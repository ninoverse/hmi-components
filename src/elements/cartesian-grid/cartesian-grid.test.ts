import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './cartesian-grid.js';
import type { HmiCartesianGrid } from './cartesian-grid.js';
import { CartesianGrid } from './cartesian-grid.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-cartesian-grid') as HmiCartesianGrid;
    await el.updateComplete;
    return el;
}

const lines = (el: HmiCartesianGrid) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<SVGLineElement>(
            '[part~="grid-line"]',
        ) ?? [],
    );

const horizontal = (el: HmiCartesianGrid) =>
    lines(el).filter((l) => l.getAttribute('y1') === l.getAttribute('y2'));
const vertical = (el: HmiCartesianGrid) =>
    lines(el).filter((l) => l.getAttribute('x1') === l.getAttribute('x2'));

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-cartesian-grid', () => {
    it('registers', () => {
        expect(customElements.get('hmi-cartesian-grid')).toBeDefined();
    });

    it('draws nothing but an empty svg until it has a size', async () => {
        const el = await fixture(
            html`<hmi-cartesian-grid></hmi-cartesian-grid>`,
        );
        const svg = el.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('0');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('draws rows + 1 horizontal and cols + 1 vertical lines', async () => {
        const el = await fixture(
            html`<hmi-cartesian-grid
                width="400"
                height="200"
                rows="4"
                cols="6"
            ></hmi-cartesian-grid>`,
        );
        expect(horizontal(el)).toHaveLength(5);
        expect(vertical(el)).toHaveLength(7);
        const svg = el.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('viewBox')).toBe('0 0 400 200');
    });

    it('spaces the lines evenly across the area', async () => {
        const el = await fixture(
            html`<hmi-cartesian-grid width="400" height="200" rows="4" cols="4"></hmi-cartesian-grid>`,
        );
        expect(horizontal(el).map((l) => Number(l.getAttribute('y1')))).toEqual(
            [0, 50, 100, 150, 200],
        );
        expect(vertical(el).map((l) => Number(l.getAttribute('x1')))).toEqual([
            0, 100, 200, 300, 400,
        ]);
    });

    it('insets the lines by padding', async () => {
        const el = await fixture(
            html`<hmi-cartesian-grid width="400" height="200" rows="2" cols="2" padding="20"></hmi-cartesian-grid>`,
        );
        const h = horizontal(el);
        expect(h.map((l) => Number(l.getAttribute('y1')))).toEqual([
            20, 100, 180,
        ]);
        expect(h[0]?.getAttribute('x1')).toBe('20');
        expect(h[0]?.getAttribute('x2')).toBe('380');
        expect(vertical(el).map((l) => Number(l.getAttribute('x1')))).toEqual([
            20, 200, 380,
        ]);
    });

    it('leaves out a direction with hide-horizontal or hide-vertical', async () => {
        const noH = await fixture(
            html`<hmi-cartesian-grid hide-horizontal width="100" height="100"></hmi-cartesian-grid>`,
        );
        expect(horizontal(noH)).toHaveLength(0);
        expect(vertical(noH)).toHaveLength(5);
        const noV = await fixture(
            html`<hmi-cartesian-grid hide-vertical width="100" height="100"></hmi-cartesian-grid>`,
        );
        expect(vertical(noV)).toHaveLength(0);
        expect(horizontal(noV)).toHaveLength(5);
    });

    it('strokes the lines from the outline token', async () => {
        const el = await fixture(
            html`<hmi-cartesian-grid
                style="--outline-variant: rgb(10, 20, 30)"
                width="100"
                height="100"
            ></hmi-cartesian-grid>`,
        );
        expect(getComputedStyle(lines(el)[0] as Element).stroke).toBe(
            'rgb(10, 20, 30)',
        );
    });

    it('updates when its size changes', async () => {
        const el = await fixture(
            html`<hmi-cartesian-grid width="100" height="100" rows="1" cols="1"></hmi-cartesian-grid>`,
        );
        el.width = 300;
        await el.updateComplete;
        expect(vertical(el).map((l) => Number(l.getAttribute('x1')))).toEqual([
            0, 300,
        ]);
    });
});

describe('CartesianGrid (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(CartesianGrid, {
                    width: 200,
                    height: 100,
                    rows: 2,
                    cols: 2,
                    hideVertical: true,
                }),
            );
        });
        const el = host.querySelector('hmi-cartesian-grid') as HmiCartesianGrid;
        await el.updateComplete;
        expect(el.width).toBe(200);
        expect(el.hideVertical).toBe(true);
        expect(horizontal(el)).toHaveLength(3);
        expect(vertical(el)).toHaveLength(0);
        await act(async () => root.unmount());
    });
});
