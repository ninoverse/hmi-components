import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './segmented-control.js';
import type {
    HmiSegmentedControl,
    SegmentedControlOption,
    SegmentedControlValueDetail,
} from './segmented-control.js';
import { SegmentedControl } from './segmented-control.react.js';

const OPTIONS: SegmentedControlOption[] = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'map', label: 'Map', disabled: true },
    { value: 'table', label: 'Table' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector(
        'hmi-segmented-control',
    ) as HmiSegmentedControl;
    await el.updateComplete;
    return el;
}

const segs = (el: HmiSegmentedControl) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLButtonElement>(
            '[part~="segment"]',
        ) ?? [],
    );
const part = (el: HmiSegmentedControl, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const checked = (el: HmiSegmentedControl) =>
    segs(el).map((s) => s.getAttribute('aria-checked') === 'true');
const active = (el: HmiSegmentedControl) => el.shadowRoot?.activeElement;

async function press(el: HmiSegmentedControl, index: number, key: string) {
    const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
    });
    segs(el)[index]?.dispatchEvent(event);
    await el.updateComplete;
    return event;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-segmented-control', () => {
    it('registers', () => {
        expect(customElements.get('hmi-segmented-control')).toBeDefined();
    });

    it('renders a radio button per option inside a radiogroup, at the React size', async () => {
        const el = await fixture(
            html`<hmi-segmented-control .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(segs(el)).toHaveLength(4);
        expect(segs(el).every((s) => s.getAttribute('role') === 'radio')).toBe(
            true,
        );
        expect(part(el, 'base').getAttribute('role')).toBe('radiogroup');
        expect(segs(el)[0]?.getBoundingClientRect().height).toBe(36);
        expect(segs(el)[1]?.textContent?.trim()).toBe('Grid');
        expect(part(el, 'base').getAttribute('aria-label')).toBe(
            'Segmented control',
        );
    });

    it('rounds the outer corners of the first and last segment like the container', async () => {
        const el = await fixture(
            html`<hmi-segmented-control value="list" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        // The theme tokens are not loaded in the test page.
        for (const [name, value] of [
            ['--corner-tl', '20px'],
            ['--corner-tr', '8px'],
            ['--corner-br', '20px'],
            ['--corner-bl', '8px'],
            ['--corner-extra-small', '4px'],
        ] as const) {
            el.style.setProperty(name, value);
        }
        const base = getComputedStyle(part(el, 'base'));
        const first = getComputedStyle(segs(el)[0] as HTMLElement);
        const last = getComputedStyle(segs(el)[3] as HTMLElement);
        const middle = getComputedStyle(segs(el)[1] as HTMLElement);
        expect(first.borderTopLeftRadius).toBe(base.borderTopLeftRadius);
        expect(first.borderBottomLeftRadius).toBe(base.borderBottomLeftRadius);
        expect(last.borderTopRightRadius).toBe(base.borderTopRightRadius);
        expect(last.borderBottomRightRadius).toBe(base.borderBottomRightRadius);
        expect(middle.borderTopLeftRadius).not.toBe(base.borderTopLeftRadius);
    });

    it('sizes the segments', async () => {
        const small = await fixture(
            html`<hmi-segmented-control size="small" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(segs(small)[0]?.getBoundingClientRect().height).toBe(28);
        const large = await fixture(
            html`<hmi-segmented-control size="large" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(segs(large)[0]?.getBoundingClientRect().height).toBe(44);
    });

    it('stretches to the width with full-width', async () => {
        const host = document.createElement('div');
        host.style.width = '600px';
        document.body.append(host);
        render(
            html`<hmi-segmented-control full-width .options=${OPTIONS}></hmi-segmented-control>`,
            host,
        );
        const el = host.querySelector(
            'hmi-segmented-control',
        ) as HmiSegmentedControl;
        await el.updateComplete;
        expect(part(el, 'base').getBoundingClientRect().width).toBe(600);
    });

    it('names the group by the label, else the host aria-label', async () => {
        const labelled = await fixture(
            html`<hmi-segmented-control label="View" required .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(part(labelled, 'base').getAttribute('aria-labelledby')).toBe(
            'label',
        );
        expect(part(labelled, 'label').textContent).toContain('View');
        const named = await fixture(
            html`<hmi-segmented-control aria-label="Layout" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(part(named, 'base').getAttribute('aria-label')).toBe('Layout');
    });

    it('checks the segment of the value, and disables the disabled option', async () => {
        const el = await fixture(
            html`<hmi-segmented-control value="grid" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(checked(el)).toEqual([false, true, false, false]);
        expect(segs(el)[2]?.disabled).toBe(true);
    });

    it('chooses on a click and fires hmi-change once with the value; the same segment again fires nothing', async () => {
        const el = await fixture(
            html`<hmi-segmented-control value="list" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        const seen: string[] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push(
                (e as CustomEvent<SegmentedControlValueDetail>).detail.value,
            ),
        );
        segs(el)[1]?.click();
        await el.updateComplete;
        expect(el.value).toBe('grid');
        expect(checked(el)).toEqual([false, true, false, false]);
        segs(el)[1]?.click();
        await el.updateComplete;
        expect(seen).toEqual(['grid']);
    });

    it('keeps one tab stop: the chosen segment, else the first enabled one', async () => {
        const chosen = await fixture(
            html`<hmi-segmented-control value="table" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(segs(chosen).map((s) => s.tabIndex)).toEqual([-1, -1, -1, 0]);
        const none = await fixture(
            html`<hmi-segmented-control .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(segs(none).map((s) => s.tabIndex)).toEqual([0, -1, -1, -1]);
    });

    it('moves and chooses with the arrow keys, wrapping and skipping disabled segments', async () => {
        const el = await fixture(
            html`<hmi-segmented-control value="list" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        const seen: string[] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push(
                (e as CustomEvent<SegmentedControlValueDetail>).detail.value,
            ),
        );
        await press(el, 0, 'ArrowRight');
        expect(el.value).toBe('grid');
        expect(active(el)).toBe(segs(el)[1]);
        await press(el, 1, 'ArrowDown');
        expect(el.value).toBe('table');
        await press(el, 3, 'ArrowRight');
        expect(el.value).toBe('list');
        await press(el, 0, 'ArrowLeft');
        expect(el.value).toBe('table');
        await press(el, 3, 'Home');
        expect(el.value).toBe('list');
        await press(el, 0, 'End');
        expect(el.value).toBe('table');
        await press(el, 3, 'ArrowUp');
        expect(el.value).toBe('grid');
        expect(seen).toEqual([
            'grid',
            'table',
            'list',
            'table',
            'list',
            'table',
            'grid',
        ]);
    });

    it('ignores other keys', async () => {
        const el = await fixture(
            html`<hmi-segmented-control value="list" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        const event = await press(el, 0, 'a');
        expect(event.defaultPrevented).toBe(false);
        expect(el.value).toBe('list');
    });

    it('lets a listener veto a choice by setting value back', async () => {
        const el = await fixture(
            html`<hmi-segmented-control value="list" .options=${OPTIONS}></hmi-segmented-control>`,
        );
        el.addEventListener('hmi-change', () => {
            el.value = 'list';
        });
        segs(el)[1]?.click();
        await el.updateComplete;
        expect(el.value).toBe('list');
        expect(checked(el)).toEqual([true, false, false, false]);
    });

    it('takes a rich label and an icon from the label-<value> and icon-<value> slots', async () => {
        const el = await fixture(
            html`<hmi-segmented-control .options=${OPTIONS}
                ><b slot="label-grid">Grid view</b
                ><svg slot="icon-list" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg
            ></hmi-segmented-control>`,
        );
        await el.updateComplete;
        const slot = (name: string) =>
            el.shadowRoot?.querySelector(
                `slot[name="${name}"]`,
            ) as HTMLSlotElement;
        expect(slot('label-grid').assignedElements()).toHaveLength(1);
        expect(slot('label-list').assignedElements()).toHaveLength(0);
        expect(slot('icon-list').assignedElements()).toHaveLength(1);
        const icons =
            el.shadowRoot?.querySelectorAll<HTMLElement>('[part~="icon"]');
        expect(icons?.[0]?.hidden).toBe(false);
        expect(icons?.[1]?.hidden).toBe(true);
    });

    it('disables every segment while disabled, also by an ancestor fieldset', async () => {
        const el = await fixture(
            html`<hmi-segmented-control disabled .options=${OPTIONS}></hmi-segmented-control>`,
        );
        expect(segs(el).every((s) => s.disabled)).toBe(true);
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-segmented-control name="n" .options=${OPTIONS}></hmi-segmented-control></fieldset>`,
            host,
        );
        const inner = host.querySelector(
            'hmi-segmented-control',
        ) as HmiSegmentedControl;
        await inner.updateComplete;
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await inner.updateComplete;
        expect(segs(inner).every((s) => s.disabled)).toBe(true);
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector(
                'hmi-segmented-control',
            ) as HmiSegmentedControl;
            await el.updateComplete;
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits the chosen value under its name, and nothing while none is chosen', async () => {
            const { form, el } = await formFixture(
                html`<hmi-segmented-control name="view" .options=${OPTIONS}></hmi-segmented-control>`,
            );
            expect(new FormData(form).has('view')).toBe(false);
            segs(el)[1]?.click();
            await el.updateComplete;
            expect(new FormData(form).get('view')).toBe('grid');
        });

        it('restores the initial value on reset, or default-value', async () => {
            const { form, el } = await formFixture(
                html`<hmi-segmented-control name="view" value="list" .options=${OPTIONS}></hmi-segmented-control>`,
            );
            segs(el)[1]?.click();
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('list');
            const withDefault = await formFixture(
                html`<hmi-segmented-control name="view" default-value="table" .options=${OPTIONS}></hmi-segmented-control>`,
            );
            expect(withDefault.el.value).toBe('table');
        });

        it('is invalid while required and nothing is chosen, with a customizable message', async () => {
            const { el } = await formFixture(
                html`<hmi-segmented-control name="view" required .options=${OPTIONS}></hmi-segmented-control>`,
            );
            expect(el.checkValidity()).toBe(false);
            expect(el.validity.valueMissing).toBe(true);
            expect(el.validationMessage).toBe('Please select an option.');
            el.requiredMessage = 'Choose a view.';
            await el.updateComplete;
            expect(el.validationMessage).toBe('Choose a view.');
            el.reportValidity();
            expect(active(el)).toBe(segs(el)[0]);
            segs(el)[1]?.click();
            await el.updateComplete;
            expect(el.checkValidity()).toBe(true);
        });

        it('takes required-message from the attribute', async () => {
            const { el } = await formFixture(
                html`<hmi-segmented-control required required-message="Elige una vista" .options=${OPTIONS}></hmi-segmented-control>`,
            );
            expect(el.validationMessage).toBe('Elige una vista');
        });

        it('is invalid with the error text, shown below and marked on the group', async () => {
            const { el } = await formFixture(
                html`<hmi-segmented-control name="view" value="list" error="Not allowed" hint="Hint" .options=${OPTIONS}></hmi-segmented-control>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Not allowed');
            expect(part(el, 'error').textContent?.trim()).toBe('Not allowed');
            expect(part(el, 'hint')).toBeNull();
            const base = part(el, 'base');
            expect(base.getAttribute('aria-invalid')).toBe('true');
            expect(base.getAttribute('aria-describedby')).toBe('error');
        });

        it('is valid when not required and nothing is chosen', async () => {
            const { el } = await formFixture(
                html`<hmi-segmented-control name="view" .options=${OPTIONS}></hmi-segmented-control>`,
            );
            expect(el.checkValidity()).toBe(true);
        });
    });
});

describe('SegmentedControl (React wrapper)', () => {
    it('maps onChange to hmi-change and takes options', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: string[] = [];
        await act(async () => {
            root.render(
                createElement(SegmentedControl, {
                    options: OPTIONS,
                    onChange: (e) => seen.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector(
            'hmi-segmented-control',
        ) as HmiSegmentedControl;
        await el.updateComplete;
        segs(el)[1]?.click();
        expect(seen).toEqual(['grid']);
        await act(async () => root.unmount());
    });
});
