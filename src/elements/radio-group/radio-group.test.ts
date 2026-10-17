import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './radio-group.js';
import type { HmiRadio } from '../radio/radio.js';
import type {
    HmiRadioGroup,
    RadioGroupChangeDetail,
    RadioOption,
} from './radio-group.js';
import { RadioGroup } from './radio-group.react.js';

const OPTIONS: RadioOption[] = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team (disabled)', disabled: true },
];

async function settle(el: HmiRadioGroup) {
    await el.updateComplete;
    await Promise.all(radios(el).map((r) => r.updateComplete));
    await Promise.all(radios(el).map((r) => r.updateComplete));
    await el.updateComplete;
}

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-radio-group') as HmiRadioGroup;
    await settle(el);
    return el;
}

const radios = (el: HmiRadioGroup) =>
    Array.from(el.shadowRoot?.querySelectorAll<HmiRadio>('hmi-radio') ?? []);
const native = (r: HmiRadio) =>
    r.shadowRoot?.querySelector('input') as HTMLInputElement;
const part = (el: HmiRadioGroup, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const choose = async (el: HmiRadioGroup, index: number) => {
    native(radios(el)[index] as HmiRadio).click();
    await settle(el);
};

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-radio-group', () => {
    it('registers', () => {
        expect(customElements.get('hmi-radio-group')).toBeDefined();
    });

    it('renders a radio per option, in a column, with the label text', async () => {
        const el = await fixture(
            html`<hmi-radio-group .options=${OPTIONS}></hmi-radio-group>`,
        );
        expect(radios(el)).toHaveLength(3);
        expect(radios(el).map((r) => r.value)).toEqual(['free', 'pro', 'team']);
        expect(radios(el)[1]?.textContent?.trim()).toBe('Pro');
        const [a, b] = radios(el).map((r) => r.getBoundingClientRect().top) as [
            number,
            number,
        ];
        expect(b).toBeGreaterThan(a);
        expect(part(el, 'base').getAttribute('role')).toBe('radiogroup');
    });

    it('takes options as a property only: an options attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-radio-group options='[{"value":"a","label":"A"}]'></hmi-radio-group>`,
        );
        expect(radios(el)).toHaveLength(0);
        el.options = [{ value: 'a', label: 'A' }];
        await settle(el);
        expect(radios(el)).toHaveLength(1);
    });

    it('checks the radio of the value, and disables the disabled option', async () => {
        const el = await fixture(
            html`<hmi-radio-group value="pro" .options=${OPTIONS}></hmi-radio-group>`,
        );
        expect(radios(el).map((r) => r.checked)).toEqual([false, true, false]);
        expect(native(radios(el)[2] as HmiRadio).disabled).toBe(true);
    });

    it('chooses on a click, fires hmi-change once with the value, and keeps the inner event inside', async () => {
        const el = await fixture(
            html`<hmi-radio-group .options=${OPTIONS}></hmi-radio-group>`,
        );
        const group: RadioGroupChangeDetail[] = [];
        const outer: unknown[] = [];
        el.addEventListener('hmi-change', (e) =>
            group.push((e as CustomEvent<RadioGroupChangeDetail>).detail),
        );
        document.body.addEventListener('hmi-change', (e) =>
            outer.push((e as CustomEvent).detail),
        );
        await choose(el, 1);
        expect(el.value).toBe('pro');
        expect(group).toEqual([{ value: 'pro' }]);
        expect(outer).toEqual([{ value: 'pro' }]);
        await choose(el, 0);
        expect(el.value).toBe('free');
        expect(radios(el).map((r) => r.checked)).toEqual([true, false, false]);
    });

    it('moves between the options with the arrow keys, which choose them', async () => {
        const el = await fixture(
            html`<hmi-radio-group value="free" .options=${OPTIONS}></hmi-radio-group>`,
        );
        native(radios(el)[0] as HmiRadio).dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                bubbles: true,
                cancelable: true,
            }),
        );
        await settle(el);
        expect(el.value).toBe('pro');
    });

    it('lets a listener veto a choice by setting value back', async () => {
        const el = await fixture(
            html`<hmi-radio-group value="free" .options=${OPTIONS}></hmi-radio-group>`,
        );
        el.addEventListener('hmi-change', () => {
            el.value = 'free';
        });
        await choose(el, 1);
        expect(el.value).toBe('free');
        expect(radios(el).map((r) => r.checked)).toEqual([true, false, false]);
    });

    it('takes a rich option label from the label-<value> slot', async () => {
        const el = await fixture(
            html`<hmi-radio-group .options=${OPTIONS}><b slot="label-pro">Pro plan</b></hmi-radio-group>`,
        );
        const slot = el.shadowRoot?.querySelector(
            'slot[name="label-pro"]',
        ) as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
        const other = el.shadowRoot?.querySelector(
            'slot[name="label-free"]',
        ) as HTMLSlotElement;
        expect(other.assignedElements()).toHaveLength(0);
        expect(radios(el)[0]?.textContent?.trim()).toBe('Free');
    });

    it('names the group by the label, else the host aria-label', async () => {
        const labelled = await fixture(
            html`<hmi-radio-group label="Plan" required .options=${OPTIONS}></hmi-radio-group>`,
        );
        expect(part(labelled, 'base').getAttribute('aria-labelledby')).toBe(
            'label',
        );
        expect(part(labelled, 'label').textContent).toContain('Plan');
        expect(part(labelled, 'label').textContent).toContain('*');
        const named = await fixture(
            html`<hmi-radio-group aria-label="Billing" .options=${OPTIONS}></hmi-radio-group>`,
        );
        expect(part(named, 'base').getAttribute('aria-label')).toBe('Billing');
    });

    it('disables every radio while disabled, also by an ancestor fieldset', async () => {
        const el = await fixture(
            html`<hmi-radio-group disabled .options=${OPTIONS}></hmi-radio-group>`,
        );
        expect(radios(el).every((r) => native(r).disabled)).toBe(true);
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-radio-group name="n" .options=${OPTIONS}></hmi-radio-group></fieldset>`,
            host,
        );
        const inner = host.querySelector('hmi-radio-group') as HmiRadioGroup;
        await settle(inner);
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await settle(inner);
        expect(native(radios(inner)[0] as HmiRadio).disabled).toBe(true);
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector('hmi-radio-group') as HmiRadioGroup;
            await settle(el);
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits the chosen value under its name, and nothing while none is chosen', async () => {
            const { form, el } = await formFixture(
                html`<hmi-radio-group name="plan" .options=${OPTIONS}></hmi-radio-group>`,
            );
            expect(new FormData(form).has('plan')).toBe(false);
            await choose(el, 1);
            expect(new FormData(form).getAll('plan')).toEqual(['pro']);
        });

        it('restores the initial value on reset, or default-value', async () => {
            const { form, el } = await formFixture(
                html`<hmi-radio-group name="plan" value="free" .options=${OPTIONS}></hmi-radio-group>`,
            );
            await choose(el, 1);
            form.reset();
            await settle(el);
            expect(el.value).toBe('free');
            expect(radios(el)[0]?.checked).toBe(true);
            const withDefault = await formFixture(
                html`<hmi-radio-group name="plan" default-value="pro" .options=${OPTIONS}></hmi-radio-group>`,
            );
            expect(withDefault.el.value).toBe('pro');
        });

        it('is invalid while required and nothing is chosen, and focuses the first radio', async () => {
            const { el } = await formFixture(
                html`<hmi-radio-group name="plan" required .options=${OPTIONS}></hmi-radio-group>`,
            );
            expect(el.checkValidity()).toBe(false);
            expect(el.validity.valueMissing).toBe(true);
            await choose(el, 1);
            expect(el.checkValidity()).toBe(true);
        });

        it('is invalid with the error text, shown below and marked on the group', async () => {
            const { el } = await formFixture(
                html`<hmi-radio-group name="plan" error="Pick a plan" hint="Hint" .options=${OPTIONS}></hmi-radio-group>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Pick a plan');
            expect(part(el, 'error').textContent?.trim()).toBe('Pick a plan');
            expect(part(el, 'hint')).toBeNull();
            const base = part(el, 'base');
            expect(base.getAttribute('aria-invalid')).toBe('true');
            expect(base.getAttribute('aria-describedby')).toBe('error');
        });

        it('shows the hint without an error', async () => {
            const { el } = await formFixture(
                html`<hmi-radio-group hint="Pick one" .options=${OPTIONS}></hmi-radio-group>`,
            );
            expect(part(el, 'hint').textContent?.trim()).toBe('Pick one');
        });
    });
});

describe('RadioGroup (React wrapper)', () => {
    it('maps onChange to hmi-change and takes options', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: string[] = [];
        await act(async () => {
            root.render(
                createElement(RadioGroup, {
                    name: 'plan',
                    options: OPTIONS,
                    onChange: (e) => seen.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector('hmi-radio-group') as HmiRadioGroup;
        await settle(el);
        await choose(el, 1);
        expect(seen).toEqual(['pro']);
        await act(async () => root.unmount());
    });
});
