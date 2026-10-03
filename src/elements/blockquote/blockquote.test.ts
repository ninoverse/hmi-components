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
        const plain = await fixture(
            html`<hmi-blockquote>Quote</hmi-blockquote>`,
        );
        const cited = await fixture(
            html`<hmi-blockquote>Quote<span slot="cite">Ada</span></hmi-blockquote>`,
        );
        const height = (el: HmiBlockquote) => el.getBoundingClientRect().height;
        expect(height(plain)).toBeLessThan(height(cited));
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-blockquote>Quote</hmi-blockquote>`);
        expect(el.shadowRoot?.querySelector('blockquote')).not.toBeNull();
        expect(
            el.shadowRoot
                ?.querySelector('[part~="base"]')
                ?.getAttribute('role'),
        ).toBeNull();
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
