import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './radar-chart.js';
import type { HmiRadarChart, RadarChartSeries } from './radar-chart.js';
import { RadarChart } from './radar-chart.react.js';

const AXES = ['A', 'B', 'C', 'D'];
const SERIES: RadarChartSeries[] = [
    { name: 'One', data: [100, 50, 100, 0], color: 'rgb(255, 0, 0)' },
    { name: 'Two', data: [20, 20, 20, 20] },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-radar-chart') as HmiRadarChart;
    await el.updateComplete;
    return el;
}

const all = (el: HmiRadarChart, name: string) =>
    Array.from(el.shadowRoot?.querySelectorAll(`[part~="${name}"]`) ?? []);

const num = (el: Element | undefined, attr: string) =>
    Number(el?.getAttribute(attr));

// "x,y x,y …" as pairs of numbers.
const pairs = (el: Element | undefined) =>
    (el?.getAttribute('points') ?? '')
        .split(' ')
        .map((p) => p.split(',').map(Number) as [number, number]);

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-radar-chart', () => {
    it('registers', () => {
        expect(customElements.get('hmi-radar-chart')).toBeDefined();
    });

    it('renders nothing with fewer than three axes, or without values', async () => {
        const two = await fixture(
            html`<hmi-radar-chart .axes=${['A', 'B']} .series=${SERIES}></hmi-radar-chart>`,
        );
        expect(two.shadowRoot?.querySelector('svg')).toBeNull();
        const noSeries = await fixture(
            html`<hmi-radar-chart .axes=${AXES}></hmi-radar-chart>`,
        );
        expect(noSeries.shadowRoot?.querySelector('svg')).toBeNull();
        const empty = await fixture(
            html`<hmi-radar-chart .axes=${AXES} .series=${[{ name: 'A', data: [] }]}></hmi-radar-chart>`,
        );
        expect(empty.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes axes and series as properties only: attributes are ignored', async () => {
        const el = await fixture(
            html`<hmi-radar-chart
                axes='["A","B","C"]'
                series='[{"name":"A","data":[1,2,3]}]'
            ></hmi-radar-chart>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-radar-chart .axes=${AXES} .series=${SERIES}></hmi-radar-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Radar chart');
        expect(svg.getAttribute('viewBox')).toBe('0 0 300 300');
    });

    it('names the image from label and takes a size', async () => {
        const el = await fixture(
            html`<hmi-radar-chart
                label="Skills"
                size="200"
                .axes=${AXES}
                .series=${SERIES}
            ></hmi-radar-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('aria-label')).toBe('Skills');
        expect(svg.getAttribute('viewBox')).toBe('0 0 200 200');
    });

    it('draws four rings by default, evenly spaced out to the radius', async () => {
        const el = await fixture(
            html`<hmi-radar-chart .axes=${AXES} .series=${SERIES}></hmi-radar-chart>`,
        );
        const rings = all(el, 'ring');
        expect(rings).toHaveLength(4);
        // Centre 150, radius 150 - 36 = 114: the first point of each ring is straight up.
        const tops = rings.map((r) => pairs(r)[0]?.[1] ?? Number.NaN);
        expect(tops[0]).toBeCloseTo(150 - 28.5, 3);
        expect(tops[3]).toBeCloseTo(150 - 114, 3);
        expect(pairs(rings[0]).length).toBe(4);
    });

    it('takes the number of rings from rings', async () => {
        const el = await fixture(
            html`<hmi-radar-chart rings="2" .axes=${AXES} .series=${SERIES}></hmi-radar-chart>`,
        );
        expect(all(el, 'ring')).toHaveLength(2);
    });

    it('draws a spoke and a label per axis, labels just outside the ring', async () => {
        const el = await fixture(
            html`<hmi-radar-chart .axes=${AXES} .series=${SERIES}></hmi-radar-chart>`,
        );
        const spokes = all(el, 'spoke');
        const labels = all(el, 'axis-label');
        expect(spokes).toHaveLength(4);
        expect(labels.map((l) => l.textContent?.trim())).toEqual(AXES);
        // The first spoke runs from the centre straight up to the radius.
        expect(num(spokes[0], 'x1')).toBe(150);
        expect(num(spokes[0], 'y1')).toBe(150);
        expect(num(spokes[0], 'x2')).toBeCloseTo(150, 3);
        expect(num(spokes[0], 'y2')).toBeCloseTo(36, 3);
        // Its label is 16px further out; the second axis points right.
        expect(num(labels[0], 'y')).toBeCloseTo(20, 3);
        expect(num(labels[1], 'x')).toBeCloseTo(280, 3);
    });

    it('draws a polygon per series, a vertex per axis, scaled from the centre', async () => {
        const el = await fixture(
            html`<hmi-radar-chart .axes=${AXES} .series=${SERIES}></hmi-radar-chart>`,
        );
        const areas = all(el, 'area');
        expect(areas).toHaveLength(2);
        // 0..100: 100 is the radius (114), 50 half of it, 0 the centre.
        const [a, b, c, d] = pairs(areas[0]) as [number, number][];
        expect(a?.[1]).toBeCloseTo(36, 3);
        expect(b?.[0]).toBeCloseTo(150 + 57, 3);
        expect(c?.[1]).toBeCloseTo(264, 3);
        expect(d?.[0]).toBeCloseTo(150, 3);
        expect(d?.[1]).toBeCloseTo(150, 3);
    });

    it('takes the range from min and max', async () => {
        const el = await fixture(
            html`<hmi-radar-chart
                max="200"
                .axes=${AXES}
                .series=${[{ name: 'A', data: [100, 100, 100, 100] }]}
            ></hmi-radar-chart>`,
        );
        // 100 of 0..200 is half the radius.
        expect(pairs(all(el, 'area')[0])[0]?.[1]).toBeCloseTo(150 - 57, 3);
    });

    it('draws the polygons translucent, with a stroke, from the series colour then the palette', async () => {
        const el = await fixture(
            html`<hmi-radar-chart
                style="--primary: rgb(1, 2, 3); --tertiary: rgb(4, 5, 6)"
                .axes=${AXES}
                .series=${[SERIES[0] as RadarChartSeries, SERIES[1] as RadarChartSeries]}
            ></hmi-radar-chart>`,
        );
        const [one, two] = all(el, 'area').map((a) => getComputedStyle(a));
        expect(one?.fill).toBe('rgb(255, 0, 0)');
        expect(one?.stroke).toBe('rgb(255, 0, 0)');
        expect(one?.fillOpacity).toBe('0.2');
        expect(one?.strokeWidth).toBe('2px');
        // The second series has no colour: it takes the palette entry at its index.
        expect(two?.fill).toBe('rgb(4, 5, 6)');
        expect(two?.stroke).toBe('rgb(4, 5, 6)');
    });

    it('updates when the series change', async () => {
        const el = await fixture(
            html`<hmi-radar-chart .axes=${AXES} .series=${SERIES}></hmi-radar-chart>`,
        );
        el.series = [SERIES[0] as RadarChartSeries];
        await el.updateComplete;
        expect(all(el, 'area')).toHaveLength(1);
    });
});

describe('RadarChart (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(RadarChart, {
                    axes: AXES,
                    series: SERIES,
                    label: 'Skills',
                    rings: 3,
                }),
            );
        });
        const el = host.querySelector('hmi-radar-chart') as HmiRadarChart;
        await el.updateComplete;
        expect(el.rings).toBe(3);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Skills');
        expect(all(el, 'area')).toHaveLength(2);
        await act(async () => root.unmount());
    });
});
