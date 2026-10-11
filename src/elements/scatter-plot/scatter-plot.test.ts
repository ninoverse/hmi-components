import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './scatter-plot.js';
import type { HmiScatterPlot, ScatterPlotSeries } from './scatter-plot.js';
import { ScatterPlot } from './scatter-plot.react.js';

const SERIES: ScatterPlotSeries[] = [
    {
        name: 'A',
        color: 'rgb(255, 0, 0)',
        data: [
            { x: 0, y: 0 },
            { x: 50, y: 50 },
            { x: 100, y: 100 },
        ],
    },
    { name: 'B', data: [{ x: 20, y: 80 }] },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-scatter-plot') as HmiScatterPlot;
    await el.updateComplete;
    return el;
}

const all = (el: HmiScatterPlot, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<SVGElement>(`[part~="${name}"]`) ?? [],
    );

const num = (el: Element | undefined, attr: string) =>
    Number(el?.getAttribute(attr));

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-scatter-plot', () => {
    it('registers', () => {
        expect(customElements.get('hmi-scatter-plot')).toBeDefined();
    });

    it('renders nothing without series, or with only empty ones', async () => {
        const none = await fixture(html`<hmi-scatter-plot></hmi-scatter-plot>`);
        expect(none.shadowRoot?.querySelector('svg')).toBeNull();
        const empty = await fixture(
            html`<hmi-scatter-plot .series=${[{ name: 'A', data: [] }]}></hmi-scatter-plot>`,
        );
        expect(empty.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes series as a property only: the attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot
                series='[{"name":"A","data":[{"x":1,"y":1}]}]'
            ></hmi-scatter-plot>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot .series=${SERIES}></hmi-scatter-plot>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Scatter plot');
        expect(svg.getAttribute('viewBox')).toBe('0 0 520 260');
    });

    it('names the image from label and takes a size', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot
                label="Height versus weight"
                width="300"
                height="200"
                .series=${SERIES}
            ></hmi-scatter-plot>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('aria-label')).toBe('Height versus weight');
        expect(svg.getAttribute('viewBox')).toBe('0 0 300 200');
    });

    it('draws a marker per point, across every series', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot .series=${SERIES}></hmi-scatter-plot>`,
        );
        expect(all(el, 'point')).toHaveLength(4);
    });

    it('places each point from the x extent and the y range from zero', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot .series=${SERIES}></hmi-scatter-plot>`,
        );
        const points = all(el, 'point');
        // Plot area 464 x 220 at (44, 12): x 0..100, y 0..100.
        expect(num(points[0], 'cx')).toBeCloseTo(44, 3);
        expect(num(points[0], 'cy')).toBeCloseTo(232, 3);
        expect(num(points[1], 'cx')).toBeCloseTo(276, 3);
        expect(num(points[1], 'cy')).toBeCloseTo(122, 3);
        expect(num(points[2], 'cx')).toBeCloseTo(508, 3);
        expect(num(points[2], 'cy')).toBeCloseTo(12, 3);
    });

    it('takes the ranges from x-min, x-max, y-min and y-max', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot
                x-min="-100"
                x-max="100"
                y-min="0"
                y-max="200"
                .series=${[{ name: 'A', data: [{ x: 0, y: 100 }] }]}
            ></hmi-scatter-plot>`,
        );
        const point = all(el, 'point')[0];
        expect(num(point, 'cx')).toBeCloseTo(276, 3);
        expect(num(point, 'cy')).toBeCloseTo(122, 3);
    });

    it('lets the y range dip below zero for negative data', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot
                .series=${[
                    {
                        name: 'A',
                        data: [
                            { x: 0, y: -50 },
                            { x: 1, y: 50 },
                        ],
                    },
                ]}
            ></hmi-scatter-plot>`,
        );
        const [low, high] = all(el, 'point');
        expect(num(low, 'cy')).toBeCloseTo(232, 3);
        expect(num(high, 'cy')).toBeCloseTo(12, 3);
    });

    it('sizes the markers from radius', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot radius="7" .series=${SERIES}></hmi-scatter-plot>`,
        );
        expect(all(el, 'point')[0]?.getAttribute('r')).toBe('7');
        const dflt = await fixture(
            html`<hmi-scatter-plot .series=${SERIES}></hmi-scatter-plot>`,
        );
        expect(all(dflt, 'point')[0]?.getAttribute('r')).toBe('4');
    });

    it('fills each marker from its series colour, defaulting to the primary token', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot
                style="--primary: rgb(1, 2, 3)"
                .series=${SERIES}
            ></hmi-scatter-plot>`,
        );
        const points = all(el, 'point');
        expect(getComputedStyle(points[0] as Element).fill).toBe(
            'rgb(255, 0, 0)',
        );
        expect(getComputedStyle(points[3] as Element).fill).toBe(
            'rgb(1, 2, 3)',
        );
    });

    it('draws the markers translucent', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot .series=${SERIES}></hmi-scatter-plot>`,
        );
        expect(
            getComputedStyle(all(el, 'point')[0] as Element).fillOpacity,
        ).toBe('0.75');
    });

    it('draws a grid of horizontal and vertical lines, one more than each ticks count', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot
                x-ticks="2"
                y-ticks="3"
                .series=${SERIES}
            ></hmi-scatter-plot>`,
        );
        const lines = all(el, 'grid-line');
        // 4 horizontal + 3 vertical.
        expect(lines).toHaveLength(7);
        expect(
            lines.filter((l) => l.getAttribute('y1') === l.getAttribute('y2')),
        ).toHaveLength(4);
    });

    it('labels both axes with rounded tick values', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot .series=${SERIES}></hmi-scatter-plot>`,
        );
        expect(all(el, 'axis-label').map((l) => l.textContent?.trim())).toEqual(
            ['0', '25', '50', '75', '100', '0', '20', '40', '60', '80', '100'],
        );
    });

    it('updates when the series change', async () => {
        const el = await fixture(
            html`<hmi-scatter-plot .series=${SERIES}></hmi-scatter-plot>`,
        );
        el.series = [{ name: 'A', data: [{ x: 1, y: 1 }] }];
        await el.updateComplete;
        expect(all(el, 'point')).toHaveLength(1);
    });
});

describe('ScatterPlot (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(ScatterPlot, {
                    series: SERIES,
                    label: 'Groups',
                    xTicks: 2,
                }),
            );
        });
        const el = host.querySelector('hmi-scatter-plot') as HmiScatterPlot;
        await el.updateComplete;
        expect(el.xTicks).toBe(2);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Groups');
        expect(all(el, 'point')).toHaveLength(4);
        await act(async () => root.unmount());
    });
});
