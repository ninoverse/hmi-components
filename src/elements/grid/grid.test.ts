import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './grid.js';
import type { HmiGrid } from './grid.js';
import { Grid } from './grid.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiGrid> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-grid') as HmiGrid;
    await el.updateComplete;
    return el;
}

const base = (el: HmiGrid) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;
const cells = (count: number) =>
    html`${Array.from({ length: count }, () => html`<span style="height: 10px"></span>`)}`;
const rects = (el: HmiGrid) =>
    [...el.children].map((c) => c.getBoundingClientRect());

/* Where the items land, never the template the browser serialises. */
const columns = (el: HmiGrid) =>
    new Set(rects(el).map((r) => Math.round(r.left))).size;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-grid', () => {
    it('registers', () => {
        expect(customElements.get('hmi-grid')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 200px">${cells(2)}</hmi-grid>`,
        );
        const { width, height } = base(el).getBoundingClientRect();
        expect(width).toBe(200);
        expect(height).toBe(10);
    });

    it('reflects gap', async () => {
        const el = await fixture(html`<hmi-grid></hmi-grid>`);
        el.gap = 'large';
        await el.updateComplete;
        expect(el.getAttribute('gap')).toBe('large');
        el.setAttribute('gap', 'small');
        await el.updateComplete;
        expect(el.gap).toBe('small');
    });

    it('projects default slot', async () => {
        const el = await fixture(
            html`<hmi-grid><span id="item">One</span></hmi-grid>`,
        );
        const slot =
            el.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
        expect(slot?.assignedElements()).toEqual([el.querySelector('#item')]);
    });

    it('renders a grid whose items are the slotted children', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 200px">${cells(4)}</hmi-grid>`,
        );
        expect(getComputedStyle(el).display).toBe('block');
        expect(getComputedStyle(base(el)).display).toBe('grid');
        const [a, b, c] = rects(el) as [DOMRect, DOMRect, DOMRect];
        expect(a.top).toBe(b.top);
        expect(c.top).toBeGreaterThan(a.top);
    });

    it('has defaults', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 300px">${cells(2)}</hmi-grid>`,
        );
        expect(el.columns).toBe(2);
        expect(el.gap).toBe('none');
        expect(rects(el).map((r) => r.width)).toEqual([150, 150]);
    });

    it('turns a number into equal tracks', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 300px" .columns=${3}>${cells(3)}</hmi-grid>`,
        );
        const [a, b, c] = rects(el) as [DOMRect, DOMRect, DOMRect];
        expect(a.top).toBe(b.top);
        expect(b.top).toBe(c.top);
        expect(a.width).toBe(100);
        expect(b.width).toBe(100);
    });

    it('reads a digit-only attribute as a track count', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 300px" columns="3">${cells(3)}</hmi-grid>`,
        );
        expect(el.columns).toBe(3);
        expect(rects(el)[2]?.top).toBe(rects(el)[0]?.top);
    });

    it('uses any other string as the template, as-is', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 400px" columns="1fr 3fr">${cells(2)}</hmi-grid>`,
        );
        expect(el.columns).toBe('1fr 3fr');
        const [a, b] = rects(el) as [DOMRect, DOMRect];
        expect(a.width).toBe(100);
        expect(b.width).toBe(300);
    });

    it('goes back to two tracks when the columns attribute is removed', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 300px" columns="3">${cells(3)}</hmi-grid>`,
        );
        el.removeAttribute('columns');
        await el.updateComplete;
        expect(columns(el)).toBe(2);
        el.setAttribute('columns', '');
        await el.updateComplete;
        expect(columns(el)).toBe(2);
    });

    it('lays out a template CSS rejects as one column, after a valid one too', async () => {
        const first = await fixture(
            html`<hmi-grid style="width: 300px" columns="nonsense">${cells(3)}</hmi-grid>`,
        );
        expect(columns(first)).toBe(1);
        for (const value of ['nonsense', 0, 2.5]) {
            const el = await fixture(
                html`<hmi-grid style="width: 300px" columns="3">${cells(3)}</hmi-grid>`,
            );
            el.columns = value;
            await el.updateComplete;
            expect(columns(el), String(value)).toBe(1);
        }
    });

    it('cannot break out of the declaration it is set in', async () => {
        const el = await fixture(
            html`<hmi-grid columns="1fr; } :host { display: none"
                >${cells(2)}</hmi-grid
            >`,
        );
        expect(getComputedStyle(el).display).toBe('block');
        expect(getComputedStyle(base(el)).display).toBe('grid');
    });

    it('maps the gap presets to the spacing tokens', async () => {
        const el = await fixture(
            html`<hmi-grid gap="small">${cells(2)}</hmi-grid>`,
        );
        el.style.setProperty('--space-4', '10px');
        el.style.setProperty('--space-8', '20px');
        el.style.setProperty('--space-11', '30px');
        expect(getComputedStyle(base(el)).columnGap).toBe('10px');
        el.gap = 'medium';
        await el.updateComplete;
        expect(getComputedStyle(base(el)).columnGap).toBe('20px');
        el.gap = 'large';
        await el.updateComplete;
        expect(getComputedStyle(base(el)).rowGap).toBe('30px');
    });

    it("lets the host's style beat the gap preset", async () => {
        const el = await fixture(
            html`<hmi-grid gap="large" style="width: 302px; --space-11: 24px; gap: 2px"
                >${cells(2)}</hmi-grid
            >`,
        );
        const [a, b] = rects(el) as [DOMRect, DOMRect];
        expect(b.left - a.right).toBe(2);
    });

    it("lays the items out by the host's grid properties", async () => {
        const el = await fixture(
            html`<hmi-grid
                style="width: 300px; align-items: center; grid-auto-rows: 40px"
                ><span style="height: 10px"></span
                ><span style="height: 30px"></span
            ></hmi-grid>`,
        );
        const [a, b] = rects(el) as [DOMRect, DOMRect];
        const top = el.getBoundingClientRect().top;
        expect(el.getBoundingClientRect().height).toBe(40);
        expect(a.top - top).toBe(15);
        expect(b.top - top).toBe(5);
    });

    it("flows the items by the host's grid-auto-flow", async () => {
        const el = await fixture(
            html`<hmi-grid
                style="width: 300px; grid-auto-flow: column; grid-template-rows: auto auto"
                >${cells(4)}</hmi-grid
            >`,
        );
        const [a, b] = rects(el) as [DOMRect, DOMRect];
        expect(a.left).toBe(b.left);
        expect(b.top).toBeGreaterThan(a.top);
    });

    it('stretches its rows to a height given to the host', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 300px; height: 200px"
                ><span></span><span></span><span></span><span></span
            ></hmi-grid>`,
        );
        expect(rects(el).map((r) => r.height)).toEqual([100, 100, 100, 100]);
    });

    it('stays as wide as the host under justify-items', async () => {
        const el = await fixture(
            html`<hmi-grid style="width: 300px; justify-items: center"
                ><span style="width: 20px; height: 10px"></span
                ><span style="width: 20px; height: 10px"></span
            ></hmi-grid>`,
        );
        expect(base(el).getBoundingClientRect().width).toBe(300);
        const left = el.getBoundingClientRect().left;
        expect(rects(el).map((r) => r.left - left)).toEqual([65, 215]);
    });

    it('can still be styled through its base part', async () => {
        const style = document.createElement('style');
        style.textContent = '.parted::part(base) { grid-auto-rows: 40px; }';
        document.body.append(style);
        const el = await fixture(
            html`<hmi-grid class="parted">${cells(2)}</hmi-grid>`,
        );
        expect(el.getBoundingClientRect().height).toBe(40);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Grid,
                    { columns: 3, gap: 'small' },
                    createElement('span', null, 'One'),
                ),
            );
        });
        const el = mount.querySelector('hmi-grid') as HmiGrid;
        await el.updateComplete;
        expect(el.columns).toBe(3);
        expect(el.gap).toBe('small');
    });
});
