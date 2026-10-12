import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './heatmap.js';
import type { HmiHeatmap } from './heatmap.js';
import { Heatmap } from './heatmap.react.js';

const DATA = [
    [0, 50, 100],
    [25, 75, 100],
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-heatmap') as HmiHeatmap;
    await el.updateComplete;
    return el;
}

const all = (el: HmiHeatmap, name: string) =>
    Array.from(el.shadowRoot?.querySelectorAll(`[part~="${name}"]`) ?? []);

const num = (el: Element | undefined, attr: string) =>
    Number(el?.getAttribute(attr));

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-heatmap', () => {
    it('registers', () => {
        expect(customElements.get('hmi-heatmap')).toBeDefined();
    });

    it('renders nothing without data, or with only empty rows', async () => {
        const none = await fixture(html`<hmi-heatmap></hmi-heatmap>`);
        expect(none.shadowRoot?.querySelector('svg')).toBeNull();
        const empty = await fixture(
            html`<hmi-heatmap .data=${[[], []]}></hmi-heatmap>`,
        );
        expect(empty.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes data and labels as properties only: attributes are ignored', async () => {
        const el = await fixture(
            html`<hmi-heatmap data="[[1,2],[3,4]]" xLabels='["a","b"]'></hmi-heatmap>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image the size of its cells', async () => {
        const el = await fixture(
            html`<hmi-heatmap .data=${DATA}></hmi-heatmap>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Heatmap');
        // 3 columns and 2 rows of 40 with a gap of 4, and no labels.
        expect(svg.getAttribute('viewBox')).toBe('0 0 128 84');
    });

    it('names the image from label', async () => {
        const el = await fixture(
            html`<hmi-heatmap label="Weekly activity" .data=${DATA}></hmi-heatmap>`,
        );
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe(
            'Weekly activity',
        );
    });

    it('draws a cell per value, on a grid', async () => {
        const el = await fixture(
            html`<hmi-heatmap .data=${DATA}></hmi-heatmap>`,
        );
        const cells = all(el, 'cell');
        expect(cells).toHaveLength(6);
        expect(num(cells[0], 'x')).toBe(0);
        expect(num(cells[1], 'x')).toBe(44);
        expect(num(cells[2], 'x')).toBe(88);
        expect(num(cells[3], 'y')).toBe(44);
        expect(num(cells[0], 'width')).toBe(40);
        expect(num(cells[0], 'height')).toBe(40);
        expect(cells[0]?.getAttribute('rx')).toBe('4');
    });

    it('takes the cell size and the gap', async () => {
        const el = await fixture(
            html`<hmi-heatmap cell-size="20" gap="2" .data=${DATA}></hmi-heatmap>`,
        );
        const cells = all(el, 'cell');
        expect(num(cells[1], 'x')).toBe(22);
        expect(num(cells[0], 'width')).toBe(20);
        expect(all(el, 'base')[0]?.getAttribute('viewBox')).toBe('0 0 64 42');
    });

    it('maps each value to the cell colour at an opacity from 0.12 to 1', async () => {
        const el = await fixture(
            html`<hmi-heatmap .data=${DATA}></hmi-heatmap>`,
        );
        const opacity = all(el, 'cell').map((c) => num(c, 'fill-opacity'));
        // 0..100: the lowest value is faint, the highest solid.
        expect(opacity[0]).toBeCloseTo(0.12, 5);
        expect(opacity[1]).toBeCloseTo(0.12 + 0.88 * 0.5, 5);
        expect(opacity[2]).toBeCloseTo(1, 5);
    });

    it('takes the scale from min and max', async () => {
        const el = await fixture(
            html`<hmi-heatmap min="0" max="200" .data=${DATA}></hmi-heatmap>`,
        );
        expect(num(all(el, 'cell')[2], 'fill-opacity')).toBeCloseTo(
            0.12 + 0.88 * 0.5,
            5,
        );
    });

    it('fills the cells from color, defaulting to the primary token', async () => {
        const el = await fixture(
            html`<hmi-heatmap
                style="--primary: rgb(1, 2, 3)"
                .data=${DATA}
            ></hmi-heatmap>`,
        );
        expect(getComputedStyle(all(el, 'cell')[0] as Element).fill).toBe(
            'rgb(1, 2, 3)',
        );
        const red = await fixture(
            html`<hmi-heatmap color="rgb(255, 0, 0)" .data=${DATA}></hmi-heatmap>`,
        );
        expect(getComputedStyle(all(red, 'cell')[0] as Element).fill).toBe(
            'rgb(255, 0, 0)',
        );
    });

    it('labels the rows on the left and the columns below, making room for both', async () => {
        const el = await fixture(
            html`<hmi-heatmap
                .data=${DATA}
                .xLabels=${['a', 'b', 'c']}
                .yLabels=${['r1', 'r2']}
            ></hmi-heatmap>`,
        );
        const labels = all(el, 'axis-label');
        expect(labels.map((l) => l.textContent?.trim())).toEqual([
            'r1',
            'r2',
            'a',
            'b',
            'c',
        ]);
        // A 64px gutter on the left, 24px of room below: 64 + 128 wide, 84 + 24 high.
        expect(all(el, 'base')[0]?.getAttribute('viewBox')).toBe('0 0 192 108');
        // Row labels end 8px before the cells, centred on the row.
        expect(num(labels[0], 'x')).toBe(56);
        expect(num(labels[0], 'y')).toBe(20);
        expect(labels[0]?.getAttribute('text-anchor')).toBe('end');
        // Column labels are centred under the column, 16px below the cells.
        expect(num(labels[2], 'x')).toBe(64 + 20);
        expect(num(labels[2], 'y')).toBe(84 + 16);
        // The cells move over by the gutter.
        expect(num(all(el, 'cell')[0], 'x')).toBe(64);
    });

    it('prints each value at its cell centre only with show-values', async () => {
        const none = await fixture(
            html`<hmi-heatmap .data=${DATA}></hmi-heatmap>`,
        );
        expect(all(none, 'value')).toHaveLength(0);
        const el = await fixture(
            html`<hmi-heatmap show-values .data=${DATA}></hmi-heatmap>`,
        );
        const values = all(el, 'value');
        expect(values.map((v) => v.textContent?.trim())).toEqual([
            '0',
            '50',
            '100',
            '25',
            '75',
            '100',
        ]);
        expect(num(values[1], 'x')).toBe(44 + 20);
        expect(num(values[1], 'y')).toBe(20);
        expect(values[1]?.getAttribute('text-anchor')).toBe('middle');
    });

    it('draws a ragged matrix as it is, sized by its longest row', async () => {
        const el = await fixture(
            html`<hmi-heatmap .data=${[[1], [1, 2, 3]]}></hmi-heatmap>`,
        );
        expect(all(el, 'cell')).toHaveLength(4);
        expect(all(el, 'base')[0]?.getAttribute('viewBox')).toBe('0 0 128 84');
    });

    it('updates when the data changes', async () => {
        const el = await fixture(
            html`<hmi-heatmap .data=${DATA}></hmi-heatmap>`,
        );
        el.data = [[1]];
        await el.updateComplete;
        expect(all(el, 'cell')).toHaveLength(1);
    });
});

describe('Heatmap (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(Heatmap, {
                    data: DATA,
                    xLabels: ['a', 'b', 'c'],
                    label: 'Activity',
                    showValues: true,
                }),
            );
        });
        const el = host.querySelector('hmi-heatmap') as HmiHeatmap;
        await el.updateComplete;
        expect(el.showValues).toBe(true);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Activity');
        expect(all(el, 'cell')).toHaveLength(6);
        await act(async () => root.unmount());
    });
});
