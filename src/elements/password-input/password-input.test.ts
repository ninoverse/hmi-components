import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './password-input.js';
import type {
    HmiPasswordInput,
    PasswordInputValueDetail,
} from './password-input.js';
import { PasswordInput } from './password-input.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiPasswordInput> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-password-input') as HmiPasswordInput;
    await el.updateComplete;
    return el;
}

const part = (el: HmiPasswordInput, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const field = (el: HmiPasswordInput) => part(el, 'control') as HTMLInputElement;
const toggle = (el: HmiPasswordInput) =>
    part(el, 'toggle') as HTMLButtonElement;

async function type(el: HmiPasswordInput, value: string): Promise<void> {
    const input = field(el);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-password-input', () => {
    it('registers', () => {
        expect(customElements.get('hmi-password-input')).toBeDefined();
    });

    it('renders the field box at its height, as a password field', async () => {
        const el = await fixture(
            html`<hmi-password-input></hmi-password-input>`,
        );
        expect(part(el, 'base').getBoundingClientRect().height).toBe(40);
        expect(field(el).type).toBe('password');
    });

    it('has defaults', async () => {
        const el = await fixture(
            html`<hmi-password-input></hmi-password-input>`,
        );
        expect(el.showLabel).toBe('Show password');
        expect(el.hideLabel).toBe('Hide password');
        expect(toggle(el).getAttribute('aria-label')).toBe('Show password');
        expect(toggle(el).getAttribute('aria-pressed')).toBe('false');
        expect(toggle(el).type).toBe('button');
    });

    it('reveals and hides the password with the toggle, keeping the value', async () => {
        const el = await fixture(
            html`<hmi-password-input value="secret"></hmi-password-input>`,
        );
        toggle(el).click();
        await el.updateComplete;
        expect(field(el).type).toBe('text');
        expect(field(el).value).toBe('secret');
        expect(toggle(el).getAttribute('aria-pressed')).toBe('true');
        expect(toggle(el).getAttribute('aria-label')).toBe('Hide password');
        toggle(el).click();
        await el.updateComplete;
        expect(field(el).type).toBe('password');
        expect(el.value).toBe('secret');
        expect(toggle(el).getAttribute('aria-label')).toBe('Show password');
    });

    it('takes the toggle labels from properties', async () => {
        const el = await fixture(
            html`<hmi-password-input show-label="Mostrar" hide-label="Ocultar"></hmi-password-input>`,
        );
        expect(toggle(el).getAttribute('aria-label')).toBe('Mostrar');
        toggle(el).click();
        await el.updateComplete;
        expect(toggle(el).getAttribute('aria-label')).toBe('Ocultar');
    });

    it('ignores the type property', async () => {
        const el = await fixture(
            html`<hmi-password-input type="text"></hmi-password-input>`,
        );
        expect(field(el).type).toBe('password');
    });

    it('disables the toggle while the field is disabled, but not while it is readonly', async () => {
        const el = await fixture(
            html`<hmi-password-input value="x"></hmi-password-input>`,
        );
        el.readonly = true;
        await el.updateComplete;
        expect(toggle(el).disabled).toBe(false);
        el.readonly = false;
        el.disabled = true;
        await el.updateComplete;
        expect(toggle(el).disabled).toBe(true);
        expect(field(el).disabled).toBe(true);
    });

    it('is disabled by an ancestor fieldset', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-password-input name="n"></hmi-password-input></fieldset>`,
            host,
        );
        const el = host.querySelector('hmi-password-input') as HmiPasswordInput;
        await el.updateComplete;
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await el.updateComplete;
        expect(toggle(el).disabled).toBe(true);
    });

    it('has the left-icon slot but no right-icon slot', async () => {
        const el = await fixture(
            html`<hmi-password-input>
                <svg slot="left-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
            </hmi-password-input>`,
        );
        const slot = (name: string) =>
            el.shadowRoot?.querySelector<HTMLSlotElement>(
                `slot[name="${name}"]`,
            );
        expect(slot('left-icon')?.assignedElements()).toHaveLength(1);
        expect(slot('right-icon')).toBeNull();
    });

    it('sizes the toggle icon in base units', async () => {
        const el = await fixture(
            html`<hmi-password-input></hmi-password-input>`,
        );
        expect(
            (toggle(el).querySelector('svg') as Element).getBoundingClientRect()
                .width,
        ).toBe(16);
    });

    it('fires hmi-input and hmi-change like hmi-input, and submits the same value either way', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-password-input name="pw"></hmi-password-input></form>`,
            host,
        );
        const el = host.querySelector('hmi-password-input') as HmiPasswordInput;
        await el.updateComplete;
        const log: string[] = [];
        el.addEventListener('hmi-input', (e) =>
            log.push(
                `input:${(e as CustomEvent<PasswordInputValueDetail>).detail.value}`,
            ),
        );
        el.addEventListener('hmi-change', (e) =>
            log.push(
                `change:${(e as CustomEvent<PasswordInputValueDetail>).detail.value}`,
            ),
        );
        await type(el, 'hunter2');
        field(el).dispatchEvent(new Event('change', { bubbles: true }));
        expect(log).toEqual(['input:hunter2', 'change:hunter2']);
        const form = host.querySelector('form') as HTMLFormElement;
        expect(new FormData(form).get('pw')).toBe('hunter2');
        toggle(el).click();
        await el.updateComplete;
        expect(new FormData(form).get('pw')).toBe('hunter2');
        form.reset();
        await el.updateComplete;
        expect(el.value).toBe('');
    });

    it('shows the error message and marks the field invalid', async () => {
        const el = await fixture(
            html`<hmi-password-input label="Password" error="Must include a number."></hmi-password-input>`,
        );
        expect(part(el, 'error').textContent?.trim()).toBe(
            'Must include a number.',
        );
        expect(field(el).getAttribute('aria-invalid')).toBe('true');
        expect(el.validity.customError).toBe(true);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        const typed: string[] = [];
        await act(async () => {
            createRoot(mount).render(
                createElement(PasswordInput, {
                    name: 'pw',
                    label: 'Password',
                    value: 'abc',
                    showLabel: 'Show',
                    onInput: (e) => typed.push(e.detail.value),
                }),
            );
        });
        const el = mount.querySelector(
            'hmi-password-input',
        ) as HmiPasswordInput;
        await el.updateComplete;
        expect(el.value).toBe('abc');
        expect(toggle(el).getAttribute('aria-label')).toBe('Show');
        await type(el, 'abcd');
        expect(typed).toEqual(['abcd']);
    });
});
