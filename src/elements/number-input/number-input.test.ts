import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './number-input.js';
import type { HmiNumberInput, NumberInputValueDetail } from './number-input.js';
import { NumberInput } from './number-input.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiNumberInput> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-number-input') as HmiNumberInput;
    await el.updateComplete;
    return el;
}

const part = (el: HmiNumberInput, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const field = (el: HmiNumberInput) => part(el, 'control') as HTMLInputElement;
const up = (el: HmiNumberInput) => part(el, 'increase') as HTMLButtonElement;
const down = (el: HmiNumberInput) => part(el, 'decrease') as HTMLButtonElement;

/** What the user does: type into the native input. */
async function type(el: HmiNumberInput, text: string): Promise<void> {
    const input = field(el);
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
}

function commit(el: HmiNumberInput): void {
    field(el).dispatchEvent(new Event('change', { bubbles: true }));
}

function record(el: HmiNumberInput): string[] {
    const log: string[] = [];
    for (const type of ['hmi-input', 'hmi-change'] as const) {
        el.addEventListener(type, (e) =>
            log.push(
                `${type.slice(4)}:${(e as CustomEvent<NumberInputValueDetail>).detail.value}`,
            ),
        );
    }
    return log;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-number-input', () => {
    it('registers', () => {
        expect(customElements.get('hmi-number-input')).toBeDefined();
    });

    it('renders the field box at its height with a stepper column', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        const { height } = part(el, 'base').getBoundingClientRect();
        expect(height).toBe(40);
        expect(up(el).getBoundingClientRect().width).toBe(28);
        expect(field(el).type).toBe('number');
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        expect(el.value).toBeNull();
        expect(el.step).toBe(1);
        expect(el.min).toBeUndefined();
        expect(el.max).toBeUndefined();
        expect(el.defaultValue).toBeUndefined();
        expect(el.increaseLabel).toBe('Increase');
        expect(el.decreaseLabel).toBe('Decrease');
        expect(field(el).value).toBe('');
    });

    it('reads the value attribute as a number, and empty or non-numeric as null', async () => {
        const read = async (attr: string) =>
            (
                await fixture(
                    html`<hmi-number-input value=${attr}></hmi-number-input>`,
                )
            ).value;
        expect(await read('3')).toBe(3);
        expect(await read('-2.5')).toBe(-2.5);
        expect(await read('0')).toBe(0);
        expect(await read('')).toBeNull();
        expect(await read('abc')).toBeNull();
    });

    it('forwards min, max, step, placeholder, readonly and required to the native input', async () => {
        const el = await fixture(
            html`<hmi-number-input min="1" max="9" step="2" placeholder="Qty" readonly required></hmi-number-input>`,
        );
        const input = field(el);
        expect(input.min).toBe('1');
        expect(input.max).toBe('9');
        expect(input.step).toBe('2');
        expect(input.placeholder).toBe('Qty');
        expect(input.readOnly).toBe(true);
        expect(input.required).toBe(true);
    });

    it('shows the value and keeps the field in step with it', async () => {
        const el = await fixture(
            html`<hmi-number-input value="5"></hmi-number-input>`,
        );
        expect(field(el).value).toBe('5');
        el.value = 7;
        await el.updateComplete;
        expect(field(el).value).toBe('7');
        el.value = null;
        await el.updateComplete;
        expect(field(el).value).toBe('');
    });

    it('does not rewrite the text the user typed when it is the same number', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        await type(el, '1.0');
        expect(el.value).toBe(1);
        expect(field(el).value).toBe('1.0');
    });

    it('fires hmi-input on every edit with a number, and null when cleared', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        const log = record(el);
        await type(el, '1');
        await type(el, '12');
        await type(el, '');
        expect(log).toEqual(['input:1', 'input:12', 'input:null']);
        expect(el.value).toBeNull();
    });

    it('fires hmi-change once on commit', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        await type(el, '12');
        const log = record(el);
        commit(el);
        expect(log).toEqual(['change:12']);
    });

    it('clamps to min and max on commit, with a single hmi-change carrying the clamped value', async () => {
        const el = await fixture(
            html`<hmi-number-input min="1" max="10"></hmi-number-input>`,
        );
        await type(el, '50');
        const log = record(el);
        commit(el);
        await el.updateComplete;
        field(el).dispatchEvent(new FocusEvent('blur'));
        expect(log).toEqual(['change:10']);
        expect(el.value).toBe(10);
        expect(field(el).value).toBe('10');
        await type(el, '-4');
        commit(el);
        expect(el.value).toBe(1);
    });

    it('clamps a value set from code on blur, and reports it', async () => {
        const el = await fixture(
            html`<hmi-number-input max="10"></hmi-number-input>`,
        );
        el.value = 50;
        await el.updateComplete;
        const log = record(el);
        field(el).dispatchEvent(new FocusEvent('blur'));
        await el.updateComplete;
        expect(log).toEqual(['change:10']);
        expect(field(el).value).toBe('10');
    });

    it('does not report a blur that changes nothing', async () => {
        const el = await fixture(
            html`<hmi-number-input max="10" value="5"></hmi-number-input>`,
        );
        const log = record(el);
        field(el).dispatchEvent(new FocusEvent('blur'));
        expect(log).toEqual([]);
    });

    it('steps with the buttons, firing hmi-input then hmi-change', async () => {
        const el = await fixture(
            html`<hmi-number-input value="5" step="2"></hmi-number-input>`,
        );
        const log = record(el);
        up(el).click();
        await el.updateComplete;
        expect(log).toEqual(['input:7', 'change:7']);
        expect(field(el).value).toBe('7');
        down(el).click();
        down(el).click();
        await el.updateComplete;
        expect(el.value).toBe(3);
    });

    it('steps from the minimum, or 0, when empty', async () => {
        const withMin = await fixture(
            html`<hmi-number-input min="10"></hmi-number-input>`,
        );
        up(withMin).click();
        expect(withMin.value).toBe(11);
        const bare = await fixture(html`<hmi-number-input></hmi-number-input>`);
        down(bare).click();
        expect(bare.value).toBe(-1);
    });

    it('stops at the bounds and disables the button there', async () => {
        const el = await fixture(
            html`<hmi-number-input min="1" max="3" value="3"></hmi-number-input>`,
        );
        expect(up(el).disabled).toBe(true);
        expect(down(el).disabled).toBe(false);
        down(el).click();
        down(el).click();
        await el.updateComplete;
        expect(el.value).toBe(1);
        expect(down(el).disabled).toBe(true);
        expect(up(el).disabled).toBe(false);
    });

    it('rounds the stepper arithmetic to the decimals of the step', async () => {
        const el = await fixture(
            html`<hmi-number-input value="0.1" step="0.1"></hmi-number-input>`,
        );
        up(el).click();
        up(el).click();
        expect(el.value).toBe(0.3);
        down(el).click();
        expect(el.value).toBe(0.2);
    });

    it('disables the stepper buttons when disabled or readonly', async () => {
        const el = await fixture(
            html`<hmi-number-input value="5"></hmi-number-input>`,
        );
        el.readonly = true;
        await el.updateComplete;
        expect(up(el).disabled && down(el).disabled).toBe(true);
        el.readonly = false;
        el.disabled = true;
        await el.updateComplete;
        expect(up(el).disabled && down(el).disabled).toBe(true);
        expect(field(el).disabled).toBe(true);
    });

    it('takes its stepper labels from properties', async () => {
        const el = await fixture(
            html`<hmi-number-input increase-label="Plus" decrease-label="Minus"></hmi-number-input>`,
        );
        expect(up(el).getAttribute('aria-label')).toBe('Plus');
        expect(down(el).getAttribute('aria-label')).toBe('Minus');
        expect(up(el).getAttribute('tabindex')).toBe('-1');
    });

    it('does not fire events when the value is set from code', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        const log = record(el);
        el.value = 4;
        await el.updateComplete;
        expect(log).toEqual([]);
    });

    it('submits the number as a string, and nothing when empty', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form>
                <hmi-number-input id="a" name="a" value="5"></hmi-number-input>
                <hmi-number-input id="b" name="b"></hmi-number-input>
            </form>`,
            host,
        );
        const a = host.querySelector('#a') as HmiNumberInput;
        const b = host.querySelector('#b') as HmiNumberInput;
        await a.updateComplete;
        await b.updateComplete;
        const data = new FormData(
            host.querySelector('form') as HTMLFormElement,
        );
        expect(data.get('a')).toBe('5');
        expect(data.has('b')).toBe(false);
        await type(b, '0');
        expect(
            new FormData(host.querySelector('form') as HTMLFormElement).get(
                'b',
            ),
        ).toBe('0');
    });

    it('restores the initial value on form reset, or defaultValue when set', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form>
                <hmi-number-input id="a" name="a" value="2"></hmi-number-input>
                <hmi-number-input id="b" name="b" default-value="9"></hmi-number-input>
            </form>`,
            host,
        );
        const a = host.querySelector('#a') as HmiNumberInput;
        const b = host.querySelector('#b') as HmiNumberInput;
        await a.updateComplete;
        await b.updateComplete;
        expect(b.value).toBe(9);
        await type(a, '40');
        await type(b, '41');
        (host.querySelector('form') as HTMLFormElement).reset();
        await a.updateComplete;
        await b.updateComplete;
        expect(a.value).toBe(2);
        expect(b.value).toBe(9);
        expect(field(a).value).toBe('2');
    });

    it('is disabled by an ancestor fieldset without clearing its own disabled', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-number-input name="n"></hmi-number-input></fieldset>`,
            host,
        );
        const el = host.querySelector('hmi-number-input') as HmiNumberInput;
        const fieldset = host.querySelector('fieldset') as HTMLFieldSetElement;
        await el.updateComplete;
        fieldset.disabled = true;
        await el.updateComplete;
        expect(field(el).disabled).toBe(true);
        expect(up(el).disabled).toBe(true);
        expect(el.disabled).toBe(false);
        fieldset.disabled = false;
        await el.updateComplete;
        expect(field(el).disabled).toBe(false);
    });

    it('uses the browser rules for required, range and step', async () => {
        const el = await fixture(
            html`<hmi-number-input required min="1" max="10" step="2"></hmi-number-input>`,
        );
        expect(el.validity.valueMissing).toBe(true);
        el.value = 50;
        await el.updateComplete;
        expect(el.validity.rangeOverflow).toBe(true);
        el.value = 0;
        await el.updateComplete;
        expect(el.validity.rangeUnderflow).toBe(true);
        // steps count from the minimum: 1, 3, 5…
        el.value = 4;
        await el.updateComplete;
        expect(el.validity.stepMismatch).toBe(true);
        el.value = 3;
        await el.updateComplete;
        expect(el.validity.valid).toBe(true);
    });

    it('turns error into a custom validity error, a message and aria-invalid', async () => {
        const el = await fixture(
            html`<hmi-number-input value="3"></hmi-number-input>`,
        );
        el.error = 'Too many';
        await el.updateComplete;
        expect(el.validity.customError).toBe(true);
        expect(el.validationMessage).toBe('Too many');
        expect(field(el).getAttribute('aria-invalid')).toBe('true');
        expect(part(el, 'error').getAttribute('role')).toBe('alert');
    });

    it('draws the label tied to the field, and the hint', async () => {
        const el = await fixture(
            html`<hmi-number-input label="Quantity" hint="1 to 99" required></hmi-number-input>`,
        );
        expect((part(el, 'label') as HTMLLabelElement).htmlFor).toBe('control');
        expect(part(el, 'hint').textContent?.trim()).toBe('1 to 99');
        expect(field(el).getAttribute('aria-describedby')).toBe('hint');
    });

    it('delegates focus to the native input', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        el.focus();
        expect(el.shadowRoot?.activeElement).toBe(field(el));
    });

    it('draws the error border and a disabled look', async () => {
        const el = await fixture(html`<hmi-number-input></hmi-number-input>`);
        el.style.setProperty('--error', 'rgb(1, 2, 3)');
        el.error = 'Bad';
        await el.updateComplete;
        expect(getComputedStyle(part(el, 'base')).borderTopColor).toBe(
            'rgb(1, 2, 3)',
        );
        el.error = '';
        el.disabled = true;
        el.style.setProperty('--state-disabled-opacity', '0.4');
        await el.updateComplete;
        expect(getComputedStyle(part(el, 'base')).opacity).toBe('0.4');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        const typed: Array<number | null> = [];
        const committed: Array<number | null> = [];
        await act(async () => {
            createRoot(mount).render(
                createElement(NumberInput, {
                    name: 'qty',
                    label: 'Quantity',
                    min: 1,
                    max: 99,
                    value: 3,
                    onInput: (e) => typed.push(e.detail.value),
                    onChange: (e) => committed.push(e.detail.value),
                }),
            );
        });
        const el = mount.querySelector('hmi-number-input') as HmiNumberInput;
        await el.updateComplete;
        expect(el.value).toBe(3);
        expect(el.min).toBe(1);
        expect(el.max).toBe(99);
        up(el).click();
        expect(typed).toEqual([4]);
        expect(committed).toEqual([4]);
    });
});
