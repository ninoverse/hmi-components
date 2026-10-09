import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import './stepper.js';
import type {
    HmiStepper,
    StepperChangeDetail,
    StepperStep,
} from './stepper.js';
import { Stepper } from './stepper.react.js';

const STEPS: StepperStep[] = [
    { value: 'cart', label: 'Cart', description: 'Review items' },
    { value: 'address', label: 'Address' },
    { value: 'pay', label: 'Payment' },
    { value: 'done', label: 'Done' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-stepper') as HmiStepper;
    await el.updateComplete;
    return el;
}

const settle = () => new Promise((r) => setTimeout(r));

const all = (el: HmiStepper, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

const slotOf = (el: HmiStepper, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(
        `slot[name="${name}"]`,
    ) as HTMLSlotElement;

function onChange(el: HmiStepper) {
    const seen: string[] = [];
    el.addEventListener('hmi-change', (e) =>
        seen.push((e as CustomEvent<StepperChangeDetail>).detail.value),
    );
    return seen;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-stepper', () => {
    beforeAll(async () => {
        await page.viewport(1000, 800);
    });

    afterAll(async () => {
        await page.viewport(414, 896);
    });

    it('registers', () => {
        expect(customElements.get('hmi-stepper')).toBeDefined();
    });

    it('renders a named ordered list with a step per entry', async () => {
        const el = await fixture(
            html`<hmi-stepper current="address" .steps=${STEPS}></hmi-stepper>`,
        );
        const ol = el.shadowRoot?.querySelector('ol');
        expect(ol?.getAttribute('aria-label')).toBe('Progress steps');
        expect(all(el, 'step')).toHaveLength(4);
        expect(all(el, 'label').map((l) => l.textContent?.trim())).toEqual([
            'Cart',
            'Address',
            'Payment',
            'Done',
        ]);
    });

    it('names the list from label', async () => {
        const el = await fixture(
            html`<hmi-stepper label="Checkout" .steps=${STEPS}></hmi-stepper>`,
        );
        expect(
            el.shadowRoot?.querySelector('ol')?.getAttribute('aria-label'),
        ).toBe('Checkout');
    });

    it('takes steps as a property only: a steps attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-stepper steps='[{"value":"a","label":"A"}]'></hmi-stepper>`,
        );
        expect(all(el, 'step')).toHaveLength(0);
    });

    it('marks steps before current completed, the current active, the rest upcoming', async () => {
        const el = await fixture(
            html`<hmi-stepper current="pay" .steps=${STEPS}></hmi-stepper>`,
        );
        const steps = all(el, 'step');
        expect(steps.map((s) => s.dataset.status)).toEqual([
            'completed',
            'completed',
            'active',
            'upcoming',
        ]);
        expect(steps.map((s) => s.getAttribute('aria-current'))).toEqual([
            null,
            null,
            'step',
            null,
        ]);
    });

    it('treats every step as upcoming when current matches none', async () => {
        const el = await fixture(
            html`<hmi-stepper .steps=${STEPS}></hmi-stepper>`,
        );
        expect(
            all(el, 'step').every((s) => s.dataset.status === 'upcoming'),
        ).toBe(true);
        expect(
            all(el, 'step').some((s) => s.hasAttribute('aria-current')),
        ).toBe(false);
    });

    it('draws numbers, and a check for a completed step', async () => {
        const el = await fixture(
            html`<hmi-stepper current="pay" .steps=${STEPS}></hmi-stepper>`,
        );
        const indicators = all(el, 'indicator');
        expect(indicators[0]?.querySelector('svg')).not.toBeNull();
        expect(indicators[0]?.textContent?.trim()).toBe('');
        expect(indicators[2]?.textContent?.trim()).toBe('3');
        expect(indicators[3]?.textContent?.trim()).toBe('4');
        expect(
            indicators.every((i) => i.getAttribute('aria-hidden') === 'true'),
        ).toBe(true);
    });

    it('draws a connector between steps, not after the last', async () => {
        const el = await fixture(
            html`<hmi-stepper .steps=${STEPS}></hmi-stepper>`,
        );
        expect(all(el, 'connector')).toHaveLength(3);
    });

    it('shows a description only for a step that has one', async () => {
        const el = await fixture(
            html`<hmi-stepper .steps=${STEPS}></hmi-stepper>`,
        );
        const d = all(el, 'description');
        expect(d[0]?.hidden).toBe(false);
        expect(d[0]?.textContent?.trim()).toBe('Review items');
        expect(d[1]?.hidden).toBe(true);
    });

    it('slots a rich label and description by value', async () => {
        const el = await fixture(
            html`<hmi-stepper .steps=${STEPS}>
                <b slot="label-cart">Basket</b>
                <i slot="description-address">Where to</i>
            </hmi-stepper>`,
        );
        await settle();
        expect(
            slotOf(el, 'label-cart').assignedElements()[0]?.textContent,
        ).toBe('Basket');
        expect(slotOf(el, 'label-address').textContent?.trim()).toBe('Address');
        expect(all(el, 'description')[1]?.hidden).toBe(false);
    });

    it('defaults to horizontal and takes vertical, reflected', async () => {
        const el = await fixture(
            html`<hmi-stepper .steps=${STEPS}></hmi-stepper>`,
        );
        expect(el.orientation).toBe('horizontal');
        expect(el.getAttribute('orientation')).toBe('horizontal');
        const base = all(el, 'base')[0] as HTMLElement;
        expect(getComputedStyle(base).flexDirection).toBe('row');
        el.orientation = 'vertical';
        await el.updateComplete;
        expect(getComputedStyle(base).flexDirection).toBe('column');
    });

    it('sets the gap between vertical steps from spacing', async () => {
        const el = await fixture(
            html`<hmi-stepper
                orientation="vertical"
                spacing="30px"
                .steps=${STEPS}
            ></hmi-stepper>`,
        );
        const steps = all(el, 'step');
        expect(getComputedStyle(steps[0] as HTMLElement).paddingBottom).toBe(
            '30px',
        );
        expect(getComputedStyle(steps[3] as HTMLElement).paddingBottom).toBe(
            '0px',
        );
    });

    it('also takes the gap from a --stepper-item-gap set on the host', async () => {
        const el = await fixture(
            html`<hmi-stepper
                style="--stepper-item-gap: 40px"
                orientation="vertical"
                .steps=${STEPS}
            ></hmi-stepper>`,
        );
        expect(
            getComputedStyle(all(el, 'step')[0] as HTMLElement).paddingBottom,
        ).toBe('40px');
    });
});

describe('hmi-stepper changes', () => {
    it('makes only completed steps buttons', async () => {
        const el = await fixture(
            html`<hmi-stepper current="pay" .steps=${STEPS}></hmi-stepper>`,
        );
        expect(all(el, 'button').map((b) => b.tagName)).toEqual([
            'BUTTON',
            'BUTTON',
            'SPAN',
            'SPAN',
        ]);
    });

    it('fires hmi-change when a completed step is chosen', async () => {
        const el = await fixture(
            html`<hmi-stepper current="pay" .steps=${STEPS}></hmi-stepper>`,
        );
        const seen = onChange(el);
        all(el, 'button')[0]?.click();
        expect(seen).toEqual(['cart']);
    });

    it('is controlled: it keeps current until the consumer sets it', async () => {
        const el = await fixture(
            html`<hmi-stepper current="pay" .steps=${STEPS}></hmi-stepper>`,
        );
        all(el, 'button')[0]?.click();
        await el.updateComplete;
        expect(el.current).toBe('pay');
        el.current = 'cart';
        await el.updateComplete;
        expect(all(el, 'step').map((s) => s.dataset.status)).toEqual([
            'active',
            'upcoming',
            'upcoming',
            'upcoming',
        ]);
    });

    it('does not fire from the active or an upcoming step', async () => {
        const el = await fixture(
            html`<hmi-stepper current="address" .steps=${STEPS}></hmi-stepper>`,
        );
        const seen = onChange(el);
        all(el, 'button')[1]?.click();
        all(el, 'button')[2]?.click();
        expect(seen).toEqual([]);
    });

    it('makes completed steps plain text when readonly', async () => {
        const el = await fixture(
            html`<hmi-stepper readonly current="pay" .steps=${STEPS}></hmi-stepper>`,
        );
        expect(all(el, 'button').every((b) => b.tagName === 'SPAN')).toBe(true);
        expect(el.hasAttribute('readonly')).toBe(true);
    });
});

describe('hmi-stepper on a narrow screen', () => {
    afterAll(async () => {
        await page.viewport(414, 896);
    });

    it('falls back to the vertical layout below 40em', async () => {
        await page.viewport(400, 800);
        const el = await fixture(
            html`<hmi-stepper .steps=${STEPS}></hmi-stepper>`,
        );
        expect(
            getComputedStyle(all(el, 'base')[0] as HTMLElement).flexDirection,
        ).toBe('column');
    });

    it('keeps the horizontal layout on a wide screen', async () => {
        await page.viewport(1000, 800);
        const el = await fixture(
            html`<hmi-stepper .steps=${STEPS}></hmi-stepper>`,
        );
        expect(
            getComputedStyle(all(el, 'base')[0] as HTMLElement).flexDirection,
        ).toBe('row');
    });
});

describe('Stepper (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: string[] = [];
        await act(async () => {
            root.render(
                createElement(Stepper, {
                    steps: STEPS,
                    current: 'pay',
                    orientation: 'vertical',
                    onChange: (e) => seen.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector('hmi-stepper') as HmiStepper;
        await el.updateComplete;
        expect(el.current).toBe('pay');
        expect(el.getAttribute('orientation')).toBe('vertical');
        expect(all(el, 'step')).toHaveLength(4);
        all(el, 'button')[1]?.click();
        expect(seen).toEqual(['address']);
        await act(async () => root.unmount());
    });
});
