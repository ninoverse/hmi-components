import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './slider.js';
import type { HmiSlider, SliderValueDetail } from './slider.js';
import { Slider } from './slider.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiSlider> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-slider') as HmiSlider;
    await el.updateComplete;
    return el;
}

const part = (el: HmiSlider, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const range = (el: HmiSlider) => part(el, 'control') as HTMLInputElement;

/** Moves the thumb: the native input's `input` event. */
async function move(el: HmiSlider, value: number) {
    range(el).value = String(value);
    range(el).dispatchEvent(
        new Event('input', { bubbles: true, composed: true }),
    );
    await el.updateComplete;
}

const release = (el: HmiSlider) =>
    range(el).dispatchEvent(new Event('change', { bubbles: true }));

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-slider', () => {
    it('registers', () => {
        expect(customElements.get('hmi-slider')).toBeDefined();
    });

    it('has defaults: 0 to 100 by 1, at min, no value shown', async () => {
        const el = await fixture(html`<hmi-slider></hmi-slider>`);
        expect(el.min).toBe(0);
        expect(el.max).toBe(100);
        expect(el.step).toBe(1);
        expect(el.value).toBe(0);
        expect(range(el).type).toBe('range');
        expect(range(el).value).toBe('0');
        expect(part(el, 'value')).toBeNull();
    });

    it('starts at min when min is set, and at the value attribute when given', async () => {
        const atMin = await fixture(
            html`<hmi-slider min="10" max="20"></hmi-slider>`,
        );
        expect(atMin.value).toBe(10);
        const withValue = await fixture(
            html`<hmi-slider value="40"></hmi-slider>`,
        );
        expect(withValue.value).toBe(40);
        expect(range(withValue).value).toBe('40');
    });

    it('forwards min, max and step to the range input', async () => {
        const el = await fixture(
            html`<hmi-slider min="0" max="50" step="5" value="25"></hmi-slider>`,
        );
        expect([range(el).min, range(el).max, range(el).step]).toEqual([
            '0',
            '50',
            '5',
        ]);
    });

    it('sets the fill from the value, on the base', async () => {
        const el = await fixture(
            html`<hmi-slider min="0" max="200" value="50"></hmi-slider>`,
        );
        expect(part(el, 'base').style.getPropertyValue('--slider-pct')).toBe(
            '25%',
        );
        el.value = 200;
        await el.updateComplete;
        expect(part(el, 'base').style.getPropertyValue('--slider-pct')).toBe(
            '100%',
        );
    });

    it('does not divide by zero when min equals max', async () => {
        const el = await fixture(
            html`<hmi-slider min="5" max="5"></hmi-slider>`,
        );
        expect(part(el, 'base').style.getPropertyValue('--slider-pct')).toBe(
            '0%',
        );
    });

    it('fires hmi-input with the number while moving, and hmi-change on release', async () => {
        const el = await fixture(html`<hmi-slider></hmi-slider>`);
        const events: string[] = [];
        for (const type of ['hmi-input', 'hmi-change'])
            el.addEventListener(type, (e) =>
                events.push(
                    `${type}:${(e as CustomEvent<SliderValueDetail>).detail.value}`,
                ),
            );
        await move(el, 30);
        await move(el, 35);
        expect(events).toEqual(['hmi-input:30', 'hmi-input:35']);
        release(el);
        expect(events).toEqual([
            'hmi-input:30',
            'hmi-input:35',
            'hmi-change:35',
        ]);
        expect(el.value).toBe(35);
    });

    it('lets a listener veto a move by setting value back', async () => {
        const el = await fixture(html`<hmi-slider value="10"></hmi-slider>`);
        el.addEventListener('hmi-input', () => {
            el.value = 10;
        });
        await move(el, 80);
        await el.updateComplete;
        expect(el.value).toBe(10);
        expect(range(el).value).toBe('10');
    });

    it('follows value set from outside, without firing events', async () => {
        const el = await fixture(html`<hmi-slider></hmi-slider>`);
        let fired = 0;
        el.addEventListener('hmi-input', () => fired++);
        el.value = 70;
        await el.updateComplete;
        expect(range(el).value).toBe('70');
        expect(fired).toBe(0);
    });

    describe('value display', () => {
        it('shows the value, or the formatted value from a template', async () => {
            const plain = await fixture(
                html`<hmi-slider value="40" show-value></hmi-slider>`,
            );
            expect(part(plain, 'value').textContent?.trim()).toBe('40');
            expect(part(plain, 'value').getAttribute('aria-hidden')).toBe(
                'true',
            );
            const templated = await fixture(
                html`<hmi-slider value="40" show-value format-value="{value}%"></hmi-slider>`,
            );
            expect(part(templated, 'value').textContent?.trim()).toBe('40%');
            expect(range(templated).getAttribute('aria-valuetext')).toBe('40%');
        });

        it('formats with a function set as a property, and follows the value', async () => {
            const el = await fixture(
                html`<hmi-slider value="40" show-value></hmi-slider>`,
            );
            el.formatValue = (v) => `${v} dB`;
            await el.updateComplete;
            expect(part(el, 'value').textContent?.trim()).toBe('40 dB');
            await move(el, 55);
            expect(part(el, 'value').textContent?.trim()).toBe('55 dB');
            expect(range(el).getAttribute('aria-valuetext')).toBe('55 dB');
        });

        it('leaves aria-valuetext off without a format', async () => {
            const el = await fixture(
                html`<hmi-slider value="40"></hmi-slider>`,
            );
            expect(range(el).hasAttribute('aria-valuetext')).toBe(false);
        });
    });

    it('names the slider by the label, else the host aria-label', async () => {
        const labelled = await fixture(
            html`<hmi-slider label="Volume"></hmi-slider>`,
        );
        expect(part(labelled, 'label').textContent?.trim()).toBe('Volume');
        expect(range(labelled).hasAttribute('aria-label')).toBe(false);
        expect(
            labelled.shadowRoot?.querySelector('label')?.getAttribute('for'),
        ).toBe('control');
        const named = await fixture(
            html`<hmi-slider aria-label="Contrast"></hmi-slider>`,
        );
        expect(range(named).getAttribute('aria-label')).toBe('Contrast');
    });

    it('disables the input, also by an ancestor fieldset', async () => {
        const el = await fixture(html`<hmi-slider disabled></hmi-slider>`);
        expect(range(el).disabled).toBe(true);
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-slider name="n"></hmi-slider></fieldset>`,
            host,
        );
        const inner = host.querySelector('hmi-slider') as HmiSlider;
        await inner.updateComplete;
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await inner.updateComplete;
        expect(range(inner).disabled).toBe(true);
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector('hmi-slider') as HmiSlider;
            await el.updateComplete;
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits the value under its name', async () => {
            const { form, el } = await formFixture(
                html`<hmi-slider name="vol" value="40"></hmi-slider>`,
            );
            expect(new FormData(form).get('vol')).toBe('40');
            await move(el, 65);
            expect(new FormData(form).get('vol')).toBe('65');
        });

        it('submits min for an untouched slider', async () => {
            const { form } = await formFixture(
                html`<hmi-slider name="vol" min="10"></hmi-slider>`,
            );
            expect(new FormData(form).get('vol')).toBe('10');
        });

        it('restores the initial value on reset, or default-value', async () => {
            const { form, el } = await formFixture(
                html`<hmi-slider name="vol" value="40"></hmi-slider>`,
            );
            await move(el, 90);
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe(40);
            expect(range(el).value).toBe('40');
            const withDefault = await formFixture(
                html`<hmi-slider name="vol" default-value="25"></hmi-slider>`,
            );
            expect(withDefault.el.value).toBe(25);
            await move(withDefault.el, 90);
            withDefault.form.reset();
            await withDefault.el.updateComplete;
            expect(withDefault.el.value).toBe(25);
        });

        it('is invalid with the error text, shown below and marked on the input', async () => {
            const { el } = await formFixture(
                html`<hmi-slider name="vol" error="Too loud" hint="Hint"></hmi-slider>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Too loud');
            expect(part(el, 'error').textContent?.trim()).toBe('Too loud');
            expect(part(el, 'hint')).toBeNull();
            expect(range(el).getAttribute('aria-invalid')).toBe('true');
            expect(range(el).getAttribute('aria-describedby')).toBe('error');
        });

        it('is valid without an error', async () => {
            const { el } = await formFixture(
                html`<hmi-slider name="vol"></hmi-slider>`,
            );
            expect(el.checkValidity()).toBe(true);
        });
    });
});

describe('Slider (React wrapper)', () => {
    it('maps onInput and onChange to the events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const inputs: number[] = [];
        const changes: number[] = [];
        await act(async () => {
            root.render(
                createElement(Slider, {
                    onInput: (e) => inputs.push(e.detail.value),
                    onChange: (e) => changes.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector('hmi-slider') as HmiSlider;
        await el.updateComplete;
        await move(el, 20);
        release(el);
        expect(inputs).toEqual([20]);
        expect(changes).toEqual([20]);
        await act(async () => root.unmount());
    });

    it('takes formatValue as a function prop', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(Slider, {
                    value: 40,
                    showValue: true,
                    formatValue: (v: number) => `${v}%`,
                }),
            );
        });
        const el = host.querySelector('hmi-slider') as HmiSlider;
        await el.updateComplete;
        expect(part(el, 'value').textContent?.trim()).toBe('40%');
        await act(async () => root.unmount());
    });
});
