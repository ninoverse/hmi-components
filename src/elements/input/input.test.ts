import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './input.js';
import type { HmiInput, InputValueDetail } from './input.js';
import { Input } from './input.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiInput> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-input') as HmiInput;
    await el.updateComplete;
    return el;
}

const part = (el: HmiInput, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const field = (el: HmiInput) => part(el, 'control') as HTMLInputElement;

/** What the user does: type into the native input. */
async function type(el: HmiInput, value: string): Promise<void> {
    const input = field(el);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
}

function commit(el: HmiInput): void {
    field(el).dispatchEvent(new Event('change', { bubbles: true }));
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-input', () => {
    it('registers', () => {
        expect(customElements.get('hmi-input')).toBeDefined();
    });

    it('renders the field box at its height', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBe(40);
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        expect(el.value).toBe('');
        expect(el.type).toBe('text');
        expect(el.disabled).toBe(false);
        expect(el.readonly).toBe(false);
        expect(el.required).toBe(false);
        expect(el.error).toBe('');
        expect(el.placeholder).toBeUndefined();
        expect(el.defaultValue).toBeUndefined();
    });

    it('forwards its attributes to the native input', async () => {
        const el = await fixture(
            html`<hmi-input
                type="email"
                placeholder="you@studio.co"
                autocomplete="email"
                inputmode="email"
                pattern=".+@.+"
                minlength="3"
                maxlength="40"
                readonly
                required
            ></hmi-input>`,
        );
        const input = field(el);
        expect(input.type).toBe('email');
        expect(input.placeholder).toBe('you@studio.co');
        expect(input.getAttribute('autocomplete')).toBe('email');
        expect(input.getAttribute('inputmode')).toBe('email');
        expect(input.pattern).toBe('.+@.+');
        expect(input.minLength).toBe(3);
        expect(input.maxLength).toBe(40);
        expect(input.readOnly).toBe(true);
        expect(input.required).toBe(true);
    });

    it('reflects type, disabled, readonly and required', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        el.type = 'tel';
        el.disabled = el.readonly = el.required = true;
        await el.updateComplete;
        expect(el.getAttribute('type')).toBe('tel');
        for (const name of ['disabled', 'readonly', 'required']) {
            expect(el.hasAttribute(name)).toBe(true);
        }
    });

    it('takes its initial value from the attribute and keeps the native input in step', async () => {
        const el = await fixture(html`<hmi-input value="Ada"></hmi-input>`);
        expect(el.value).toBe('Ada');
        expect(field(el).value).toBe('Ada');
        el.value = 'Grace';
        await el.updateComplete;
        expect(field(el).value).toBe('Grace');
        await type(el, 'Gra');
        el.value = 'Grace';
        await el.updateComplete;
        expect(field(el).value).toBe('Grace');
    });

    it('fires hmi-input on every keystroke and hmi-change on commit', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        const log: string[] = [];
        el.addEventListener('hmi-input', (e) =>
            log.push(
                `input:${(e as CustomEvent<InputValueDetail>).detail.value}`,
            ),
        );
        el.addEventListener('hmi-change', (e) =>
            log.push(
                `change:${(e as CustomEvent<InputValueDetail>).detail.value}`,
            ),
        );
        await type(el, 'a');
        await type(el, 'ab');
        commit(el);
        expect(log).toEqual(['input:a', 'input:ab', 'change:ab']);
        expect(el.value).toBe('ab');
    });

    it('does not fire events when the value is set from code', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        let fired = 0;
        el.addEventListener('hmi-input', () => {
            fired += 1;
        });
        el.addEventListener('hmi-change', () => {
            fired += 1;
        });
        el.value = 'from code';
        await el.updateComplete;
        expect(fired).toBe(0);
    });

    it('lets a listener veto a change by setting the value back', async () => {
        const el = await fixture(html`<hmi-input value="ok"></hmi-input>`);
        el.addEventListener('hmi-input', () => {
            el.value = 'ok';
        });
        await type(el, 'nope');
        await el.updateComplete;
        expect(field(el).value).toBe('ok');
    });

    it('submits name and value with the form', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form>
                <hmi-input name="email" value="a@b.co"></hmi-input>
                <hmi-input name="note"></hmi-input>
            </form>`,
            host,
        );
        const form = host.querySelector('form') as HTMLFormElement;
        for (const el of host.querySelectorAll<HmiInput>('hmi-input')) {
            await el.updateComplete;
        }
        const note = host.querySelectorAll<HmiInput>(
            'hmi-input',
        )[1] as HmiInput;
        await type(note, 'hello');
        const data = new FormData(form);
        expect(data.get('email')).toBe('a@b.co');
        expect(data.get('note')).toBe('hello');
        expect(note.form).toBe(form);
    });

    it('restores the initial value on form reset', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-input name="n" value="Ada"></hmi-input></form>`,
            host,
        );
        const el = host.querySelector('hmi-input') as HmiInput;
        await el.updateComplete;
        await type(el, 'changed');
        (host.querySelector('form') as HTMLFormElement).reset();
        await el.updateComplete;
        expect(el.value).toBe('Ada');
        expect(field(el).value).toBe('Ada');
    });

    it('restores defaultValue on reset when it is set', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-input name="n" default-value="Initial"></hmi-input></form>`,
            host,
        );
        const el = host.querySelector('hmi-input') as HmiInput;
        await el.updateComplete;
        expect(el.value).toBe('Initial');
        await type(el, 'changed');
        (host.querySelector('form') as HTMLFormElement).reset();
        await el.updateComplete;
        expect(el.value).toBe('Initial');
    });

    it('is disabled by an ancestor fieldset without clearing its own disabled', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-input name="n"></hmi-input></fieldset>`,
            host,
        );
        const el = host.querySelector('hmi-input') as HmiInput;
        const fieldset = host.querySelector('fieldset') as HTMLFieldSetElement;
        await el.updateComplete;
        expect(field(el).disabled).toBe(false);
        fieldset.disabled = true;
        await el.updateComplete;
        expect(field(el).disabled).toBe(true);
        expect(el.disabled).toBe(false);
        fieldset.disabled = false;
        await el.updateComplete;
        expect(field(el).disabled).toBe(false);
    });

    it('is excluded from the form while disabled', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-input name="n" value="x" disabled></hmi-input></form>`,
            host,
        );
        await (host.querySelector('hmi-input') as HmiInput).updateComplete;
        expect(
            new FormData(host.querySelector('form') as HTMLFormElement).has(
                'n',
            ),
        ).toBe(false);
    });

    it('is invalid when required and empty, valid once it has a value', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-input name="n" required></hmi-input></form>`,
            host,
        );
        const el = host.querySelector('hmi-input') as HmiInput;
        const form = host.querySelector('form') as HTMLFormElement;
        await el.updateComplete;
        expect(el.validity.valueMissing).toBe(true);
        expect(el.validationMessage).not.toBe('');
        expect(form.checkValidity()).toBe(false);
        await type(el, 'x');
        expect(el.validity.valid).toBe(true);
        expect(form.checkValidity()).toBe(true);
    });

    it('uses the browser rules for type and pattern', async () => {
        const el = await fixture(
            html`<hmi-input type="email" value="nope"></hmi-input>`,
        );
        expect(el.validity.typeMismatch).toBe(true);
        el.value = 'a@b.co';
        await el.updateComplete;
        expect(el.validity.valid).toBe(true);
        el.pattern = '[0-9]+';
        await el.updateComplete;
        expect(el.validity.patternMismatch).toBe(true);
    });

    it('turns error into a custom validity error, a message and aria-invalid', async () => {
        const el = await fixture(
            html`<hmi-input name="n" value="x"></hmi-input>`,
        );
        expect(field(el).hasAttribute('aria-invalid')).toBe(false);
        el.error = 'Already taken';
        await el.updateComplete;
        expect(el.validity.customError).toBe(true);
        expect(el.validationMessage).toBe('Already taken');
        expect(field(el).getAttribute('aria-invalid')).toBe('true');
        const message = part(el, 'error');
        expect(message.textContent?.trim()).toBe('Already taken');
        expect(message.getAttribute('role')).toBe('alert');
        expect(field(el).getAttribute('aria-describedby')).toBe('error');
        el.error = '';
        await el.updateComplete;
        expect(el.validity.valid).toBe(true);
        expect(el.shadowRoot?.querySelector('[part~="error"]')).toBeNull();
    });

    it('draws the label tied to the field, with a required marker', async () => {
        const el = await fixture(
            html`<hmi-input label="Email" required></hmi-input>`,
        );
        const label = part(el, 'label') as HTMLLabelElement;
        expect(label.htmlFor).toBe('control');
        expect(label.textContent).toContain('Email');
        expect(
            label.querySelector('.required')?.getAttribute('aria-hidden'),
        ).toBe('true');
        expect(field(el).id).toBe('control');
    });

    it('shows the hint, and the error instead of it', async () => {
        const el = await fixture(
            html`<hmi-input hint="As on documents"></hmi-input>`,
        );
        expect(part(el, 'hint').textContent?.trim()).toBe('As on documents');
        expect(field(el).getAttribute('aria-describedby')).toBe('hint');
        el.error = 'Required';
        await el.updateComplete;
        expect(el.shadowRoot?.querySelector('[part~="hint"]')).toBeNull();
        expect(part(el, 'error')).not.toBeNull();
    });

    it('draws no label or message when there are none', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        expect(el.shadowRoot?.querySelector('[part~="label"]')).toBeNull();
        expect(el.shadowRoot?.querySelector('[part~="hint"]')).toBeNull();
        expect(field(el).hasAttribute('aria-describedby')).toBe(false);
    });

    it('is labelled by a label outside the element', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<label for="name">Name</label><hmi-input id="name"></hmi-input>`,
            host,
        );
        const el = host.querySelector('hmi-input') as HmiInput;
        await el.updateComplete;
        expect(el.labels).toHaveLength(1);
    });

    it('delegates focus to the native input', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        el.focus();
        expect(el.shadowRoot?.activeElement).toBe(field(el));
    });

    it('focuses the field when reportValidity finds it invalid', async () => {
        const el = await fixture(html`<hmi-input required></hmi-input>`);
        expect(el.reportValidity()).toBe(false);
        expect(el.shadowRoot?.activeElement).toBe(field(el));
    });

    it('slots icons before and after the text, sized in base units', async () => {
        const el = await fixture(
            html`<hmi-input>
                <svg slot="left-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
                <svg slot="right-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
            </hmi-input>`,
        );
        const assigned = (name: string) =>
            el.shadowRoot
                ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
                ?.assignedElements() ?? [];
        expect(assigned('left-icon')).toHaveLength(1);
        expect(assigned('right-icon')).toHaveLength(1);
        expect(
            (assigned('left-icon')[0] as Element).getBoundingClientRect().width,
        ).toBe(16);
    });

    it('draws the error border and a disabled look', async () => {
        const el = await fixture(html`<hmi-input></hmi-input>`);
        el.style.setProperty('--error', 'rgb(1, 2, 3)');
        el.style.setProperty('--outline-variant', 'rgb(9, 9, 9)');
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
        const typed: string[] = [];
        const committed: string[] = [];
        await act(async () => {
            createRoot(mount).render(
                createElement(Input, {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    value: 'a@b.co',
                    required: true,
                    onInput: (e) => typed.push(e.detail.value),
                    onChange: (e) => committed.push(e.detail.value),
                }),
            );
        });
        const el = mount.querySelector('hmi-input') as HmiInput;
        await el.updateComplete;
        expect(el.value).toBe('a@b.co');
        expect(el.type).toBe('email');
        expect(el.required).toBe(true);
        await type(el, 'x@y.co');
        commit(el);
        expect(typed).toEqual(['x@y.co']);
        expect(committed).toEqual(['x@y.co']);
    });
});
