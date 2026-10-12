import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './line-chart.js';
import type { HmiLineChart, LineChartSeries } from './line-chart.js';
import { LineChart } from './line-chart.react.js';

const SERIES: LineChartSeries[] = [
    { name: 'Revenue', data: [0, 50, 100], color: 'rgb(255, 0, 0)' },
    { name: 'Costs', data: [20, 40, 60] },
];
const LABELS = ['Jan', 'Feb', 'Mar'];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-line-chart') as HmiLineChart;
    await el.updateComplete;
    return el;
}

const all = (el: HmiLineChart, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<SVGElement>(`[part~="${name}"]`) ?? [],
    );

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-line-chart', () => {
    it('registers', () => {
        expect(customElements.get('hmi-line-chart')).toBeDefined();
    });

    it('renders nothing without series, or with only empty ones', async () => {
        const none = await fixture(html`<hmi-line-chart></hmi-line-chart>`);
        expect(none.shadowRoot?.querySelector('svg')).toBeNull();
        const empty = await fixture(
            html`<hmi-line-chart .series=${[{ name: 'A', data: [] }]}></hmi-line-chart>`,
        );
        expect(empty.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes series and labels as properties only: attributes are ignored', async () => {
        const el = await fixture(
            html`<hmi-line-chart
                series='[{"name":"A","data":[1,2]}]'
                labels='["a","b"]'
            ></hmi-line-chart>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-line-chart .series=${SERIES} .labels=${LABELS}></hmi-line-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Line chart');
        expect(svg.getAttribute('width')).toBe('520');
        expect(svg.getAttribute('height')).toBe('260');
        expect(svg.getAttribute('viewBox')).toBe('0 0 520 260');
    });

    it('names the image from label and takes a size', async () => {
        const el = await fixture(
            html`<hmi-line-chart
                label="Monthly revenue"
                width="300"
                height="200"
                .series=${SERIES}
            ></hmi-line-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('aria-label')).toBe('Monthly revenue');
        expect(svg.getAttribute('viewBox')).toBe('0 0 300 200');
    });

    it('draws a polyline per series through the scaled points', async () => {
        const el = await fixture(
            html`<hmi-line-chart .series=${SERIES} .labels=${LABELS}></hmi-line-chart>`,
        );
        const lines = all(el, 'line');
        expect(lines).toHaveLength(2);
        // Plot area: left 44, right 12, top 12, bottom 28 of 520 x 260.
        // x spans 44..508 over 3 points; y spans 232..12 for 0..100.
        expect(lines[0]?.getAttribute('d')).toBe('M44,232 L276,122 L508,12');
    });

    it('paints each series from its colour, defaulting to the primary token', async () => {
        const el = await fixture(
            html`<hmi-line-chart
                style="--primary: rgb(1, 2, 3)"
                .series=${SERIES}
            ></hmi-line-chart>`,
        );
        const lines = all(el, 'line');
        expect(getComputedStyle(lines[0] as Element).stroke).toBe(
            'rgb(255, 0, 0)',
        );
        expect(getComputedStyle(lines[1] as Element).stroke).toBe(
            'rgb(1, 2, 3)',
        );
    });

    it('draws horizontal grid lines only, one more than yTicks', async () => {
        const el = await fixture(
            html`<hmi-line-chart y-ticks="5" .series=${SERIES}></hmi-line-chart>`,
        );
        const lines = all(el, 'grid-line');
        expect(lines).toHaveLength(6);
        expect(
            lines.every((l) => l.getAttribute('y1') === l.getAttribute('y2')),
        ).toBe(true);
    });

    it('labels the y axis from the range, and the x axis from labels', async () => {
        const el = await fixture(
            html`<hmi-line-chart .series=${SERIES} .labels=${LABELS}></hmi-line-chart>`,
        );
        const labels = all(el, 'axis-label').map((l) => l.textContent?.trim());
        expect(labels).toEqual([
            '0',
            '25',
            '50',
            '75',
            '100',
            'Jan',
            'Feb',
            'Mar',
        ]);
    });

    it('takes the range from min and max', async () => {
        const el = await fixture(
            html`<hmi-line-chart min="0" max="200" y-ticks="2" .series=${SERIES}></hmi-line-chart>`,
        );
        expect(all(el, 'axis-label').map((l) => l.textContent?.trim())).toEqual(
            ['0', '100', '200'],
        );
    });

    it('draws dots only with show-dots', async () => {
        const plain = await fixture(
            html`<hmi-line-chart .series=${SERIES}></hmi-line-chart>`,
        );
        expect(all(plain, 'dot')).toHaveLength(0);
        const dotted = await fixture(
            html`<hmi-line-chart show-dots .series=${SERIES}></hmi-line-chart>`,
        );
        const dots = all(dotted, 'dot');
        expect(dots).toHaveLength(6);
        expect(dots[0]?.getAttribute('r')).toBe('3');
        expect(dots[0]?.getAttribute('cx')).toBe('44');
        expect(getComputedStyle(dots[0] as Element).fill).toBe(
            'rgb(255, 0, 0)',
        );
    });

    it('centres a single point', async () => {
        const el = await fixture(
            html`<hmi-line-chart .series=${[{ name: 'A', data: [10] }]}></hmi-line-chart>`,
        );
        expect(all(el, 'line')[0]?.getAttribute('d')).toMatch(/^M276,/);
    });

    it('updates when the series change', async () => {
        const el = await fixture(
            html`<hmi-line-chart .series=${SERIES}></hmi-line-chart>`,
        );
        el.series = [{ name: 'A', data: [1, 2] }];
        await el.updateComplete;
        expect(all(el, 'line')).toHaveLength(1);
    });

    it('fits the width of its container when it is narrower than the svg', async () => {
        const host = document.createElement('div');
        host.style.width = '260px';
        document.body.append(host);
        render(html`<hmi-line-chart .series=${SERIES}></hmi-line-chart>`, host);
        const el = host.querySelector('hmi-line-chart') as HmiLineChart;
        await el.updateComplete;
        const rect = (all(el, 'base')[0] as SVGElement).getBoundingClientRect();
        expect(rect.width).toBe(260);
        expect(rect.height).toBeCloseTo(130, 0);
    });
});

describe('LineChart (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(LineChart, {
                    series: SERIES,
                    labels: LABELS,
                    label: 'Revenue',
                    showDots: true,
                    yTicks: 2,
                }),
            );
        });
        const el = host.querySelector('hmi-line-chart') as HmiLineChart;
        await el.updateComplete;
        expect(el.showDots).toBe(true);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Revenue');
        expect(all(el, 'dot')).toHaveLength(6);
        await act(async () => root.unmount());
    });
});
