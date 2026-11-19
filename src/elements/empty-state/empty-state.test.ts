// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
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

    it('hides the icon from screen readers, adding no box', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                ><svg slot="icon" viewBox="0 0 24 24"><title>Empty inbox</title></svg
                ><span slot="title">T</span></hmi-empty-state
            >`,
        );
        const slot = el.shadowRoot?.querySelector('slot[name="icon"]');
        const wrapper = slot?.parentElement as HTMLElement;
        expect(wrapper.closest('[aria-hidden="true"]')).toBe(wrapper);
        expect(getComputedStyle(wrapper).display).toBe('contents');
        expect(slotted(el, 'icon')[0]?.getBoundingClientRect().width).toBe(48);
    });

    it('leaves the heading out while the title slot is empty', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                ><span slot="description">Nothing here.</span></hmi-empty-state
            >`,
        );
        const heading = el.shadowRoot?.querySelector('h3') as HTMLElement;
        expect(heading.hidden).toBe(true);
        expect(getComputedStyle(heading).display).toBe('none');
        const title = document.createElement('span');
        title.slot = 'title';
        title.textContent = 'Late title';
        el.append(title);
        await new Promise((r) => setTimeout(r));
        await el.updateComplete;
        expect(heading.hidden).toBe(false);
        title.remove();
        await new Promise((r) => setTimeout(r));
        await el.updateComplete;
        expect(heading.hidden).toBe(true);
    });

    it('takes the heading level from level, 3 otherwise', async () => {
        const el = await fixture(
            html`<hmi-empty-state level="2"
                ><span slot="title">T</span></hmi-empty-state
            >`,
        );
        expect(el.shadowRoot?.querySelector('[part~="title"]')?.tagName).toBe(
            'H2',
        );
        el.level = 6;
        await el.updateComplete;
        expect(el.getAttribute('level')).toBe('6');
        expect(el.shadowRoot?.querySelector('[part~="title"]')?.tagName).toBe(
            'H6',
        );
        el.setAttribute('level', '9');
        await el.updateComplete;
        expect(el.shadowRoot?.querySelector('[part~="title"]')?.tagName).toBe(
            'H3',
        );
    });

    it('lays several actions out in one row', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                ><span slot="title">T</span><button slot="action">Create</button
                ><button slot="action">Import</button></hmi-empty-state
            >`,
        );
        const [a, b] = slotted(el, 'action').map((n) =>
            n.getBoundingClientRect(),
        );
        expect(a?.top).toBe(b?.top);
        expect((b as DOMRect).left).toBeGreaterThanOrEqual(
            (a as DOMRect).right,
        );
    });

    it('draws no actions row without an action', async () => {
        const el = await fixture(
            html`<hmi-empty-state><span slot="title">T</span></hmi-empty-state>`,
        );
        const row = el.shadowRoot?.querySelector('[part~="actions"]');
        expect(getComputedStyle(row as Element).display).toBe('none');
    });

    it('wraps a long word inside the box', async () => {
        const el = await fixture(
            html`<hmi-empty-state style="width: 220px"
                ><span slot="title">Supercalifragilisticexpialidocious_identifier</span
                ><span slot="description"
                    >https://example.com/a/very/long/path/without/any/break/0123456789</span
                ></hmi-empty-state
            >`,
        );
        const base = el.shadowRoot?.querySelector('[part~="base"]') as Element;
        expect(base.scrollWidth).toBeLessThanOrEqual(base.clientWidth);
    });

    it('draws its dashed edge in --outline', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                style="--outline: rgb(1, 2, 3); --outline-variant: rgb(4, 5, 6)"
                ><span slot="title">T</span></hmi-empty-state
            >`,
        );
        const base = el.shadowRoot?.querySelector('[part~="base"]') as Element;
        expect(getComputedStyle(base).borderTopStyle).toBe('dashed');
        expect(getComputedStyle(base).borderTopColor).toBe('rgb(1, 2, 3)');
    });

    it('draws the icon in system colours in forced colors', async () => {
        const el = await fixture(
            html`<hmi-empty-state
                ><svg slot="icon" viewBox="0 0 24 24" aria-hidden="true"></svg
                ><span slot="title">T</span></hmi-empty-state
            >`,
        );
        const probe = document.createElement('span');
        probe.style.color = 'CanvasText';
        probe.style.backgroundColor = 'Canvas';
        document.body.append(probe);
        const session = cdp();
        await session.send('Emulation.setEmulatedMedia', {
            features: [{ name: 'forced-colors', value: 'active' }],
        });
        try {
            const icon = getComputedStyle(slotted(el, 'icon')[0] as Element);
            const system = getComputedStyle(probe);
            expect(icon.color).toBe(system.color);
            expect(icon.backgroundColor).toBe(system.backgroundColor);
            expect(icon.borderTopColor).toBe(system.color);
            expect(icon.borderTopStyle).toBe('solid');
        } finally {
            await session.send('Emulation.setEmulatedMedia', { features: [] });
        }
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
