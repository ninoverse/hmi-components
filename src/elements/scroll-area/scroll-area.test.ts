import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './scroll-area.js';
import type { HmiScrollArea } from './scroll-area.js';
import { ScrollArea } from './scroll-area.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiScrollArea> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiScrollArea;
    await el.updateComplete;
    return el;
}

const base = (el: HmiScrollArea) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;

const tall = html`<div style="height: 400px; width: 100px"></div>`;
const wide = html`<div style="height: 20px; width: 800px"></div>`;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-scroll-area', () => {
    it('registers', () => {
        expect(customElements.get('hmi-scroll-area')).toBeDefined();
    });

    it('has defaults and reflects orientation', async () => {
        const el = await fixture(html`<hmi-scroll-area></hmi-scroll-area>`);
        expect(el.orientation).toBe('vertical');
        expect(el.maxHeight).toBeUndefined();
        el.orientation = 'both';
        await el.updateComplete;
        expect(el.getAttribute('orientation')).toBe('both');
    });

    it('scrolls vertically once maxHeight is reached, and hides the other axis', async () => {
        const el = await fixture(
            html`<hmi-scroll-area .maxHeight=${100}>${tall}</hmi-scroll-area>`,
        );
        const scroller = base(el);
        expect(scroller.clientHeight).toBe(100);
        expect(scroller.scrollHeight).toBe(400);
        const style = getComputedStyle(scroller);
        expect(style.overflowY).toBe('auto');
        expect(style.overflowX).toBe('hidden');
    });

    it('reads a digit-only attribute as pixels', async () => {
        const el = await fixture(
            html`<hmi-scroll-area max-height="120">${tall}</hmi-scroll-area>`,
        );
        expect(el.maxHeight).toBe(120);
        expect(base(el).clientHeight).toBe(120);
    });

    it('uses any other string as a CSS length', async () => {
        const el = await fixture(
            html`<hmi-scroll-area max-height="10em">${tall}</hmi-scroll-area>`,
        );
        expect(el.maxHeight).toBe('10em');
        expect(base(el).style.maxHeight).toBe('10em');
    });

    it('is limited by a CSS max-height on the host too', async () => {
        const el = await fixture(
            html`<hmi-scroll-area style="max-height: 80px">${tall}</hmi-scroll-area>`,
        );
        expect(base(el).clientHeight).toBe(80);
        expect(base(el).scrollHeight).toBe(400);
    });

    it('lets maxHeight win over the host max-height', async () => {
        const el = await fixture(
            html`<hmi-scroll-area style="max-height: 80px" .maxHeight=${60}>${tall}</hmi-scroll-area>`,
        );
        expect(base(el).clientHeight).toBe(60);
    });

    it('does not constrain content without a max height', async () => {
        const el = await fixture(
            html`<hmi-scroll-area>${tall}</hmi-scroll-area>`,
        );
        expect(base(el).clientHeight).toBe(400);
    });

    it('scrolls horizontally when horizontal', async () => {
        const el = await fixture(
            html`<hmi-scroll-area orientation="horizontal" style="width: 200px">${wide}</hmi-scroll-area>`,
        );
        const scroller = base(el);
        expect(scroller.clientWidth).toBe(200);
        expect(scroller.scrollWidth).toBe(800);
        const style = getComputedStyle(scroller);
        expect(style.overflowX).toBe('auto');
        expect(style.overflowY).toBe('hidden');
    });

    it('scrolls both ways when both', async () => {
        const el = await fixture(
            html`<hmi-scroll-area orientation="both" style="width: 150px" .maxHeight=${90}>
                <div style="height: 400px; width: 800px"></div>
            </hmi-scroll-area>`,
        );
        const style = getComputedStyle(base(el));
        expect(style.overflowX).toBe('auto');
        expect(style.overflowY).toBe('auto');
    });

    it('thins the scrollbar and takes its colour from the outline token', async () => {
        const el = await fixture(html`<hmi-scroll-area></hmi-scroll-area>`);
        el.style.setProperty('--outline', 'rgb(1, 2, 3)');
        const style = getComputedStyle(base(el));
        expect(style.scrollbarWidth).toBe('thin');
        expect(style.scrollbarColor).toContain('rgb(1, 2, 3)');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    ScrollArea,
                    { maxHeight: 100, orientation: 'vertical' },
                    createElement('div', { style: { height: 400 } }),
                ),
            );
        });
        const el = mount.querySelector('hmi-scroll-area') as HmiScrollArea;
        await el.updateComplete;
        expect(el.maxHeight).toBe(100);
        expect(base(el).clientHeight).toBe(100);
    });
});
