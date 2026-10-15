import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './hover-card.js';
import type { HmiHoverCard, HoverCardOpenChangeDetail } from './hover-card.js';
import { HoverCard } from './hover-card.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(
        html`<div style="padding: 200px 300px">${template}</div>
            <div style="height: 3000px"></div>`,
        host,
    );
    const el = host.querySelector('hmi-hover-card') as HmiHoverCard;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const panel = (el: HmiHoverCard) =>
    el.shadowRoot?.querySelector('.panel') as HTMLElement;
const trigger = (el: HmiHoverCard) =>
    el.querySelector('[slot="trigger"]') as HTMLElement;
const content = (el: HmiHoverCard) =>
    el.querySelector('#content') as HTMLElement;
const isShown = (el: HmiHoverCard) => panel(el).matches(':popover-open');
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const listen = (el: HmiHoverCard) => {
    const events: CustomEvent<HoverCardOpenChangeDetail>[] = [];
    el.addEventListener('hmi-open-change', (e) =>
        events.push(e as CustomEvent<HoverCardOpenChangeDetail>),
    );
    return events;
};

const BASIC = html`<hmi-hover-card open-delay="0" close-delay="0">
    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
    <p id="content" style="margin: 0; width: 160px">Content <a id="link" href="#x">link</a></p>
</hmi-hover-card>`;

// The real pointer stays where a test left it: park it in a corner, away from
// where the next test puts its trigger, or it would enter the new trigger by itself.
afterEach(async () => {
    document.body.replaceChildren();
    window.scrollTo(0, 0);
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; left: 0; bottom: 0; width: 60px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-hover-card', () => {
    it('registers', () => {
        expect(customElements.get('hmi-hover-card')).toBeDefined();
    });

    it('defaults to the bottom, centred, with an open delay of 300 ms and a close delay of 150 ms', async () => {
        const el = await fixture(
            html`<hmi-hover-card><button slot="trigger">Hover</button>x</hmi-hover-card>`,
        );
        expect(el.side).toBe('bottom');
        expect(el.align).toBe('center');
        expect(el.openDelay).toBe(300);
        expect(el.closeDelay).toBe(150);
        expect(el.getAttribute('side')).toBe('bottom');
        expect(el.getAttribute('align')).toBe('center');
    });

    it('takes its delays from open-delay and close-delay', async () => {
        const el = await fixture(
            html`<hmi-hover-card open-delay="10" close-delay="20"><button slot="trigger">Hover</button>x</hmi-hover-card>`,
        );
        expect(el.openDelay).toBe(10);
        expect(el.closeDelay).toBe(20);
    });

    it('is closed by default, reflects open, and shows its card in the top layer from open', async () => {
        const el = await fixture(BASIC);
        expect(isShown(el)).toBe(false);
        el.open = true;
        await el.updateComplete;
        expect(el.hasAttribute('open')).toBe(true);
        expect(isShown(el)).toBe(true);
        expect(panel(el).getAttribute('popover')).toBe('hint');
        el.open = false;
        await el.updateComplete;
        expect(isShown(el)).toBe(false);
    });

    it('exposes the trigger wrapper and the card as base and panel', async () => {
        const el = await fixture(BASIC);
        expect(el.shadowRoot?.querySelector('[part="trigger"]')).not.toBeNull();
        expect(panel(el).getAttribute('part')).toBe('base panel');
    });

    it('paints the card from the panel tokens, and embeds the liquid filter', async () => {
        const el = await fixture(
            html`<hmi-hover-card
                open
                style="--panel-bg: rgb(1, 2, 3); --panel-border: rgb(4, 5, 6); --on-background: rgb(7, 8, 9)"
            ><button slot="trigger">Hover</button>x</hmi-hover-card>`,
        );
        const style = getComputedStyle(panel(el));
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.borderTopColor).toBe('rgb(4, 5, 6)');
        expect(style.color).toBe('rgb(7, 8, 9)');
        expect(panel(el).querySelector('filter#liquid-glass')).not.toBeNull();
    });

    it('does not let align="end" right-align the text: a browser maps align to text-align', async () => {
        const el = await fixture(
            html`<hmi-hover-card align="end" open>
                <button slot="trigger">Hover</button>
                <p id="content">Content</p>
            </hmi-hover-card>`,
        );
        expect(getComputedStyle(panel(el)).textAlign).toBe('start');
        expect(getComputedStyle(content(el)).textAlign).toBe('start');
        expect(getComputedStyle(trigger(el)).textAlign).not.toBe('end');
    });

    describe('placement', () => {
        const place = async (side: string, align: string) => {
            const el = await fixture(
                html`<hmi-hover-card open side=${side} align=${align}>
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p style="margin: 0; width: 160px; height: 60px">Content</p>
                </hmi-hover-card>`,
            );
            return {
                t: trigger(el).getBoundingClientRect(),
                p: panel(el).getBoundingClientRect(),
            };
        };

        it('opens below the trigger, centred on it, with a gap of 6px', async () => {
            const { t, p } = await place('bottom', 'center');
            expect(p.top).toBeCloseTo(t.bottom + 6, 1);
            expect(p.left + p.width / 2).toBeCloseTo(t.left + t.width / 2, 1);
        });

        it('opens above the trigger, from its left edge', async () => {
            const { t, p } = await place('top', 'start');
            expect(p.bottom).toBeCloseTo(t.top - 6, 1);
            expect(p.left).toBeCloseTo(t.left, 1);
        });

        it('opens right of the trigger, centred on it', async () => {
            const { t, p } = await place('right', 'center');
            expect(p.left).toBeCloseTo(t.right + 6, 1);
            expect(p.top + p.height / 2).toBeCloseTo(t.top + t.height / 2, 1);
        });

        it('opens left of the trigger, ending at its bottom edge', async () => {
            const { t, p } = await place('left', 'end');
            expect(p.right).toBeCloseTo(t.left - 6, 1);
            expect(p.bottom).toBeCloseTo(t.bottom, 1);
        });

        it('moves with side and align', async () => {
            const el = await fixture(BASIC);
            el.open = true;
            await el.updateComplete;
            el.side = 'top';
            el.align = 'end';
            await el.updateComplete;
            const t = trigger(el).getBoundingClientRect();
            const p = panel(el).getBoundingClientRect();
            expect(p.bottom).toBeCloseTo(t.top - 6, 1);
            expect(p.right).toBeCloseTo(t.right, 1);
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
    });

    describe('width', () => {
        it('is the card’s width: a number of px, or any CSS length', async () => {
            const el = await fixture(BASIC);
            el.open = true;
            await el.updateComplete;
            expect(getComputedStyle(panel(el)).width).not.toBe('280px');
            el.width = 280;
            await el.updateComplete;
            expect(getComputedStyle(panel(el)).width).toBe('280px');
            el.width = '20em';
            await el.updateComplete;
            expect(getComputedStyle(panel(el)).width).toBe('320px');
            el.width = undefined;
            await el.updateComplete;
            expect(getComputedStyle(panel(el)).width).not.toBe('320px');
        });

        it('takes a plain number in the attribute as px', async () => {
            const el = await fixture(
                html`<hmi-hover-card open width="250"><button slot="trigger">Hover</button>x</hmi-hover-card>`,
            );
            expect(getComputedStyle(panel(el)).width).toBe('250px');
        });
    });

    describe('hover', () => {
        it('opens after the open delay, and tells the consumer', async () => {
            const el = await fixture(
                html`<hmi-hover-card open-delay="300" close-delay="0">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p id="content">Content</p>
                </hmi-hover-card>`,
            );
            const events = listen(el);
            await userEvent.hover(trigger(el));
            await wait(20);
            expect(el.open).toBe(false);
            await wait(400);
            expect(el.open).toBe(true);
            expect(isShown(el)).toBe(true);
            expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
            expect(events[0]?.bubbles).toBe(true);
            expect(events[0]?.composed).toBe(true);
            expect(events[0]?.cancelable).toBe(false);
        });

        it('closes after the close delay when the pointer leaves, and not before', async () => {
            const el = await fixture(
                html`<hmi-hover-card open-delay="0" close-delay="300">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p id="content">Content</p>
                </hmi-hover-card>`,
            );
            await userEvent.hover(trigger(el));
            expect(el.open).toBe(true);
            const events = listen(el);
            await userEvent.unhover(trigger(el));
            await wait(20);
            expect(el.open).toBe(true);
            await wait(400);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('stays open while the pointer is over the card, and closes after it leaves it', async () => {
            const el = await fixture(
                html`<hmi-hover-card open-delay="0" close-delay="250">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p id="content" style="margin: 0; width: 160px; height: 60px">Content</p>
                </hmi-hover-card>`,
            );
            await userEvent.hover(trigger(el));
            await userEvent.hover(content(el));
            await wait(450);
            expect(el.open).toBe(true);
            await userEvent.unhover(content(el));
            await wait(400);
            expect(el.open).toBe(false);
        });

        it('does not open when the pointer leaves before the open delay', async () => {
            const el = await fixture(
                html`<hmi-hover-card open-delay="300" close-delay="0">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p id="content">Content</p>
                </hmi-hover-card>`,
            );
            const events = listen(el);
            await userEvent.hover(trigger(el));
            await userEvent.unhover(trigger(el));
            await wait(450);
            expect(el.open).toBe(false);
            expect(events).toHaveLength(0);
        });
    });

    describe('focus', () => {
        it('opens when focus reaches the trigger, and closes after the delay when it leaves', async () => {
            const el = await fixture(
                html`<hmi-hover-card open-delay="0" close-delay="150">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p id="content">Content</p>
                </hmi-hover-card>`,
            );
            trigger(el).focus();
            expect(el.open).toBe(true);
            trigger(el).blur();
            expect(el.open).toBe(true);
            await wait(300);
            expect(el.open).toBe(false);
        });

        it('stays open while focus moves from the trigger into the card, and closes when it leaves the card', async () => {
            const el = await fixture(BASIC);
            trigger(el).focus();
            expect(el.open).toBe(true);
            (el.querySelector('#link') as HTMLElement).focus();
            expect(el.open).toBe(true);
            await el.updateComplete;
            expect(isShown(el)).toBe(true);
            trigger(el).focus();
            expect(el.open).toBe(true);
            (el.querySelector('#link') as HTMLElement).focus();
            (el.querySelector('#link') as HTMLElement).blur();
            expect(el.open).toBe(false);
        });
    });

    describe('dismissal', () => {
        it('closes at once on Escape, whatever the close delay, and tells the consumer', async () => {
            const el = await fixture(
                html`<hmi-hover-card open-delay="0" close-delay="2000">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p id="content">Content</p>
                </hmi-hover-card>`,
            );
            await userEvent.hover(trigger(el));
            const events = listen(el);
            await userEvent.keyboard('{Escape}');
            await el.updateComplete;
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('tells the consumer when the browser closes the card itself', async () => {
            const el = await fixture(BASIC);
            el.open = true;
            await el.updateComplete;
            // The browser coalesces the toggle of a popover shown and hidden in one task.
            await wait(20);
            const events = listen(el);
            panel(el).hidePopover();
            await wait(20);
            expect(el.open).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('closes when another hint opens, and tells the consumer', async () => {
            const host = document.createElement('div');
            document.body.append(host);
            render(
                html`<hmi-hover-card id="one"><button slot="trigger" id="t1">One</button>1</hmi-hover-card>
                    <hmi-hover-card id="two"><button slot="trigger" id="t2">Two</button>2</hmi-hover-card>`,
                host,
            );
            const one = host.querySelector('#one') as HmiHoverCard;
            const two = host.querySelector('#two') as HmiHoverCard;
            await Promise.all([one.updateComplete, two.updateComplete]);
            one.open = true;
            await one.updateComplete;
            await wait(20);
            const events = listen(one);
            two.open = true;
            await two.updateComplete;
            await wait(20);
            expect(two.open).toBe(true);
            expect(one.open).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('tells nothing when open is set from code', async () => {
            const el = await fixture(BASIC);
            const events = listen(el);
            el.open = true;
            await el.updateComplete;
            el.open = false;
            await el.updateComplete;
            await wait(20);
            expect(events).toHaveLength(0);
        });

        it('opens nothing after it is taken out of the document while an open is pending', async () => {
            const el = await fixture(
                html`<hmi-hover-card open-delay="200" close-delay="0">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                    <p id="content">Content</p>
                </hmi-hover-card>`,
            );
            const events = listen(el);
            await userEvent.hover(trigger(el));
            el.remove();
            await wait(350);
            expect(el.open).toBe(false);
            expect(events).toHaveLength(0);
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

        it('opens and closes on hover without showing a popover, and places the card', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture(BASIC);
                const events = listen(el);
                await userEvent.hover(trigger(el));
                expect(el.open).toBe(true);
                expect(isShown(el)).toBe(false);
                expect(panel(el).style.top).not.toBe('');
                await userEvent.unhover(trigger(el));
                expect(el.open).toBe(false);
                expect(events.map((e) => e.detail.open)).toEqual([true, false]);
            });
        });

        it('closes on Escape', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture(BASIC);
                el.open = true;
                await el.updateComplete;
                document.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Escape' }),
                );
                await el.updateComplete;
                expect(el.open).toBe(false);
            });
        });
    });

    it('slides in only while shown', async () => {
        const el = await fixture(
            html`<hmi-hover-card style="--duration-short-4: 200ms; --easing-spring: ease">
                <button slot="trigger">Hover</button>x
            </hmi-hover-card>`,
        );
        expect(getComputedStyle(panel(el)).animationName).toBe('none');
        el.open = true;
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).animationName).toContain(
            'hover-card-in',
        );
    });
});

describe('HoverCard (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        host.style.padding = '200px 300px';
        document.body.append(host);
        const root = createRoot(host);
        const changes: boolean[] = [];
        await act(async () => {
            root.render(
                createElement(
                    HoverCard,
                    {
                        side: 'right',
                        align: 'start',
                        openDelay: 0,
                        closeDelay: 0,
                        width: 280,
                        onOpenChange: (e) => changes.push(e.detail.open),
                    },
                    createElement(
                        'button',
                        { slot: 'trigger', id: 'rt', type: 'button' },
                        'Hover',
                    ),
                    createElement('p', null, 'Content'),
                ),
            );
        });
        const el = host.querySelector('hmi-hover-card') as HmiHoverCard;
        await el.updateComplete;
        expect(el.side).toBe('right');
        expect(el.align).toBe('start');
        expect(el.openDelay).toBe(0);
        expect(el.closeDelay).toBe(0);
        expect(el.width).toBe(280);
        await userEvent.hover(host.querySelector('#rt') as HTMLElement);
        expect(changes).toEqual([true]);
        expect(isShown(el)).toBe(true);
        await act(async () => root.unmount());
    });
});
