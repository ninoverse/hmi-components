import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './multi-input.js';
import type { HmiMultiInput, MultiInputValueDetail } from './multi-input.js';
import { MultiInput } from './multi-input.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiMultiInput> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-multi-input') as HmiMultiInput;
    await el.updateComplete;
    return el;
}

const cells = (el: HmiMultiInput) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLInputElement>('[part~="cell"]') ??
            [],
    );
const part = (el: HmiMultiInput, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const values = (el: HmiMultiInput) => cells(el).map((c) => c.value);

async function type(el: HmiMultiInput, index: number, text: string) {
    const cell = cells(el)[index] as HTMLInputElement;
    cell.value = text;
    cell.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
}

async function key(el: HmiMultiInput, index: number, k: string) {
    const cell = cells(el)[index] as HTMLInputElement;
    const event = new KeyboardEvent('keydown', {
        key: k,
        bubbles: true,
        cancelable: true,
    });
    cell.dispatchEvent(event);
    await el.updateComplete;
    return event;
}

async function paste(el: HmiMultiInput, index: number, text: string) {
    const cell = cells(el)[index] as HTMLInputElement;
    const data = new DataTransfer();
    data.setData('text', text);
    const event = new ClipboardEvent('paste', {
        clipboardData: data,
        bubbles: true,
        cancelable: true,
    });
    cell.dispatchEvent(event);
    await el.updateComplete;
    return event;
}

const active = (el: HmiMultiInput) => el.shadowRoot?.activeElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-multi-input', () => {
    it('registers', () => {
        expect(customElements.get('hmi-multi-input')).toBeDefined();
    });

    it('has defaults: six numeric cells at the React size', async () => {
        const el = await fixture(html`<hmi-multi-input></hmi-multi-input>`);
        expect(el.length).toBe(6);
        expect(el.type).toBe('numeric');
        expect(el.separator).toBe('–');
        expect(el.autocomplete).toBe('off');
        expect(cells(el)).toHaveLength(6);
        const box = (cells(el)[0] as HTMLElement).getBoundingClientRect();
        expect([box.width, box.height]).toEqual([40, 48]);
        expect(cells(el)[0]?.getAttribute('inputmode')).toBe('numeric');
        expect(cells(el)[2]?.getAttribute('aria-label')).toBe('Segment 3 of 6');
        expect(part(el, 'base').getAttribute('aria-label')).toBe(
            'Segmented input',
        );
    });

    it('names the group by the label, else the host aria-label', async () => {
        const labelled = await fixture(
            html`<hmi-multi-input label="Code"></hmi-multi-input>`,
        );
        const base = part(labelled, 'base');
        expect(base.getAttribute('aria-labelledby')).toBe('label');
        expect(base.hasAttribute('aria-label')).toBe(false);
        const named = await fixture(
            html`<hmi-multi-input aria-label="PIN"></hmi-multi-input>`,
        );
        expect(part(named, 'base').getAttribute('aria-label')).toBe('PIN');
    });

    it('spreads the value over the cells and clips a long one', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4" value="123456"></hmi-multi-input>`,
        );
        expect(values(el)).toEqual(['1', '2', '3', '4']);
    });

    it('inserts a separator every group-size cells', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="6" group-size="3" separator="/"></hmi-multi-input>`,
        );
        const seps = el.shadowRoot?.querySelectorAll('[part~="separator"]');
        expect(seps).toHaveLength(1);
        expect(seps?.[0]?.textContent).toBe('/');
        expect(seps?.[0]?.getAttribute('aria-hidden')).toBe('true');
    });

    it('masks the cells', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4" mask></hmi-multi-input>`,
        );
        expect(cells(el)[0]?.type).toBe('password');
    });

    it('gives only the first cell the autocomplete hint', async () => {
        const el = await fixture(
            html`<hmi-multi-input autocomplete="one-time-code"></hmi-multi-input>`,
        );
        expect(cells(el)[0]?.autocomplete).toBe('one-time-code');
        expect(cells(el)[1]?.autocomplete).toBe('off');
    });

    it('advances after a character and fires hmi-input with the value', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4"></hmi-multi-input>`,
        );
        const seen: string[] = [];
        el.addEventListener('hmi-input', (e) =>
            seen.push((e as CustomEvent<MultiInputValueDetail>).detail.value),
        );
        await type(el, 0, '1');
        expect(el.value).toBe('1');
        expect(active(el)).toBe(cells(el)[1]);
        await type(el, 1, '2');
        expect(seen).toEqual(['1', '12']);
    });

    it('rejects a character the type refuses and restores the cell', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4" value="1"></hmi-multi-input>`,
        );
        let fired = 0;
        el.addEventListener('hmi-input', () => fired++);
        await type(el, 1, 'a');
        expect(el.value).toBe('1');
        expect(cells(el)[1]?.value).toBe('');
        await type(el, 0, 'x');
        expect(cells(el)[0]?.value).toBe('1');
        expect(fired).toBe(0);
    });

    it('takes any non-space character for type="text", and the pattern over the type', async () => {
        const text = await fixture(
            html`<hmi-multi-input length="3" type="text"></hmi-multi-input>`,
        );
        await type(text, 0, 'a');
        await type(text, 1, ' ');
        expect(text.value).toBe('a');
        const hex = await fixture(
            html`<hmi-multi-input length="3" pattern="[0-9a-f]"></hmi-multi-input>`,
        );
        await type(hex, 0, 'f');
        await type(hex, 1, 'g');
        expect(hex.value).toBe('f');
    });

    it('takes a RegExp as the pattern property', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="3"></hmi-multi-input>`,
        );
        el.pattern = /^[A-Z]$/;
        await el.updateComplete;
        await type(el, 0, 'a');
        await type(el, 0, 'Q');
        expect(el.value).toBe('Q');
    });

    it('clears a cell when it is emptied, and stays put', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4" value="123"></hmi-multi-input>`,
        );
        await type(el, 2, '');
        expect(el.value).toBe('12');
    });

    it('moves back and clears on Backspace in an empty cell', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4" value="12"></hmi-multi-input>`,
        );
        const event = await key(el, 2, 'Backspace');
        expect(event.defaultPrevented).toBe(true);
        expect(el.value).toBe('1');
        expect(active(el)).toBe(cells(el)[1]);
        const filled = await key(el, 0, 'Backspace');
        expect(filled.defaultPrevented).toBe(false);
    });

    it('navigates with the arrow keys, Home and End', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4"></hmi-multi-input>`,
        );
        await key(el, 0, 'ArrowRight');
        expect(active(el)).toBe(cells(el)[1]);
        await key(el, 1, 'ArrowLeft');
        expect(active(el)).toBe(cells(el)[0]);
        await key(el, 0, 'End');
        expect(active(el)).toBe(cells(el)[3]);
        await key(el, 3, 'Home');
        expect(active(el)).toBe(cells(el)[0]);
        const edge = await key(el, 0, 'ArrowLeft');
        expect(edge.defaultPrevented).toBe(false);
    });

    it('fills from the focused cell on paste, dropping rejected characters', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="6"></hmi-multi-input>`,
        );
        const event = await paste(el, 1, '12-34');
        expect(event.defaultPrevented).toBe(true);
        expect(el.value).toBe('1234');
        // Like v5, the value is the cells joined, so a gap closes up.
        expect(values(el)).toEqual(['1', '2', '3', '4', '', '']);
    });

    it('focuses the last cell after a paste that fills the code', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4"></hmi-multi-input>`,
        );
        await paste(el, 0, '123456');
        expect(el.value).toBe('1234');
        expect(active(el)).toBe(cells(el)[3]);
    });

    it('distributes a multi-character input, as a one-time-code autofill sends it', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="6"></hmi-multi-input>`,
        );
        await type(el, 0, '482913');
        expect(el.value).toBe('482913');
        expect(values(el)).toEqual(['4', '8', '2', '9', '1', '3']);
    });

    it('fires hmi-complete when every cell is filled', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="3" value="12"></hmi-multi-input>`,
        );
        const seen: string[] = [];
        el.addEventListener('hmi-complete', (e) =>
            seen.push((e as CustomEvent<MultiInputValueDetail>).detail.value),
        );
        await type(el, 1, '2');
        expect(seen).toEqual([]);
        await type(el, 2, '3');
        expect(seen).toEqual(['123']);
    });

    it('fires hmi-change once when focus leaves the group after a change', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="3"></hmi-multi-input>`,
        );
        const seen: string[] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push((e as CustomEvent<MultiInputValueDetail>).detail.value),
        );
        (cells(el)[0] as HTMLElement).focus();
        await type(el, 0, '1');
        await type(el, 1, '2');
        expect(seen).toEqual([]);
        (cells(el)[2] as HTMLElement).blur();
        expect(seen).toEqual(['12']);
        (cells(el)[2] as HTMLElement).focus();
        (cells(el)[2] as HTMLElement).blur();
        expect(seen).toEqual(['12']);
    });

    it('selects the cell text on focus', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="3" value="123"></hmi-multi-input>`,
        );
        const cell = cells(el)[1] as HTMLInputElement;
        cell.focus();
        expect([cell.selectionStart, cell.selectionEnd]).toEqual([0, 1]);
    });

    it('focuses the first cell for autofocus', async () => {
        const el = await fixture(
            html`<hmi-multi-input autofocus></hmi-multi-input>`,
        );
        expect(active(el)).toBe(cells(el)[0]);
    });

    it('ignores edits through paste and Backspace while readonly', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="4" value="12" readonly></hmi-multi-input>`,
        );
        expect(cells(el)[0]?.readOnly).toBe(true);
        await paste(el, 0, '9999');
        await key(el, 2, 'Backspace');
        expect(el.value).toBe('12');
    });

    it('disables the cells, also by an ancestor fieldset', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-multi-input name="n" length="2"></hmi-multi-input></fieldset>`,
            host,
        );
        const el = host.querySelector('hmi-multi-input') as HmiMultiInput;
        await el.updateComplete;
        expect(cells(el)[0]?.disabled).toBe(false);
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await el.updateComplete;
        expect(cells(el).every((c) => c.disabled)).toBe(true);
    });

    it('uses segment-label for the cell names', async () => {
        const el = await fixture(
            html`<hmi-multi-input length="2" segment-label="Casilla {n} de {total}"></hmi-multi-input>`,
        );
        expect(cells(el)[1]?.getAttribute('aria-label')).toBe('Casilla 2 de 2');
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector('hmi-multi-input') as HmiMultiInput;
            await el.updateComplete;
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits the joined cells under its name', async () => {
            const { form, el } = await formFixture(
                html`<hmi-multi-input name="code" length="4"></hmi-multi-input>`,
            );
            await type(el, 0, '1');
            await type(el, 1, '2');
            expect(new FormData(form).get('code')).toBe('12');
        });

        it('restores the initial value on reset', async () => {
            const { form, el } = await formFixture(
                html`<hmi-multi-input name="code" length="4" value="12"></hmi-multi-input>`,
            );
            await type(el, 2, '3');
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('12');
            expect(values(el)).toEqual(['1', '2', '', '']);
        });

        it('restores default-value on reset', async () => {
            const { form, el } = await formFixture(
                html`<hmi-multi-input name="code" length="4" default-value="99"></hmi-multi-input>`,
            );
            expect(el.value).toBe('99');
            await type(el, 2, '3');
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('99');
        });

        it('is invalid while required and incomplete, and focuses the first gap', async () => {
            const { el } = await formFixture(
                html`<hmi-multi-input name="code" length="3" value="12" required></hmi-multi-input>`,
            );
            expect(el.checkValidity()).toBe(false);
            expect(el.validity.valueMissing).toBe(true);
            el.reportValidity();
            expect(active(el)).toBe(cells(el)[2]);
            await type(el, 2, '3');
            expect(el.checkValidity()).toBe(true);
        });

        it('is valid when empty and not required', async () => {
            const { el } = await formFixture(
                html`<hmi-multi-input name="code"></hmi-multi-input>`,
            );
            expect(el.checkValidity()).toBe(true);
        });

        it('is invalid with the error text, and marks the cells', async () => {
            const { el } = await formFixture(
                html`<hmi-multi-input name="code" value="123456" error="Expired"></hmi-multi-input>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Expired');
            expect(cells(el)[0]?.getAttribute('aria-invalid')).toBe('true');
            expect(part(el, 'error').textContent?.trim()).toBe('Expired');
            expect(part(el, 'base').getAttribute('aria-describedby')).toBe(
                'error',
            );
        });

        it('submits nothing while disabled', async () => {
            const { form } = await formFixture(
                html`<hmi-multi-input name="code" value="12" disabled></hmi-multi-input>`,
            );
            expect(new FormData(form).has('code')).toBe(false);
        });
    });
});

describe('MultiInput (React wrapper)', () => {
    it('maps onInput, onChange and onComplete to the events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const inputs: string[] = [];
        const completes: string[] = [];
        await act(async () => {
            root.render(
                createElement(MultiInput, {
                    length: 2,
                    onInput: (e) => inputs.push(e.detail.value),
                    onComplete: (e) => completes.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector('hmi-multi-input') as HmiMultiInput;
        await el.updateComplete;
        await type(el, 0, '4');
        await type(el, 1, '2');
        expect(inputs).toEqual(['4', '42']);
        expect(completes).toEqual(['42']);
        await act(async () => root.unmount());
    });
});
