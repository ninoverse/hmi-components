import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './area-chart.js';
import type { AreaChartSeries, HmiAreaChart } from './area-chart.js';
import { AreaChart } from './area-chart.react.js';

const SERIES: AreaChartSeries[] = [
    { name: 'Pro', data: [0, 50, 100], color: 'rgb(255, 0, 0)' },
    { name: 'Free', data: [20, 40, 60] },
];
const LABELS = ['Jan', 'Feb', 'Mar'];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-area-chart') as HmiAreaChart;
    await el.updateComplete;
    return el;
}

const all = (el: HmiAreaChart, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<SVGElement>(`[part~="${name}"]`) ?? [],
    );

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-area-chart', () => {
    it('registers', () => {
        expect(customElements.get('hmi-area-chart')).toBeDefined();
    });

    it('renders nothing without series, or with only empty ones', async () => {
        const none = await fixture(html`<hmi-area-chart></hmi-area-chart>`);
        expect(none.shadowRoot?.querySelector('svg')).toBeNull();
        const empty = await fixture(
            html`<hmi-area-chart .series=${[{ name: 'A', data: [] }]}></hmi-area-chart>`,
        );
        expect(empty.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes series and labels as properties only: attributes are ignored', async () => {
        const el = await fixture(
            html`<hmi-area-chart
                series='[{"name":"A","data":[1,2]}]'
                labels='["a","b"]'
            ></hmi-area-chart>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-area-chart .series=${SERIES} .labels=${LABELS}></hmi-area-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Area chart');
        expect(svg.getAttribute('viewBox')).toBe('0 0 520 260');
    });

    it('names the image from label and takes a size', async () => {
        const el = await fixture(
            html`<hmi-area-chart
                label="Active users"
                width="300"
                height="200"
                .series=${SERIES}
            ></hmi-area-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('aria-label')).toBe('Active users');
        expect(svg.getAttribute('viewBox')).toBe('0 0 300 200');
    });

    it('draws a line and a fill per series, the fill closed down to the zero line', async () => {
        const el = await fixture(
            html`<hmi-area-chart .series=${SERIES} .labels=${LABELS}></hmi-area-chart>`,
        );
        expect(all(el, 'line')).toHaveLength(2);
        expect(all(el, 'area')).toHaveLength(2);
        expect(all(el, 'line')[0]?.getAttribute('d')).toBe(
            'M44,232 L276,122 L508,12',
        );
        expect(all(el, 'area')[0]?.getAttribute('d')).toBe(
            'M44,232 L276,122 L508,12 L508,232 L44,232 Z',
        );
    });

    it('closes the fill at the bottom of the range when it is above zero', async () => {
        const el = await fixture(
            html`<hmi-area-chart
                min="50"
                max="100"
                .series=${[{ name: 'A', data: [60, 80] }]}
            ></hmi-area-chart>`,
        );
        expect(all(el, 'area')[0]?.getAttribute('d')).toMatch(
            /L508,232 L44,232 Z$/,
        );
    });

    it('paints the line and the fill from the series colour, the fill faint', async () => {
        const el = await fixture(
            html`<hmi-area-chart
                style="--primary: rgb(1, 2, 3)"
                .series=${SERIES}
            ></hmi-area-chart>`,
        );
        expect(getComputedStyle(all(el, 'line')[0] as Element).stroke).toBe(
            'rgb(255, 0, 0)',
        );
        expect(getComputedStyle(all(el, 'area')[0] as Element).fill).toBe(
            'rgb(255, 0, 0)',
        );
        expect(getComputedStyle(all(el, 'area')[1] as Element).fill).toBe(
            'rgb(1, 2, 3)',
        );
        expect(
            Number(getComputedStyle(all(el, 'area')[0] as Element).opacity),
        ).toBeCloseTo(0.18);
    });

    it('draws horizontal grid lines only, one more than yTicks', async () => {
        const el = await fixture(
            html`<hmi-area-chart y-ticks="3" .series=${SERIES}></hmi-area-chart>`,
        );
        const lines = all(el, 'grid-line');
        expect(lines).toHaveLength(4);
        expect(
            lines.every((l) => l.getAttribute('y1') === l.getAttribute('y2')),
        ).toBe(true);
    });

    it('labels the y axis from the range, and the x axis from labels', async () => {
        const el = await fixture(
            html`<hmi-area-chart .series=${SERIES} .labels=${LABELS}></hmi-area-chart>`,
        );
        expect(all(el, 'axis-label').map((l) => l.textContent?.trim())).toEqual(
            ['0', '25', '50', '75', '100', 'Jan', 'Feb', 'Mar'],
        );
    });

    it('updates when the series change', async () => {
        const el = await fixture(
            html`<hmi-area-chart .series=${SERIES}></hmi-area-chart>`,
        );
        el.series = [{ name: 'A', data: [1, 2] }];
        await el.updateComplete;
        expect(all(el, 'area')).toHaveLength(1);
    });
});

describe('AreaChart (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(AreaChart, {
                    series: SERIES,
                    labels: LABELS,
                    label: 'Active users',
                    yTicks: 2,
                }),
            );
        });
        const el = host.querySelector('hmi-area-chart') as HmiAreaChart;
        await el.updateComplete;
        expect(el.yTicks).toBe(2);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe(
            'Active users',
        );
        expect(all(el, 'grid-line')).toHaveLength(3);
        await act(async () => root.unmount());
    });
});
