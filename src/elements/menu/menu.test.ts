import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../menu-item/menu-item.js';
import '../menu-label/menu-label.js';
import '../menu-separator/menu-separator.js';
import './menu.js';
import type { HmiMenu } from './menu.js';
import { Menu } from './menu.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiMenu;
    await el.updateComplete;
    for (const item of el.querySelectorAll('hmi-menu-item')) {
        await (item as unknown as { updateComplete: Promise<unknown> })
            .updateComplete;
    }
    return el;
}

const base = (el: HmiMenu) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLElement;
const items = (el: HmiMenu) =>
    Array.from(el.querySelectorAll('hmi-menu-item')) as HTMLElement[];
const itemButton = (item: Element) =>
    item.shadowRoot?.querySelector('button') as HTMLButtonElement;
const focused = (el: HmiMenu) =>
    items(el).indexOf(document.activeElement as HTMLElement);

const FULL = html`<hmi-menu label="Actions">
    <hmi-menu-label>Workspace</hmi-menu-label>
    <hmi-menu-item id="a">New file</hmi-menu-item>
    <hmi-menu-item id="b" disabled>Open…</hmi-menu-item>
    <hmi-menu-item id="c">Save</hmi-menu-item>
    <hmi-menu-separator></hmi-menu-separator>
    <hmi-menu-item id="d" danger>Delete</hmi-menu-item>
</hmi-menu>`;

afterEach(async () => {
    document.body.replaceChildren();
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-menu', () => {
    it('registers', () => {
        expect(customElements.get('hmi-menu')).toBeDefined();
    });

    it('is a transparent column that gaps its children by 1px', async () => {
        const el = await fixture(FULL);
        expect(getComputedStyle(el).display).toBe('block');
        const style = getComputedStyle(base(el));
        expect(style.display).toBe('flex');
        expect(style.flexDirection).toBe('column');
        expect(style.rowGap).toBe('1px');
        expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
        expect(style.borderTopWidth).toBe('0px');
        expect(style.boxShadow).toBe('none');
    });

    it('is a menu named by label, with a base part', async () => {
        const el = await fixture(FULL);
        expect(base(el).getAttribute('part')).toBe('base');
        expect(base(el).getAttribute('role')).toBe('menu');
        expect(base(el).getAttribute('aria-label')).toBe('Actions');
        el.label = '';
        await el.updateComplete;
        expect(base(el).hasAttribute('aria-label')).toBe(false);
    });

    it('projects its children into the base', async () => {
        const el = await fixture(FULL);
        const slot = base(el).querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedElements().map((e) => e.localName)).toEqual([
            'hmi-menu-label',
            'hmi-menu-item',
            'hmi-menu-item',
            'hmi-menu-item',
            'hmi-menu-separator',
            'hmi-menu-item',
        ]);
    });

    describe('corner radii', () => {
        const TOKENS =
            '--corner-tl: 11px; --corner-tr: 12px; --corner-br: 13px; --corner-bl: 14px; --corner-extra-small: 3px';
        const radii = (item: Element) => {
            const style = getComputedStyle(itemButton(item));
            return [
                style.borderTopLeftRadius,
                style.borderTopRightRadius,
                style.borderBottomRightRadius,
                style.borderBottomLeftRadius,
            ];
        };

        it('gives the first item the top corners of the surface and the last the bottom ones', async () => {
            const el = await fixture(
                html`<hmi-menu style="${TOKENS}">
                    <hmi-menu-item>One</hmi-menu-item>
                    <hmi-menu-item>Two</hmi-menu-item>
                    <hmi-menu-item>Three</hmi-menu-item>
                </hmi-menu>`,
            );
            const [first, middle, last] = items(el);
            expect(radii(first as Element)).toEqual([
                '11px',
                '12px',
                '3px',
                '3px',
            ]);
            expect(radii(middle as Element)).toEqual([
                '3px',
                '3px',
                '3px',
                '3px',
            ]);
            expect(radii(last as Element)).toEqual([
                '3px',
                '3px',
                '13px',
                '14px',
            ]);
        });

        it('gives a single item all four, and no item after a label the top ones', async () => {
            const single = await fixture(
                html`<hmi-menu style="${TOKENS}"><hmi-menu-item>One</hmi-menu-item></hmi-menu>`,
            );
            expect(radii(items(single)[0] as Element)).toEqual([
                '11px',
                '12px',
                '13px',
                '14px',
            ]);
            const labelled = await fixture(
                html`<hmi-menu style="${TOKENS}">
                    <hmi-menu-label>Group</hmi-menu-label>
                    <hmi-menu-item>One</hmi-menu-item>
                    <hmi-menu-item>Two</hmi-menu-item>
                </hmi-menu>`,
            );
            expect(radii(items(labelled)[0] as Element)).toEqual([
                '3px',
                '3px',
                '3px',
                '3px',
            ]);
            expect(radii(items(labelled)[1] as Element)).toEqual([
                '3px',
                '3px',
                '13px',
                '14px',
            ]);
        });
    });

    describe('keyboard', () => {
        it('moves focus to the next enabled item on ArrowDown, skipping a disabled one', async () => {
            const el = await fixture(FULL);
            items(el)[0]?.focus();
            expect(focused(el)).toBe(0);
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(2);
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(3);
        });

        it('wraps from the last item to the first, and from the first to the last on ArrowUp', async () => {
            const el = await fixture(FULL);
            items(el)[3]?.focus();
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(0);
            await userEvent.keyboard('{ArrowUp}');
            expect(focused(el)).toBe(3);
            await userEvent.keyboard('{ArrowUp}');
            expect(focused(el)).toBe(2);
        });

        it('moves to the first and last enabled items on Home and End', async () => {
            const el = await fixture(FULL);
            items(el)[2]?.focus();
            await userEvent.keyboard('{Home}');
            expect(focused(el)).toBe(0);
            await userEvent.keyboard('{End}');
            expect(focused(el)).toBe(3);
        });

        it('keeps the page from scrolling on the keys it handles, and ignores the rest', async () => {
            const el = await fixture(FULL);
            items(el)[0]?.focus();
            const prevented: Record<string, boolean> = {};
            document.addEventListener('keydown', (event) => {
                prevented[event.key] = event.defaultPrevented;
            });
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('a');
            await userEvent.keyboard('{ArrowLeft}');
            expect(prevented.ArrowDown).toBe(true);
            expect(prevented.a).toBe(false);
            expect(prevented.ArrowLeft).toBe(false);
        });

        it('ignores a key pressed with a modifier', async () => {
            const el = await fixture(FULL);
            items(el)[0]?.focus();
            await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');
            expect(focused(el)).toBe(0);
        });

        it('goes to the first item on ArrowDown, and the last on ArrowUp, from a focusable that is not an item', async () => {
            const el = await fixture(
                html`<hmi-menu>
                    <button id="own">Own</button>
                    <hmi-menu-item>One</hmi-menu-item>
                    <hmi-menu-item>Two</hmi-menu-item>
                </hmi-menu>`,
            );
            (el.querySelector('#own') as HTMLElement).focus();
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(0);
            (el.querySelector('#own') as HTMLElement).focus();
            await userEvent.keyboard('{ArrowUp}');
            expect(focused(el)).toBe(1);
        });

        it('does nothing in a menu with no enabled item', async () => {
            const el = await fixture(
                html`<hmi-menu>
                    <button id="own">Own</button>
                    <hmi-menu-item disabled>One</hmi-menu-item>
                </hmi-menu>`,
            );
            (el.querySelector('#own') as HTMLElement).focus();
            await userEvent.keyboard('{ArrowDown}');
            expect(document.activeElement).toBe(el.querySelector('#own'));
        });

        it('finds items nested in a wrapper', async () => {
            const el = await fixture(
                html`<hmi-menu>
                    <div><hmi-menu-item>One</hmi-menu-item></div>
                    <div><hmi-menu-item>Two</hmi-menu-item></div>
                </hmi-menu>`,
            );
            items(el)[0]?.focus();
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(1);
        });

        it('leaves the items in the Tab order', async () => {
            const el = await fixture(FULL);
            await userEvent.tab();
            expect(focused(el)).toBe(0);
            await userEvent.tab();
            expect(focused(el)).toBe(2);
            await userEvent.tab();
            expect(focused(el)).toBe(3);
        });

        it('activates the focused item on Enter without closing or moving focus', async () => {
            const el = await fixture(FULL);
            let clicked = '';
            el.addEventListener('click', (e) => {
                clicked = (e.target as HTMLElement).id;
            });
            items(el)[2]?.focus();
            await userEvent.keyboard('{Enter}');
            expect(clicked).toBe('c');
            expect(focused(el)).toBe(2);
        });
    });
});

describe('Menu (React wrapper)', () => {
    it('mounts through the React wrapper, with its label', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(createElement(Menu, { label: 'Actions' }));
        });
        const el = host.querySelector('hmi-menu') as HmiMenu;
        await el.updateComplete;
        expect(el.label).toBe('Actions');
        expect(base(el).getAttribute('aria-label')).toBe('Actions');
        await act(async () => root.unmount());
    });
});
