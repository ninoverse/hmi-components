import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './switch.js';
import type { HmiSwitch } from './switch.js';
import { Switch } from './switch.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiSwitch> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-switch') as HmiSwitch;
    await el.updateComplete;
    return el;
}

const part = (el: HmiSwitch, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const input = (el: HmiSwitch) =>
    el.shadowRoot?.querySelector('input') as HTMLInputElement;

/** A user toggle: the native input's click, which fires `change`. */
async function toggle(el: HmiSwitch) {
    input(el).click();
    await el.updateComplete;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-switch', () => {
    it('registers', () => {
        expect(customElements.get('hmi-switch')).toBeDefined();
    });

    it('has defaults: off, submitting "on"', async () => {
        const el = await fixture(html`<hmi-switch></hmi-switch>`);
        expect(el.checked).toBe(false);
        expect(el.value).toBe('on');
        expect(input(el).checked).toBe(false);
        expect(input(el).type).toBe('checkbox');
        const track = part(el, 'track').getBoundingClientRect();
        expect([track.width, track.height]).toEqual([36, 22]);
    });

    it('shows the label text, and hides the label part without one', async () => {
        const el = await fixture(
            html`<hmi-switch label="Accept"></hmi-switch>`,
        );
        expect(part(el, 'label').textContent?.trim()).toBe('Accept');
        expect(part(el, 'label').hidden).toBe(false);
        const bare = await fixture(html`<hmi-switch></hmi-switch>`);
        expect(part(bare, 'label').hidden).toBe(true);
    });

    it('takes a rich label from the default slot', async () => {
        const el = await fixture(
            html`<hmi-switch>I agree to the <a href="#x">terms</a></hmi-switch>`,
        );
        await el.updateComplete;
        expect(part(el, 'label').hidden).toBe(false);
        const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
    });

    it('toggles on a click anywhere on the row, and fires hmi-change with checked', async () => {
        const el = await fixture(
            html`<hmi-switch label="Accept"></hmi-switch>`,
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
        const el = await fixture(html`<hmi-switch checked></hmi-switch>`);
        expect(input(el).checked).toBe(true);
    });

    it('lets a listener veto a toggle by setting checked back', async () => {
        const el = await fixture(html`<hmi-switch></hmi-switch>`);
        el.addEventListener('hmi-change', () => {
            el.checked = false;
        });
        await toggle(el);
        await el.updateComplete;
        expect(el.checked).toBe(false);
        expect(input(el).checked).toBe(false);
    });

    it('follows checked set from outside, without firing hmi-change', async () => {
        const el = await fixture(html`<hmi-switch></hmi-switch>`);
        let fired = 0;
        el.addEventListener('hmi-change', () => fired++);
        el.checked = true;
        await el.updateComplete;
        expect(input(el).checked).toBe(true);
        expect(fired).toBe(0);
    });

    it('does not toggle while disabled, also by an ancestor fieldset', async () => {
        const el = await fixture(html`<hmi-switch disabled></hmi-switch>`);
        expect(input(el).disabled).toBe(true);
        await toggle(el);
        expect(el.checked).toBe(false);
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-switch name="n"></hmi-switch></fieldset>`,
            host,
        );
        const inner = host.querySelector('hmi-switch') as HmiSwitch;
        await inner.updateComplete;
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await inner.updateComplete;
        expect(input(inner).disabled).toBe(true);
    });

    it('focuses the native input, so Space toggles it', async () => {
        const el = await fixture(html`<hmi-switch label="x"></hmi-switch>`);
        input(el).focus();
        expect(el.shadowRoot?.activeElement).toBe(input(el));
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector('hmi-switch') as HmiSwitch;
            await el.updateComplete;
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits name=value while checked, and nothing while unchecked', async () => {
            const { form, el } = await formFixture(
                html`<hmi-switch name="opt" value="yes"></hmi-switch>`,
            );
            expect(new FormData(form).has('opt')).toBe(false);
            await toggle(el);
            expect(new FormData(form).get('opt')).toBe('yes');
        });

        it('submits "on" without a value', async () => {
            const { form } = await formFixture(
                html`<hmi-switch name="opt" checked></hmi-switch>`,
            );
            expect(new FormData(form).get('opt')).toBe('on');
        });

        it('restores the initial state on reset', async () => {
            const { form, el } = await formFixture(
                html`<hmi-switch name="opt" checked></hmi-switch>`,
            );
            await toggle(el);
            expect(el.checked).toBe(false);
            form.reset();
            await el.updateComplete;
            expect(el.checked).toBe(true);
        });

        it('restores default-checked on reset', async () => {
            const { form, el } = await formFixture(
                html`<hmi-switch name="opt" default-checked></hmi-switch>`,
            );
            expect(el.checked).toBe(true);
            await toggle(el);
            form.reset();
            await el.updateComplete;
            expect(el.checked).toBe(true);
        });

        it('is invalid while required and unchecked', async () => {
            const { el } = await formFixture(
                html`<hmi-switch name="opt" required></hmi-switch>`,
            );
            expect(el.checkValidity()).toBe(false);
            expect(el.validity.valueMissing).toBe(true);
            await toggle(el);
            expect(el.checkValidity()).toBe(true);
        });

        it('is invalid with the error text, which replaces the hint', async () => {
            const { el } = await formFixture(
                html`<hmi-switch name="opt" hint="Optional" error="Required"></hmi-switch>`,
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
                html`<hmi-switch hint="Optional"></hmi-switch>`,
            );
            expect(part(el, 'hint').textContent?.trim()).toBe('Optional');
            expect(input(el).getAttribute('aria-describedby')).toBe('hint');
        });
    });
});

describe('Switch (React wrapper)', () => {
    it('maps onChange to hmi-change', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: boolean[] = [];
        await act(async () => {
            root.render(
                createElement(Switch, {
                    label: 'x',
                    onChange: (e) => seen.push(e.detail.checked),
                }),
            );
        });
        const el = host.querySelector('hmi-switch') as HmiSwitch;
        await el.updateComplete;
        await toggle(el);
        expect(seen).toEqual([true]);
        await act(async () => root.unmount());
    });
});
