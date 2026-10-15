import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './menu-item.js';
import type { HmiMenuItem } from './menu-item.js';
import { MenuItem } from './menu-item.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiMenuItem;
    await el.updateComplete;
    return el;
}

const base = (el: HmiMenuItem) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
const part = (el: HmiMenuItem, name: string) =>
    el.shadowRoot?.querySelector(`[part="${name}"]`) as HTMLElement;

const TOKENS =
    '--space-4: 8px; --space-5: 10px; --on-background: rgb(1, 2, 3); --error: rgb(200, 0, 0); --error-container: rgb(250, 200, 200); --surface-container-highest: rgb(9, 9, 9); --state-disabled-opacity: 0.4';

// The real pointer stays where a test left it: park it in a corner, away from
// where the next test puts its item, or it would hover the new item by itself.
afterEach(async () => {
    document.body.replaceChildren();
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-menu-item', () => {
    it('registers', () => {
        expect(customElements.get('hmi-menu-item')).toBeDefined();
    });

    it('is a block with a native button that is a menu item', async () => {
        const el = await fixture(html`<hmi-menu-item>Save</hmi-menu-item>`);
        expect(getComputedStyle(el).display).toBe('block');
        expect(base(el).tagName).toBe('BUTTON');
        expect(base(el).type).toBe('button');
        expect(base(el).getAttribute('role')).toBe('menuitem');
        expect(el.textContent).toBe('Save');
        expect(base(el).getBoundingClientRect().width).toBeGreaterThan(0);
    });

    it('reflects danger and disabled, and defaults both to false', async () => {
        const el = await fixture(html`<hmi-menu-item>Save</hmi-menu-item>`);
        expect(el.danger).toBe(false);
        expect(el.disabled).toBe(false);
        el.danger = true;
        el.disabled = true;
        await el.updateComplete;
        expect(el.hasAttribute('danger')).toBe(true);
        expect(el.hasAttribute('disabled')).toBe(true);
        expect(base(el).disabled).toBe(true);
        el.danger = false;
        el.disabled = false;
        await el.updateComplete;
        expect(el.hasAttribute('danger')).toBe(false);
        expect(base(el).disabled).toBe(false);
    });

    it('exposes base, icon, label and shortcut as parts', async () => {
        const el = await fixture(html`<hmi-menu-item>Save</hmi-menu-item>`);
        for (const name of ['base', 'icon', 'label', 'shortcut']) {
            expect(part(el, name)).not.toBeNull();
        }
    });

    describe('shortcut', () => {
        it('renders the shortcut property in the slot, and the slot in its place', async () => {
            const el = await fixture(
                html`<hmi-menu-item shortcut="⌘S">Save</hmi-menu-item>`,
            );
            const slot = el.shadowRoot?.querySelector(
                'slot[name="shortcut"]',
            ) as HTMLSlotElement;
            expect(slot.textContent).toBe('⌘S');
            const rich = await fixture(
                html`<hmi-menu-item shortcut="⌘S">Save<kbd slot="shortcut" id="k">Ctrl S</kbd></hmi-menu-item>`,
            );
            const richSlot = rich.shadowRoot?.querySelector(
                'slot[name="shortcut"]',
            ) as HTMLSlotElement;
            expect(richSlot.assignedElements().map((e) => e.id)).toEqual(['k']);
        });

        it('sits at the end of the row', async () => {
            const el = await fixture(
                html`<hmi-menu-item shortcut="⌘S" style="width: 300px; ${TOKENS}">Save</hmi-menu-item>`,
            );
            const row = base(el).getBoundingClientRect();
            const slot = el.shadowRoot?.querySelector(
                'slot[name="shortcut"]',
            ) as HTMLSlotElement;
            const range = document.createRange();
            range.selectNodeContents(slot);
            const text = range.getBoundingClientRect();
            expect(text.right).toBeCloseTo(row.right - 10, 0);
        });
    });

    describe('empty icon and shortcut', () => {
        it('add no box and no gap: the label starts at the row’s padding', async () => {
            const el = await fixture(
                html`<hmi-menu-item style="${TOKENS}">Save</hmi-menu-item>`,
            );
            const row = base(el).getBoundingClientRect();
            const label = part(el, 'label').getBoundingClientRect();
            expect(getComputedStyle(part(el, 'icon')).display).toBe('contents');
            expect(getComputedStyle(part(el, 'shortcut')).display).toBe(
                'contents',
            );
            expect(label.left).toBeCloseTo(row.left + 10, 1);
            expect(label.right).toBeCloseTo(row.right - 10, 1);
        });
    });

    describe('icon', () => {
        it('is rendered before the label, and an svg is sized to the text', async () => {
            const el = await fixture(
                html`<hmi-menu-item style="${TOKENS}; --space-5: 10px">
                    <svg slot="icon" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" /></svg>
                    Open
                </hmi-menu-item>`,
            );
            const icon = el.querySelector('svg') as SVGElement;
            const iconBox = icon.getBoundingClientRect();
            expect(iconBox.width).toBe(14);
            expect(iconBox.height).toBe(14);
            const label = part(el, 'label').getBoundingClientRect();
            expect(iconBox.right).toBeLessThanOrEqual(label.left);
            expect(label.left - iconBox.right).toBeCloseTo(10, 1);
        });

        it('is coloured from on-surface-variant, and from error when danger', async () => {
            const el = await fixture(
                html`<hmi-menu-item style="${TOKENS}; --on-surface-variant: rgb(5, 6, 7)">
                    <svg slot="icon" viewBox="0 0 10 10"></svg>Open
                </hmi-menu-item>`,
            );
            const icon = el.querySelector('svg') as SVGElement;
            expect(getComputedStyle(icon).color).toBe('rgb(5, 6, 7)');
            el.danger = true;
            await el.updateComplete;
            expect(getComputedStyle(icon).color).toBe('rgb(200, 0, 0)');
        });
    });

    describe('colours', () => {
        it('paints the label from on-background, and from error when danger', async () => {
            const el = await fixture(
                html`<hmi-menu-item style="${TOKENS}">Save</hmi-menu-item>`,
            );
            expect(getComputedStyle(base(el)).color).toBe('rgb(1, 2, 3)');
            el.danger = true;
            await el.updateComplete;
            expect(getComputedStyle(base(el)).color).toBe('rgb(200, 0, 0)');
        });

        it('highlights on hover, with the error container when danger', async () => {
            const el = await fixture(
                html`<hmi-menu-item style="${TOKENS}">Save</hmi-menu-item>`,
            );
            await userEvent.hover(base(el));
            await new Promise((resolve) => setTimeout(resolve, 20));
            expect(getComputedStyle(base(el)).backgroundColor).toBe(
                'rgb(9, 9, 9)',
            );
            await userEvent.unhover(base(el));
            el.danger = true;
            await el.updateComplete;
            await userEvent.hover(base(el));
            await new Promise((resolve) => setTimeout(resolve, 20));
            expect(getComputedStyle(base(el)).backgroundColor).toBe(
                'rgb(250, 200, 200)',
            );
        });

        it('dims a disabled item, and does not highlight it on hover', async () => {
            const el = await fixture(
                html`<hmi-menu-item disabled style="${TOKENS}">Save</hmi-menu-item>`,
            );
            expect(getComputedStyle(base(el)).opacity).toBe('0.4');
            expect(getComputedStyle(base(el)).cursor).toBe('not-allowed');
            await userEvent.hover(base(el), { force: true });
            await new Promise((resolve) => setTimeout(resolve, 20));
            expect(getComputedStyle(base(el)).backgroundColor).not.toBe(
                'rgb(9, 9, 9)',
            );
        });
    });

    it('takes the menu’s corner radii from the --_radius-* properties', async () => {
        const el = await fixture(
            html`<hmi-menu-item style="--_radius-tl: 7px; --_radius-br: 9px">Save</hmi-menu-item>`,
        );
        const style = getComputedStyle(base(el));
        expect(style.borderTopLeftRadius).toBe('7px');
        expect(style.borderBottomRightRadius).toBe('9px');
    });

    describe('activation', () => {
        it('fires a native click on the host, from a press and from Enter and Space', async () => {
            const el = await fixture(html`<hmi-menu-item>Save</hmi-menu-item>`);
            const targets: EventTarget[] = [];
            el.addEventListener('click', (e) => targets.push(e.target as Node));
            await userEvent.click(base(el));
            el.focus();
            await userEvent.keyboard('{Enter}');
            await userEvent.keyboard(' ');
            expect(targets).toEqual([el, el, el]);
        });

        it('takes no click and no focus when disabled', async () => {
            const el = await fixture(
                html`<hmi-menu-item disabled>Save</hmi-menu-item>`,
            );
            let clicks = 0;
            el.addEventListener('click', () => clicks++);
            await userEvent.click(base(el), { force: true });
            el.focus();
            expect(clicks).toBe(0);
            expect(el.shadowRoot?.activeElement).toBeNull();
        });

        it('delegates focus to the inner button', async () => {
            const el = await fixture(html`<hmi-menu-item>Save</hmi-menu-item>`);
            el.focus();
            expect(el.shadowRoot?.activeElement).toBe(base(el));
            expect(document.activeElement).toBe(el);
        });

        it('shows the focus ring on keyboard focus', async () => {
            const el = await fixture(
                html`<hmi-menu-item style="${TOKENS}; --ring: rgb(0, 0, 255)">Save</hmi-menu-item>`,
            );
            await userEvent.tab();
            expect(el.shadowRoot?.activeElement).toBe(base(el));
            expect(getComputedStyle(base(el)).boxShadow).toContain(
                'rgb(0, 0, 255)',
            );
        });
    });
});

describe('MenuItem (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and click', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        let clicks = 0;
        await act(async () => {
            root.render(
                createElement(
                    MenuItem,
                    {
                        danger: true,
                        shortcut: '⌫',
                        onClick: () => clicks++,
                    },
                    'Delete',
                ),
            );
        });
        const el = host.querySelector('hmi-menu-item') as HmiMenuItem;
        await el.updateComplete;
        expect(el.danger).toBe(true);
        expect(el.shortcut).toBe('⌫');
        await userEvent.click(base(el));
        expect(clicks).toBe(1);
        await act(async () => root.unmount());
    });
});
