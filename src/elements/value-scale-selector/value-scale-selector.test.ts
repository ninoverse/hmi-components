import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './value-scale-selector.js';
import type {
    HmiValueScaleSelector,
    ValueScaleSelectorValueDetail,
} from './value-scale-selector.js';
import { ValueScaleSelector } from './value-scale-selector.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector(
        'hmi-value-scale-selector',
    ) as HmiValueScaleSelector;
    await el.updateComplete;
    await el.updateComplete;
    return el;
}

const part = (el: HmiValueScaleSelector, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const slider = (el: HmiValueScaleSelector) => part(el, 'base');
const targets = (el: HmiValueScaleSelector) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLButtonElement>('.target') ?? [],
    );
const rows = (el: HmiValueScaleSelector) =>
    Array.from(el.shadowRoot?.querySelectorAll<HTMLElement>('.row') ?? []);

async function press(el: HmiValueScaleSelector, key: string) {
    const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
    });
    slider(el).dispatchEvent(event);
    await el.updateComplete;
    return event;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-value-scale-selector', () => {
    it('registers', () => {
        expect(customElements.get('hmi-value-scale-selector')).toBeDefined();
    });

    it('has defaults: a slider from 0 to 5 at 0, with five stars in two rows', async () => {
        const el = await fixture(
            html`<hmi-value-scale-selector></hmi-value-scale-selector>`,
        );
        expect(el.value).toBe(0);
        expect(el.max).toBe(5);
        const s = slider(el);
        expect(s.getAttribute('role')).toBe('slider');
        expect(s.getAttribute('aria-valuemin')).toBe('0');
        expect(s.getAttribute('aria-valuemax')).toBe('5');
        expect(s.getAttribute('aria-valuenow')).toBe('0');
        expect(s.getAttribute('aria-valuetext')).toBe('0 out of 5');
        expect(s.getAttribute('aria-label')).toBe('Value selector');
        expect(s.tabIndex).toBe(0);
        expect(rows(el)).toHaveLength(2);
        expect(el.shadowRoot?.querySelectorAll('.item')).toHaveLength(10);
        expect(targets(el)).toHaveLength(5);
        const icon = el.shadowRoot?.querySelector('.item svg') as SVGElement;
        expect(icon.getBoundingClientRect().width).toBe(24);
    });

    it('sizes the icons', async () => {
        const small = await fixture(
            html`<hmi-value-scale-selector size="small"></hmi-value-scale-selector>`,
        );
        expect(
            (
                small.shadowRoot?.querySelector('.item svg') as SVGElement
            ).getBoundingClientRect().width,
        ).toBe(16);
        const large = await fixture(
            html`<hmi-value-scale-selector size="large"></hmi-value-scale-selector>`,
        );
        expect(
            (
                large.shadowRoot?.querySelector('.item svg') as SVGElement
            ).getBoundingClientRect().width,
        ).toBe(32);
    });

    it('clips the fill to the value, and previews a hovered position', async () => {
        const el = await fixture(
            html`<hmi-value-scale-selector value="2.5" max="5" allow-half></hmi-value-scale-selector>`,
        );
        const fill = part(el, 'fill');
        expect(fill.style.width).toBe('50%');
        targets(el)[1]?.dispatchEvent(new MouseEvent('mouseenter'));
        await el.updateComplete;
        expect(fill.style.width).toBe('20%');
        slider(el).dispatchEvent(new MouseEvent('mouseleave'));
        await el.updateComplete;
        expect(fill.style.width).toBe('50%');
    });

    it('has one target per position, or two halves with allow-half', async () => {
        const half = await fixture(
            html`<hmi-value-scale-selector max="3" allow-half></hmi-value-scale-selector>`,
        );
        expect(targets(half).map((t) => t.getAttribute('aria-label'))).toEqual([
            '0.5',
            '1',
            '1.5',
            '2',
            '2.5',
            '3',
        ]);
    });

    it('picks a value on a click, and fires hmi-change; the same value again fires nothing', async () => {
        const el = await fixture(
            html`<hmi-value-scale-selector max="5"></hmi-value-scale-selector>`,
        );
        const seen: number[] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push(
                (e as CustomEvent<ValueScaleSelectorValueDetail>).detail.value,
            ),
        );
        targets(el)[3]?.click();
        await el.updateComplete;
        expect(el.value).toBe(4);
        expect(slider(el).getAttribute('aria-valuenow')).toBe('4');
        targets(el)[3]?.click();
        await el.updateComplete;
        expect(seen).toEqual([4]);
    });

    it('steps with the arrow keys, and jumps with Home and End', async () => {
        const el = await fixture(
            html`<hmi-value-scale-selector value="2" max="5"></hmi-value-scale-selector>`,
        );
        await press(el, 'ArrowRight');
        expect(el.value).toBe(3);
        await press(el, 'ArrowUp');
        expect(el.value).toBe(4);
        await press(el, 'ArrowLeft');
        await press(el, 'ArrowDown');
        expect(el.value).toBe(2);
        await press(el, 'End');
        expect(el.value).toBe(5);
        await press(el, 'ArrowRight');
        expect(el.value).toBe(5);
        await press(el, 'Home');
        expect(el.value).toBe(0);
        await press(el, 'ArrowLeft');
        expect(el.value).toBe(0);
        const other = await press(el, 'a');
        expect(other.defaultPrevented).toBe(false);
    });

    it('steps by a half with allow-half', async () => {
        const el = await fixture(
            html`<hmi-value-scale-selector value="2" allow-half></hmi-value-scale-selector>`,
        );
        await press(el, 'ArrowRight');
        expect(el.value).toBe(2.5);
    });

    it('lets a listener veto a change by setting value back', async () => {
        const el = await fixture(
            html`<hmi-value-scale-selector value="2"></hmi-value-scale-selector>`,
        );
        el.addEventListener('hmi-change', () => {
            el.value = 2;
        });
        targets(el)[4]?.click();
        await el.updateComplete;
        expect(el.value).toBe(2);
        expect(slider(el).getAttribute('aria-valuenow')).toBe('2');
    });

    it('builds aria-valuetext from a template, or a function property', async () => {
        const el = await fixture(
            html`<hmi-value-scale-selector value="3" value-text="{value} of {max} stars"></hmi-value-scale-selector>`,
        );
        expect(slider(el).getAttribute('aria-valuetext')).toBe('3 of 5 stars');
        el.valueText = (v, m) => `rated ${v}/${m}`;
        await el.updateComplete;
        expect(slider(el).getAttribute('aria-valuetext')).toBe('rated 3/5');
    });

    it('does not interact while readonly or disabled', async () => {
        const readonly = await fixture(
            html`<hmi-value-scale-selector value="2" readonly></hmi-value-scale-selector>`,
        );
        expect(targets(readonly)).toHaveLength(0);
        expect(slider(readonly).tabIndex).toBe(-1);
        expect(slider(readonly).getAttribute('aria-readonly')).toBe('true');
        await press(readonly, 'ArrowRight');
        expect(readonly.value).toBe(2);
        const disabled = await fixture(
            html`<hmi-value-scale-selector value="2" disabled></hmi-value-scale-selector>`,
        );
        expect(targets(disabled)).toHaveLength(0);
        expect(slider(disabled).getAttribute('aria-disabled')).toBe('true');
        await press(disabled, 'End');
        expect(disabled.value).toBe(2);
    });

    it('is disabled by an ancestor fieldset', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-value-scale-selector name="n"></hmi-value-scale-selector></fieldset>`,
            host,
        );
        const el = host.querySelector(
            'hmi-value-scale-selector',
        ) as HmiValueScaleSelector;
        await el.updateComplete;
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await el.updateComplete;
        expect(slider(el).getAttribute('aria-disabled')).toBe('true');
    });

    it('names the slider by the label, else the host aria-label', async () => {
        const labelled = await fixture(
            html`<hmi-value-scale-selector label="Rating" required></hmi-value-scale-selector>`,
        );
        expect(slider(labelled).getAttribute('aria-labelledby')).toBe('label');
        expect(part(labelled, 'label').textContent).toContain('Rating');
        const named = await fixture(
            html`<hmi-value-scale-selector aria-label="Quality"></hmi-value-scale-selector>`,
        );
        expect(slider(named).getAttribute('aria-label')).toBe('Quality');
    });

    describe('icon slot', () => {
        it('copies one slotted icon into every position of both rows, without the slot attribute', async () => {
            const el = await fixture(
                html`<hmi-value-scale-selector max="3"
                    ><svg slot="icon" viewBox="0 0 16 16" class="heart"><circle cx="8" cy="8" r="6" /></svg
                ></hmi-value-scale-selector>`,
            );
            await el.updateComplete;
            const copies = el.shadowRoot?.querySelectorAll('.item .heart');
            expect(copies).toHaveLength(6);
            expect(copies?.[0]?.hasAttribute('slot')).toBe(false);
            expect(copies?.[0]?.getAttribute('aria-hidden')).toBe('true');
            expect(el.shadowRoot?.querySelectorAll('.item path')).toHaveLength(
                0,
            );
        });

        it('keeps the copies when the value changes, and adds copies when max grows', async () => {
            const el = await fixture(
                html`<hmi-value-scale-selector max="2"
                    ><svg slot="icon" class="heart" viewBox="0 0 16 16"></svg
                ></hmi-value-scale-selector>`,
            );
            await el.updateComplete;
            const first = el.shadowRoot?.querySelector('.item .heart');
            el.value = 1;
            await el.updateComplete;
            expect(el.shadowRoot?.querySelector('.item .heart')).toBe(first);
            el.max = 4;
            await el.updateComplete;
            expect(
                el.shadowRoot?.querySelectorAll('.item .heart'),
            ).toHaveLength(8);
        });
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector(
                'hmi-value-scale-selector',
            ) as HmiValueScaleSelector;
            await el.updateComplete;
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits the value under its name', async () => {
            const { form, el } = await formFixture(
                html`<hmi-value-scale-selector name="rating" value="2"></hmi-value-scale-selector>`,
            );
            expect(new FormData(form).get('rating')).toBe('2');
            targets(el)[3]?.click();
            await el.updateComplete;
            expect(new FormData(form).get('rating')).toBe('4');
        });

        it('restores the initial value on reset, or default-value', async () => {
            const { form, el } = await formFixture(
                html`<hmi-value-scale-selector name="rating" value="2"></hmi-value-scale-selector>`,
            );
            targets(el)[4]?.click();
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe(2);
            const withDefault = await formFixture(
                html`<hmi-value-scale-selector name="rating" default-value="3"></hmi-value-scale-selector>`,
            );
            expect(withDefault.el.value).toBe(3);
        });

        it('is invalid while required and 0, with a customizable message', async () => {
            const { el } = await formFixture(
                html`<hmi-value-scale-selector name="rating" required></hmi-value-scale-selector>`,
            );
            expect(el.checkValidity()).toBe(false);
            expect(el.validity.valueMissing).toBe(true);
            expect(el.validationMessage).toBe('Please select an option.');
            el.requiredMessage = 'Rate it first.';
            await el.updateComplete;
            expect(el.validationMessage).toBe('Rate it first.');
            el.reportValidity();
            expect(el.shadowRoot?.activeElement).toBe(slider(el));
            targets(el)[0]?.click();
            await el.updateComplete;
            expect(el.checkValidity()).toBe(true);
        });

        it('takes required-message from the attribute', async () => {
            const { el } = await formFixture(
                html`<hmi-value-scale-selector required required-message="Valora"></hmi-value-scale-selector>`,
            );
            expect(el.validationMessage).toBe('Valora');
        });

        it('is invalid with the error text, shown below and marked on the slider', async () => {
            const { el } = await formFixture(
                html`<hmi-value-scale-selector name="rating" value="1" error="Too low" hint="Hint"></hmi-value-scale-selector>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Too low');
            expect(part(el, 'error').textContent?.trim()).toBe('Too low');
            expect(part(el, 'hint')).toBeNull();
            expect(slider(el).getAttribute('aria-invalid')).toBe('true');
            expect(slider(el).getAttribute('aria-describedby')).toBe('error');
        });
    });
});

describe('ValueScaleSelector (React wrapper)', () => {
    it('maps onChange to hmi-change', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: number[] = [];
        await act(async () => {
            root.render(
                createElement(ValueScaleSelector, {
                    max: 5,
                    onChange: (e) => seen.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector(
            'hmi-value-scale-selector',
        ) as HmiValueScaleSelector;
        await el.updateComplete;
        targets(el)[2]?.click();
        expect(seen).toEqual([3]);
        await act(async () => root.unmount());
    });
});
