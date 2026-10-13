import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './popover.js';
import type { HmiPopover, PopoverOpenChangeDetail } from './popover.js';
import { Popover } from './popover.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(
        html`<div style="padding: 100px 200px">${template}</div>
            <div id="outside" style="position: absolute; left: 0; top: 700px; width: 60px; height: 40px"></div>
            <div style="height: 3000px"></div>`,
        host,
    );
    const el = host.querySelector('hmi-popover') as HmiPopover;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const panel = (el: HmiPopover) =>
    el.shadowRoot?.querySelector('.panel') as HTMLElement;
const trigger = (el: HmiPopover) =>
    el.querySelector('[slot="trigger"]') as HTMLElement;
const isShown = (el: HmiPopover) => panel(el).matches(':popover-open');
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const outside = () => document.getElementById('outside') as HTMLElement;

const listen = (el: HmiPopover) => {
    const events: CustomEvent<PopoverOpenChangeDetail>[] = [];
    el.addEventListener('hmi-open-change', (e) =>
        events.push(e as CustomEvent<PopoverOpenChangeDetail>),
    );
    return events;
};

const BASIC = html`<hmi-popover>
    <button slot="trigger" style="display: block; width: 120px; height: 32px">Open</button>
    <p id="content" style="margin: 0">Content</p>
</hmi-popover>`;

afterEach(() => {
    document.body.replaceChildren();
    window.scrollTo(0, 0);
});

describe('hmi-popover', () => {
    it('registers', () => {
        expect(customElements.get('hmi-popover')).toBeDefined();
    });

    it('is closed by default, and shows its panel in the top layer from open', async () => {
        const el = await fixture(BASIC);
        expect(isShown(el)).toBe(false);
        el.open = true;
        await el.updateComplete;
        expect(isShown(el)).toBe(true);
        expect(panel(el).getAttribute('popover')).toBe('auto');
        el.open = false;
        await el.updateComplete;
        expect(isShown(el)).toBe(false);
        expect(el.hasAttribute('open')).toBe(false);
    });

    it('opens from the open attribute, and reflects open', async () => {
        const el = await fixture(
            html`<hmi-popover open><button slot="trigger">Open</button>x</hmi-popover>`,
        );
        expect(isShown(el)).toBe(true);
        expect(el.hasAttribute('open')).toBe(true);
    });

    it('exposes the trigger wrapper and the panel as base and panel', async () => {
        const el = await fixture(BASIC);
        expect(el.shadowRoot?.querySelector('[part="trigger"]')).not.toBeNull();
        expect(panel(el).getAttribute('part')).toBe('base panel');
    });

    it('paints the panel from the panel tokens', async () => {
        const el = await fixture(
            html`<hmi-popover
                open
                style="--panel-bg: rgb(1, 2, 3); --panel-border: rgb(4, 5, 6); --on-background: rgb(7, 8, 9)"
            ><button slot="trigger">Open</button>x</hmi-popover>`,
        );
        const style = getComputedStyle(panel(el));
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.borderTopColor).toBe('rgb(4, 5, 6)');
        expect(style.color).toBe('rgb(7, 8, 9)');
    });

    it('opens under the trigger, from its left edge, with a gap of 6px', async () => {
        const el = await fixture(BASIC);
        el.open = true;
        await el.updateComplete;
        const t = trigger(el).getBoundingClientRect();
        const p = panel(el).getBoundingClientRect();
        expect(p.top).toBeCloseTo(t.bottom + 6, 1);
        expect(p.left).toBeCloseTo(t.left, 1);
    });

    it('ends at the trigger’s right edge with align="end"', async () => {
        const el = await fixture(
            html`<hmi-popover align="end" width="320">
                <button slot="trigger" style="display: block; width: 120px; height: 32px">Open</button>x
            </hmi-popover>`,
        );
        el.open = true;
        await el.updateComplete;
        const t = trigger(el).getBoundingClientRect();
        const p = panel(el).getBoundingClientRect();
        expect(p.right).toBeCloseTo(t.right, 1);
        expect(p.width).toBeGreaterThanOrEqual(320);
        el.align = 'start';
        await el.updateComplete;
        expect(panel(el).getBoundingClientRect().left).toBeCloseTo(t.left, 1);
    });

    it('is at least as wide as the trigger, and takes a minimum width from width', async () => {
        const el = await fixture(BASIC);
        el.open = true;
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).minWidth).toBe('120px');
        el.width = 300;
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).minWidth).toBe('300px');
        el.width = '20em';
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).minWidth).toBe('320px');
        el.width = undefined;
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).minWidth).toBe('120px');
        const attr = await fixture(
            html`<hmi-popover open width="250"><button slot="trigger">Open</button>x</hmi-popover>`,
        );
        expect(getComputedStyle(panel(attr)).minWidth).toBe('250px');
    });

    it('follows the trigger when the page scrolls', async () => {
        const el = await fixture(BASIC);
        el.open = true;
        await el.updateComplete;
        const before = panel(el).getBoundingClientRect().top;
        window.scrollTo(0, 40);
        await frame();
        await frame();
        expect(panel(el).getBoundingClientRect().top).toBeCloseTo(
            before - 40,
            1,
        );
    });

    it('stops following the trigger once closed', async () => {
        const el = await fixture(BASIC);
        el.open = true;
        await el.updateComplete;
        el.open = false;
        await el.updateComplete;
        const before = panel(el).style.top;
        window.scrollTo(0, 40);
        await frame();
        await frame();
        expect(panel(el).style.top).toBe(before);
    });

    it('gives the trigger aria-expanded, and aria-haspopup unless it has its own', async () => {
        const el = await fixture(BASIC);
        expect(trigger(el).getAttribute('aria-expanded')).toBe('false');
        expect(trigger(el).getAttribute('aria-haspopup')).toBe('true');
        el.open = true;
        await el.updateComplete;
        expect(trigger(el).getAttribute('aria-expanded')).toBe('true');
        const menu = await fixture(
            html`<hmi-popover><button slot="trigger" aria-haspopup="menu">Open</button>x</hmi-popover>`,
        );
        expect(trigger(menu).getAttribute('aria-haspopup')).toBe('menu');
    });

    it('opens on a press on the trigger, and tells the consumer', async () => {
        const el = await fixture(BASIC);
        const events = listen(el);
        await userEvent.click(trigger(el));
        expect(el.open).toBe(true);
        expect(isShown(el)).toBe(true);
        expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
        expect(events[0]?.bubbles).toBe(true);
        expect(events[0]?.composed).toBe(true);
        expect(events[0]?.cancelable).toBe(false);
    });

    it('closes on a second press on the trigger, once: it does not reopen', async () => {
        const el = await fixture(BASIC);
        await userEvent.click(trigger(el));
        const events = listen(el);
        await userEvent.click(trigger(el));
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(el.open).toBe(false);
        expect(isShown(el)).toBe(false);
        expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
    });

    it('opens and closes from the keyboard on the trigger', async () => {
        const el = await fixture(BASIC);
        const events = listen(el);
        trigger(el).focus();
        await userEvent.keyboard('{Enter}');
        expect(el.open).toBe(true);
        await userEvent.keyboard('{Enter}');
        expect(el.open).toBe(false);
        expect(events.map((e) => e.detail.open)).toEqual([true, false]);
    });

    it('closes on Escape, and tells the consumer', async () => {
        const el = await fixture(BASIC);
        el.open = true;
        await el.updateComplete;
        const events = listen(el);
        await userEvent.keyboard('{Escape}');
        await el.updateComplete;
        expect(el.open).toBe(false);
        expect(isShown(el)).toBe(false);
        expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
    });

    it('closes on a click outside, and stays open on a click inside the panel', async () => {
        const el = await fixture(BASIC);
        el.open = true;
        await el.updateComplete;
        const events = listen(el);
        await userEvent.click(el.querySelector('#content') as HTMLElement);
        expect(el.open).toBe(true);
        expect(events).toHaveLength(0);
        await userEvent.click(outside());
        await el.updateComplete;
        expect(el.open).toBe(false);
        expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
    });

    it('tells nothing when open is set from code', async () => {
        const el = await fixture(BASIC);
        const events = listen(el);
        el.open = true;
        await el.updateComplete;
        el.open = false;
        await el.updateComplete;
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(events).toHaveLength(0);
    });

    it('closes when another popover opens, and tells the consumer', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<hmi-popover id="one"><button slot="trigger" id="t1">One</button>1</hmi-popover>
                <hmi-popover id="two"><button slot="trigger" id="t2">Two</button>2</hmi-popover>`,
            host,
        );
        const one = host.querySelector('#one') as HmiPopover;
        const two = host.querySelector('#two') as HmiPopover;
        await Promise.all([one.updateComplete, two.updateComplete]);
        await userEvent.click(host.querySelector('#t1') as HTMLElement);
        const events = listen(one);
        await userEvent.click(host.querySelector('#t2') as HTMLElement);
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(two.open).toBe(true);
        expect(one.open).toBe(false);
        expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
    });

    it('shows its panel again when taken out of the document and put back while open', async () => {
        const el = await fixture(BASIC);
        el.open = true;
        await el.updateComplete;
        const other = document.createElement('div');
        document.body.append(other);
        el.remove();
        other.append(el);
        await el.updateComplete;
        expect(isShown(el)).toBe(true);
    });

    it('slides in only while shown', async () => {
        const el = await fixture(
            html`<hmi-popover style="--duration-short-4: 200ms; --easing-spring: ease">
                <button slot="trigger">Open</button>x
            </hmi-popover>`,
        );
        expect(getComputedStyle(panel(el)).animationName).toBe('none');
        el.open = true;
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).animationName).toContain(
            'popover-in',
        );
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

        it('opens and closes on the trigger without showing a popover', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture(BASIC);
                const events = listen(el);
                trigger(el).click();
                await el.updateComplete;
                expect(el.open).toBe(true);
                expect(isShown(el)).toBe(false);
                // It is placed anyway.
                expect(panel(el).style.top).not.toBe('');
                trigger(el).click();
                await el.updateComplete;
                expect(el.open).toBe(false);
                expect(events.map((e) => e.detail.open)).toEqual([true, false]);
            });
        });

        it('closes itself on an outside press and on Escape, and not on a press inside', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture(BASIC);
                el.open = true;
                await el.updateComplete;
                const events = listen(el);
                trigger(el).dispatchEvent(
                    new PointerEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                el.querySelector('#content')?.dispatchEvent(
                    new PointerEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                expect(el.open).toBe(true);
                outside().dispatchEvent(
                    new PointerEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                await el.updateComplete;
                expect(el.open).toBe(false);
                el.open = true;
                await el.updateComplete;
                document.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Escape' }),
                );
                await el.updateComplete;
                expect(el.open).toBe(false);
                expect(events.map((e) => e.detail.open)).toEqual([
                    false,
                    false,
                ]);
            });
        });

        it('stops listening for dismissal once closed', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture(BASIC);
                el.open = true;
                await el.updateComplete;
                el.open = false;
                await el.updateComplete;
                const events = listen(el);
                outside().dispatchEvent(
                    new PointerEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                expect(events).toHaveLength(0);
            });
        });
    });
});

describe('Popover (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const changes: boolean[] = [];
        await act(async () => {
            root.render(
                createElement(
                    Popover,
                    {
                        align: 'end',
                        width: 320,
                        onOpenChange: (e) => changes.push(e.detail.open),
                    },
                    createElement(
                        'button',
                        { slot: 'trigger', id: 'rt', type: 'button' },
                        'Open',
                    ),
                    createElement('p', null, 'Content'),
                ),
            );
        });
        const el = host.querySelector('hmi-popover') as HmiPopover;
        await el.updateComplete;
        expect(el.align).toBe('end');
        expect(el.width).toBe(320);
        await userEvent.click(host.querySelector('#rt') as HTMLElement);
        expect(changes).toEqual([true]);
        expect(isShown(el)).toBe(true);
        await act(async () => root.unmount());
    });
});
