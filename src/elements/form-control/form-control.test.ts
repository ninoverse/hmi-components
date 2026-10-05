import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import '../input/input.js';
import './form-control.js';
import type { HmiFormControl } from './form-control.js';
import { FormControl } from './form-control.react.js';

/** Resolves after the slotchange events and the update they request. */
async function settle(el: HmiFormControl): Promise<void> {
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await el.updateComplete;
}

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiFormControl> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-form-control') as HmiFormControl;
    await settle(el);
    return el;
}

const part = (el: HmiFormControl, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const shown = (el: HmiFormControl, name: string) =>
    getComputedStyle(part(el, name)).display !== 'none';

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-form-control', () => {
    it('registers', () => {
        expect(customElements.get('hmi-form-control')).toBeDefined();
    });

    it('stacks the label, the control and the message vertically', async () => {
        const el = await fixture(
            html`<hmi-form-control label="Name" hint="Hint"
                ><div id="c" style="height: 20px"></div></hmi-form-control
            >`,
        );
        const style = getComputedStyle(el);
        expect(style.display).toBe('flex');
        expect(style.flexDirection).toBe('column');
        const label = part(el, 'label').getBoundingClientRect();
        const control = (
            el.querySelector('#c') as Element
        ).getBoundingClientRect();
        const hint = part(el, 'hint').getBoundingClientRect();
        expect(label.bottom).toBeLessThanOrEqual(control.top);
        expect(control.bottom).toBeLessThanOrEqual(hint.top);
    });

    it('has defaults and draws nothing around a bare control', async () => {
        const el = await fixture(
            html`<hmi-form-control><div>control</div></hmi-form-control>`,
        );
        expect(el.label).toBe('');
        expect(el.hint).toBe('');
        expect(el.error).toBe('');
        for (const name of ['label', 'hint', 'error']) {
            expect(shown(el, name)).toBe(false);
        }
    });

    it('shows the label and hint strings', async () => {
        const el = await fixture(
            html`<hmi-form-control label="Full name" hint="As on documents"
                ><div></div></hmi-form-control
            >`,
        );
        expect(part(el, 'label').textContent?.trim()).toBe('Full name');
        expect(part(el, 'hint').textContent?.trim()).toBe('As on documents');
        expect(shown(el, 'label')).toBe(true);
        expect(shown(el, 'hint')).toBe(true);
        expect(shown(el, 'error')).toBe(false);
    });

    it('shows the error instead of the hint', async () => {
        const el = await fixture(
            html`<hmi-form-control hint="Hint" error="Not valid"><div></div></hmi-form-control>`,
        );
        expect(shown(el, 'error')).toBe(true);
        expect(part(el, 'error').textContent?.trim()).toBe('Not valid');
        expect(shown(el, 'hint')).toBe(false);
        el.error = '';
        await el.updateComplete;
        expect(shown(el, 'hint')).toBe(true);
        expect(shown(el, 'error')).toBe(false);
    });

    it('lets the slots replace the strings', async () => {
        const el = await fixture(
            html`<hmi-form-control label="ignored">
                <b slot="label">Rich label</b>
                <div>control</div>
                <i slot="hint">Rich hint</i>
            </hmi-form-control>`,
        );
        expect(
            el.shadowRoot
                ?.querySelector<HTMLSlotElement>('slot[name="label"]')
                ?.assignedElements(),
        ).toHaveLength(1);
        expect(shown(el, 'label')).toBe(true);
        expect(shown(el, 'hint')).toBe(true);
    });

    it('treats an error slot as an error and hides the hint', async () => {
        const el = await fixture(
            html`<hmi-form-control hint="Hint">
                <div>control</div>
                <span slot="error">Slotted error</span>
            </hmi-form-control>`,
        );
        expect(shown(el, 'error')).toBe(true);
        expect(shown(el, 'hint')).toBe(false);
    });

    it('follows slotted content added and removed later', async () => {
        const el = await fixture(
            html`<hmi-form-control><div></div></hmi-form-control>`,
        );
        expect(shown(el, 'error')).toBe(false);
        const error = document.createElement('span');
        error.slot = 'error';
        error.textContent = 'Late error';
        el.append(error);
        await settle(el);
        expect(shown(el, 'error')).toBe(true);
        error.remove();
        await settle(el);
        expect(shown(el, 'error')).toBe(false);
    });

    it('wraps a form element', async () => {
        const el = await fixture(
            html`<hmi-form-control label="Email" error="Not an email"
                ><hmi-input type="email"></hmi-input
            ></hmi-form-control>`,
        );
        expect(shown(el, 'label')).toBe(true);
        expect(
            el.shadowRoot
                ?.querySelector<HTMLSlotElement>('slot:not([name])')
                ?.assignedElements(),
        ).toHaveLength(1);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    FormControl,
                    { label: 'Email', hint: 'We never share it' },
                    createElement('div', null, 'control'),
                ),
            );
        });
        const el = mount.querySelector('hmi-form-control') as HmiFormControl;
        await settle(el);
        expect(el.label).toBe('Email');
        expect(shown(el, 'hint')).toBe(true);
    });
});
