import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import '../menu/menu.js';
import '../menu-item/menu-item.js';
import '../menu-label/menu-label.js';
import '../menu-separator/menu-separator.js';
import './context-menu.js';
import type {
    ContextMenuOpenChangeDetail,
    HmiContextMenu,
} from './context-menu.js';
import { ContextMenu } from './context-menu.react.js';

const MENU = html`<hmi-menu slot="menu" label="Edit">
    <hmi-menu-label id="label">Edit</hmi-menu-label>
    <hmi-menu-item id="copy" shortcut="⌘C">Copy</hmi-menu-item>
    <hmi-menu-item id="paste" disabled>Paste</hmi-menu-item>
    <hmi-menu-separator></hmi-menu-separator>
    <hmi-menu-item id="delete" danger>Delete</hmi-menu-item>
</hmi-menu>`;

async function fixture(menu = MENU) {
    const host = document.createElement('div');
    document.body.append(host);
    render(
        html`<div style="padding: 100px 200px">
                <hmi-context-menu>
                    <div slot="trigger" id="area" style="width: 300px; height: 150px; background: #ddd">Right-click</div>
                    ${menu}
                </hmi-context-menu>
            </div>
            <div id="outside" style="position: absolute; left: 0; top: 500px; width: 60px; height: 40px"></div>
            <div style="height: 3000px"></div>`,
        host,
    );
    const el = host.querySelector('hmi-context-menu') as HmiContextMenu;
    await el.updateComplete;
    for (const item of el.querySelectorAll('hmi-menu-item')) {
        await (item as unknown as { updateComplete: Promise<unknown> })
            .updateComplete;
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const panel = (el: HmiContextMenu) =>
    el.shadowRoot?.querySelector('.panel') as HTMLElement;
const area = (el: HmiContextMenu) => el.querySelector('#area') as HTMLElement;
const item = (el: HmiContextMenu, id: string) =>
    el.querySelector(`#${id}`) as HTMLElement;
const isShown = (el: HmiContextMenu) => panel(el).matches(':popover-open');
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const listen = (el: HmiContextMenu) => {
    const events: CustomEvent<ContextMenuOpenChangeDetail>[] = [];
    el.addEventListener('hmi-open-change', (e) =>
        events.push(e as CustomEvent<ContextMenuOpenChangeDetail>),
    );
    return events;
};

// A `contextmenu` event at a point of the page, as a right-click or, with a
// button other than 2, as the Menu key sends it.
function contextMenu(el: HTMLElement, x: number, y: number, button = 2) {
    const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: x,
        clientY: y,
        button,
    });
    el.dispatchEvent(event);
    return event;
}

beforeEach(async () => {
    await page.viewport(1000, 700);
    // A viewport change reaches the page as a resize a frame later, which would
    // close a menu opened in the meantime.
    await frame();
    await frame();
});

afterEach(async () => {
    document.body.replaceChildren();
    window.scrollTo(0, 0);
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-context-menu', () => {
    it('registers', () => {
        expect(customElements.get('hmi-context-menu')).toBeDefined();
    });

    it('is closed by default, reflects open, and shows its card in the top layer from open', async () => {
        const el = await fixture();
        expect(el.open).toBe(false);
        expect(isShown(el)).toBe(false);
        el.open = true;
        await el.updateComplete;
        expect(el.hasAttribute('open')).toBe(true);
        expect(isShown(el)).toBe(true);
        expect(panel(el).getAttribute('popover')).toBe('auto');
        el.open = false;
        await el.updateComplete;
        expect(isShown(el)).toBe(false);
        expect(el.hasAttribute('open')).toBe(false);
    });

    it('has focus-on-open keyboard by default, and takes it from the attribute', async () => {
        const el = await fixture();
        expect(el.focusOnOpen).toBe('keyboard');
        el.setAttribute('focus-on-open', 'always');
        expect(el.focusOnOpen).toBe('always');
    });

    it('exposes the trigger wrapper and the card as base and panel, with the menu slot', async () => {
        const el = await fixture();
        expect(el.shadowRoot?.querySelector('[part="trigger"]')).not.toBeNull();
        expect(panel(el).getAttribute('part')).toBe('base panel');
        const slot = panel(el).querySelector(
            'slot[name="menu"]',
        ) as HTMLSlotElement;
        expect(slot.assignedElements().map((e) => e.localName)).toEqual([
            'hmi-menu',
        ]);
    });

    it('paints the card from the panel tokens, embeds the liquid filter and is at least 144px wide', async () => {
        const el = await fixture();
        el.style.cssText =
            '--panel-bg: rgb(1, 2, 3); --panel-border: rgb(4, 5, 6); --on-background: rgb(7, 8, 9)';
        el.open = true;
        await el.updateComplete;
        const style = getComputedStyle(panel(el));
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.borderTopColor).toBe('rgb(4, 5, 6)');
        expect(style.color).toBe('rgb(7, 8, 9)');
        expect(style.minWidth).toBe('144px');
        expect(panel(el).querySelector('filter#liquid-glass')).not.toBeNull();
    });

    describe('opening at the pointer', () => {
        it('opens at the point of a right-click on the trigger, and prevents the native menu', async () => {
            const el = await fixture();
            const event = contextMenu(area(el), 320, 260);
            await el.updateComplete;
            expect(event.defaultPrevented).toBe(true);
            expect(el.open).toBe(true);
            expect(isShown(el)).toBe(true);
            const box = panel(el).getBoundingClientRect();
            expect(box.left).toBeCloseTo(320, 0);
            expect(box.top).toBeCloseTo(260, 0);
        });

        it('opens from a right-click on anything inside the trigger', async () => {
            const el = await fixture(
                html`<hmi-menu slot="menu"><hmi-menu-item>One</hmi-menu-item></hmi-menu>`,
            );
            const inner = document.createElement('span');
            inner.textContent = 'inner';
            area(el).append(inner);
            contextMenu(inner, 300, 250);
            await el.updateComplete;
            expect(el.open).toBe(true);
        });

        it('opens from a real right-click, at the pointer', async () => {
            const el = await fixture();
            await userEvent.click(area(el), {
                button: 'right',
                position: { x: 40, y: 30 },
            });
            await el.updateComplete;
            expect(el.open).toBe(true);
            const trigger = area(el).getBoundingClientRect();
            const box = panel(el).getBoundingClientRect();
            expect(box.left).toBeCloseTo(trigger.left + 40, 0);
            expect(box.top).toBeCloseTo(trigger.top + 30, 0);
        });

        it('is as wide as its content, whatever the room beside the pointer', async () => {
            const el = await fixture();
            contextMenu(area(el), 150, 150);
            await el.updateComplete;
            const near = panel(el).getBoundingClientRect().width;
            el.open = false;
            await el.updateComplete;
            contextMenu(area(el), 985, 150);
            await el.updateComplete;
            expect(panel(el).getBoundingClientRect().width).toBeCloseTo(
                near,
                0,
            );
        });

        it('clamps to the screen with a margin of 8px', async () => {
            const el = await fixture();
            contextMenu(area(el), 990, 695);
            await el.updateComplete;
            const box = panel(el).getBoundingClientRect();
            expect(box.right).toBeCloseTo(1000 - 8, 0);
            expect(box.bottom).toBeCloseTo(700 - 8, 0);
            el.open = false;
            await el.updateComplete;
            contextMenu(area(el), 2, 3);
            await el.updateComplete;
            const corner = panel(el).getBoundingClientRect();
            expect(corner.left).toBeCloseTo(8, 0);
            expect(corner.top).toBeCloseTo(8, 0);
        });

        it('moves to the new point on a second right-click while open', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            contextMenu(area(el), 400, 300);
            await el.updateComplete;
            expect(el.open).toBe(true);
            const box = panel(el).getBoundingClientRect();
            expect(box.left).toBeCloseTo(400, 0);
            expect(box.top).toBeCloseTo(300, 0);
        });

        it('opens at the trigger’s top-left corner when open is set from code', async () => {
            const el = await fixture();
            el.open = true;
            await el.updateComplete;
            const trigger = area(el).getBoundingClientRect();
            const box = panel(el).getBoundingClientRect();
            expect(box.left).toBeCloseTo(trigger.left, 0);
            expect(box.top).toBeCloseTo(trigger.top, 0);
        });

        it('forgets the point once closed, so a later open from code is at the corner again', async () => {
            const el = await fixture();
            contextMenu(area(el), 420, 320);
            await el.updateComplete;
            el.open = false;
            await el.updateComplete;
            el.open = true;
            await el.updateComplete;
            const trigger = area(el).getBoundingClientRect();
            expect(panel(el).getBoundingClientRect().left).toBeCloseTo(
                trigger.left,
                0,
            );
        });
    });

    describe('open-change', () => {
        it('tells the consumer of a right-click, not cancelable', async () => {
            const el = await fixture();
            const events = listen(el);
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
            expect(events[0]?.bubbles).toBe(true);
            expect(events[0]?.composed).toBe(true);
            expect(events[0]?.cancelable).toBe(false);
        });

        it('tells nothing when open is set from code', async () => {
            const el = await fixture();
            const events = listen(el);
            el.open = true;
            await el.updateComplete;
            el.open = false;
            await el.updateComplete;
            await wait(20);
            expect(events).toHaveLength(0);
        });
    });

    describe('dismissal', () => {
        it('closes on Escape, and tells the consumer', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            const events = listen(el);
            await userEvent.keyboard('{Escape}');
            await el.updateComplete;
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('closes on a click outside, and stays open on a click on its padding or a label', async () => {
            const el = await fixture();
            el.style.setProperty('--space-2', '6px');
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            const events = listen(el);
            await userEvent.click(item(el, 'label'));
            expect(el.open).toBe(true);
            await userEvent.click(panel(el), { position: { x: 3, y: 3 } });
            expect(el.open).toBe(true);
            expect(events).toHaveLength(0);
            await userEvent.click(
                document.getElementById('outside') as HTMLElement,
            );
            await el.updateComplete;
            expect(el.open).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('closes when an item is activated, after the item’s own handler ran', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            const order: string[] = [];
            item(el, 'copy').addEventListener('click', () =>
                order.push(`copy while ${el.open ? 'open' : 'closed'}`),
            );
            el.addEventListener('hmi-open-change', (e) =>
                order.push(
                    `open-change ${(e as CustomEvent<ContextMenuOpenChangeDetail>).detail.open}`,
                ),
            );
            await userEvent.click(item(el, 'copy'));
            await el.updateComplete;
            expect(order).toEqual(['copy while open', 'open-change false']);
            expect(el.open).toBe(false);
        });

        it('closes when an item is activated from the keyboard', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260, 0);
            await el.updateComplete;
            expect(document.activeElement).toBe(item(el, 'copy'));
            await userEvent.keyboard('{Enter}');
            await el.updateComplete;
            expect(el.open).toBe(false);
        });

        it('stays open for a disabled item', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            await userEvent.click(item(el, 'paste'), { force: true });
            expect(el.open).toBe(true);
        });

        it('closes when the page scrolls, and when the window resizes', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            window.scrollTo(0, 40);
            await frame();
            await frame();
            expect(el.open).toBe(false);
            contextMenu(area(el), 320, 200);
            await el.updateComplete;
            expect(el.open).toBe(true);
            window.dispatchEvent(new Event('resize'));
            expect(el.open).toBe(false);
        });

        it('stops listening for scroll and resize once closed', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            el.open = false;
            await el.updateComplete;
            const events = listen(el);
            window.scrollTo(0, 40);
            window.dispatchEvent(new Event('resize'));
            await frame();
            expect(events).toHaveLength(0);
        });

        it('closes when another popover opens, and tells the consumer', async () => {
            const el = await fixture();
            const other = document.createElement('div');
            other.setAttribute('popover', 'auto');
            other.textContent = 'other';
            document.body.append(other);
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            await wait(20);
            const events = listen(el);
            other.showPopover();
            await wait(20);
            expect(el.open).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('shows its card again when taken out of the document and put back while open', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260);
            await el.updateComplete;
            const other = document.createElement('div');
            document.body.append(other);
            el.remove();
            other.append(el);
            await el.updateComplete;
            expect(isShown(el)).toBe(true);
        });
    });

    describe('focus-on-open', () => {
        const focusedItem = (el: HmiContextMenu) =>
            (el.querySelector('hmi-menu-item:focus') as HTMLElement | null)?.id;

        it('moves focus to the first enabled item for a contextmenu that is not a right-button press, by default', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260, 0);
            await el.updateComplete;
            expect(focusedItem(el)).toBe('copy');
            el.open = false;
            await el.updateComplete;
            contextMenu(area(el), 320, 260, -1);
            await el.updateComplete;
            expect(focusedItem(el)).toBe('copy');
        });

        it('skips a disabled first item', async () => {
            const el = await fixture(
                html`<hmi-menu slot="menu">
                    <hmi-menu-item id="first" disabled>First</hmi-menu-item>
                    <hmi-menu-item id="second">Second</hmi-menu-item>
                </hmi-menu>`,
            );
            contextMenu(area(el), 320, 260, 0);
            await el.updateComplete;
            expect(focusedItem(el)).toBe('second');
        });

        it('leaves focus alone for a right-click by default', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260, 2);
            await el.updateComplete;
            expect(focusedItem(el)).toBeUndefined();
        });

        it('always moves focus with focus-on-open="always", from a right-click and from code', async () => {
            const el = await fixture();
            el.focusOnOpen = 'always';
            contextMenu(area(el), 320, 260, 2);
            await el.updateComplete;
            expect(focusedItem(el)).toBe('copy');
            el.open = false;
            await el.updateComplete;
            (document.activeElement as HTMLElement | null)?.blur();
            el.open = true;
            await el.updateComplete;
            expect(focusedItem(el)).toBe('copy');
        });

        it('never moves focus with focus-on-open="never"', async () => {
            const el = await fixture();
            el.focusOnOpen = 'never';
            contextMenu(area(el), 320, 260, 0);
            await el.updateComplete;
            expect(focusedItem(el)).toBeUndefined();
        });

        it('does not move focus when open is set from code, by default', async () => {
            const el = await fixture();
            el.open = true;
            await el.updateComplete;
            expect(focusedItem(el)).toBeUndefined();
        });

        it('lets the arrow keys move on from the focused item, and gives focus back on Escape', async () => {
            const el = await fixture();
            const before = document.createElement('button');
            before.textContent = 'before';
            document.body.prepend(before);
            before.focus();
            contextMenu(area(el), 320, 260, 0);
            await el.updateComplete;
            expect(focusedItem(el)).toBe('copy');
            await userEvent.keyboard('{ArrowDown}');
            expect(focusedItem(el)).toBe('delete');
            await userEvent.keyboard('{Escape}');
            await el.updateComplete;
            expect(el.open).toBe(false);
            expect(document.activeElement).toBe(before);
        });

        it('gives focus back to where it was when an activated item closes the menu', async () => {
            const el = await fixture();
            const before = document.createElement('button');
            before.textContent = 'before';
            document.body.prepend(before);
            before.focus();
            contextMenu(area(el), 320, 260, 2);
            await el.updateComplete;
            expect(document.activeElement).toBe(before);
            await userEvent.click(item(el, 'copy'));
            await el.updateComplete;
            expect(el.open).toBe(false);
            expect(document.activeElement).toBe(before);
        });

        it('does not take focus from an element the user moved to on purpose', async () => {
            const el = await fixture();
            const before = document.createElement('button');
            const other = document.createElement('button');
            document.body.prepend(before, other);
            before.focus();
            contextMenu(area(el), 320, 260, 2);
            await el.updateComplete;
            other.focus();
            el.open = false;
            await el.updateComplete;
            expect(document.activeElement).toBe(other);
        });

        it('does not scroll the page when it takes focus', async () => {
            const el = await fixture();
            contextMenu(area(el), 320, 260, 0);
            await el.updateComplete;
            await frame();
            expect(window.scrollY).toBe(0);
            expect(el.open).toBe(true);
        });
    });

    describe('where the browser has no Popover API', () => {
        const withoutPopoverApi = async (run: () => Promise<void>) => {
            const proto = HTMLElement.prototype;
            const descriptor = Object.getOwnPropertyDescriptor(
                proto,
                'popover',
            );
            Reflect.deleteProperty(proto, 'popover');
            try {
                await run();
            } finally {
                if (descriptor)
                    Object.defineProperty(proto, 'popover', descriptor);
            }
        };

        it('opens at the point without showing a popover', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture();
                const events = listen(el);
                contextMenu(area(el), 320, 260);
                await el.updateComplete;
                expect(el.open).toBe(true);
                expect(isShown(el)).toBe(false);
                expect(panel(el).style.left).toBe('320px');
                expect(events.map((e) => e.detail.open)).toEqual([true]);
            });
        });

        it('closes itself on an outside press and on Escape, and not on a press inside', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture();
                contextMenu(area(el), 320, 260);
                await el.updateComplete;
                const events = listen(el);
                item(el, 'copy').dispatchEvent(
                    new PointerEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                expect(el.open).toBe(true);
                (
                    document.getElementById('outside') as HTMLElement
                ).dispatchEvent(
                    new PointerEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                await el.updateComplete;
                expect(el.open).toBe(false);
                contextMenu(area(el), 320, 260);
                await el.updateComplete;
                document.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Escape' }),
                );
                await el.updateComplete;
                expect(el.open).toBe(false);
                expect(events.map((e) => e.detail.open)).toEqual([
                    false,
                    true,
                    false,
                ]);
            });
        });

        it('stops listening for dismissal once closed', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture();
                contextMenu(area(el), 320, 260);
                await el.updateComplete;
                el.open = false;
                await el.updateComplete;
                const events = listen(el);
                (
                    document.getElementById('outside') as HTMLElement
                ).dispatchEvent(
                    new PointerEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                expect(events).toHaveLength(0);
            });
        });
    });

    it('scales in only while shown', async () => {
        const el = await fixture();
        el.style.cssText = '--duration-short-4: 200ms; --easing-spring: ease';
        expect(getComputedStyle(panel(el)).animationName).toBe('none');
        el.open = true;
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).animationName).toContain(
            'context-menu-in',
        );
    });
});

describe('ContextMenu (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        await page.viewport(1000, 700);
        const host = document.createElement('div');
        host.style.padding = '100px 200px';
        document.body.append(host);
        const root = createRoot(host);
        const changes: boolean[] = [];
        await act(async () => {
            root.render(
                createElement(
                    ContextMenu,
                    {
                        focusOnOpen: 'always',
                        onOpenChange: (e) => changes.push(e.detail.open),
                    },
                    createElement(
                        'div',
                        {
                            slot: 'trigger',
                            id: 'rt',
                            style: { width: 200, height: 100 },
                        },
                        'Right-click',
                    ),
                    createElement(
                        'hmi-menu',
                        { slot: 'menu' },
                        createElement('hmi-menu-item', { id: 'ri' }, 'Copy'),
                    ),
                ),
            );
        });
        const el = host.querySelector('hmi-context-menu') as HmiContextMenu;
        await el.updateComplete;
        expect(el.focusOnOpen).toBe('always');
        contextMenu(host.querySelector('#rt') as HTMLElement, 320, 260);
        await el.updateComplete;
        expect(changes).toEqual([true]);
        expect(isShown(el)).toBe(true);
        expect(document.activeElement).toBe(host.querySelector('#ri'));
        await act(async () => root.unmount());
    });
});
