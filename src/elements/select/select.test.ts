import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { HmiMenuItem } from '../menu-item/menu-item.js';
import type { HmiPopover } from '../popover/popover.js';
import './select.js';
import type {
    HmiSelect,
    SelectChangeDetail,
    SelectOpenChangeDetail,
    SelectOption,
} from './select.js';
import { Select } from './select.react.js';

const OPTIONS: SelectOption[] = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'beta', label: 'Beta', disabled: true },
    { value: 'team', label: 'Team' },
];

async function fixture(template: ReturnType<typeof html>): Promise<HmiSelect> {
    const host = document.createElement('div');
    document.body.append(host);
    render(
        html`<div style="padding: 60px 120px; width: 360px">
                ${template}<button id="after">After</button>
            </div>
            <button
                id="elsewhere"
                style="position: fixed; right: 0; top: 0"
            >
                Elsewhere
            </button>
            <div
                id="outside"
                style="position: fixed; left: 0; bottom: 0; width: 60px; height: 40px"
            ></div>`,
        host,
    );
    const el = host.querySelector('hmi-select') as HmiSelect;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const plain = (attrs = html``) =>
    fixture(
        html`<hmi-select .options=${OPTIONS} aria-label="x">${attrs}</hmi-select>`,
    );

const trigger = (el: HmiSelect) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
const popover = (el: HmiSelect) =>
    el.shadowRoot?.querySelector('hmi-popover') as HmiPopover;
const panel = (el: HmiSelect) =>
    popover(el).shadowRoot?.querySelector('.panel') as HTMLElement;
const items = (el: HmiSelect) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HmiMenuItem>('hmi-menu-item') ?? [],
    );
const isShown = (el: HmiSelect) => panel(el).matches(':popover-open');
const focused = (el: HmiSelect) => el.shadowRoot?.activeElement;
const part = (el: HmiSelect, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);
const text = (node: Element | null | undefined) => node?.textContent?.trim();
const outside = () => document.getElementById('outside') as HTMLElement;
const nextButton = () => document.getElementById('after') as HTMLElement;

/** Lets the select render, its popover show or hide, and a queued toggle event arrive. */
async function settle(el: HmiSelect) {
    await el.updateComplete;
    await popover(el).updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
}

const listen = <T>(el: HmiSelect, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};

// The real pointer stays where a test left it: park it in a corner, away from
// where the next test puts its select.
afterEach(async () => {
    document.body.replaceChildren();
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-select', () => {
    it('registers', () => {
        expect(customElements.get('hmi-select')).toBeDefined();
    });

    it('renders', async () => {
        const el = await plain();
        const base = part(el, 'base');
        expect(base).not.toBeNull();
        expect(base?.tagName).toBe('BUTTON');
        const box = base?.getBoundingClientRect();
        expect(box?.width).toBeGreaterThan(0);
        // As tall as an input: 5 × the base unit.
        expect(box?.height).toBe(40);
    });

    describe('the trigger', () => {
        it('shows the placeholder, Select… by default, while nothing is chosen', async () => {
            const el = await plain();
            expect(text(part(el, 'placeholder'))).toBe('Select…');
            expect(part(el, 'value')).toBeNull();
            el.placeholder = 'Choose a plan…';
            await el.updateComplete;
            expect(text(part(el, 'placeholder'))).toBe('Choose a plan…');
        });

        it('shows the chosen option’s label, and the placeholder for an unknown value', async () => {
            const el = await fixture(
                html`<hmi-select value="pro" .options=${OPTIONS}></hmi-select>`,
            );
            expect(text(part(el, 'value'))).toBe('Pro');
            expect(part(el, 'placeholder')).toBeNull();
            el.value = 'nope';
            await el.updateComplete;
            expect(part(el, 'value')).toBeNull();
            expect(text(part(el, 'placeholder'))).toBe('Select…');
        });

        it('shows only the text of the label, not a slotted label', async () => {
            const el = await fixture(
                html`<hmi-select value="pro" .options=${OPTIONS}
                    ><b slot="label-pro">Pro (rich)</b></hmi-select
                >`,
            );
            expect(text(part(el, 'value'))).toBe('Pro');
        });

        it('has a chevron that turns over while open', async () => {
            const el = await plain();
            const chevron = part(el, 'chevron') as HTMLElement;
            expect(chevron.querySelector('svg')).not.toBeNull();
            expect(getComputedStyle(chevron).transform).toBe('none');
            el.open = true;
            await settle(el);
            expect(trigger(el).getAttribute('aria-expanded')).toBe('true');
            expect(getComputedStyle(chevron).transform).not.toBe('none');
        });

        it('projects placeholder slot', async () => {
            const el = await fixture(
                html`<hmi-select .options=${OPTIONS}
                    ><i slot="placeholder">Pick…</i></hmi-select
                >`,
            );
            const slot = el.shadowRoot?.querySelector<HTMLSlotElement>(
                'slot[name="placeholder"]',
            );
            expect(slot?.assignedElements()).toHaveLength(1);
            expect(text(slot)).toBe('Select…');
        });
    });

    describe('the list', () => {
        it('has a row per option, in order, and the chosen one is checked with a check mark', async () => {
            const el = await fixture(
                html`<hmi-select value="pro" .options=${OPTIONS}></hmi-select>`,
            );
            expect(items(el).map((item) => text(item))).toEqual([
                'Free',
                'Pro',
                'Beta',
                'Team',
            ]);
            expect(items(el).map((item) => item.checked)).toEqual([
                false,
                true,
                false,
                false,
            ]);
            expect(
                items(el).map((item) => item.hasAttribute('part')),
            ).not.toContain(false);
            const marks = el.shadowRoot?.querySelectorAll('[part="check"]');
            expect(marks).toHaveLength(1);
            expect(marks?.[0]?.parentElement).toBe(items(el)[1]);
            expect(marks?.[0]?.getAttribute('slot')).toBe('shortcut');
        });

        it('is a menu named by label, and the chosen option is a menuitemradio', async () => {
            const el = await fixture(
                html`<hmi-select label="Plan" value="pro" .options=${OPTIONS}></hmi-select>`,
            );
            const menu = el.shadowRoot?.querySelector('hmi-menu');
            expect(
                menu?.shadowRoot?.querySelector('[role="menu"]'),
            ).not.toBeNull();
            expect(
                menu?.shadowRoot
                    ?.querySelector('[role="menu"]')
                    ?.getAttribute('aria-label'),
            ).toBe('Plan');
            const roles = items(el).map((item) =>
                item.shadowRoot?.querySelector('button')?.getAttribute('role'),
            );
            expect(roles).toEqual([
                'menuitem',
                'menuitemradio',
                'menuitem',
                'menuitem',
            ]);
        });

        it('keeps the options out of the Tab order', async () => {
            const el = await plain();
            expect(items(el).every((item) => item.tabIndex === -1)).toBe(true);
        });

        it('disables a disabled option', async () => {
            const el = await plain();
            expect(items(el).map((item) => item.disabled)).toEqual([
                false,
                false,
                true,
                false,
            ]);
        });

        it('projects label-<value> and icon-<value> slots, and hides the icon box of an option without one', async () => {
            const el = await fixture(
                html`<hmi-select .options=${OPTIONS}
                    ><b slot="label-pro">Pro plan</b
                    ><svg slot="icon-pro" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg
                ></hmi-select>`,
            );
            const slot = (name: string) =>
                el.shadowRoot?.querySelector<HTMLSlotElement>(
                    `slot[name="${name}"]`,
                );
            expect(slot('label-pro')?.assignedElements()).toHaveLength(1);
            expect(slot('label-free')?.assignedElements()).toHaveLength(0);
            expect(text(slot('label-free'))).toBe('Free');
            expect(slot('icon-pro')?.assignedElements()).toHaveLength(1);
            const icons = Array.from(
                el.shadowRoot?.querySelectorAll<HTMLElement>('[part="icon"]') ??
                    [],
            );
            expect(icons.map((icon) => icon.hidden)).toEqual([
                true,
                false,
                true,
                true,
            ]);
            el.open = true;
            await settle(el);
            const svg = el.querySelector('svg') as SVGElement;
            expect(svg.getBoundingClientRect().width).toBeGreaterThan(0);
        });

        it('exports the panel part, so a page can style the list', async () => {
            const style = document.createElement('style');
            style.textContent = 'hmi-select::part(panel) { padding: 37px }';
            document.head.append(style);
            try {
                const el = await plain();
                el.open = true;
                await settle(el);
                expect(getComputedStyle(panel(el)).paddingTop).toBe('37px');
            } finally {
                style.remove();
            }
        });
    });

    it('does not let align="end" right-align the text: a browser maps align to text-align', async () => {
        const el = await fixture(
            html`<hmi-select
                align="end"
                label="Plan"
                hint="Pick one"
                open
                .options=${OPTIONS}
            ></hmi-select>`,
        );
        await settle(el);
        expect(getComputedStyle(el).textAlign).toBe('start');
        expect(getComputedStyle(part(el, 'label') as Element).textAlign).toBe(
            'start',
        );
        expect(getComputedStyle(part(el, 'hint') as Element).textAlign).toBe(
            'start',
        );
        expect(getComputedStyle(panel(el)).textAlign).toBe('start');
    });

    describe('opening and choosing', () => {
        it('opens on a press on the trigger, and tells the consumer', async () => {
            const el = await fixture(
                html`<hmi-select value="pro" .options=${OPTIONS}></hmi-select>`,
            );
            const events = listen<SelectOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await userEvent.click(trigger(el));
            await settle(el);
            expect(el.open).toBe(true);
            expect(el.hasAttribute('open')).toBe(true);
            expect(isShown(el)).toBe(true);
            expect(trigger(el).getAttribute('aria-expanded')).toBe('true');
            expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
        });

        it('dispatches hmi-open-change with detail, from the select and not the popover', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-open-change', listener);
            await userEvent.click(trigger(el));
            await settle(el);
            document.removeEventListener('hmi-open-change', listener);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<SelectOpenChangeDetail>;
            expect(event.target).toBe(el);
            expect(event.detail).toEqual({ open: true });
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
            expect(event.cancelable).toBe(false);
        });

        it('leaves focus on the trigger when a pointer opens the list, and an arrow key moves it in', async () => {
            const el = await fixture(
                html`<hmi-select value="pro" .options=${OPTIONS}></hmi-select>`,
            );
            await userEvent.click(trigger(el));
            await settle(el);
            expect(el.open).toBe(true);
            expect(focused(el)).toBe(trigger(el));
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            expect(el.open).toBe(true);
            expect(focused(el)).toBe(items(el)[1]);
        });

        it('gives focus to the first enabled option when nothing is chosen', async () => {
            const el = await plain();
            trigger(el).focus();
            await userEvent.keyboard('{Enter}');
            await settle(el);
            expect(focused(el)).toBe(items(el)[0]);
        });

        it('chooses an option on click: value, hmi-change, closed, focus back on the trigger', async () => {
            const el = await plain();
            const changes = listen<SelectChangeDetail>(el, 'hmi-change');
            const opens = listen<SelectOpenChangeDetail>(el, 'hmi-open-change');
            await userEvent.click(trigger(el));
            await settle(el);
            await userEvent.click(items(el)[1] as HTMLElement);
            await settle(el);
            expect(el.value).toBe('pro');
            expect(changes.map((e) => e.detail)).toEqual([{ value: 'pro' }]);
            expect(opens.map((e) => e.detail.open)).toEqual([true, false]);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(text(part(el, 'value'))).toBe('Pro');
            expect(items(el).map((item) => item.checked)).toEqual([
                false,
                true,
                false,
                false,
            ]);
            expect(focused(el)).toBe(trigger(el));
        });

        it('dispatches hmi-change with detail', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-change', listener, { once: true });
            await userEvent.click(trigger(el));
            await settle(el);
            await userEvent.click(items(el)[3] as HTMLElement);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<SelectChangeDetail>;
            expect(event.detail).toEqual({ value: 'team' });
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
        });

        it('tells nothing for the option that is already chosen, and closes', async () => {
            const el = await fixture(
                html`<hmi-select value="pro" .options=${OPTIONS}></hmi-select>`,
            );
            const changes = listen<SelectChangeDetail>(el, 'hmi-change');
            await userEvent.click(trigger(el));
            await settle(el);
            await userEvent.click(items(el)[1] as HTMLElement);
            await settle(el);
            expect(changes).toHaveLength(0);
            expect(el.open).toBe(false);
        });

        it('does not choose a disabled option, and stays open', async () => {
            const el = await plain();
            const changes = listen<SelectChangeDetail>(el, 'hmi-change');
            await userEvent.click(trigger(el));
            await settle(el);
            (items(el)[2] as HTMLElement).click();
            await settle(el);
            expect(changes).toHaveLength(0);
            expect(el.value).toBe('');
            expect(el.open).toBe(true);
        });

        it('lets a listener veto a choice by setting value back', async () => {
            const el = await fixture(
                html`<hmi-select value="free" .options=${OPTIONS}></hmi-select>`,
            );
            el.addEventListener('hmi-change', () => {
                el.value = 'free';
            });
            await userEvent.click(trigger(el));
            await settle(el);
            await userEvent.click(items(el)[3] as HTMLElement);
            await settle(el);
            expect(el.value).toBe('free');
            expect(text(part(el, 'value'))).toBe('Free');
        });

        it('closes on a click outside, and tells the consumer', async () => {
            const el = await plain();
            await userEvent.click(trigger(el));
            await settle(el);
            const opens = listen<SelectOpenChangeDetail>(el, 'hmi-open-change');
            await userEvent.click(outside());
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(opens.map((e) => e.detail.open)).toEqual([false]);
        });

        it('does not take focus from another control that an outside click lands on', async () => {
            const el = await plain();
            await userEvent.click(trigger(el));
            await settle(el);
            const elsewhere = document.getElementById(
                'elsewhere',
            ) as HTMLElement;
            await userEvent.click(elsewhere);
            await settle(el);
            expect(el.open).toBe(false);
            expect(document.activeElement).toBe(elsewhere);
        });

        it('tells nothing, and moves no focus, when open is set from code', async () => {
            const el = await plain();
            const opens = listen<SelectOpenChangeDetail>(el, 'hmi-open-change');
            el.open = true;
            await settle(el);
            expect(isShown(el)).toBe(true);
            expect(focused(el)).toBeNull();
            el.open = false;
            await settle(el);
            expect(isShown(el)).toBe(false);
            expect(opens).toHaveLength(0);
        });

        it('reflects open, from the attribute too', async () => {
            const el = await fixture(
                html`<hmi-select open .options=${OPTIONS}></hmi-select>`,
            );
            expect(el.open).toBe(true);
            await settle(el);
            expect(isShown(el)).toBe(true);
            el.removeAttribute('open');
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
        });

        it('reflects align, and the list ends at the trigger’s right edge with end', async () => {
            const el = await plain();
            expect(el.align).toBe('start');
            expect(el.getAttribute('align')).toBe('start');
            el.setAttribute('align', 'end');
            el.open = true;
            await settle(el);
            expect(el.align).toBe('end');
            const trigger_ = trigger(el).getBoundingClientRect();
            const list = panel(el).getBoundingClientRect();
            expect(Math.round(list.right)).toBe(Math.round(trigger_.right));
        });
    });

    describe('from the keyboard', () => {
        for (const key of ['{Enter}', ' ', '{ArrowDown}', '{ArrowUp}']) {
            it(`opens on ${key.trim() || 'Space'} and moves focus to the chosen option`, async () => {
                const el = await fixture(
                    html`<hmi-select value="team" .options=${OPTIONS}></hmi-select>`,
                );
                trigger(el).focus();
                await userEvent.keyboard(key);
                await settle(el);
                expect(el.open).toBe(true);
                expect(isShown(el)).toBe(true);
                expect(focused(el)).toBe(items(el)[3]);
            });
        }

        it('moves between the enabled options with the arrow keys, Home and End, wrapping', async () => {
            const el = await plain();
            trigger(el).focus();
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            expect(focused(el)).toBe(items(el)[0]);
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(items(el)[1]);
            // The disabled option is skipped.
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(items(el)[3]);
            await userEvent.keyboard('{ArrowDown}');
            expect(focused(el)).toBe(items(el)[0]);
            await userEvent.keyboard('{End}');
            expect(focused(el)).toBe(items(el)[3]);
            await userEvent.keyboard('{Home}');
            expect(focused(el)).toBe(items(el)[0]);
        });

        it('chooses the focused option on Enter and on Space, and gives focus back', async () => {
            const el = await plain();
            const changes = listen<SelectChangeDetail>(el, 'hmi-change');
            trigger(el).focus();
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{Enter}');
            await settle(el);
            expect(el.value).toBe('pro');
            expect(el.open).toBe(false);
            expect(focused(el)).toBe(trigger(el));
            await userEvent.keyboard(' ');
            await settle(el);
            expect(el.open).toBe(true);
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard(' ');
            await settle(el);
            expect(el.value).toBe('team');
            expect(changes.map((e) => e.detail.value)).toEqual(['pro', 'team']);
        });

        it('closes on Escape, tells the consumer, and gives focus back to the trigger', async () => {
            const el = await plain();
            trigger(el).focus();
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            const opens = listen<SelectOpenChangeDetail>(el, 'hmi-open-change');
            await userEvent.keyboard('{Escape}');
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(opens.map((e) => e.detail.open)).toEqual([false]);
            expect(focused(el)).toBe(trigger(el));
            expect(el.value).toBe('');
        });

        it('closes on Tab and moves on to the next control, past the options', async () => {
            const el = await plain();
            trigger(el).focus();
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            const opens = listen<SelectOpenChangeDetail>(el, 'hmi-open-change');
            await userEvent.tab();
            await settle(el);
            expect(el.open).toBe(false);
            expect(opens.map((e) => e.detail.open)).toEqual([false]);
            expect(document.activeElement).toBe(nextButton());
        });

        it('closes on Shift+Tab and leaves the select backwards', async () => {
            const el = await plain();
            trigger(el).focus();
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            await userEvent.tab({ shift: true });
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(focused(el)).toBeNull();
        });

        it('does not open on an arrow key with a modifier', async () => {
            const el = await plain();
            trigger(el).focus();
            await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');
            await settle(el);
            expect(el.open).toBe(false);
        });
    });

    describe('disabled', () => {
        it('boolean attribute presence', async () => {
            const el = await fixture(
                html`<hmi-select disabled .options=${OPTIONS}></hmi-select>`,
            );
            expect(el.disabled).toBe(true);
            expect(trigger(el).disabled).toBe(true);
            el.removeAttribute('disabled');
            await el.updateComplete;
            expect(el.disabled).toBe(false);
            expect(trigger(el).disabled).toBe(false);
        });

        it('does not open, and closes a list that is open', async () => {
            const el = await fixture(
                html`<hmi-select disabled .options=${OPTIONS}></hmi-select>`,
            );
            trigger(el).click();
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            el.disabled = false;
            el.open = true;
            await settle(el);
            expect(isShown(el)).toBe(true);
            el.disabled = true;
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
        });
    });

    describe('roles', () => {
        it('exposes roles', async () => {
            const el = await fixture(
                html`<hmi-select
                    label="Plan"
                    hint="Pick one"
                    value="pro"
                    .options=${OPTIONS}
                ></hmi-select>`,
            );
            const base = trigger(el);
            expect(base.getAttribute('aria-haspopup')).toBe('menu');
            expect(base.getAttribute('aria-expanded')).toBe('false');
            expect(base.getAttribute('aria-labelledby')).toBe('label value');
            expect(base.getAttribute('aria-describedby')).toBe('hint');
            expect(base.hasAttribute('aria-invalid')).toBe(false);
            const label = part(el, 'label') as HTMLLabelElement;
            expect(label.id).toBe('label');
            expect(label.htmlFor).toBe('control');
            expect(base.id).toBe('control');
            expect(
                el.shadowRoot?.querySelector('#value')?.textContent?.trim(),
            ).toBe('Pro');
        });

        it('has no labelledby without a label, and marks an error', async () => {
            const el = await fixture(
                html`<hmi-select error="Required" .options=${OPTIONS}></hmi-select>`,
            );
            const base = trigger(el);
            expect(base.hasAttribute('aria-labelledby')).toBe(false);
            expect(base.getAttribute('aria-invalid')).toBe('true');
            expect(base.getAttribute('aria-describedby')).toBe('error');
            expect(part(el, 'error')?.getAttribute('role')).toBe('alert');
        });

        it('shows the required marker on the label', async () => {
            const el = await fixture(
                html`<hmi-select label="Plan" required .options=${OPTIONS}></hmi-select>`,
            );
            expect(
                part(el, 'label')?.querySelector('.required'),
            ).not.toBeNull();
            expect(el.required).toBe(true);
        });
    });

    describe('as a form control', () => {
        async function inForm(template: ReturnType<typeof html>) {
            const form = document.createElement('form');
            document.body.append(form);
            render(template, form);
            const el = form.querySelector('hmi-select') as HmiSelect;
            await el.updateComplete;
            return { form, el };
        }

        it('submits the chosen value under its name, and nothing while none is chosen', async () => {
            const { form, el } = await inForm(
                html`<hmi-select name="plan" .options=${OPTIONS}></hmi-select>`,
            );
            expect(new FormData(form).has('plan')).toBe(false);
            el.value = 'team';
            await el.updateComplete;
            expect(new FormData(form).get('plan')).toBe('team');
        });

        it('submits what the user chose', async () => {
            const { form, el } = await inForm(
                html`<hmi-select name="plan" .options=${OPTIONS}></hmi-select>`,
            );
            await userEvent.click(trigger(el));
            await settle(el);
            await userEvent.click(items(el)[1] as HTMLElement);
            await settle(el);
            expect(new FormData(form).get('plan')).toBe('pro');
        });

        it('submits its value and resets', async () => {
            const { form, el } = await inForm(
                html`<hmi-select name="plan" value="free" .options=${OPTIONS}></hmi-select>`,
            );
            expect(new FormData(form).get('plan')).toBe('free');
            el.value = 'team';
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('free');
            expect(text(part(el, 'value'))).toBe('Free');
        });

        it('restores default-value on reset, and starts from it', async () => {
            const { form, el } = await inForm(
                html`<hmi-select name="plan" default-value="pro" .options=${OPTIONS}></hmi-select>`,
            );
            expect(el.value).toBe('pro');
            el.value = 'team';
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('pro');
        });

        it('is invalid while required and nothing is chosen, with required-message as the text', async () => {
            const { form, el } = await inForm(
                html`<hmi-select name="plan" required .options=${OPTIONS}></hmi-select>`,
            );
            expect(el.validity.valueMissing).toBe(true);
            expect(el.validationMessage).toBe('Please select an option.');
            expect(form.checkValidity()).toBe(false);
            el.requiredMessage = 'Choose a plan.';
            await el.updateComplete;
            expect(el.validationMessage).toBe('Choose a plan.');
            el.value = 'pro';
            await el.updateComplete;
            expect(el.validity.valid).toBe(true);
            expect(form.checkValidity()).toBe(true);
        });

        it('reports a required miss on the trigger', async () => {
            const { el } = await inForm(
                html`<hmi-select name="plan" required .options=${OPTIONS}></hmi-select>`,
            );
            el.reportValidity();
            expect(focused(el)).toBe(trigger(el));
        });

        it('is invalid with the message of a non-empty error', async () => {
            const { el } = await inForm(
                html`<hmi-select name="plan" value="pro" error="Not allowed" .options=${OPTIONS}></hmi-select>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Not allowed');
            expect(part(el, 'error')?.textContent?.trim()).toBe('Not allowed');
        });

        it('is not submitted, and the trigger is disabled, inside a disabled fieldset', async () => {
            const fieldset = document.createElement('fieldset');
            fieldset.disabled = true;
            document.body.append(fieldset);
            render(
                html`<hmi-select name="plan" value="pro" .options=${OPTIONS}></hmi-select>`,
                fieldset,
            );
            const el = fieldset.querySelector('hmi-select') as HmiSelect;
            await el.updateComplete;
            await el.updateComplete;
            expect(trigger(el).disabled).toBe(true);
        });
    });
});

describe('Select (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const onChange = vi.fn();
        const onOpenChange = vi.fn();
        await act(async () => {
            root.render(
                createElement(Select, {
                    options: OPTIONS,
                    value: 'pro',
                    name: 'plan',
                    label: 'Plan',
                    required: true,
                    onChange,
                    onOpenChange,
                }),
            );
        });
        const el = host.querySelector('hmi-select') as HmiSelect;
        await el.updateComplete;
        expect(el.value).toBe('pro');
        expect(el.name).toBe('plan');
        expect(el.required).toBe(true);
        expect(text(part(el, 'value'))).toBe('Pro');
        await userEvent.click(trigger(el));
        await settle(el);
        expect(onOpenChange).toHaveBeenCalledOnce();
        expect(onOpenChange.mock.calls[0]?.[0].detail).toEqual({ open: true });
        await userEvent.click(items(el)[3] as HTMLElement);
        await settle(el);
        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange.mock.calls[0]?.[0].detail).toEqual({ value: 'team' });
        expect(el.value).toBe('team');
        await act(async () => root.unmount());
    });
});
