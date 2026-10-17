import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { HmiPopover } from '../popover/popover.js';
import './color-picker.js';
import type {
    ColorPickerChangeDetail,
    ColorPickerOpenChangeDetail,
    HmiColorPicker,
} from './color-picker.js';
import { ColorPicker } from './color-picker.react.js';

const DEFAULTS = [
    '#e87a5d',
    '#d49a3f',
    '#5c9a6a',
    '#6b86b3',
    '#c0524c',
    '#7a6f64',
    '#2b2520',
    '#ffffff',
];

const PAGE = `<button id="elsewhere" style="position: fixed; right: 0; top: 0">Elsewhere</button>
    <div id="outside" style="position: fixed; left: 0; bottom: 0; width: 60px; height: 40px"></div>`;

// The attributes are parsed from text, as a page's markup would give them.
async function plain(attrs = ''): Promise<HmiColorPicker> {
    const host = document.createElement('div');
    host.innerHTML = `<div style="padding: 40px 20px">
            <hmi-color-picker aria-label="x" ${attrs}></hmi-color-picker>
        </div>${PAGE}`;
    document.body.append(host);
    const el = host.querySelector('hmi-color-picker') as HmiColorPicker;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const trigger = (el: HmiColorPicker) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
const popover = (el: HmiColorPicker) =>
    el.shadowRoot?.querySelector('hmi-popover') as HmiPopover;
const panel = (el: HmiColorPicker) =>
    popover(el).shadowRoot?.querySelector('.panel') as HTMLElement;
const isShown = (el: HmiColorPicker) => panel(el).matches(':popover-open');
const swatches = (el: HmiColorPicker) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>('[part="swatch"]') ?? [],
    );
const hex = (el: HmiColorPicker) =>
    el.shadowRoot?.querySelector('[part="hex"]') as HTMLInputElement;
const sample = (el: HmiColorPicker) =>
    el.shadowRoot?.querySelector('[part="sample"]') as HTMLInputElement;
const part = (el: HmiColorPicker, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);
const focused = (el: HmiColorPicker) => el.shadowRoot?.activeElement;
const text = (node: Element | null | undefined) => node?.textContent?.trim();
const outside = () => document.getElementById('outside') as HTMLElement;
const swatch = (el: HmiColorPicker, colour: string) =>
    swatches(el).find(
        (s) => s.getAttribute('aria-label') === colour,
    ) as HTMLElement;
const checked = (el: HmiColorPicker) =>
    swatches(el)
        .filter((s) => s.getAttribute('aria-checked') === 'true')
        .map((s) => s.getAttribute('aria-label'));

/** Lets the picker render, its popover show or hide, and a queued toggle event arrive. */
async function settle(el: HmiColorPicker) {
    await el.updateComplete;
    await popover(el).updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
}

const open = async (el: HmiColorPicker) => {
    await userEvent.click(trigger(el));
    await settle(el);
};

const listen = <T>(el: HmiColorPicker, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};

/** Every hmi-input and hmi-change, in order, as `type value`. */
const log = (el: HmiColorPicker) => {
    const events: string[] = [];
    for (const type of ['hmi-input', 'hmi-change']) {
        el.addEventListener(type, (e) =>
            events.push(
                `${type} ${(e as CustomEvent<{ value: string }>).detail.value}`,
            ),
        );
    }
    return events;
};

// The real pointer stays where a test left it: park it in a corner, away from
// where the next test puts its picker.
afterEach(async () => {
    document.body.replaceChildren();
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-color-picker', () => {
    it('registers', () => {
        expect(customElements.get('hmi-color-picker')).toBeDefined();
    });

    it('renders a closed trigger with the default colour', async () => {
        const el = await plain();
        expect(el.value).toBe('#e87a5d');
        expect(el.open).toBe(false);
        expect(el.hideInput).toBe(false);
        expect(trigger(el).tagName).toBe('BUTTON');
        expect(isShown(el)).toBe(false);
    });

    describe('the trigger', () => {
        it('shows the colour as a box and its hex text, in upper case', async () => {
            const el = await plain('value="#5c9a6a"');
            expect(text(part(el, 'value'))).toBe('#5c9a6a');
            expect(
                getComputedStyle(part(el, 'value') as Element).textTransform,
            ).toBe('uppercase');
            expect(
                getComputedStyle(part(el, 'preview') as Element)
                    .backgroundColor,
            ).toBe('rgb(92, 154, 106)');
        });

        it('shows #rrggbb for a shorthand and for upper case', async () => {
            const el = await plain('value="#ABC"');
            expect(text(part(el, 'value'))).toBe('#aabbcc');
            el.value = '#E87A5D';
            await el.updateComplete;
            expect(text(part(el, 'value'))).toBe('#e87a5d');
        });

        it('shows text that is not a hex as it is, and paints it', async () => {
            const el = await plain('value="red"');
            expect(text(part(el, 'value'))).toBe('red');
            expect(
                getComputedStyle(part(el, 'preview') as Element)
                    .backgroundColor,
            ).toBe('rgb(255, 0, 0)');
            expect(checked(el)).toEqual([]);
            expect(sample(el).value).toBe('#000000');
        });

        it('is named by aria-label, Choose color by default, and describes itself by the colour', async () => {
            const bare = await fixtureBare();
            expect(trigger(bare).getAttribute('aria-label')).toBe(
                'Choose color',
            );
            expect(trigger(bare).hasAttribute('aria-labelledby')).toBe(false);
            expect(trigger(bare).getAttribute('aria-describedby')).toBe(
                'value',
            );
            const named = await plain();
            expect(trigger(named).getAttribute('aria-label')).toBe('x');
        });

        it('is named by the label together with the colour', async () => {
            const el = await plain('label="Brand" hint="Pick one"');
            const base = trigger(el);
            expect(base.getAttribute('aria-haspopup')).toBe('dialog');
            expect(base.getAttribute('aria-expanded')).toBe('false');
            expect(base.getAttribute('aria-labelledby')).toBe('label value');
            expect(base.hasAttribute('aria-label')).toBe(false);
            expect(base.getAttribute('aria-describedby')).toBe('hint');
            const label = part(el, 'label') as HTMLLabelElement;
            expect(label.id).toBe('label');
            expect(label.htmlFor).toBe('control');
            expect(base.id).toBe('control');
        });

        it('is as wide as its content, not its container', async () => {
            const el = await plain();
            expect(trigger(el).getBoundingClientRect().width).toBeLessThan(200);
        });

        it('marks an error on the trigger, as an alert', async () => {
            const el = await plain('error="Too light"');
            expect(trigger(el).getAttribute('aria-invalid')).toBe('true');
            expect(trigger(el).getAttribute('aria-describedby')).toBe(
                'error value',
            );
            expect(part(el, 'error')?.getAttribute('role')).toBe('alert');
            expect(trigger(el).classList.contains('invalid')).toBe(true);
        });
    });

    describe('the swatches', () => {
        it('are a radiogroup of the preset colours, in order, each named by its hex', async () => {
            const el = await plain();
            const group = part(el, 'swatches') as HTMLElement;
            expect(group.getAttribute('role')).toBe('radiogroup');
            expect(group.getAttribute('aria-label')).toBe('x');
            expect(
                swatches(el).map((s) => s.getAttribute('aria-label')),
            ).toEqual(DEFAULTS);
            for (const s of swatches(el)) {
                expect(s.getAttribute('role')).toBe('radio');
            }
            expect(
                getComputedStyle(swatch(el, '#5c9a6a')).backgroundColor,
            ).toBe('rgb(92, 154, 106)');
        });

        it('mark the chosen one, whatever the spelling of the value', async () => {
            const el = await plain('value="#5C9A6A"');
            expect(checked(el)).toEqual(['#5c9a6a']);
            el.value = '#fff';
            await el.updateComplete;
            expect(checked(el)).toEqual(['#ffffff']);
            el.value = '#123456';
            await el.updateComplete;
            expect(checked(el)).toEqual([]);
        });

        it('put one swatch in the Tab order: the chosen one, else the first', async () => {
            const el = await plain('value="#6b86b3"');
            expect(
                swatches(el)
                    .filter((s) => s.tabIndex === 0)
                    .map((s) => s.getAttribute('aria-label')),
            ).toEqual(['#6b86b3']);
            el.value = '#123456';
            await el.updateComplete;
            expect(
                swatches(el)
                    .filter((s) => s.tabIndex === 0)
                    .map((s) => s.getAttribute('aria-label')),
            ).toEqual(['#e87a5d']);
        });

        it('take another list, and skip what is not a hex, and a colour twice', async () => {
            const el = await plain();
            el.swatches = [
                '#111',
                '#222222',
                'red',
                '#ABCDEF',
                '#112233',
                '#111111',
                'rgb(0,0,0)',
            ];
            await el.updateComplete;
            expect(
                swatches(el).map((s) => s.getAttribute('aria-label')),
            ).toEqual(['#111111', '#222222', '#abcdef', '#112233']);
        });

        it('are none when the list is empty', async () => {
            const el = await plain();
            el.swatches = [];
            await el.updateComplete;
            expect(swatches(el)).toHaveLength(0);
        });
    });

    describe('the hex field and the sampler', () => {
        it('show the colour, and the sampler takes #rrggbb for a shorthand', async () => {
            const el = await plain('value="#abc"');
            expect(hex(el).value).toBe('#aabbcc');
            expect(sample(el).value).toBe('#aabbcc');
            expect(hex(el).getAttribute('aria-label')).toBe('Hex color value');
            expect(sample(el).getAttribute('aria-label')).toBe('Color sample');
            expect(hex(el).getAttribute('spellcheck')).toBe('false');
            expect(hex(el).getAttribute('autocomplete')).toBe('off');
            expect(sample(el).type).toBe('color');
        });

        it('are hidden by hide-input, which flips like any presence boolean', async () => {
            const el = await plain('hide-input');
            expect(el.hideInput).toBe(true);
            expect(hex(el)).toBeNull();
            expect(sample(el)).toBeNull();
            expect(part(el, 'inputs')).toBeNull();
            expect(swatches(el)).toHaveLength(8);
            const flipped = await plain('hide-input="false"');
            expect(flipped.hideInput).toBe(true);
        });

        it('take their names from properties and attributes', async () => {
            const el = await plain(
                'hex-label="Esadecimale" sample-label="Campione"',
            );
            expect(hex(el).getAttribute('aria-label')).toBe('Esadecimale');
            expect(sample(el).getAttribute('aria-label')).toBe('Campione');
            el.hexLabel = 'Hex';
            el.sampleLabel = 'Sample';
            await el.updateComplete;
            expect(hex(el).getAttribute('aria-label')).toBe('Hex');
            expect(sample(el).getAttribute('aria-label')).toBe('Sample');
        });

        it('follow a colour set from code', async () => {
            const el = await plain();
            await open(el);
            el.value = '#123456';
            await el.updateComplete;
            expect(hex(el).value).toBe('#123456');
            expect(sample(el).value).toBe('#123456');
        });
    });

    describe('opening', () => {
        it('opens on a press on the trigger, and tells the consumer', async () => {
            const el = await plain();
            const events = listen<ColorPickerOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await open(el);
            expect(el.open).toBe(true);
            expect(el.hasAttribute('open')).toBe(true);
            expect(isShown(el)).toBe(true);
            expect(trigger(el).getAttribute('aria-expanded')).toBe('true');
            expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
        });

        it('dispatches hmi-open-change from the picker and not the popover', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-open-change', listener);
            await open(el);
            document.removeEventListener('hmi-open-change', listener);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<ColorPickerOpenChangeDetail>;
            expect(event.target).toBe(el);
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
            expect(event.cancelable).toBe(false);
        });

        it('is a dialog named like the trigger', async () => {
            const el = await plain();
            await open(el);
            const dialog = el.shadowRoot?.querySelector('[role="dialog"]');
            expect(dialog?.getAttribute('aria-label')).toBe('x');
            document.body.replaceChildren();
            const labelled = await plain('label="Brand"');
            await open(labelled);
            expect(
                labelled.shadowRoot
                    ?.querySelector('[role="dialog"]')
                    ?.getAttribute('aria-label'),
            ).toBe('Brand');
        });

        it('leaves focus on the trigger when a pointer opens it', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            expect(focused(el)).toBe(trigger(el));
        });

        it('gives focus to the chosen swatch when the keyboard opens it, else the first', async () => {
            for (const key of ['{Enter}', ' ']) {
                const el = await plain('value="#5c9a6a"');
                trigger(el).focus();
                await userEvent.keyboard(key);
                await settle(el);
                expect(el.open).toBe(true);
                expect(focused(el)).toBe(swatch(el, '#5c9a6a'));
                document.body.replaceChildren();
            }
            const none = await plain('value="#123456"');
            trigger(none).focus();
            await userEvent.keyboard('{Enter}');
            await settle(none);
            expect(focused(none)).toBe(swatch(none, '#e87a5d'));
        });

        it('gives focus to the hex field when there are no swatches', async () => {
            const el = await plain();
            el.swatches = [];
            await el.updateComplete;
            trigger(el).focus();
            await userEvent.keyboard('{Enter}');
            await settle(el);
            expect(focused(el)).toBe(hex(el));
        });

        it('closes on Escape, tells the consumer, and gives focus back to the trigger', async () => {
            const el = await plain();
            trigger(el).focus();
            await userEvent.keyboard('{Enter}');
            await settle(el);
            const events = listen<ColorPickerOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await userEvent.keyboard('{Escape}');
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
            expect(focused(el)).toBe(trigger(el));
        });

        it('closes on a click outside, without taking focus from what was clicked', async () => {
            const el = await plain();
            await open(el);
            await userEvent.click(outside());
            await settle(el);
            expect(el.open).toBe(false);
            const elsewhere = document.getElementById(
                'elsewhere',
            ) as HTMLElement;
            await open(el);
            await userEvent.click(elsewhere);
            await settle(el);
            expect(el.open).toBe(false);
            expect(document.activeElement).toBe(elsewhere);
        });

        it('stays open while a swatch or the hex field is pressed', async () => {
            const el = await plain();
            await open(el);
            await userEvent.click(swatch(el, '#5c9a6a'));
            await settle(el);
            expect(el.open).toBe(true);
            await userEvent.click(hex(el));
            await settle(el);
            expect(el.open).toBe(true);
        });

        it('tells nothing, and moves no focus, when open is set from code', async () => {
            const el = await plain();
            const opens = listen<ColorPickerOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            el.open = true;
            await settle(el);
            expect(isShown(el)).toBe(true);
            expect(focused(el)).toBeNull();
            el.open = false;
            await settle(el);
            expect(isShown(el)).toBe(false);
            expect(opens).toHaveLength(0);
        });

        it('reads open from the attribute', async () => {
            const el = await plain('open');
            await settle(el);
            expect(el.open).toBe(true);
            expect(isShown(el)).toBe(true);
        });

        it('exports the panel part, so a page can style the panel', async () => {
            const style = document.createElement('style');
            style.textContent =
                'hmi-color-picker::part(panel) { padding: 37px }';
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

    describe('choosing a swatch', () => {
        it('takes the colour: value, hmi-input then hmi-change, hex field, and stays open', async () => {
            const el = await plain();
            const events = log(el);
            await open(el);
            await userEvent.click(swatch(el, '#5c9a6a'));
            await settle(el);
            expect(el.value).toBe('#5c9a6a');
            expect(events).toEqual(['hmi-input #5c9a6a', 'hmi-change #5c9a6a']);
            expect(checked(el)).toEqual(['#5c9a6a']);
            expect(hex(el).value).toBe('#5c9a6a');
            expect(text(part(el, 'value'))).toBe('#5c9a6a');
            expect(el.open).toBe(true);
        });

        it('reports #rrggbb for a shorthand swatch', async () => {
            const el = await plain();
            el.swatches = ['#f80'];
            await el.updateComplete;
            const events = log(el);
            await open(el);
            await userEvent.click(swatch(el, '#ff8800'));
            await settle(el);
            expect(el.value).toBe('#ff8800');
            expect(events).toEqual(['hmi-input #ff8800', 'hmi-change #ff8800']);
        });

        it('tells nothing for the colour that is already chosen', async () => {
            const el = await plain();
            const events = log(el);
            await open(el);
            await userEvent.click(swatch(el, '#e87a5d'));
            await settle(el);
            expect(events).toEqual([]);
        });

        it('dispatches events that bubble, cross the shadow root, and cannot be cancelled', async () => {
            const el = await plain();
            const input = vi.fn();
            const change = vi.fn();
            document.addEventListener('hmi-input', input);
            document.addEventListener('hmi-change', change);
            await open(el);
            await userEvent.click(swatch(el, '#5c9a6a'));
            await settle(el);
            document.removeEventListener('hmi-input', input);
            document.removeEventListener('hmi-change', change);
            for (const listener of [input, change]) {
                expect(listener).toHaveBeenCalledOnce();
                const event = listener.mock
                    .calls[0]?.[0] as CustomEvent<ColorPickerChangeDetail>;
                expect(event.target).toBe(el);
                expect(event.detail).toEqual({ value: '#5c9a6a' });
                expect(event.bubbles).toBe(true);
                expect(event.composed).toBe(true);
                expect(event.cancelable).toBe(false);
            }
        });

        it('lets a listener veto a colour by setting value back, and commits nothing', async () => {
            const el = await plain();
            const events = log(el);
            el.addEventListener('hmi-input', () => {
                el.value = '#e87a5d';
            });
            await open(el);
            await userEvent.click(swatch(el, '#5c9a6a'));
            await settle(el);
            expect(el.value).toBe('#e87a5d');
            expect(events).toEqual(['hmi-input #5c9a6a']);
            expect(checked(el)).toEqual(['#e87a5d']);
            expect(hex(el).value).toBe('#e87a5d');
        });

        it('measures hmi-change against a colour set from outside', async () => {
            const el = await plain();
            await open(el);
            el.value = '#d49a3f';
            await el.updateComplete;
            const events = log(el);
            await userEvent.click(swatch(el, '#d49a3f'));
            await settle(el);
            expect(events).toEqual([]);
            await userEvent.click(swatch(el, '#5c9a6a'));
            await userEvent.click(swatch(el, '#d49a3f'));
            await settle(el);
            expect(events).toEqual([
                'hmi-input #5c9a6a',
                'hmi-change #5c9a6a',
                'hmi-input #d49a3f',
                'hmi-change #d49a3f',
            ]);
        });
    });

    describe('from the keyboard on the swatches', () => {
        const openOnKeyboard = async (attrs = 'value="#5c9a6a"') => {
            const el = await plain(attrs);
            trigger(el).focus();
            await userEvent.keyboard('{Enter}');
            await settle(el);
            return el;
        };
        const press = async (el: HmiColorPicker, key: string) => {
            await userEvent.keyboard(key);
            await settle(el);
        };

        it('moves to the next swatch and chooses it with the right and down arrows', async () => {
            const el = await openOnKeyboard();
            const events = log(el);
            await press(el, '{ArrowRight}');
            expect(el.value).toBe('#6b86b3');
            expect(focused(el)).toBe(swatch(el, '#6b86b3'));
            expect(events).toEqual(['hmi-input #6b86b3', 'hmi-change #6b86b3']);
            await press(el, '{ArrowDown}');
            expect(el.value).toBe('#c0524c');
            expect(focused(el)).toBe(swatch(el, '#c0524c'));
        });

        it('moves to the previous swatch with the left and up arrows', async () => {
            const el = await openOnKeyboard();
            await press(el, '{ArrowLeft}');
            expect(el.value).toBe('#d49a3f');
            await press(el, '{ArrowUp}');
            expect(el.value).toBe('#e87a5d');
        });

        it('wraps around at both ends, and Home and End go to the first and the last', async () => {
            const el = await openOnKeyboard('value="#e87a5d"');
            await press(el, '{ArrowLeft}');
            expect(el.value).toBe('#ffffff');
            await press(el, '{ArrowRight}');
            expect(el.value).toBe('#e87a5d');
            await press(el, '{End}');
            expect(el.value).toBe('#ffffff');
            await press(el, '{Home}');
            expect(el.value).toBe('#e87a5d');
        });

        it('puts the Tab stop on the swatch it chose', async () => {
            const el = await openOnKeyboard();
            await press(el, '{ArrowRight}');
            expect(
                swatches(el)
                    .filter((s) => s.tabIndex === 0)
                    .map((s) => s.getAttribute('aria-label')),
            ).toEqual(['#6b86b3']);
        });

        it('leaves a key with a modifier to the browser', async () => {
            const el = await openOnKeyboard();
            await press(el, '{Control>}{ArrowRight}{/Control}');
            expect(el.value).toBe('#5c9a6a');
        });

        it('chooses a swatch on Space and Enter, as a press', async () => {
            const el = await openOnKeyboard('value="#e87a5d"');
            swatch(el, '#5c9a6a').focus();
            const events = log(el);
            await press(el, ' ');
            expect(el.value).toBe('#5c9a6a');
            expect(events).toEqual(['hmi-input #5c9a6a', 'hmi-change #5c9a6a']);
        });

        it('keeps the focus within the panel until Escape gives it back', async () => {
            const el = await openOnKeyboard();
            await press(el, '{ArrowRight}');
            await press(el, '{Escape}');
            expect(el.open).toBe(false);
            expect(focused(el)).toBe(trigger(el));
        });
    });

    describe('the hex field', () => {
        const typeInto = async (el: HmiColorPicker, value: string) => {
            await userEvent.click(hex(el));
            await userEvent.clear(hex(el));
            await userEvent.type(hex(el), value);
        };

        it('takes a 6-digit hex as it is typed, with hmi-input only, and does not pass through the 3-digit one', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            const events = log(el);
            await typeInto(el, '#e87a5d');
            await settle(el);
            expect(events).toEqual(['hmi-input #e87a5d']);
            expect(el.value).toBe('#e87a5d');
            expect(checked(el)).toEqual(['#e87a5d']);
        });

        it('takes upper case, and keeps what is typed until it is committed', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            await typeInto(el, '#D49A3F');
            await settle(el);
            expect(el.value).toBe('#d49a3f');
            expect(hex(el).value).toBe('#D49A3F');
        });

        it('commits on Enter: hmi-change, with the field showing #rrggbb', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            const events = log(el);
            await typeInto(el, '#D49A3F');
            await userEvent.keyboard('{Enter}');
            await settle(el);
            expect(events).toEqual(['hmi-input #d49a3f', 'hmi-change #d49a3f']);
            expect(hex(el).value).toBe('#d49a3f');
        });

        it('takes a 3-digit hex on Enter, expanded, and not before', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            const events = log(el);
            await typeInto(el, '#f80');
            await settle(el);
            expect(events).toEqual([]);
            expect(el.value).toBe('#5c9a6a');
            await userEvent.keyboard('{Enter}');
            await settle(el);
            expect(events).toEqual(['hmi-input #ff8800', 'hmi-change #ff8800']);
            expect(hex(el).value).toBe('#ff8800');
            expect(sample(el).value).toBe('#ff8800');
        });

        it('commits on leaving the field', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            const events = log(el);
            await typeInto(el, '#d49a3f');
            await userEvent.click(swatch(el, '#ffffff'));
            await settle(el);
            expect(events).toEqual([
                'hmi-input #d49a3f',
                'hmi-change #d49a3f',
                'hmi-input #ffffff',
                'hmi-change #ffffff',
            ]);
        });

        it('puts the colour back when it is left with text that is not one', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            const events = log(el);
            await typeInto(el, '#zzz');
            await userEvent.click(swatch(el, '#5c9a6a'));
            await settle(el);
            expect(hex(el).value).toBe('#5c9a6a');
            expect(el.value).toBe('#5c9a6a');
            expect(events).toEqual([]);
        });

        it('puts the colour back when the panel closes with text that is not one', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            await userEvent.click(hex(el));
            await userEvent.clear(hex(el));
            await userEvent.type(hex(el), '#12');
            await userEvent.click(outside());
            await settle(el);
            expect(el.open).toBe(false);
            await open(el);
            expect(hex(el).value).toBe('#5c9a6a');
        });

        it('shows the colour a swatch chose', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            await typeInto(el, '#12');
            await userEvent.click(swatch(el, '#d49a3f'));
            await settle(el);
            expect(hex(el).value).toBe('#d49a3f');
        });
    });

    describe('the sampler', () => {
        const sampleTo = async (
            el: HmiColorPicker,
            colour: string,
            type: 'input' | 'change',
        ) => {
            sample(el).value = colour;
            sample(el).dispatchEvent(new Event(type, { bubbles: true }));
            await settle(el);
        };

        it('fires hmi-input for each move, and hmi-change when it commits', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            const events = log(el);
            await sampleTo(el, '#112233', 'input');
            await sampleTo(el, '#223344', 'input');
            expect(events).toEqual(['hmi-input #112233', 'hmi-input #223344']);
            expect(el.value).toBe('#223344');
            expect(hex(el).value).toBe('#223344');
            await sampleTo(el, '#223344', 'change');
            expect(events).toEqual([
                'hmi-input #112233',
                'hmi-input #223344',
                'hmi-change #223344',
            ]);
        });

        it('commits a colour that changed without an input event', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            const events = log(el);
            await sampleTo(el, '#112233', 'change');
            expect(events).toEqual(['hmi-input #112233', 'hmi-change #112233']);
        });

        it('does not repeat hmi-change for the colour already committed', async () => {
            const el = await plain('value="#5c9a6a"');
            await open(el);
            await sampleTo(el, '#112233', 'change');
            const events = log(el);
            await sampleTo(el, '#112233', 'change');
            expect(events).toEqual([]);
        });
    });

    describe('disabled', () => {
        it('boolean attribute presence', async () => {
            const el = await plain('disabled');
            expect(el.disabled).toBe(true);
            expect(trigger(el).disabled).toBe(true);
        });

        it('does not open, and closes a panel that is open', async () => {
            const el = await plain();
            await open(el);
            el.disabled = true;
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            el.open = true;
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            el.disabled = false;
            await settle(el);
            expect(trigger(el).disabled).toBe(false);
            await open(el);
            expect(el.open).toBe(true);
        });
    });

    describe('as a form control', () => {
        async function inForm(template: ReturnType<typeof html>) {
            const form = document.createElement('form');
            document.body.append(form);
            render(template, form);
            const el = form.querySelector('hmi-color-picker') as HmiColorPicker;
            await el.updateComplete;
            return { form, el };
        }

        it('submits the colour under its name, as #rrggbb', async () => {
            const { form, el } = await inForm(
                html`<hmi-color-picker name="brand"></hmi-color-picker>`,
            );
            expect(new FormData(form).get('brand')).toBe('#e87a5d');
            el.value = '#ABC';
            await el.updateComplete;
            expect(new FormData(form).get('brand')).toBe('#aabbcc');
        });

        it('submits what the user chose', async () => {
            const { form, el } = await inForm(
                html`<hmi-color-picker name="brand"></hmi-color-picker>`,
            );
            await open(el);
            await userEvent.click(swatch(el, '#5c9a6a'));
            await settle(el);
            expect(new FormData(form).get('brand')).toBe('#5c9a6a');
        });

        it('submits text that is not a hex as it is, and nothing for an empty value', async () => {
            const { form, el } = await inForm(
                html`<hmi-color-picker name="brand" value="red"></hmi-color-picker>`,
            );
            expect(new FormData(form).get('brand')).toBe('red');
            el.value = '';
            await el.updateComplete;
            expect(new FormData(form).has('brand')).toBe(false);
        });

        it('restores value on reset', async () => {
            const { form, el } = await inForm(
                html`<hmi-color-picker name="brand" value="#5c9a6a"></hmi-color-picker>`,
            );
            el.value = '#123456';
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('#5c9a6a');
            expect(text(part(el, 'value'))).toBe('#5c9a6a');
        });

        it('restores default-value on reset, and starts from it', async () => {
            const { form, el } = await inForm(
                html`<hmi-color-picker name="brand" default-value="#6b86b3"></hmi-color-picker>`,
            );
            expect(el.value).toBe('#6b86b3');
            el.value = '#123456';
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('#6b86b3');
        });

        it('restores its state', async () => {
            const { el } = await inForm(
                html`<hmi-color-picker name="brand"></hmi-color-picker>`,
            );
            el.formStateRestoreCallback('#123456');
            await el.updateComplete;
            expect(el.value).toBe('#123456');
        });

        it('is never invalid for required: it always holds a colour', async () => {
            const { form, el } = await inForm(
                html`<hmi-color-picker name="brand" required></hmi-color-picker>`,
            );
            expect(el.validity.valid).toBe(true);
            expect(form.checkValidity()).toBe(true);
        });

        it('is invalid with the message of a non-empty error, reported on the trigger', async () => {
            const { el } = await inForm(
                html`<hmi-color-picker name="brand" error="Too light"></hmi-color-picker>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Too light');
            expect(text(part(el, 'error'))).toBe('Too light');
            el.reportValidity();
            expect(focused(el)).toBe(trigger(el));
        });

        it('is not submitted, and the trigger is disabled, inside a disabled fieldset', async () => {
            const fieldset = document.createElement('fieldset');
            fieldset.disabled = true;
            document.body.append(fieldset);
            render(
                html`<hmi-color-picker name="brand"></hmi-color-picker>`,
                fieldset,
            );
            const el = fieldset.querySelector(
                'hmi-color-picker',
            ) as HmiColorPicker;
            await el.updateComplete;
            await el.updateComplete;
            expect(trigger(el).disabled).toBe(true);
        });

        it('closes when a fieldset disables it', async () => {
            const fieldset = document.createElement('fieldset');
            document.body.append(fieldset);
            render(html`<hmi-color-picker></hmi-color-picker>`, fieldset);
            const el = fieldset.querySelector(
                'hmi-color-picker',
            ) as HmiColorPicker;
            await el.updateComplete;
            await open(el);
            fieldset.disabled = true;
            await settle(el);
            expect(el.open).toBe(false);
        });
    });
});

describe('ColorPicker (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const onInput = vi.fn();
        const onChange = vi.fn();
        const onOpenChange = vi.fn();
        await act(async () => {
            root.render(
                createElement(ColorPicker, {
                    value: '#5c9a6a',
                    name: 'brand',
                    label: 'Brand',
                    swatches: ['#5c9a6a', '#6b86b3'],
                    hideInput: true,
                    onInput,
                    onChange,
                    onOpenChange,
                }),
            );
        });
        const el = host.querySelector('hmi-color-picker') as HmiColorPicker;
        await el.updateComplete;
        expect(el.value).toBe('#5c9a6a');
        expect(el.name).toBe('brand');
        expect(el.hideInput).toBe(true);
        expect(swatches(el)).toHaveLength(2);
        expect(text(part(el, 'value'))).toBe('#5c9a6a');
        await open(el);
        expect(onOpenChange).toHaveBeenCalledOnce();
        expect(onOpenChange.mock.calls[0]?.[0].detail).toEqual({ open: true });
        await userEvent.click(swatch(el, '#6b86b3'));
        await settle(el);
        expect(onInput).toHaveBeenCalledOnce();
        expect(onInput.mock.calls[0]?.[0].detail).toEqual({ value: '#6b86b3' });
        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange.mock.calls[0]?.[0].detail).toEqual({
            value: '#6b86b3',
        });
        expect(el.value).toBe('#6b86b3');
        await act(async () => root.unmount());
    });
});

// A picker without the `aria-label` that `plain` adds.
async function fixtureBare(): Promise<HmiColorPicker> {
    const host = document.createElement('div');
    host.innerHTML = `<hmi-color-picker></hmi-color-picker>${PAGE}`;
    document.body.append(host);
    const el = host.querySelector('hmi-color-picker') as HmiColorPicker;
    await el.updateComplete;
    return el;
}
