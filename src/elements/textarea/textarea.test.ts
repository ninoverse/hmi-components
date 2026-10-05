import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './textarea.js';
import type { HmiTextarea, TextareaValueDetail } from './textarea.js';
import { Textarea } from './textarea.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiTextarea> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-textarea') as HmiTextarea;
    await el.updateComplete;
    return el;
}

const part = (el: HmiTextarea, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const field = (el: HmiTextarea) => part(el, 'control') as HTMLTextAreaElement;

async function type(el: HmiTextarea, value: string): Promise<void> {
    const area = field(el);
    area.value = value;
    area.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
}

function commit(el: HmiTextarea): void {
    field(el).dispatchEvent(new Event('change', { bubbles: true }));
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-textarea', () => {
    it('registers', () => {
        expect(customElements.get('hmi-textarea')).toBeDefined();
    });

    it('renders a textarea at least 12 base units tall that is also the base part', async () => {
        const el = await fixture(html`<hmi-textarea></hmi-textarea>`);
        const { width, height } = field(el).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThanOrEqual(96);
        expect(part(el, 'base')).toBe(field(el));
        expect(getComputedStyle(field(el)).resize).toBe('vertical');
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-textarea></hmi-textarea>`);
        expect(el.value).toBe('');
        expect(el.disabled).toBe(false);
        expect(el.readonly).toBe(false);
        expect(el.required).toBe(false);
        expect(el.error).toBe('');
        expect(el.rows).toBeUndefined();
        expect(el.defaultValue).toBeUndefined();
    });

    it('forwards its attributes to the native textarea', async () => {
        const el = await fixture(
            html`<hmi-textarea
                placeholder="Tell us"
                autocomplete="off"
                rows="6"
                minlength="3"
                maxlength="240"
                readonly
                required
            ></hmi-textarea>`,
        );
        const area = field(el);
        expect(area.placeholder).toBe('Tell us');
        expect(area.getAttribute('autocomplete')).toBe('off');
        expect(area.rows).toBe(6);
        expect(area.minLength).toBe(3);
        expect(area.maxLength).toBe(240);
        expect(area.readOnly).toBe(true);
        expect(area.required).toBe(true);
    });

    it('reflects disabled, readonly and required', async () => {
        const el = await fixture(html`<hmi-textarea></hmi-textarea>`);
        el.disabled = el.readonly = el.required = true;
        await el.updateComplete;
        for (const name of ['disabled', 'readonly', 'required']) {
            expect(el.hasAttribute(name)).toBe(true);
        }
    });

    it('takes its initial value from the attribute and keeps the native textarea in step', async () => {
        const el = await fixture(
            html`<hmi-textarea value="Hello"></hmi-textarea>`,
        );
        expect(field(el).value).toBe('Hello');
        el.value = 'World';
        await el.updateComplete;
        expect(field(el).value).toBe('World');
    });

    it('fires hmi-input on every keystroke and hmi-change on commit', async () => {
        const el = await fixture(html`<hmi-textarea></hmi-textarea>`);
        const log: string[] = [];
        el.addEventListener('hmi-input', (e) =>
            log.push(
                `input:${(e as CustomEvent<TextareaValueDetail>).detail.value}`,
            ),
        );
        el.addEventListener('hmi-change', (e) =>
            log.push(
                `change:${(e as CustomEvent<TextareaValueDetail>).detail.value}`,
            ),
        );
        await type(el, 'a');
        await type(el, 'a\nb');
        commit(el);
        expect(log).toEqual(['input:a', 'input:a\nb', 'change:a\nb']);
        expect(el.value).toBe('a\nb');
    });

    it('does not fire events when the value is set from code', async () => {
        const el = await fixture(html`<hmi-textarea></hmi-textarea>`);
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

    it('submits name and value with the form, line breaks as LF', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-textarea name="bio"></hmi-textarea></form>`,
            host,
        );
        const el = host.querySelector('hmi-textarea') as HmiTextarea;
        await el.updateComplete;
        await type(el, 'line one\nline two');
        const data = new FormData(
            host.querySelector('form') as HTMLFormElement,
        );
        expect(data.get('bio')).toBe('line one\nline two');
        expect(el.form).toBe(host.querySelector('form'));
    });

    it('restores the initial value on form reset, or defaultValue when set', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form>
                <hmi-textarea id="a" name="a" value="First"></hmi-textarea>
                <hmi-textarea id="b" name="b" default-value="Second"></hmi-textarea>
            </form>`,
            host,
        );
        const a = host.querySelector('#a') as HmiTextarea;
        const b = host.querySelector('#b') as HmiTextarea;
        await a.updateComplete;
        await b.updateComplete;
        expect(b.value).toBe('Second');
        await type(a, 'changed');
        await type(b, 'changed');
        (host.querySelector('form') as HTMLFormElement).reset();
        await a.updateComplete;
        await b.updateComplete;
        expect(a.value).toBe('First');
        expect(b.value).toBe('Second');
    });

    it('is disabled by an ancestor fieldset without clearing its own disabled', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-textarea name="n"></hmi-textarea></fieldset>`,
            host,
        );
        const el = host.querySelector('hmi-textarea') as HmiTextarea;
        const fieldset = host.querySelector('fieldset') as HTMLFieldSetElement;
        await el.updateComplete;
        fieldset.disabled = true;
        await el.updateComplete;
        expect(field(el).disabled).toBe(true);
        expect(el.disabled).toBe(false);
        fieldset.disabled = false;
        await el.updateComplete;
        expect(field(el).disabled).toBe(false);
    });

    it('is invalid when required and empty, valid once it has a value', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-textarea name="n" required></hmi-textarea></form>`,
            host,
        );
        const el = host.querySelector('hmi-textarea') as HmiTextarea;
        await el.updateComplete;
        expect(el.validity.valueMissing).toBe(true);
        expect(
            (host.querySelector('form') as HTMLFormElement).checkValidity(),
        ).toBe(false);
        await type(el, 'x');
        expect(el.validity.valid).toBe(true);
    });

    it('turns error into a custom validity error, a message and aria-invalid', async () => {
        const el = await fixture(html`<hmi-textarea value="x"></hmi-textarea>`);
        el.error = 'Describe the issue';
        await el.updateComplete;
        expect(el.validity.customError).toBe(true);
        expect(el.validationMessage).toBe('Describe the issue');
        expect(field(el).getAttribute('aria-invalid')).toBe('true');
        expect(part(el, 'error').getAttribute('role')).toBe('alert');
        expect(field(el).getAttribute('aria-describedby')).toBe('error');
        el.error = '';
        await el.updateComplete;
        expect(el.validity.valid).toBe(true);
        expect(el.shadowRoot?.querySelector('[part~="error"]')).toBeNull();
    });

    it('draws the label tied to the field, the hint, and the error instead of it', async () => {
        const el = await fixture(
            html`<hmi-textarea label="About you" hint="240 max" required></hmi-textarea>`,
        );
        const label = part(el, 'label') as HTMLLabelElement;
        expect(label.htmlFor).toBe('control');
        expect(field(el).id).toBe('control');
        expect(part(el, 'hint').textContent?.trim()).toBe('240 max');
        el.error = 'Required';
        await el.updateComplete;
        expect(el.shadowRoot?.querySelector('[part~="hint"]')).toBeNull();
    });

    it('delegates focus and focuses the field when reportValidity finds it invalid', async () => {
        const el = await fixture(html`<hmi-textarea required></hmi-textarea>`);
        el.focus();
        expect(el.shadowRoot?.activeElement).toBe(field(el));
        field(el).blur();
        expect(el.reportValidity()).toBe(false);
        expect(el.shadowRoot?.activeElement).toBe(field(el));
    });

    it('draws the error border and a disabled look', async () => {
        const el = await fixture(html`<hmi-textarea></hmi-textarea>`);
        el.style.setProperty('--error', 'rgb(1, 2, 3)');
        el.error = 'Bad';
        await el.updateComplete;
        expect(getComputedStyle(field(el)).borderTopColor).toBe('rgb(1, 2, 3)');
        el.error = '';
        el.disabled = true;
        el.style.setProperty('--state-disabled-opacity', '0.4');
        await el.updateComplete;
        expect(getComputedStyle(field(el)).opacity).toBe('0.4');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        const typed: string[] = [];
        const committed: string[] = [];
        await act(async () => {
            createRoot(mount).render(
                createElement(Textarea, {
                    name: 'bio',
                    label: 'About you',
                    rows: 4,
                    value: 'Hi',
                    onInput: (e) => typed.push(e.detail.value),
                    onChange: (e) => committed.push(e.detail.value),
                }),
            );
        });
        const el = mount.querySelector('hmi-textarea') as HmiTextarea;
        await el.updateComplete;
        expect(el.value).toBe('Hi');
        expect(el.rows).toBe(4);
        await type(el, 'Hello');
        commit(el);
        expect(typed).toEqual(['Hello']);
        expect(committed).toEqual(['Hello']);
    });
});
