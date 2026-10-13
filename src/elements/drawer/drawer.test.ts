import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import '../button/button.js';
import { activeElementDeep } from '../shared/dom.js';
import './drawer.js';
import type {
    DrawerActionDetail,
    DrawerCloseDetail,
    DrawerSide,
    HmiDrawer,
} from './drawer.js';
import { Drawer } from './drawer.react.js';

const ACTIONS = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Apply', value: 'apply', variant: 'primary' as const },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-drawer') as HmiDrawer;
    await el.updateComplete;
    // Give the slots' `slotchange` a turn, and the render it causes.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    return el;
}

const dialog = (el: HmiDrawer) =>
    el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;

const part = (el: HmiDrawer, name: string) =>
    el.shadowRoot?.querySelector(`[part~="${name}"]`) as HTMLElement | null;

const listen = <T>(el: HmiDrawer, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};

beforeEach(async () => {
    await page.viewport(1000, 800);
});

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.style.overflow = '';
});

describe('hmi-drawer', () => {
    it('registers', () => {
        expect(customElements.get('hmi-drawer')).toBeDefined();
    });

    it('is closed by default, and opens as a modal dialog from open', async () => {
        const el = await fixture(html`<hmi-drawer></hmi-drawer>`);
        expect(dialog(el).open).toBe(false);
        el.open = true;
        await el.updateComplete;
        expect(dialog(el).open).toBe(true);
        expect(dialog(el).matches(':modal')).toBe(true);
        el.open = false;
        await el.updateComplete;
        expect(el.hasAttribute('open')).toBe(false);
        expect(dialog(el).open).toBe(false);
    });

    it('stays out of the layout while closed', async () => {
        const el = await fixture(
            html`<hmi-drawer heading="Filters"></hmi-drawer>`,
        );
        // The panel is a column only while open: a closed dialog is display: none.
        expect(getComputedStyle(dialog(el)).display).toBe('none');
        el.open = true;
        await el.updateComplete;
        expect(getComputedStyle(dialog(el)).display).toBe('flex');
    });

    it('comes from the right by default, and reflects side', async () => {
        const el = await fixture(html`<hmi-drawer open></hmi-drawer>`);
        expect(el.side).toBe('right');
        expect(el.getAttribute('side')).toBe('right');
    });

    for (const [side, check] of [
        ['right', (b: DOMRect) => [b.right, b.width, b.height, b.top]],
        ['left', (b: DOMRect) => [b.left, b.width, b.height, b.top]],
        ['top', (b: DOMRect) => [b.top, b.height, b.width, b.left]],
        ['bottom', (b: DOMRect) => [b.bottom, b.height, b.width, b.left]],
    ] as [DrawerSide, (b: DOMRect) => number[]][]) {
        it(`pins a ${side} drawer to its edge, at the default size`, async () => {
            const el = await fixture(
                html`<hmi-drawer open side=${side} heading="Filters"></hmi-drawer>`,
            );
            const [edge, along, across, start] = check(
                dialog(el).getBoundingClientRect(),
            ) as [number, number, number, number];
            const horizontal = side === 'left' || side === 'right';
            // 40 base units wide, or 36 high; the full height, or width, of the screen.
            expect(along).toBeCloseTo(horizontal ? 320 : 288, 1);
            expect(across).toBeCloseTo(horizontal ? 800 : 1000, 1);
            expect(start).toBeCloseTo(0, 1);
            const far = side === 'right' ? 1000 : side === 'bottom' ? 800 : 0;
            expect(edge).toBeCloseTo(far, 1);
        });
    }

    it('takes size as px from a number, a plain digit string or an attribute, and as a CSS length otherwise', async () => {
        const el = await fixture(html`<hmi-drawer open></hmi-drawer>`);
        el.size = 480;
        await el.updateComplete;
        expect(dialog(el).getBoundingClientRect().width).toBeCloseTo(480, 1);
        el.size = '400';
        await el.updateComplete;
        expect(dialog(el).getBoundingClientRect().width).toBeCloseTo(400, 1);
        el.size = '30em';
        await el.updateComplete;
        expect(dialog(el).getBoundingClientRect().width).toBeCloseTo(480, 1);
        const attr = await fixture(
            html`<hmi-drawer open size="360"></hmi-drawer>`,
        );
        expect(dialog(attr).getBoundingClientRect().width).toBeCloseTo(360, 1);
    });

    it('sizes the height of a top or bottom drawer from size', async () => {
        const el = await fixture(
            html`<hmi-drawer open side="bottom" size="200"></hmi-drawer>`,
        );
        expect(dialog(el).getBoundingClientRect().height).toBeCloseTo(200, 1);
    });

    it('goes back to the default size when size is cleared', async () => {
        const el = await fixture(
            html`<hmi-drawer open size="500"></hmi-drawer>`,
        );
        el.size = undefined;
        await el.updateComplete;
        expect(dialog(el).getBoundingClientRect().width).toBeCloseTo(320, 1);
        expect(el.style.getPropertyValue('--_size')).toBe('');
    });

    it('never grows past 90% of the screen', async () => {
        const el = await fixture(
            html`<hmi-drawer open size="5000"></hmi-drawer>`,
        );
        expect(dialog(el).getBoundingClientRect().width).toBeCloseTo(900, 1);
        const bottom = await fixture(
            html`<hmi-drawer open side="bottom" size="5000"></hmi-drawer>`,
        );
        expect(dialog(bottom).getBoundingClientRect().height).toBeCloseTo(
            720,
            1,
        );
    });

    it('rounds only the corners facing the screen', async () => {
        const el = await fixture(
            html`<hmi-drawer
                open
                style="--corner-tl: 10px; --corner-tr: 11px; --corner-br: 12px; --corner-bl: 13px"
            ></hmi-drawer>`,
        );
        const style = getComputedStyle(dialog(el));
        // A right drawer: the top-left and bottom-left corners, from the tokens.
        expect(style.borderTopLeftRadius).toBe('10px');
        expect(style.borderBottomLeftRadius).toBe('13px');
        expect(style.borderTopRightRadius).toBe('0px');
        expect(style.borderBottomRightRadius).toBe('0px');
        el.side = 'bottom';
        await el.updateComplete;
        expect(style.borderTopLeftRadius).toBe('10px');
        expect(style.borderTopRightRadius).toBe('11px');
        expect(style.borderBottomLeftRadius).toBe('0px');
    });

    it('exposes the dialog as base and panel, painted from the drawer surface token', async () => {
        const el = await fixture(
            html`<hmi-drawer
                open
                style="--drawer-bg: rgb(1, 2, 3); --on-surface: rgb(4, 5, 6)"
            ></hmi-drawer>`,
        );
        expect(part(el, 'base')).toBe(dialog(el));
        expect(part(el, 'panel')).toBe(dialog(el));
        const style = getComputedStyle(dialog(el));
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.color).toBe('rgb(4, 5, 6)');
    });

    it('paints the scrim from the scrim token', async () => {
        const el = await fixture(
            html`<hmi-drawer open style="--scrim: rgb(7, 8, 9)"></hmi-drawer>`,
        );
        expect(getComputedStyle(dialog(el), '::backdrop').backgroundColor).toBe(
            'rgb(7, 8, 9)',
        );
    });

    it('slides in from its own side, and shortens it for reduced motion', async () => {
        const tokens =
            '--duration-medium-3: 300ms; --easing-emphasized-decelerate: ease';
        for (const side of ['left', 'right', 'top', 'bottom']) {
            const el = await fixture(
                html`<hmi-drawer open side=${side} style=${tokens}></hmi-drawer>`,
            );
            expect(getComputedStyle(dialog(el)).animationName).toBe(
                `drawer-slide-${side}`,
            );
        }
    });

    it('shows heading and description as the defaults of their slots', async () => {
        const el = await fixture(
            html`<hmi-drawer
                open
                heading="Filters"
                description="Tune the result set."
            ></hmi-drawer>`,
        );
        expect(part(el, 'title')?.textContent?.trim()).toBe('Filters');
        expect(part(el, 'title')?.tagName).toBe('H2');
        expect(part(el, 'description')?.textContent?.trim()).toBe(
            'Tune the result set.',
        );
        expect(dialog(el).getAttribute('aria-labelledby')).toBe('title');
        expect(dialog(el).getAttribute('aria-describedby')).toBe('description');
    });

    it('takes a slotted title and description in place of the strings', async () => {
        const el = await fixture(
            html`<hmi-drawer open heading="Plain">
                <span slot="title">Rich title</span>
                <span slot="description">Rich description</span>
            </hmi-drawer>`,
        );
        expect(part(el, 'title')?.textContent).not.toContain('Plain');
        expect(part(el, 'description')?.hidden).toBe(false);
    });

    it('hides the title, the description and the footer when there is nothing for them', async () => {
        const el = await fixture(html`<hmi-drawer open>body</hmi-drawer>`);
        expect(part(el, 'title')?.hidden).toBe(true);
        expect(part(el, 'description')?.hidden).toBe(true);
        expect(part(el, 'actions')?.hidden).toBe(true);
        expect(dialog(el).hasAttribute('aria-labelledby')).toBe(false);
    });

    it('names a drawer with no title from label', async () => {
        const el = await fixture(
            html`<hmi-drawer open label="Navigation"></hmi-drawer>`,
        );
        expect(dialog(el).getAttribute('aria-label')).toBe('Navigation');
    });

    it('puts the default slot in a growing body between the description and the footer', async () => {
        const el = await fixture(
            html`<hmi-drawer open heading="Filters" .actions=${ACTIONS}>
                <p id="body">Body</p>
            </hmi-drawer>`,
        );
        const body = part(el, 'body') as HTMLElement;
        expect(body.querySelector('slot:not([name])')).not.toBeNull();
        expect(getComputedStyle(body).flexGrow).toBe('1');
        const order = Array.from(dialog(el).children)
            .map((c) => c.getAttribute('part'))
            .filter(Boolean);
        expect(order).toEqual(['title', 'description', 'body', 'actions']);
    });

    it('renders the actions array as buttons, and fires hmi-action with the value, staying open', async () => {
        const el = await fixture(
            html`<hmi-drawer open .actions=${ACTIONS}></hmi-drawer>`,
        );
        const buttons = Array.from(
            el.shadowRoot?.querySelectorAll('hmi-button[part="action"]') ?? [],
        );
        expect(buttons.map((b) => b.getAttribute('variant'))).toEqual([
            'secondary',
            'primary',
        ]);
        const events = listen<DrawerActionDetail>(el, 'hmi-action');
        (buttons[1] as HTMLElement).click();
        expect(events.map((e) => e.detail)).toEqual([{ value: 'apply' }]);
        expect(el.open).toBe(true);
    });

    it('draws a rule above the footer', async () => {
        const el = await fixture(
            html`<hmi-drawer
                open
                .actions=${ACTIONS}
                style="--outline-variant: rgb(1, 2, 3)"
            ></hmi-drawer>`,
        );
        const style = getComputedStyle(part(el, 'actions') as Element);
        expect(style.borderTopStyle).toBe('solid');
        expect(style.borderTopColor).toBe('rgb(1, 2, 3)');
    });

    it('asks to close on Escape, and stays open until open is set to false', async () => {
        const el = await fixture(
            html`<hmi-drawer open heading="Filters"></hmi-drawer>`,
        );
        const events = listen<DrawerCloseDetail>(el, 'hmi-close');
        await userEvent.keyboard('{Escape}');
        expect(events.map((e) => e.detail)).toEqual([{ reason: 'escape' }]);
        expect(events[0]?.cancelable).toBe(true);
        expect(el.open).toBe(true);
        expect(dialog(el).open).toBe(true);
    });

    it('asks to close on a press outside the panel, through the scrim', async () => {
        const el = await fixture(
            html`<hmi-drawer open heading="Filters"></hmi-drawer>`,
        );
        const events = listen<DrawerCloseDetail>(el, 'hmi-close');
        // A right drawer is 320 wide: x = 100 is on the scrim.
        dialog(el).dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                composed: true,
                clientX: 100,
                clientY: 100,
            }),
        );
        expect(events.map((e) => e.detail)).toEqual([{ reason: 'backdrop' }]);
    });

    it('does not ask to close on a press inside the panel', async () => {
        const el = await fixture(
            html`<hmi-drawer open heading="Filters"></hmi-drawer>`,
        );
        const events = listen<DrawerCloseDetail>(el, 'hmi-close');
        dialog(el).dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                composed: true,
                clientX: 900,
                clientY: 100,
            }),
        );
        expect(events).toHaveLength(0);
    });

    it('stops the page scrolling while open, and gives focus back on close', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<button id="trigger">Open</button>
                <hmi-drawer heading="Filters"></hmi-drawer>`,
            host,
        );
        const el = host.querySelector('hmi-drawer') as HmiDrawer;
        await el.updateComplete;
        const trigger = host.querySelector('#trigger') as HTMLButtonElement;
        trigger.focus();
        el.open = true;
        await el.updateComplete;
        expect(document.documentElement.style.overflow).toBe('hidden');
        el.open = false;
        await el.updateComplete;
        expect(document.documentElement.style.overflow).toBe('');
        expect(activeElementDeep(document)).toBe(trigger);
    });
});

describe('Drawer (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const closes: DrawerCloseDetail[] = [];
        const actions: string[] = [];
        await act(async () => {
            root.render(
                createElement(
                    Drawer,
                    {
                        open: true,
                        side: 'left',
                        size: 400,
                        heading: 'Workspace',
                        actions: ACTIONS,
                        onClose: (e) => closes.push(e.detail),
                        onAction: (e) => actions.push(e.detail.value),
                    },
                    createElement('p', null, 'Body'),
                ),
            );
        });
        const el = host.querySelector('hmi-drawer') as HmiDrawer;
        await el.updateComplete;
        expect(el.side).toBe('left');
        expect(el.size).toBe(400);
        expect(dialog(el).getBoundingClientRect().width).toBeCloseTo(400, 1);
        await userEvent.keyboard('{Escape}');
        expect(closes).toEqual([{ reason: 'escape' }]);
        (
            el.shadowRoot?.querySelectorAll('hmi-button')[0] as HTMLElement
        ).click();
        expect(actions).toEqual(['cancel']);
        await act(async () => root.unmount());
    });
});
