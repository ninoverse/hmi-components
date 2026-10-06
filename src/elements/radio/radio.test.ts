import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './radio.js';
import type { HmiRadio } from './radio.js';
import { Radio } from './radio.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const radios = Array.from(host.querySelectorAll<HmiRadio>('hmi-radio'));
    await Promise.all(radios.map((r) => r.updateComplete));
    // Peers update each other once more.
    await Promise.all(radios.map((r) => r.updateComplete));
    return { host, radios };
}

const input = (el: HmiRadio) =>
    el.shadowRoot?.querySelector('input') as HTMLInputElement;
const part = (el: HmiRadio, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const settle = async (radios: HmiRadio[]) => {
    await Promise.all(radios.map((r) => r.updateComplete));
    await Promise.all(radios.map((r) => r.updateComplete));
};
const press = async (el: HmiRadio, key: string, radios: HmiRadio[]) => {
    input(el).dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
    await settle(radios);
};

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-radio', () => {
    it('registers', () => {
        expect(customElements.get('hmi-radio')).toBeDefined();
    });

    it('renders a native radio, a round box at the React size, and a label', async () => {
        const { radios } = await fixture(
            html`<hmi-radio label="Small"></hmi-radio>`,
        );
        const [el] = radios as [HmiRadio];
        expect(input(el).type).toBe('radio');
        const box = part(el, 'box').getBoundingClientRect();
        expect([box.width, box.height]).toEqual([20, 20]);
        expect(part(el, 'label').textContent?.trim()).toBe('Small');
    });

    it('fires hmi-change with checked true when it becomes checked, and cannot be unchecked by a click', async () => {
        const { radios } = await fixture(
            html`<hmi-radio name="s" value="a" label="A"></hmi-radio>`,
        );
        const [el] = radios as [HmiRadio];
        const seen: boolean[] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push((e as CustomEvent<{ checked: boolean }>).detail.checked),
        );
        input(el).click();
        await el.updateComplete;
        expect(el.checked).toBe(true);
        input(el).click();
        await el.updateComplete;
        expect(el.checked).toBe(true);
        expect(seen).toEqual([true]);
    });

    describe('group', () => {
        const trio = html`
            <hmi-radio name="size" value="sm" label="S"></hmi-radio>
            <hmi-radio name="size" value="md" label="M"></hmi-radio>
            <hmi-radio name="size" value="lg" label="L" disabled></hmi-radio>
            <hmi-radio name="size" value="xl" label="XL"></hmi-radio>
            <hmi-radio name="other" value="x" label="Other"></hmi-radio>
        `;

        it('unchecks the others of the name when one is checked, and only those', async () => {
            const { radios } = await fixture(trio);
            const [sm, md, , xl, other] = radios as HmiRadio[] as [
                HmiRadio,
                HmiRadio,
                HmiRadio,
                HmiRadio,
                HmiRadio,
            ];
            other.checked = true;
            sm.checked = true;
            await settle(radios);
            md.checked = true;
            await settle(radios);
            expect(sm.checked).toBe(false);
            expect(md.checked).toBe(true);
            expect(input(sm).checked).toBe(false);
            expect(other.checked).toBe(true);
            xl.checked = true;
            await settle(radios);
            expect(md.checked).toBe(false);
        });

        it('does not fire hmi-change on the radio that loses the check', async () => {
            const { radios } = await fixture(trio);
            const [sm, md] = radios as [HmiRadio, HmiRadio];
            sm.checked = true;
            await settle(radios);
            let fired = 0;
            sm.addEventListener('hmi-change', () => fired++);
            input(md).click();
            await settle(radios);
            expect(sm.checked).toBe(false);
            expect(fired).toBe(0);
        });

        it('moves and checks with the arrow keys, wrapping and skipping disabled', async () => {
            const { radios } = await fixture(trio);
            const [sm, md, , xl] = radios as [
                HmiRadio,
                HmiRadio,
                HmiRadio,
                HmiRadio,
                HmiRadio,
            ];
            const seen: string[] = [];
            for (const r of [sm, md, xl])
                r.addEventListener('hmi-change', () => seen.push(r.value));
            sm.checked = true;
            await settle(radios);
            await press(sm, 'ArrowDown', radios);
            expect(md.checked).toBe(true);
            expect(md.shadowRoot?.activeElement).toBe(input(md));
            await press(md, 'ArrowRight', radios);
            expect(xl.checked).toBe(true);
            await press(xl, 'ArrowDown', radios);
            expect(sm.checked).toBe(true);
            await press(sm, 'ArrowUp', radios);
            expect(xl.checked).toBe(true);
            await press(xl, 'ArrowLeft', radios);
            expect(md.checked).toBe(true);
            expect(seen).toEqual(['md', 'xl', 'sm', 'xl', 'md']);
        });

        it('keeps one tab stop: the checked radio, else the first enabled', async () => {
            const { radios } = await fixture(trio);
            const [sm, md, lg, xl, other] = radios as [
                HmiRadio,
                HmiRadio,
                HmiRadio,
                HmiRadio,
                HmiRadio,
            ];
            const tabIndexes = () =>
                [sm, md, lg, xl].map((r) => input(r).tabIndex);
            expect(tabIndexes()).toEqual([0, -1, -1, -1]);
            md.checked = true;
            await settle(radios);
            expect(tabIndexes()).toEqual([-1, 0, -1, -1]);
            expect(input(other).tabIndex).toBe(0);
        });

        it('tells assistive technology its place in the group', async () => {
            const { radios } = await fixture(trio);
            const [, md] = radios as [HmiRadio, HmiRadio];
            expect(input(md).getAttribute('aria-posinset')).toBe('2');
            expect(input(md).getAttribute('aria-setsize')).toBe('4');
        });

        it('groups only within the same form', async () => {
            const host = document.createElement('div');
            document.body.append(host);
            render(
                html`<form id="a"><hmi-radio name="n" value="1"></hmi-radio></form>
                    <form id="b"><hmi-radio name="n" value="2"></hmi-radio></form>`,
                host,
            );
            const radios = Array.from(
                host.querySelectorAll<HmiRadio>('hmi-radio'),
            );
            await settle(radios);
            const [a, b] = radios as [HmiRadio, HmiRadio];
            a.checked = true;
            await settle(radios);
            b.checked = true;
            await settle(radios);
            expect(a.checked).toBe(true);
            expect(b.checked).toBe(true);
        });

        it('leaves a radio without a name alone', async () => {
            const { radios } = await fixture(
                html`<hmi-radio value="1"></hmi-radio><hmi-radio value="2"></hmi-radio>`,
            );
            const [a, b] = radios as [HmiRadio, HmiRadio];
            a.checked = true;
            b.checked = true;
            await settle(radios);
            expect(a.checked && b.checked).toBe(true);
            expect(input(a).tabIndex).toBe(0);
        });
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const { host, radios } = await fixture(html`<form>${inner}</form>`);
            return {
                form: host.querySelector('form') as HTMLFormElement,
                radios,
            };
        }

        it('submits the checked radio under the shared name', async () => {
            const { form, radios } = await formFixture(html`
                <hmi-radio name="size" value="sm"></hmi-radio>
                <hmi-radio name="size" value="md" checked></hmi-radio>
            `);
            expect(new FormData(form).getAll('size')).toEqual(['md']);
            input(radios[0] as HmiRadio).click();
            await settle(radios);
            expect(new FormData(form).getAll('size')).toEqual(['sm']);
        });

        it('restores the initial state of each radio on reset', async () => {
            const { form, radios } = await formFixture(html`
                <hmi-radio name="size" value="sm" checked></hmi-radio>
                <hmi-radio name="size" value="md"></hmi-radio>
            `);
            const [sm, md] = radios as [HmiRadio, HmiRadio];
            input(md).click();
            await settle(radios);
            expect(sm.checked).toBe(false);
            form.reset();
            await settle(radios);
            expect(sm.checked).toBe(true);
            expect(md.checked).toBe(false);
        });

        it('is required for the group: invalid only while none is checked', async () => {
            const { radios } = await formFixture(html`
                <hmi-radio name="size" value="sm" required></hmi-radio>
                <hmi-radio name="size" value="md" required></hmi-radio>
            `);
            const [sm, md] = radios as [HmiRadio, HmiRadio];
            expect(sm.checkValidity()).toBe(false);
            expect(sm.validity.valueMissing).toBe(true);
            input(md).click();
            await settle(radios);
            expect(sm.checkValidity()).toBe(true);
            expect(md.checkValidity()).toBe(true);
        });

        it('is invalid with the error text', async () => {
            const { radios } = await formFixture(
                html`<hmi-radio name="n" value="a" error="Pick one"></hmi-radio>`,
            );
            const [el] = radios as [HmiRadio];
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Pick one');
        });
    });
});

describe('Radio (React wrapper)', () => {
    it('maps onChange to hmi-change', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: boolean[] = [];
        await act(async () => {
            root.render(
                createElement(Radio, {
                    name: 'n',
                    value: 'a',
                    label: 'A',
                    onChange: (e) => seen.push(e.detail.checked),
                }),
            );
        });
        const el = host.querySelector('hmi-radio') as HmiRadio;
        await el.updateComplete;
        input(el).click();
        expect(seen).toEqual([true]);
        await act(async () => root.unmount());
    });
});
