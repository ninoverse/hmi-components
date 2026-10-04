import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './visually-hidden.js';
import type { HmiVisuallyHidden } from './visually-hidden.js';
import { VisuallyHidden } from './visually-hidden.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiVisuallyHidden> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-visually-hidden') as HmiVisuallyHidden;
    await el.updateComplete;
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-visually-hidden', () => {
    it('registers', () => {
        expect(customElements.get('hmi-visually-hidden')).toBeDefined();
    });

    it('collapses to a clipped one-pixel box', async () => {
        const el = await fixture(
            html`<hmi-visually-hidden>Search</hmi-visually-hidden>`,
        );
        const style = getComputedStyle(el);
        expect(style.position).toBe('absolute');
        expect(style.overflow).toBe('hidden');
        expect(style.clipPath).toBe('inset(50%)');
        expect(style.whiteSpace).toBe('nowrap');
        const { width, height } = el.getBoundingClientRect();
        expect(width).toBe(1);
        expect(height).toBe(1);
    });

    it('takes no room in the layout', async () => {
        const host = document.createElement('div');
        host.style.cssText = 'position: relative; width: 100px; height: 20px';
        host.innerHTML =
            '<hmi-visually-hidden>A long hidden label</hmi-visually-hidden><span>Visible</span>';
        document.body.append(host);
        await (host.firstElementChild as HmiVisuallyHidden).updateComplete;
        expect(host.getBoundingClientRect().height).toBe(20);
        expect(
            (host.querySelector('span') as HTMLElement).getBoundingClientRect()
                .left,
        ).toBe(host.getBoundingClientRect().left);
    });

    it('keeps its content in the document for assistive technology', async () => {
        const el = await fixture(
            html`<button><hmi-visually-hidden>Search</hmi-visually-hidden></button>`,
        );
        expect(el.textContent).toBe('Search');
        expect(
            el.shadowRoot?.querySelector('slot')?.assignedNodes().length,
        ).toBeGreaterThan(0);
        expect(el.hasAttribute('hidden')).toBe(false);
        expect(el.getAttribute('aria-hidden')).toBeNull();
    });

    it('lets the wrapper element keep its semantics', async () => {
        const el = await fixture(
            html`<h2><hmi-visually-hidden>Section title</hmi-visually-hidden></h2>`,
        );
        expect(el.closest('h2')?.textContent).toBe('Section title');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(VisuallyHidden, null, 'Search'),
            );
        });
        const el = mount.querySelector(
            'hmi-visually-hidden',
        ) as HmiVisuallyHidden;
        await el.updateComplete;
        expect(el.textContent).toBe('Search');
        expect(el.getBoundingClientRect().width).toBe(1);
    });
});
