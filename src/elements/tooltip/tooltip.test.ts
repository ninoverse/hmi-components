import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './tooltip.js';
import type { HmiTooltip, TooltipOpenChangeDetail } from './tooltip.js';
import { Tooltip } from './tooltip.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(
        html`<div style="padding: 160px 240px">${template}</div>
            <div id="outside" style="position: absolute; left: 0; top: 700px; width: 60px; height: 40px"></div>
            <div style="height: 3000px"></div>`,
        host,
    );
    const el = host.querySelector('hmi-tooltip') as HmiTooltip;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const panel = (el: HmiTooltip) =>
    el.shadowRoot?.querySelector('.panel') as HTMLElement;
const trigger = (el: HmiTooltip) =>
    el.querySelector('[slot="trigger"]') as HTMLElement;
const isShown = (el: HmiTooltip) => panel(el).matches(':popover-open');
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const listen = (el: HmiTooltip) => {
    const events: CustomEvent<TooltipOpenChangeDetail>[] = [];
    el.addEventListener('hmi-open-change', (e) =>
        events.push(e as CustomEvent<TooltipOpenChangeDetail>),
    );
    return events;
};

const BASIC = html`<hmi-tooltip label="Copy" delay="0">
    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
</hmi-tooltip>`;

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

describe('hmi-tooltip', () => {
    it('registers', () => {
        expect(customElements.get('hmi-tooltip')).toBeDefined();
    });

    it('reflects side, defaulting to top', async () => {
        const el = await fixture(BASIC);
        expect(el.side).toBe('top');
        expect(el.getAttribute('side')).toBe('top');
        el.side = 'left';
        await el.updateComplete;
        expect(el.getAttribute('side')).toBe('left');
    });

    it('reflects open, and is closed by default', async () => {
        const el = await fixture(BASIC);
        expect(el.open).toBe(false);
        expect(isShown(el)).toBe(false);
        el.open = true;
        await el.updateComplete;
        expect(el.hasAttribute('open')).toBe(true);
        expect(isShown(el)).toBe(true);
        el.open = false;
        await el.updateComplete;
        expect(isShown(el)).toBe(false);
        expect(el.hasAttribute('open')).toBe(false);
    });

    it('has a delay of 200 ms by default', async () => {
        const el = await fixture(
            html`<hmi-tooltip label="Copy"><button slot="trigger">Hover</button></hmi-tooltip>`,
        );
        expect(el.delay).toBe(200);
    });

    it('exposes the trigger wrapper and the bubble as trigger and base, and the bubble as a tooltip', async () => {
        const el = await fixture(BASIC);
        expect(el.shadowRoot?.querySelector('[part="trigger"]')).not.toBeNull();
        expect(panel(el).getAttribute('part')).toBe('base');
        expect(panel(el).getAttribute('role')).toBe('tooltip');
        expect(panel(el).getAttribute('popover')).toBe('hint');
    });

    it('paints the bubble from the inverse tokens, and takes no pointer', async () => {
        const el = await fixture(
            html`<hmi-tooltip
                open
                label="Copy"
                style="--inverse-surface: rgb(1, 2, 3); --inverse-on-surface: rgb(4, 5, 6)"
            ><button slot="trigger">Hover</button></hmi-tooltip>`,
        );
        const style = getComputedStyle(panel(el));
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.color).toBe('rgb(4, 5, 6)');
        expect(style.pointerEvents).toBe('none');
        expect(style.whiteSpace).toBe('nowrap');
    });

    it('renders the label, and the label slot in its place', async () => {
        const el = await fixture(BASIC);
        const slot = el.shadowRoot?.querySelector(
            'slot[name="label"]',
        ) as HTMLSlotElement;
        expect(slot.textContent).toBe('Copy');
        const rich = await fixture(
            html`<hmi-tooltip delay="0">
                <button slot="trigger">Hover</button>
                <strong slot="label" id="rich">Rich</strong>
            </hmi-tooltip>`,
        );
        const richSlot = rich.shadowRoot?.querySelector(
            'slot[name="label"]',
        ) as HTMLSlotElement;
        expect(richSlot.assignedElements().map((e) => e.id)).toEqual(['rich']);
    });

    describe('placement', () => {
        const place = async (side: string) => {
            const el = await fixture(
                html`<hmi-tooltip open label="Copy" side=${side}>
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                </hmi-tooltip>`,
            );
            return {
                t: trigger(el).getBoundingClientRect(),
                p: panel(el).getBoundingClientRect(),
            };
        };

        it('sits above the trigger, centred, with a gap of 8px', async () => {
            const { t, p } = await place('top');
            expect(p.bottom).toBeCloseTo(t.top - 8, 1);
            expect(p.left + p.width / 2).toBeCloseTo(t.left + t.width / 2, 1);
        });

        it('sits below the trigger, centred', async () => {
            const { t, p } = await place('bottom');
            expect(p.top).toBeCloseTo(t.bottom + 8, 1);
            expect(p.left + p.width / 2).toBeCloseTo(t.left + t.width / 2, 1);
        });

        it('sits left of the trigger, centred on it', async () => {
            const { t, p } = await place('left');
            expect(p.right).toBeCloseTo(t.left - 8, 1);
            expect(p.top + p.height / 2).toBeCloseTo(t.top + t.height / 2, 1);
        });

        it('sits right of the trigger, centred on it', async () => {
            const { t, p } = await place('right');
            expect(p.left).toBeCloseTo(t.right + 8, 1);
            expect(p.top + p.height / 2).toBeCloseTo(t.top + t.height / 2, 1);
        });
    });

    it('points its arrow at the trigger', async () => {
        const el = await fixture(
            html`<hmi-tooltip open label="Copy" side="bottom">
                <button slot="trigger">Hover</button>
            </hmi-tooltip>`,
        );
        const arrow = getComputedStyle(panel(el), '::after');
        expect(arrow.transform).not.toBe('none');
        expect(Number.parseFloat(arrow.top)).toBeLessThan(0);
        expect(arrow.bottom).not.toBe('0px');
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

    describe('hover', () => {
        it('opens when the pointer rests on the trigger, after the delay, and tells the consumer', async () => {
            const el = await fixture(
                html`<hmi-tooltip label="Copy" delay="300">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                </hmi-tooltip>`,
            );
            const events = listen(el);
            await userEvent.hover(trigger(el));
            await wait(20);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            await wait(400);
            expect(el.open).toBe(true);
            expect(isShown(el)).toBe(true);
            expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
            expect(events[0]?.bubbles).toBe(true);
            expect(events[0]?.composed).toBe(true);
            expect(events[0]?.cancelable).toBe(false);
        });

        it('opens at once with a delay of 0', async () => {
            const el = await fixture(BASIC);
            await userEvent.hover(trigger(el));
            expect(el.open).toBe(true);
            expect(isShown(el)).toBe(true);
        });

        it('does not open when the pointer leaves before the delay', async () => {
            const el = await fixture(
                html`<hmi-tooltip label="Copy" delay="300">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                </hmi-tooltip>`,
            );
            const events = listen(el);
            await userEvent.hover(trigger(el));
            await userEvent.unhover(trigger(el));
            await wait(450);
            expect(el.open).toBe(false);
            expect(events).toHaveLength(0);
        });

        it('closes at once when the pointer leaves, and tells the consumer', async () => {
            const el = await fixture(BASIC);
            await userEvent.hover(trigger(el));
            const events = listen(el);
            await userEvent.unhover(trigger(el));
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });
    });

    describe('focus', () => {
        it('opens when focus reaches the trigger, after the delay, and closes when it leaves', async () => {
            const el = await fixture(
                html`<hmi-tooltip label="Copy" delay="200">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                </hmi-tooltip>`,
            );
            const events = listen(el);
            trigger(el).focus();
            await wait(20);
            expect(el.open).toBe(false);
            await wait(300);
            expect(el.open).toBe(true);
            trigger(el).blur();
            expect(el.open).toBe(false);
            expect(events.map((e) => e.detail.open)).toEqual([true, false]);
        });
    });

    describe('dismissal', () => {
        it('closes on Escape, and tells the consumer', async () => {
            const el = await fixture(BASIC);
            await userEvent.hover(trigger(el));
            const events = listen(el);
            await userEvent.keyboard('{Escape}');
            await el.updateComplete;
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
        });

        it('stays closed after Escape until the pointer comes back', async () => {
            const el = await fixture(BASIC);
            await userEvent.hover(trigger(el));
            await userEvent.keyboard('{Escape}');
            await wait(40);
            expect(el.open).toBe(false);
            await userEvent.unhover(trigger(el));
            await userEvent.hover(trigger(el));
            expect(el.open).toBe(true);
        });

        it('tells the consumer when the browser closes the bubble itself', async () => {
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

        it('opens nothing after it is taken out of the document while a show is pending', async () => {
            const el = await fixture(
                html`<hmi-tooltip label="Copy" delay="200">
                    <button slot="trigger" style="display: block; width: 120px; height: 32px">Hover</button>
                </hmi-tooltip>`,
            );
            const events = listen(el);
            await userEvent.hover(trigger(el));
            el.remove();
            await wait(350);
            expect(el.open).toBe(false);
            expect(events).toHaveLength(0);
        });

        it('shows its bubble again when taken out of the document and put back while open', async () => {
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
    });

    describe('the trigger’s description', () => {
        it('gives the trigger an aria-description with the label', async () => {
            const el = await fixture(BASIC);
            expect(trigger(el).getAttribute('aria-description')).toBe('Copy');
            el.label = 'Copy to clipboard';
            await el.updateComplete;
            expect(trigger(el).getAttribute('aria-description')).toBe(
                'Copy to clipboard',
            );
        });

        it('removes it when the label is cleared, and sets it again', async () => {
            const el = await fixture(BASIC);
            el.label = '';
            await el.updateComplete;
            expect(trigger(el).hasAttribute('aria-description')).toBe(false);
            el.label = 'Back';
            await el.updateComplete;
            expect(trigger(el).getAttribute('aria-description')).toBe('Back');
        });

        it('leaves a description the trigger has of its own', async () => {
            const el = await fixture(
                html`<hmi-tooltip label="Copy" delay="0">
                    <button slot="trigger" aria-description="Mine">Hover</button>
                </hmi-tooltip>`,
            );
            expect(trigger(el).getAttribute('aria-description')).toBe('Mine');
            el.label = 'Other';
            await el.updateComplete;
            expect(trigger(el).getAttribute('aria-description')).toBe('Mine');
        });

        it('gives none for a label slot, which the element never reads', async () => {
            const el = await fixture(
                html`<hmi-tooltip delay="0">
                    <button slot="trigger">Hover</button>
                    <strong slot="label">Rich</strong>
                </hmi-tooltip>`,
            );
            expect(trigger(el).hasAttribute('aria-description')).toBe(false);
        });

        it('moves to a new trigger and leaves the old one clean', async () => {
            const el = await fixture(BASIC);
            const first = trigger(el);
            const second = document.createElement('button');
            second.slot = 'trigger';
            second.textContent = 'New';
            first.replaceWith(second);
            await wait(20);
            expect(second.getAttribute('aria-description')).toBe('Copy');
            expect(first.hasAttribute('aria-description')).toBe(false);
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

        it('opens and closes on hover without showing a popover, and places the bubble', async () => {
            await withoutPopoverApi(async () => {
                const el = await fixture(BASIC);
                const events = listen(el);
                await userEvent.hover(trigger(el));
                expect(el.open).toBe(true);
                expect(isShown(el)).toBe(false);
                expect(panel(el).style.bottom).not.toBe('');
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
            html`<hmi-tooltip label="Copy" style="--duration-short-4: 200ms; --easing-spring: ease">
                <button slot="trigger">Hover</button>
            </hmi-tooltip>`,
        );
        expect(getComputedStyle(panel(el)).animationName).toBe('none');
        el.open = true;
        await el.updateComplete;
        expect(getComputedStyle(panel(el)).animationName).toContain(
            'tooltip-in',
        );
    });
});

describe('Tooltip (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        host.style.padding = '160px 240px';
        document.body.append(host);
        const root = createRoot(host);
        const changes: boolean[] = [];
        await act(async () => {
            root.render(
                createElement(
                    Tooltip,
                    {
                        label: 'Copy',
                        side: 'right',
                        delay: 0,
                        onOpenChange: (e) => changes.push(e.detail.open),
                    },
                    createElement(
                        'button',
                        { slot: 'trigger', id: 'rt', type: 'button' },
                        'Hover',
                    ),
                ),
            );
        });
        const el = host.querySelector('hmi-tooltip') as HmiTooltip;
        await el.updateComplete;
        expect(el.label).toBe('Copy');
        expect(el.side).toBe('right');
        expect(el.delay).toBe(0);
        await userEvent.hover(host.querySelector('#rt') as HTMLElement);
        expect(changes).toEqual([true]);
        expect(isShown(el)).toBe(true);
        await act(async () => root.unmount());
    });
});
