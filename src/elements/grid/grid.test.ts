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
    const el = host.firstElementChild as HmiGrid;
    await el.updateComplete;
    return el;
}

const base = (el: HmiGrid) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;
const cells = (count: number) =>
    html`${Array.from({ length: count }, () => html`<span style="height: 10px"></span>`)}`;
const rects = (el: HmiGrid) =>
    [...el.children].map((c) => c.getBoundingClientRect());

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-grid', () => {
    it('registers', () => {
        expect(customElements.get('hmi-grid')).toBeDefined();
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
        const el = await fixture(html`<hmi-grid></hmi-grid>`);
        expect(el.columns).toBe(2);
        expect(el.gap).toBe('none');
        expect(base(el).style.gridTemplateColumns).toBe(
            'repeat(2, minmax(0px, 1fr))',
        );
    });

    it('reflects gap', async () => {
        const el = await fixture(html`<hmi-grid></hmi-grid>`);
        el.gap = 'large';
        await el.updateComplete;
        expect(el.getAttribute('gap')).toBe('large');
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

    it('cannot break out of the declaration it is set in', async () => {
        const el = await fixture(
            html`<hmi-grid columns="1fr; } :host { display: none"></hmi-grid>`,
        );
        // the CSSOM keeps the first declaration and drops the rest
        expect(base(el).style.gridTemplateColumns).toBe('1fr');
        expect(getComputedStyle(el).display).toBe('block');
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
