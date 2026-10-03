import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './empty-state.js';
import type { HmiEmptyState } from './empty-state.js';
import { EmptyState } from './empty-state.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiEmptyState> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiEmptyState;
    await el.updateComplete;
    return el;
}

function slotted(el: HmiEmptyState, name: string): Element[] {
    return (
        el.shadowRoot
            ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
            ?.assignedElements() ?? []
    );
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-empty-state', () => {
    it('registers', () => {
        expect(customElements.get('hmi-empty-state')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(
            html`<hmi-empty-state><span slot="title">No results</span></hmi-empty-state>`,
        );
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base).not.toBeNull();
        const { width, height } = (base as Element).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('projects title slot inside a heading', async () => {
        const el = await fixture(
            html`<hmi-empty-state><span slot="title">No results</span></hmi-empty-state>`,
        );
        expect(slotted(el, 'title')).toHaveLength(1);
        const heading = el.shadowRoot?.querySelector('[part~="title"]');
        expect(heading?.tagName).toBe('H3');
        expect(heading?.querySelector('slot[name="title"]')).not.toBeNull();
    });

    it('projects description slot', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                ><span slot="title">T</span
                ><span slot="description">Try another search.</span></hmi-empty-state
            >`,
        );
        expect(slotted(el, 'description')).toHaveLength(1);
    });

    it('projects action slot', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                ><span slot="title">T</span><button slot="action">Reset</button></hmi-empty-state
            >`,
        );
        expect(slotted(el, 'action')).toHaveLength(1);
    });

    it('projects icon slot and draws it as a circle', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                ><svg slot="icon" viewBox="0 0 24 24" aria-hidden="true"></svg
                ><span slot="title">T</span></hmi-empty-state
            >`,
        );
        const icon = slotted(el, 'icon')[0] as Element;
        expect(icon).toBeDefined();
        const { width, height } = icon.getBoundingClientRect();
        expect(width).toBe(48);
        expect(height).toBe(48);
        expect(getComputedStyle(icon).borderRadius).toBe('50%');
    });

    it('draws no icon circle without an icon', async () => {
        const el = await fixture(
            html`<hmi-empty-state><span slot="title">T</span></hmi-empty-state>`,
        );
        expect(slotted(el, 'icon')).toHaveLength(0);
    });

    it('exposes roles', async () => {
        const el = await fixture(
            html`<hmi-empty-state><span slot="title">T</span></hmi-empty-state>`,
        );
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base?.getAttribute('role')).toBeNull();
        expect(el.shadowRoot?.querySelector('h3')).not.toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    EmptyState,
                    { className: 'x' },
                    createElement('span', { slot: 'title' }, 'No results'),
                    createElement(
                        'span',
                        { slot: 'description' },
                        'Try again.',
                    ),
                ),
            );
        });
        const el = mount.querySelector('hmi-empty-state') as HmiEmptyState;
        await el.updateComplete;
        expect(el.className).toBe('x');
        expect(slotted(el, 'title')).toHaveLength(1);
        expect(slotted(el, 'description')).toHaveLength(1);
    });
});
