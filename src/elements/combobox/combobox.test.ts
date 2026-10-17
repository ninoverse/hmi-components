import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import './combobox.js';
import type {
    ComboboxChangeDetail,
    ComboboxInputDetail,
    ComboboxOpenChangeDetail,
    ComboboxOption,
    HmiCombobox,
} from './combobox.js';
import { Combobox } from './combobox.react.js';

const CITIES: ComboboxOption[] = [
    { value: 'amsterdam', label: 'Amsterdam', description: 'Netherlands' },
    { value: 'berlin', label: 'Berlin', description: 'Germany' },
    {
        value: 'lisbon',
        label: 'Lisbon',
        description: 'Portugal',
        disabled: true,
    },
    { value: 'paris', label: 'Paris', description: 'France' },
    { value: 'parma', label: 'Parma', description: 'Italy' },
    { value: 'rome', label: 'Rome' },
];

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiCombobox> {
    const host = document.createElement('div');
    document.body.append(host);
    render(
        html`<div style="padding: 60px 120px; width: 360px">${template}</div>
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
    const el = host.querySelector('hmi-combobox') as HmiCombobox;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const plain = () =>
    fixture(
        html`<hmi-combobox .options=${CITIES} aria-label="City"></hmi-combobox>`,
    );

const input = (el: HmiCombobox) =>
    el.shadowRoot?.querySelector('[part="input"]') as HTMLInputElement;
const field = (el: HmiCombobox) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLElement;
const panel = (el: HmiCombobox) =>
    el.shadowRoot?.querySelector('[part="panel"]') as HTMLElement;
const options = (el: HmiCombobox) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>('[part="option"]') ?? [],
    );
const part = (el: HmiCombobox, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);
const isShown = (el: HmiCombobox) => panel(el).matches(':popover-open');
const text = (node: Element | null | undefined) => node?.textContent?.trim();
const labels = (el: HmiCombobox) =>
    options(el).map((option) =>
        text(option.querySelector('[part="option-label"]')),
    );
const highlighted = (el: HmiCombobox) =>
    options(el).findIndex((option) => option.dataset.highlighted === 'true');
const focused = (el: HmiCombobox) => el.shadowRoot?.activeElement;
const outside = () => document.getElementById('outside') as HTMLElement;
const elsewhere = () => document.getElementById('elsewhere') as HTMLElement;

/** Lets the combobox render, its panel show or hide, and a queued event arrive. */
async function settle(el: HmiCombobox) {
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
}

const listen = <T>(el: HmiCombobox, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};

// The real pointer stays where a test left it: park it in a corner.
afterEach(async () => {
    document.body.replaceChildren();
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-combobox', () => {
    it('registers', () => {
        expect(customElements.get('hmi-combobox')).toBeDefined();
    });

    it('renders', async () => {
        const el = await plain();
        const base = part(el, 'base');
        expect(base).not.toBeNull();
        const box = base?.getBoundingClientRect();
        expect(box?.width).toBeGreaterThan(0);
        // As tall as an input: 5 × the base unit.
        expect(box?.height).toBe(40);
    });

    describe('the field', () => {
        it('is a text input with the combobox role, and a placeholder, Search… by default', async () => {
            const el = await plain();
            expect(input(el).type).toBe('text');
            expect(input(el).getAttribute('role')).toBe('combobox');
            expect(input(el).getAttribute('aria-autocomplete')).toBe('list');
            expect(input(el).getAttribute('aria-controls')).toBe('listbox');
            expect(input(el).placeholder).toBe('Search…');
            el.placeholder = 'Search cities…';
            await el.updateComplete;
            expect(input(el).placeholder).toBe('Search cities…');
        });

        it('shows the chosen option’s label, from value and from default-value', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            expect(input(el).value).toBe('Paris');
            expect(el.query).toBe('Paris');
            const other = await fixture(
                html`<hmi-combobox default-value="rome" .options=${CITIES}></hmi-combobox>`,
            );
            expect(other.value).toBe('rome');
            expect(input(other).value).toBe('Rome');
        });

        it('follows a value set from code, and a value cleared from code', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            el.value = 'rome';
            await el.updateComplete;
            expect(input(el).value).toBe('Rome');
            expect(el.query).toBe('Rome');
            el.value = '';
            await el.updateComplete;
            expect(input(el).value).toBe('');
        });

        it('shows the label once options arrive after the value', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris"></hmi-combobox>`,
            );
            expect(input(el).value).toBe('');
            el.options = CITIES;
            await el.updateComplete;
            expect(input(el).value).toBe('Paris');
        });

        it('keeps what the user typed when options are replaced, as a server search does', async () => {
            const el = await plain();
            await userEvent.type(input(el), 'pa');
            el.options = [...CITIES, { value: 'padua', label: 'Padua' }];
            await settle(el);
            expect(input(el).value).toBe('pa');
            expect(el.query).toBe('pa');
        });

        it('takes a query set from code, and filters by it', async () => {
            const el = await plain();
            el.query = 'rom';
            el.open = true;
            await settle(el);
            expect(input(el).value).toBe('rom');
            expect(labels(el)).toEqual(['Rome']);
        });

        it('shows a clear button only while there is text and it is not disabled, named by clear-label', async () => {
            const el = await fixture(
                html`<hmi-combobox clear-label="Wis" .options=${CITIES}></hmi-combobox>`,
            );
            expect(part(el, 'clear')).toBeNull();
            await userEvent.type(input(el), 'p');
            expect(part(el, 'clear')?.getAttribute('aria-label')).toBe('Wis');
            expect(part(el, 'clear')?.getAttribute('type')).toBe('button');
            el.disabled = true;
            await el.updateComplete;
            expect(part(el, 'clear')).toBeNull();
        });
    });

    describe('opening and closing', () => {
        it('opens on focus and tells the consumer, once', async () => {
            const el = await plain();
            const events = listen<ComboboxOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            input(el).focus();
            await settle(el);
            expect(el.open).toBe(true);
            expect(el.hasAttribute('open')).toBe(true);
            expect(isShown(el)).toBe(true);
            expect(input(el).getAttribute('aria-expanded')).toBe('true');
            expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
        });

        it('dispatches hmi-open-change with detail', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-open-change', listener);
            input(el).focus();
            await settle(el);
            document.removeEventListener('hmi-open-change', listener);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<ComboboxOpenChangeDetail>;
            expect(event.detail).toEqual({ open: true });
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
            expect(event.cancelable).toBe(false);
        });

        it('opens on typing and on ArrowDown and ArrowUp, once closed with Escape', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            await userEvent.keyboard('{Escape}');
            await settle(el);
            expect(el.open).toBe(false);
            await userEvent.keyboard('p');
            await settle(el);
            expect(el.open).toBe(true);
            await userEvent.keyboard('{Escape}');
            await settle(el);
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            expect(el.open).toBe(true);
            await userEvent.keyboard('{Escape}');
            await settle(el);
            await userEvent.keyboard('{ArrowUp}');
            await settle(el);
            expect(el.open).toBe(true);
        });

        it('closes on Escape, puts the label back and tells the consumer', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            await userEvent.type(input(el), 'zz');
            await settle(el);
            const events = listen<ComboboxOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            const escapeKey = new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true,
                composed: true,
                cancelable: true,
            });
            input(el).dispatchEvent(escapeKey);
            await settle(el);
            expect(escapeKey.defaultPrevented).toBe(true);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail.open)).toEqual([false]);
            expect(input(el).value).toBe('Paris');
            expect(el.query).toBe('Paris');
            expect(el.value).toBe('paris');
        });

        it('puts the label back, or nothing, when the user leaves without a choice', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            await userEvent.type(input(el), 'zz');
            await userEvent.click(elsewhere());
            await settle(el);
            expect(el.open).toBe(false);
            expect(input(el).value).toBe('Paris');
            const empty = await plain();
            await userEvent.type(input(empty), 'zz');
            await userEvent.tab();
            await settle(empty);
            expect(empty.open).toBe(false);
            expect(input(empty).value).toBe('');
            expect(empty.value).toBe('');
        });

        it('closes on an outside press, once, and puts the label back', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            await userEvent.type(input(el), 'zz');
            await settle(el);
            const events = listen<ComboboxOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await userEvent.click(outside());
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail.open)).toEqual([false]);
            expect(input(el).value).toBe('Paris');
        });

        it('closes on an outside press when it was opened from code, with no focus in the field', async () => {
            const el = await plain();
            el.open = true;
            await settle(el);
            expect(isShown(el)).toBe(true);
            const events = listen<ComboboxOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await userEvent.click(outside());
            await settle(el);
            expect(el.open).toBe(false);
            expect(events).toHaveLength(1);
        });

        it('stays open on a press in the field', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            await userEvent.click(input(el));
            await settle(el);
            expect(el.open).toBe(true);
        });

        it('tells nothing when open is set from code', async () => {
            const el = await plain();
            const events = listen<ComboboxOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            el.open = true;
            await settle(el);
            expect(isShown(el)).toBe(true);
            el.open = false;
            await settle(el);
            expect(isShown(el)).toBe(false);
            expect(events).toHaveLength(0);
        });

        it('reflects open, from the attribute too', async () => {
            const el = await fixture(
                html`<hmi-combobox open .options=${CITIES}></hmi-combobox>`,
            );
            await settle(el);
            expect(el.open).toBe(true);
            expect(isShown(el)).toBe(true);
            el.removeAttribute('open');
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
        });
    });

    describe('the list', () => {
        it('has a row per option, with the label and the description', async () => {
            const el = await plain();
            el.open = true;
            await settle(el);
            expect(labels(el)).toEqual([
                'Amsterdam',
                'Berlin',
                'Lisbon',
                'Paris',
                'Parma',
                'Rome',
            ]);
            expect(
                options(el).map((option) =>
                    text(option.querySelector('[part="description"]')),
                ),
            ).toEqual([
                'Netherlands',
                'Germany',
                'Portugal',
                'France',
                'Italy',
                '',
            ]);
            // An option without a description has no box for it.
            expect(
                (
                    options(el)[5]?.querySelector(
                        '[part="description"]',
                    ) as HTMLElement
                ).hidden,
            ).toBe(true);
        });

        it('is a listbox, with the chosen option selected and a disabled one aria-disabled', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES} aria-label="City"></hmi-combobox>`,
            );
            el.open = true;
            await settle(el);
            expect(panel(el).getAttribute('role')).toBe('listbox');
            expect(panel(el).id).toBe('listbox');
            expect(panel(el).getAttribute('aria-label')).toBe('City');
            expect(
                options(el).every((o) => o.getAttribute('role') === 'option'),
            ).toBe(true);
            expect(
                options(el).map((o) => o.getAttribute('aria-selected')),
            ).toEqual(['false', 'false', 'false', 'true', 'false', 'false']);
            expect(
                options(el).map((o) => o.getAttribute('aria-disabled')),
            ).toEqual([null, null, 'true', null, null, null]);
        });

        it('opens under the field, 6px below it and as wide as it', async () => {
            const el = await plain();
            el.open = true;
            await settle(el);
            const box = field(el).getBoundingClientRect();
            const list = panel(el).getBoundingClientRect();
            expect(Math.round(list.top)).toBe(Math.round(box.bottom + 6));
            expect(Math.round(list.left)).toBe(Math.round(box.left));
            expect(Math.round(list.width)).toBe(Math.round(box.width));
        });

        it('paints its surface from the listbox token', async () => {
            const el = await fixture(
                html`<hmi-combobox
                    open
                    .options=${CITIES}
                    style="--listbox-bg: rgb(1, 2, 3)"
                ></hmi-combobox>`,
            );
            await settle(el);
            expect(getComputedStyle(panel(el)).backgroundColor).toBe(
                'rgb(1, 2, 3)',
            );
        });

        it('exports the panel part, so a page can style the list', async () => {
            const style = document.createElement('style');
            style.textContent = 'hmi-combobox::part(panel) { padding: 37px }';
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

        it('scrolls to the highlighted option', async () => {
            const many = Array.from({ length: 40 }, (_, i) => ({
                value: `v${i}`,
                label: `Option ${i}`,
            }));
            const el = await fixture(
                html`<hmi-combobox .options=${many}></hmi-combobox>`,
            );
            input(el).focus();
            await settle(el);
            expect(panel(el).scrollHeight).toBeGreaterThan(
                panel(el).clientHeight,
            );
            await userEvent.keyboard('{End}');
            await settle(el);
            const row = options(el).at(-1) as HTMLElement;
            const list = panel(el).getBoundingClientRect();
            const box = row.getBoundingClientRect();
            expect(box.bottom).toBeLessThanOrEqual(list.bottom + 1);
            expect(box.top).toBeGreaterThanOrEqual(list.top - 1);
            expect(panel(el).scrollTop).toBeGreaterThan(0);
        });

        it('projects label-<value>, description-<value> and empty slots', async () => {
            const el = await fixture(
                html`<hmi-combobox .options=${CITIES}
                    ><b slot="label-rome">Roma</b
                    ><i slot="description-rome">Capital</i
                    ><i slot="empty">Nothing here</i></hmi-combobox
                >`,
            );
            el.open = true;
            await settle(el);
            const slot = (name: string) =>
                el.shadowRoot?.querySelector<HTMLSlotElement>(
                    `slot[name="${name}"]`,
                );
            expect(slot('label-rome')?.assignedElements()).toHaveLength(1);
            expect(slot('label-paris')?.assignedElements()).toHaveLength(0);
            expect(text(slot('label-paris'))).toBe('Paris');
            expect(slot('description-rome')?.assignedElements()).toHaveLength(
                1,
            );
            expect(
                (
                    options(el)[5]?.querySelector(
                        '[part="description"]',
                    ) as HTMLElement
                ).hidden,
            ).toBe(false);
            await userEvent.type(input(el), 'zzz');
            await settle(el);
            expect(slot('empty')?.assignedElements()).toHaveLength(1);
            // The field shows the label text, not a slotted label.
            await userEvent.clear(input(el));
            await userEvent.click(options(el)[5] as HTMLElement);
            await settle(el);
            expect(input(el).value).toBe('Rome');
        });
    });

    describe('filtering', () => {
        it('lists the options whose label contains the text, ignoring case', async () => {
            const el = await plain();
            await userEvent.type(input(el), 'PAR');
            await settle(el);
            expect(labels(el)).toEqual(['Paris', 'Parma']);
            await userEvent.type(input(el), 'm');
            await settle(el);
            expect(labels(el)).toEqual(['Parma']);
        });

        it('dispatches hmi-input with the text, for every keystroke', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-input', listener);
            await userEvent.type(input(el), 'pa');
            document.removeEventListener('hmi-input', listener);
            expect(listener).toHaveBeenCalledTimes(2);
            const events = listener.mock.calls.map(
                (call) => call[0] as CustomEvent<ComboboxInputDetail>,
            );
            expect(events.map((e) => e.detail)).toEqual([
                { value: 'p' },
                { value: 'pa' },
            ]);
            expect(events[0]?.bubbles).toBe(true);
            expect(events[0]?.composed).toBe(true);
            expect(el.query).toBe('pa');
        });

        it('filters by prefix with filter="startsWith"', async () => {
            const el = await fixture(
                html`<hmi-combobox filter="startsWith" .options=${CITIES}></hmi-combobox>`,
            );
            await userEvent.type(input(el), 'ar');
            await settle(el);
            expect(options(el)).toHaveLength(0);
            await userEvent.clear(input(el));
            await userEvent.type(input(el), 'par');
            await settle(el);
            expect(labels(el)).toEqual(['Paris', 'Parma']);
        });

        it('lists every option with filter="none", for a consumer that filters', async () => {
            const el = await fixture(
                html`<hmi-combobox filter="none" .options=${CITIES}></hmi-combobox>`,
            );
            await userEvent.type(input(el), 'zzz');
            await settle(el);
            expect(options(el)).toHaveLength(6);
        });

        it('filters with a function set as a property', async () => {
            const el = await plain();
            el.filter = (option, query) => option.description === query;
            await userEvent.type(input(el), 'Italy');
            await settle(el);
            expect(labels(el)).toEqual(['Parma']);
        });

        it('treats an unknown filter name as includes', async () => {
            const el = await fixture(
                html`<hmi-combobox filter="contains" .options=${CITIES}></hmi-combobox>`,
            );
            await userEvent.type(input(el), 'ome');
            await settle(el);
            expect(labels(el)).toEqual(['Rome']);
        });

        it('lists every option while the field still shows the chosen label', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            input(el).focus();
            await settle(el);
            expect(options(el)).toHaveLength(6);
            await userEvent.type(input(el), 's');
            await settle(el);
            expect(labels(el)).toEqual([]);
        });

        it('shows No matches by default, empty-message, and the empty slot', async () => {
            const el = await plain();
            await userEvent.type(input(el), 'zzz');
            await settle(el);
            expect(text(part(el, 'empty'))).toBe('No matches');
            el.emptyMessage = 'Nothing found';
            await el.updateComplete;
            expect(text(part(el, 'empty'))).toBe('Nothing found');
            const attr = await fixture(
                html`<hmi-combobox empty-message="Niets" .options=${[]} open></hmi-combobox>`,
            );
            await settle(attr);
            expect(text(part(attr, 'empty'))).toBe('Niets');
        });
    });

    describe('choosing', () => {
        it('chooses an option on a press: value, hmi-change, the label in the field, closed, focus kept', async () => {
            const el = await plain();
            const changes = listen<ComboboxChangeDetail>(el, 'hmi-change');
            const opens = listen<ComboboxOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await userEvent.type(input(el), 'pa');
            await userEvent.click(options(el)[1] as HTMLElement);
            await settle(el);
            expect(options(el)).toHaveLength(6);
            expect(el.value).toBe('parma');
            expect(changes.map((e) => e.detail)).toEqual([{ value: 'parma' }]);
            expect(input(el).value).toBe('Parma');
            expect(el.query).toBe('Parma');
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(opens.map((e) => e.detail.open)).toEqual([true, false]);
            expect(focused(el)).toBe(input(el));
        });

        it('dispatches hmi-change with detail', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-change', listener, { once: true });
            input(el).focus();
            await settle(el);
            await userEvent.click(options(el)[0] as HTMLElement);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<ComboboxChangeDetail>;
            expect(event.detail).toEqual({ value: 'amsterdam' });
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
            expect(event.cancelable).toBe(false);
        });

        it('tells nothing for the option that is already chosen, and puts its label back', async () => {
            const el = await fixture(
                html`<hmi-combobox filter="none" value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            const changes = listen<ComboboxChangeDetail>(el, 'hmi-change');
            await userEvent.type(input(el), 'x');
            await settle(el);
            expect(input(el).value).toBe('Parisx');
            await userEvent.click(options(el)[3] as HTMLElement);
            await settle(el);
            expect(changes).toHaveLength(0);
            expect(input(el).value).toBe('Paris');
            expect(el.open).toBe(false);
        });

        it('does not choose a disabled option, and stays open', async () => {
            const el = await plain();
            const changes = listen<ComboboxChangeDetail>(el, 'hmi-change');
            input(el).focus();
            await settle(el);
            // Playwright will not click an aria-disabled row: press it directly.
            (options(el)[2] as HTMLElement).dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                }),
            );
            await settle(el);
            expect(changes).toHaveLength(0);
            expect(el.value).toBe('');
            expect(el.open).toBe(true);
        });

        it('lets a listener veto a choice by setting value back', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            el.addEventListener('hmi-change', () => {
                el.value = 'paris';
            });
            input(el).focus();
            await settle(el);
            await userEvent.click(options(el)[5] as HTMLElement);
            await settle(el);
            expect(el.value).toBe('paris');
            expect(input(el).value).toBe('Paris');
        });

        it('highlights the row under the pointer, except a disabled one', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            await userEvent.hover(options(el)[4] as HTMLElement);
            await settle(el);
            expect(highlighted(el)).toBe(4);
            await userEvent.hover(options(el)[2] as HTMLElement);
            await settle(el);
            expect(highlighted(el)).toBe(4);
        });

        it('keeps focus in the field on a press anywhere in the list', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            const press = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
            });
            panel(el).dispatchEvent(press);
            expect(press.defaultPrevented).toBe(true);
            expect(focused(el)).toBe(input(el));
        });
    });

    describe('from the keyboard', () => {
        it('highlights the first enabled option when nothing is chosen, and the chosen one otherwise', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            expect(highlighted(el)).toBe(0);
            expect(input(el).getAttribute('aria-activedescendant')).toBe(
                'option-0',
            );
            const chosen = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            input(chosen).focus();
            await settle(chosen);
            expect(highlighted(chosen)).toBe(3);
            expect(input(chosen).getAttribute('aria-activedescendant')).toBe(
                'option-3',
            );
        });

        it('moves over the enabled options with the arrow keys, Home and End, and stops at the ends', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            await userEvent.keyboard('{ArrowDown}');
            expect(highlighted(el)).toBe(1);
            // Lisbon is disabled.
            await userEvent.keyboard('{ArrowDown}');
            expect(highlighted(el)).toBe(3);
            await userEvent.keyboard('{ArrowUp}');
            expect(highlighted(el)).toBe(1);
            await userEvent.keyboard('{ArrowUp}');
            await userEvent.keyboard('{ArrowUp}');
            expect(highlighted(el)).toBe(0);
            await userEvent.keyboard('{End}');
            expect(highlighted(el)).toBe(5);
            await userEvent.keyboard('{ArrowDown}');
            expect(highlighted(el)).toBe(5);
            await userEvent.keyboard('{Home}');
            expect(highlighted(el)).toBe(0);
            expect(input(el).getAttribute('aria-activedescendant')).toBe(
                'option-0',
            );
        });

        it('chooses the highlighted option on Enter', async () => {
            const el = await plain();
            const changes = listen<ComboboxChangeDetail>(el, 'hmi-change');
            input(el).focus();
            await settle(el);
            await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
            await settle(el);
            expect(el.value).toBe('paris');
            expect(changes.map((e) => e.detail.value)).toEqual(['paris']);
            expect(input(el).value).toBe('Paris');
            expect(el.open).toBe(false);
        });

        it('highlights the first match while typing, and Enter chooses it', async () => {
            const el = await plain();
            await userEvent.type(input(el), 'par');
            await settle(el);
            expect(highlighted(el)).toBe(0);
            await userEvent.keyboard('{ArrowDown}{Enter}');
            await settle(el);
            expect(el.value).toBe('parma');
        });

        it('leaves Enter alone while the list is closed', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            await userEvent.keyboard('{Escape}');
            await settle(el);
            const enter = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true,
            });
            input(el).dispatchEvent(enter);
            await settle(el);
            expect(enter.defaultPrevented).toBe(false);
            expect(el.value).toBe('');
        });

        it('opens on ArrowDown without moving past the first option', async () => {
            const el = await plain();
            input(el).focus();
            await settle(el);
            await userEvent.keyboard('{Escape}');
            await settle(el);
            await userEvent.keyboard('{ArrowDown}');
            await settle(el);
            expect(el.open).toBe(true);
            expect(highlighted(el)).toBe(0);
        });
    });

    describe('clearing', () => {
        it('clears the value and the text from the clear button, keeping focus in the field', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            input(el).focus();
            await settle(el);
            const changes = listen<ComboboxChangeDetail>(el, 'hmi-change');
            const inputs = listen<ComboboxInputDetail>(el, 'hmi-input');
            await userEvent.click(part(el, 'clear') as HTMLElement);
            await settle(el);
            expect(el.value).toBe('');
            expect(input(el).value).toBe('');
            expect(changes.map((e) => e.detail)).toEqual([{ value: '' }]);
            expect(inputs.map((e) => e.detail)).toEqual([{ value: '' }]);
            expect(focused(el)).toBe(input(el));
            expect(part(el, 'clear')).toBeNull();
        });

        it('clears typed text that was not chosen, without a change event', async () => {
            const el = await plain();
            await userEvent.type(input(el), 'pa');
            const changes = listen<ComboboxChangeDetail>(el, 'hmi-change');
            await userEvent.click(part(el, 'clear') as HTMLElement);
            await settle(el);
            expect(input(el).value).toBe('');
            expect(changes).toHaveLength(0);
        });

        it('clears the value when the user empties the field by typing', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            const changes = listen<ComboboxChangeDetail>(el, 'hmi-change');
            await userEvent.clear(input(el));
            await settle(el);
            expect(el.value).toBe('');
            expect(changes.map((e) => e.detail)).toEqual([{ value: '' }]);
        });

        it('keeps the value while the user edits the text', async () => {
            const el = await fixture(
                html`<hmi-combobox value="paris" .options=${CITIES}></hmi-combobox>`,
            );
            await userEvent.type(input(el), 'x');
            await settle(el);
            expect(el.value).toBe('paris');
            expect(input(el).value).toBe('Parisx');
        });
    });

    describe('disabled', () => {
        it('boolean attribute presence', async () => {
            const el = await fixture(
                html`<hmi-combobox disabled .options=${CITIES}></hmi-combobox>`,
            );
            expect(el.disabled).toBe(true);
            expect(input(el).disabled).toBe(true);
            el.removeAttribute('disabled');
            await el.updateComplete;
            expect(el.disabled).toBe(false);
            expect(input(el).disabled).toBe(false);
        });

        it('does not open, and closes a list that is open', async () => {
            const el = await fixture(
                html`<hmi-combobox disabled .options=${CITIES}></hmi-combobox>`,
            );
            el.open = true;
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
                html`<hmi-combobox
                    label="City"
                    hint="Pick one"
                    .options=${CITIES}
                ></hmi-combobox>`,
            );
            const label = part(el, 'label') as HTMLLabelElement;
            expect(label.htmlFor).toBe('control');
            expect(input(el).id).toBe('control');
            expect(input(el).hasAttribute('aria-label')).toBe(false);
            expect(input(el).getAttribute('aria-expanded')).toBe('false');
            expect(input(el).getAttribute('aria-describedby')).toBe('hint');
            expect(input(el).hasAttribute('aria-activedescendant')).toBe(false);
            expect(input(el).hasAttribute('aria-invalid')).toBe(false);
        });

        it('is named by label, else the host aria-label, else Combobox', async () => {
            const bare = await fixture(
                html`<hmi-combobox .options=${CITIES}></hmi-combobox>`,
            );
            expect(input(bare).getAttribute('aria-label')).toBe('Combobox');
            const named = await plain();
            expect(input(named).getAttribute('aria-label')).toBe('City');
        });

        it('marks an error and a required field', async () => {
            const el = await fixture(
                html`<hmi-combobox
                    label="City"
                    required
                    error="Choose a city."
                    .options=${CITIES}
                ></hmi-combobox>`,
            );
            expect(input(el).getAttribute('aria-invalid')).toBe('true');
            expect(input(el).getAttribute('aria-describedby')).toBe('error');
            expect(input(el).getAttribute('aria-required')).toBe('true');
            expect(part(el, 'error')?.getAttribute('role')).toBe('alert');
            expect(
                part(el, 'label')?.querySelector('.required'),
            ).not.toBeNull();
        });
    });

    describe('as a form control', () => {
        async function inForm(template: ReturnType<typeof html>) {
            const form = document.createElement('form');
            document.body.append(form);
            render(template, form);
            const el = form.querySelector('hmi-combobox') as HmiCombobox;
            await el.updateComplete;
            return { form, el };
        }

        it('submits the chosen value under its name, and nothing while none is chosen', async () => {
            const { form, el } = await inForm(
                html`<hmi-combobox name="city" .options=${CITIES}></hmi-combobox>`,
            );
            expect(new FormData(form).has('city')).toBe(false);
            await userEvent.type(input(el), 'par');
            await settle(el);
            // Text that was not chosen is not a value.
            expect(new FormData(form).has('city')).toBe(false);
            await userEvent.click(options(el)[0] as HTMLElement);
            await settle(el);
            expect(new FormData(form).get('city')).toBe('paris');
        });

        it('submits its value and resets, putting the label back in the field', async () => {
            const { form, el } = await inForm(
                html`<hmi-combobox name="city" value="rome" .options=${CITIES}></hmi-combobox>`,
            );
            expect(new FormData(form).get('city')).toBe('rome');
            el.value = 'paris';
            await userEvent.type(input(el), 'x');
            await settle(el);
            form.reset();
            await settle(el);
            expect(el.value).toBe('rome');
            expect(input(el).value).toBe('Rome');
        });

        it('restores default-value on reset, and starts from it', async () => {
            const { form, el } = await inForm(
                html`<hmi-combobox name="city" default-value="berlin" .options=${CITIES}></hmi-combobox>`,
            );
            expect(el.value).toBe('berlin');
            el.value = 'rome';
            await el.updateComplete;
            form.reset();
            await settle(el);
            expect(el.value).toBe('berlin');
            expect(input(el).value).toBe('Berlin');
        });

        it('is invalid while required and nothing is chosen, even with text typed, and required-message is the text', async () => {
            const { form, el } = await inForm(
                html`<hmi-combobox name="city" required .options=${CITIES}></hmi-combobox>`,
            );
            expect(el.validity.valueMissing).toBe(true);
            expect(el.validationMessage).toBe('Please select an option.');
            expect(form.checkValidity()).toBe(false);
            await userEvent.type(input(el), 'par');
            await settle(el);
            expect(el.validity.valueMissing).toBe(true);
            el.requiredMessage = 'Choose a city.';
            await el.updateComplete;
            expect(el.validationMessage).toBe('Choose a city.');
            el.value = 'paris';
            await el.updateComplete;
            expect(el.validity.valid).toBe(true);
            expect(form.checkValidity()).toBe(true);
        });

        it('reports a required miss on the input', async () => {
            const { el } = await inForm(
                html`<hmi-combobox name="city" required .options=${CITIES}></hmi-combobox>`,
            );
            el.reportValidity();
            expect(focused(el)).toBe(input(el));
        });

        it('is invalid with the message of a non-empty error', async () => {
            const { el } = await inForm(
                html`<hmi-combobox name="city" value="paris" error="Not allowed" .options=${CITIES}></hmi-combobox>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Not allowed');
            expect(part(el, 'error')?.textContent?.trim()).toBe('Not allowed');
        });

        it('is excluded from the form while disabled, and enabled again from code', async () => {
            const { form, el } = await inForm(
                html`<hmi-combobox name="city" value="paris" disabled .options=${CITIES}></hmi-combobox>`,
            );
            expect(new FormData(form).has('city')).toBe(false);
            el.disabled = false;
            await el.updateComplete;
            await new Promise((resolve) => setTimeout(resolve, 0));
            expect(input(el).disabled).toBe(false);
            expect(new FormData(form).get('city')).toBe('paris');
        });
    });

    describe('where the browser has no Popover API', () => {
        it('opens and closes without showing a popover, and still places the list', async () => {
            const proto = HTMLElement.prototype;
            const descriptor = Object.getOwnPropertyDescriptor(
                proto,
                'popover',
            );
            Reflect.deleteProperty(proto, 'popover');
            try {
                const el = await plain();
                input(el).focus();
                await settle(el);
                expect(el.open).toBe(true);
                expect(isShown(el)).toBe(false);
                expect(panel(el).style.top).not.toBe('');
                await userEvent.click(outside());
                await settle(el);
                expect(el.open).toBe(false);
            } finally {
                if (descriptor) {
                    Object.defineProperty(proto, 'popover', descriptor);
                }
            }
        });
    });
});

describe('Combobox (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const onChange = vi.fn();
        const onInput = vi.fn();
        const onOpenChange = vi.fn();
        await act(async () => {
            root.render(
                createElement(Combobox, {
                    options: CITIES,
                    value: 'paris',
                    name: 'city',
                    label: 'City',
                    filter: 'startsWith',
                    emptyMessage: 'Niets',
                    required: true,
                    onChange,
                    onInput,
                    onOpenChange,
                }),
            );
        });
        const el = host.querySelector('hmi-combobox') as HmiCombobox;
        await el.updateComplete;
        expect(el.value).toBe('paris');
        expect(el.name).toBe('city');
        expect(el.filter).toBe('startsWith');
        expect(el.emptyMessage).toBe('Niets');
        expect(el.required).toBe(true);
        expect(input(el).value).toBe('Paris');
        input(el).focus();
        await settle(el);
        expect(onOpenChange).toHaveBeenCalledOnce();
        expect(onOpenChange.mock.calls[0]?.[0].detail).toEqual({ open: true });
        await userEvent.clear(input(el));
        await userEvent.type(input(el), 'ro');
        await settle(el);
        expect(onInput.mock.calls.at(-1)?.[0].detail).toEqual({ value: 'ro' });
        await userEvent.click(options(el)[0] as HTMLElement);
        await settle(el);
        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls.at(-1)?.[0].detail).toEqual({
            value: 'rome',
        });
        await act(async () => root.unmount());
    });
});
