import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './bar-chart.js';
import type { BarChartSeries, HmiBarChart } from './bar-chart.js';
import { BarChart } from './bar-chart.react.js';

const SERIES: BarChartSeries[] = [
    { name: 'A', data: [100, 50], color: 'rgb(255, 0, 0)' },
    { name: 'B', data: [25, 75] },
];
const LABELS = ['Q1', 'Q2'];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-bar-chart') as HmiBarChart;
    await el.updateComplete;
    return el;
}

const all = (el: HmiBarChart, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<SVGElement>(`[part~="${name}"]`) ?? [],
    );

const num = (el: Element | undefined, attr: string) =>
    Number(el?.getAttribute(attr));

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-bar-chart', () => {
    it('registers', () => {
        expect(customElements.get('hmi-bar-chart')).toBeDefined();
    });

    it('renders nothing without series, or with only empty ones', async () => {
        const none = await fixture(html`<hmi-bar-chart></hmi-bar-chart>`);
        expect(none.shadowRoot?.querySelector('svg')).toBeNull();
        const empty = await fixture(
            html`<hmi-bar-chart .series=${[{ name: 'A', data: [] }]}></hmi-bar-chart>`,
        );
        expect(empty.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes series and labels as properties only: attributes are ignored', async () => {
        const el = await fixture(
            html`<hmi-bar-chart
                series='[{"name":"A","data":[1,2]}]'
                labels='["a","b"]'
            ></hmi-bar-chart>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-bar-chart .series=${SERIES} .labels=${LABELS}></hmi-bar-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Bar chart');
        expect(svg.getAttribute('viewBox')).toBe('0 0 520 260');
    });

    it('names the image from label and takes a size', async () => {
        const el = await fixture(
            html`<hmi-bar-chart
                label="Units"
                width="300"
                height="200"
                .series=${SERIES}
            ></hmi-bar-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('aria-label')).toBe('Units');
        expect(svg.getAttribute('viewBox')).toBe('0 0 300 200');
    });

    it('draws a bar per series per category, grouped in equal slots', async () => {
        const el = await fixture(
            html`<hmi-bar-chart .series=${SERIES} .labels=${LABELS}></hmi-bar-chart>`,
        );
        const bars = all(el, 'bar');
        expect(bars).toHaveLength(4);
        // Plot width 464 over 2 categories: a 232 slot, 41.76 of padding each side.
        const slot = 232;
        const pad = slot * 0.18;
        expect(num(bars[0], 'x')).toBeCloseTo(44 + pad, 3);
        // Within a category, the second series' bar sits to the right of the first.
        expect(num(bars[1], 'x')).toBeGreaterThan(
            num(bars[0], 'x') + num(bars[0], 'width'),
        );
        // The second category starts a slot later.
        expect(num(bars[2], 'x')).toBeCloseTo(num(bars[0], 'x') + slot, 3);
    });

    it('scales each bar to its value from the zero line', async () => {
        const el = await fixture(
            html`<hmi-bar-chart .series=${SERIES} .labels=${LABELS}></hmi-bar-chart>`,
        );
        const bars = all(el, 'bar');
        // Plot height 220, 0..100: the largest bar reaches the top.
        expect(num(bars[0], 'height')).toBeCloseTo(220, 3);
        expect(num(bars[0], 'y')).toBeCloseTo(12, 3);
        expect(num(bars[1], 'height')).toBeCloseTo(55, 3);
        expect(num(bars[1], 'y') + num(bars[1], 'height')).toBeCloseTo(232, 3);
    });

    it('hangs a negative bar below the zero line', async () => {
        const el = await fixture(
            html`<hmi-bar-chart
                min="-50"
                max="50"
                .series=${[{ name: 'A', data: [-25, 25] }]}
            ></hmi-bar-chart>`,
        );
        const [below, above] = all(el, 'bar') as SVGElement[];
        // Zero is at the middle of the 220-high plot area: y = 12 + 110.
        expect(num(below, 'y')).toBeCloseTo(122, 3);
        expect(num(above, 'y') + num(above, 'height')).toBeCloseTo(122, 3);
    });

    it('draws a missing value as a bar of no height', async () => {
        const el = await fixture(
            html`<hmi-bar-chart
                .series=${[
                    { name: 'A', data: [10, 20] },
                    { name: 'B', data: [10] },
                ]}
            ></hmi-bar-chart>`,
        );
        expect(num(all(el, 'bar')[3], 'height')).toBe(0);
    });

    it('fills each bar from its series colour, defaulting to the primary token', async () => {
        const el = await fixture(
            html`<hmi-bar-chart
                style="--primary: rgb(1, 2, 3)"
                .series=${SERIES}
            ></hmi-bar-chart>`,
        );
        const bars = all(el, 'bar');
        expect(getComputedStyle(bars[0] as Element).fill).toBe(
            'rgb(255, 0, 0)',
        );
        expect(getComputedStyle(bars[1] as Element).fill).toBe('rgb(1, 2, 3)');
    });

    it('rounds each bar by two px', async () => {
        const el = await fixture(
            html`<hmi-bar-chart .series=${SERIES}></hmi-bar-chart>`,
        );
        expect(all(el, 'bar')[0]?.getAttribute('rx')).toBe('2');
    });

    it('draws horizontal grid lines only, one more than yTicks', async () => {
        const el = await fixture(
            html`<hmi-bar-chart y-ticks="3" .series=${SERIES}></hmi-bar-chart>`,
        );
        const lines = all(el, 'grid-line');
        expect(lines).toHaveLength(4);
        expect(
            lines.every((l) => l.getAttribute('y1') === l.getAttribute('y2')),
        ).toBe(true);
    });

    it('labels the y axis from the range, and each category at the middle of its slot', async () => {
        const el = await fixture(
            html`<hmi-bar-chart .series=${SERIES} .labels=${LABELS}></hmi-bar-chart>`,
        );
        const labels = all(el, 'axis-label');
        expect(labels.map((l) => l.textContent?.trim())).toEqual([
            '0',
            '25',
            '50',
            '75',
            '100',
            'Q1',
            'Q2',
        ]);
        expect(num(labels[5], 'x')).toBe(44 + 116);
        expect(num(labels[6], 'x')).toBe(44 + 232 + 116);
    });

    it('updates when the series change', async () => {
        const el = await fixture(
            html`<hmi-bar-chart .series=${SERIES}></hmi-bar-chart>`,
        );
        el.series = [{ name: 'A', data: [1] }];
        await el.updateComplete;
        expect(all(el, 'bar')).toHaveLength(1);
    });
});

describe('BarChart (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(BarChart, {
                    series: SERIES,
                    labels: LABELS,
                    label: 'Units',
                    yTicks: 2,
                }),
            );
        });
        const el = host.querySelector('hmi-bar-chart') as HmiBarChart;
        await el.updateComplete;
        expect(el.yTicks).toBe(2);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Units');
        expect(all(el, 'bar')).toHaveLength(4);
        await act(async () => root.unmount());
    });
});
