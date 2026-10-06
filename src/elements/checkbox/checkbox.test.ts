import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './checkbox.js';
import type { HmiCheckbox } from './checkbox.js';
import { Checkbox } from './checkbox.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiCheckbox> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-checkbox') as HmiCheckbox;
    await el.updateComplete;
    return el;
}

const part = (el: HmiCheckbox, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const input = (el: HmiCheckbox) =>
    el.shadowRoot?.querySelector('input') as HTMLInputElement;

/** A user toggle: the native input's click, which fires `change`. */
async function toggle(el: HmiCheckbox) {
    input(el).click();
    await el.updateComplete;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-checkbox', () => {
    it('registers', () => {
        expect(customElements.get('hmi-checkbox')).toBeDefined();
    });

    it('has defaults: off, submitting "on"', async () => {
        const el = await fixture(html`<hmi-checkbox></hmi-checkbox>`);
        expect(el.checked).toBe(false);
        expect(el.value).toBe('on');
        expect(input(el).checked).toBe(false);
        expect(input(el).type).toBe('checkbox');
        const box = part(el, 'box').getBoundingClientRect();
        expect([box.width, box.height]).toEqual([20, 20]);
    });

    it('shows the label text, and hides the label part without one', async () => {
        const el = await fixture(
            html`<hmi-checkbox label="Accept"></hmi-checkbox>`,
        );
        expect(part(el, 'label').textContent?.trim()).toBe('Accept');
        expect(part(el, 'label').hidden).toBe(false);
        const bare = await fixture(html`<hmi-checkbox></hmi-checkbox>`);
        expect(part(bare, 'label').hidden).toBe(true);
    });

    it('takes a rich label from the default slot', async () => {
        const el = await fixture(
            html`<hmi-checkbox>I agree to the <a href="#x">terms</a></hmi-checkbox>`,
        );
        await el.updateComplete;
        expect(part(el, 'label').hidden).toBe(false);
        const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
    });

    it('toggles on a click anywhere on the row, and fires hmi-change with checked', async () => {
        const el = await fixture(
            html`<hmi-checkbox label="Accept"></hmi-checkbox>`,
        );
        const seen: boolean[] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push((e as CustomEvent<{ checked: boolean }>).detail.checked),
        );
        part(el, 'label').click();
        await el.updateComplete;
        expect(el.checked).toBe(true);
        expect(el.hasAttribute('checked')).toBe(true);
        await toggle(el);
        expect(el.checked).toBe(false);
        expect(seen).toEqual([true, false]);
    });

    it('shows the initial state from the checked attribute', async () => {
        const el = await fixture(html`<hmi-checkbox checked></hmi-checkbox>`);
        expect(input(el).checked).toBe(true);
    });

    it('lets a listener veto a toggle by setting checked back', async () => {
        const el = await fixture(html`<hmi-checkbox></hmi-checkbox>`);
        el.addEventListener('hmi-change', () => {
            el.checked = false;
        });
        await toggle(el);
        await el.updateComplete;
        expect(el.checked).toBe(false);
        expect(input(el).checked).toBe(false);
    });

    it('follows checked set from outside, without firing hmi-change', async () => {
        const el = await fixture(html`<hmi-checkbox></hmi-checkbox>`);
        let fired = 0;
        el.addEventListener('hmi-change', () => fired++);
        el.checked = true;
        await el.updateComplete;
        expect(input(el).checked).toBe(true);
        expect(fired).toBe(0);
    });

    it('does not toggle while disabled, also by an ancestor fieldset', async () => {
        const el = await fixture(html`<hmi-checkbox disabled></hmi-checkbox>`);
        expect(input(el).disabled).toBe(true);
        await toggle(el);
        expect(el.checked).toBe(false);
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-checkbox name="n"></hmi-checkbox></fieldset>`,
            host,
        );
        const inner = host.querySelector('hmi-checkbox') as HmiCheckbox;
        await inner.updateComplete;
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await inner.updateComplete;
        expect(input(inner).disabled).toBe(true);
    });

    it('focuses the native input, so Space toggles it', async () => {
        const el = await fixture(html`<hmi-checkbox label="x"></hmi-checkbox>`);
        input(el).focus();
        expect(el.shadowRoot?.activeElement).toBe(input(el));
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector('hmi-checkbox') as HmiCheckbox;
            await el.updateComplete;
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits name=value while checked, and nothing while unchecked', async () => {
            const { form, el } = await formFixture(
                html`<hmi-checkbox name="opt" value="yes"></hmi-checkbox>`,
            );
            expect(new FormData(form).has('opt')).toBe(false);
            await toggle(el);
            expect(new FormData(form).get('opt')).toBe('yes');
        });

        it('submits "on" without a value', async () => {
            const { form } = await formFixture(
                html`<hmi-checkbox name="opt" checked></hmi-checkbox>`,
            );
            expect(new FormData(form).get('opt')).toBe('on');
        });

        it('restores the initial state on reset', async () => {
            const { form, el } = await formFixture(
                html`<hmi-checkbox name="opt" checked></hmi-checkbox>`,
            );
            await toggle(el);
            expect(el.checked).toBe(false);
            form.reset();
            await el.updateComplete;
            expect(el.checked).toBe(true);
        });

        it('restores default-checked on reset', async () => {
            const { form, el } = await formFixture(
                html`<hmi-checkbox name="opt" default-checked></hmi-checkbox>`,
            );
            expect(el.checked).toBe(true);
            await toggle(el);
            form.reset();
            await el.updateComplete;
            expect(el.checked).toBe(true);
        });

        it('is invalid while required and unchecked', async () => {
            const { el } = await formFixture(
                html`<hmi-checkbox name="opt" required></hmi-checkbox>`,
            );
            expect(el.checkValidity()).toBe(false);
            expect(el.validity.valueMissing).toBe(true);
            await toggle(el);
            expect(el.checkValidity()).toBe(true);
        });

        it('is invalid with the error text, which replaces the hint', async () => {
            const { el } = await formFixture(
                html`<hmi-checkbox name="opt" hint="Optional" error="Required"></hmi-checkbox>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Required');
            expect(part(el, 'error').textContent?.trim()).toBe('Required');
            expect(part(el, 'hint')).toBeNull();
            expect(input(el).getAttribute('aria-invalid')).toBe('true');
            expect(input(el).getAttribute('aria-describedby')).toBe('error');
        });

        it('shows the hint without an error', async () => {
            const { el } = await formFixture(
                html`<hmi-checkbox hint="Optional"></hmi-checkbox>`,
            );
            expect(part(el, 'hint').textContent?.trim()).toBe('Optional');
            expect(input(el).getAttribute('aria-describedby')).toBe('hint');
        });
    });
});

describe('Checkbox (React wrapper)', () => {
    it('maps onChange to hmi-change', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: boolean[] = [];
        await act(async () => {
            root.render(
                createElement(Checkbox, {
                    label: 'x',
                    onChange: (e) => seen.push(e.detail.checked),
                }),
            );
        });
        const el = host.querySelector('hmi-checkbox') as HmiCheckbox;
        await el.updateComplete;
        await toggle(el);
        expect(seen).toEqual([true]);
        await act(async () => root.unmount());
    });
});
