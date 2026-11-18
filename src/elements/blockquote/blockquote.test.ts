import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './blockquote.js';
import type { HmiBlockquote } from './blockquote.js';
import { Blockquote } from './blockquote.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiBlockquote> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiBlockquote;
    await el.updateComplete;
    return el;
}

function slotted(el: HmiBlockquote, name?: string): Element[] {
    const selector = name ? `slot[name="${name}"]` : 'slot:not([name])';
    return (
        el.shadowRoot
            ?.querySelector<HTMLSlotElement>(selector)
            ?.assignedElements() ?? []
    );
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-blockquote', () => {
    it('registers', () => {
        expect(customElements.get('hmi-blockquote')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-blockquote>Quote</hmi-blockquote>`);
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base).not.toBeNull();
        const { width, height } = (base as Element).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects source', async () => {
        const el = await fixture(html`<hmi-blockquote>Quote</hmi-blockquote>`);
        const quote = el.shadowRoot?.querySelector('blockquote') as Element;
        expect(quote.hasAttribute('cite')).toBe(false);
        el.source = 'https://example.com/a';
        await el.updateComplete;
        expect(el.getAttribute('source')).toBe('https://example.com/a');
        expect(quote.getAttribute('cite')).toBe('https://example.com/a');
        el.setAttribute('source', 'https://example.com/b');
        await el.updateComplete;
        expect(el.source).toBe('https://example.com/b');
        expect(quote.getAttribute('cite')).toBe('https://example.com/b');
    });

    it('projects the default slot', async () => {
        const el = await fixture(
            html`<hmi-blockquote><b>Quote</b></hmi-blockquote>`,
        );
        expect(slotted(el)).toHaveLength(1);
    });

    it('projects cite slot below the quote', async () => {
        const el = await fixture(
            html`<hmi-blockquote>Quote<span slot="cite">Ada</span></hmi-blockquote>`,
        );
        const [cite] = slotted(el, 'cite');
        expect(cite).toBeDefined();
        const body = el.shadowRoot?.querySelector('[part~="body"]') as Element;
        expect(cite?.getBoundingClientRect().top).toBeGreaterThanOrEqual(
            body.getBoundingClientRect().bottom,
        );
        expect(getComputedStyle(cite as Element).fontStyle).toBe('normal');
    });

    it('adds no margin without a citation', async () => {
        const el = await fixture(
            html`<hmi-blockquote style="--space-6: 12px; --space-8: 16px"
                >Quote</hmi-blockquote
            >`,
        );
        const base = el.shadowRoot?.querySelector('[part~="base"]') as Element;
        const body = el.shadowRoot?.querySelector('[part~="body"]') as Element;
        const { paddingBlockStart, paddingBlockEnd } = getComputedStyle(base);
        expect(Number.parseFloat(paddingBlockStart)).toBe(12);
        expect(base.getBoundingClientRect().height).toBeCloseTo(
            body.getBoundingClientRect().height +
                Number.parseFloat(paddingBlockStart) +
                Number.parseFloat(paddingBlockEnd),
            1,
        );
    });

    it('spaces slotted paragraphs without outer margins', async () => {
        const el = await fixture(
            html`<hmi-blockquote style="--space-6: 12px"
                ><p>One</p>
                <p>Two</p></hmi-blockquote
            >`,
        );
        const [first, second] = slotted(el).map((p) =>
            p.getBoundingClientRect(),
        );
        const body = (
            el.shadowRoot?.querySelector('[part~="body"]') as Element
        ).getBoundingClientRect();
        expect(first?.top).toBeCloseTo(body.top, 1);
        expect(second?.bottom).toBeCloseTo(body.bottom, 1);
        expect((second?.top ?? 0) - (first?.bottom ?? 0)).toBeCloseTo(12, 1);
    });

    it('keeps the rule and the square corners on the inline start', async () => {
        const host = document.createElement('div');
        host.dir = 'rtl';
        document.body.append(host);
        render(
            html`<hmi-blockquote style="--corner-medium: 8px; --primary: red"
                >Quote</hmi-blockquote
            >`,
            host,
        );
        const el = host.firstElementChild as HmiBlockquote;
        await el.updateComplete;
        const base = el.shadowRoot?.querySelector('[part~="base"]') as Element;
        const cs = getComputedStyle(base);
        expect(cs.borderRightWidth).not.toBe('0px');
        expect(cs.borderLeftWidth).toBe('0px');
        expect(cs.borderTopRightRadius).toBe('0px');
        expect(cs.borderBottomRightRadius).toBe('0px');
        expect(cs.borderTopLeftRadius).toBe('8px');
        expect(cs.borderBottomLeftRadius).toBe('8px');
    });

    it('wraps a word longer than the line', async () => {
        const el = await fixture(
            html`<hmi-blockquote style="width: 120px"
                >Pneumonoultramicroscopicsilicovolcanoconiosis</hmi-blockquote
            >`,
        );
        const base = el.shadowRoot?.querySelector('[part~="base"]') as Element;
        expect(base.scrollWidth).toBeLessThanOrEqual(base.clientWidth);
    });

    it('sets scripts without italics upright', async () => {
        const el = await fixture(
            html`<hmi-blockquote lang="ar">اقتباس</hmi-blockquote>`,
        );
        const body = el.shadowRoot?.querySelector('[part~="body"]') as Element;
        expect(getComputedStyle(body).fontStyle).toBe('normal');
        el.lang = 'en';
        expect(getComputedStyle(body).fontStyle).toBe('italic');
    });

    it('exposes roles', async () => {
        const el = await fixture(
            html`<hmi-blockquote>Quote<span slot="cite">Ada</span></hmi-blockquote>`,
        );
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base?.localName).toBe('figure');
        expect(base?.getAttribute('role')).toBeNull();
        expect(base?.querySelector(':scope > blockquote')).not.toBeNull();
        expect(
            base?.querySelector(':scope > figcaption > slot[name="cite"]'),
        ).not.toBeNull();
        expect(base?.querySelector('blockquote slot[name="cite"]')).toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Blockquote,
                    { className: 'x' },
                    'Quote',
                    createElement('span', { slot: 'cite' }, 'Ada'),
                ),
            );
        });
        const el = mount.querySelector('hmi-blockquote') as HmiBlockquote;
        await el.updateComplete;
        expect(el.className).toBe('x');
        expect(slotted(el, 'cite')).toHaveLength(1);
    });
});
