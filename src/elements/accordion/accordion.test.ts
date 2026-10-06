import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './accordion.js';
import type {
    AccordionItem,
    AccordionOpenChangeDetail,
    HmiAccordion,
} from './accordion.js';
import { Accordion } from './accordion.react.js';

const ITEMS: AccordionItem[] = [
    { title: 'Install', body: 'Run pnpm add.' },
    { title: 'Theme', body: 'Import the CSS.' },
    { title: 'Disabled', body: 'Never shown.', disabled: true },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-accordion') as HmiAccordion;
    await el.updateComplete;
    return el;
}

const triggers = (el: HmiAccordion) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLButtonElement>(
            '[part~="trigger"]',
        ) ?? [],
    );
const panels = (el: HmiAccordion) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>('[part~="panel"]') ?? [],
    );
const expanded = (el: HmiAccordion) =>
    triggers(el).map((t) => t.getAttribute('aria-expanded') === 'true');

async function click(el: HmiAccordion, index: number) {
    triggers(el)[index]?.click();
    await el.updateComplete;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-accordion', () => {
    it('registers', () => {
        expect(customElements.get('hmi-accordion')).toBeDefined();
    });

    it('renders a trigger and a panel per item, with the text', async () => {
        const el = await fixture(
            html`<hmi-accordion .items=${ITEMS}></hmi-accordion>`,
        );
        expect(triggers(el)).toHaveLength(3);
        expect(triggers(el)[0]?.textContent?.trim()).toBe('Install');
        expect(panels(el)[1]?.textContent?.trim()).toBe('Import the CSS.');
        expect(expanded(el)).toEqual([false, false, false]);
    });

    it('wires each trigger to its panel inside the shadow root', async () => {
        const el = await fixture(
            html`<hmi-accordion .items=${ITEMS}></hmi-accordion>`,
        );
        const trigger = triggers(el)[1] as HTMLButtonElement;
        const panel = panels(el)[1] as HTMLElement;
        expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
        expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
        expect(el.shadowRoot?.getElementById(panel.id)).toBe(panel);
    });

    it('opens the default-open sections, and open wins when set', async () => {
        const seeded = await fixture(
            html`<hmi-accordion default-open="[1]" .items=${ITEMS}></hmi-accordion>`,
        );
        expect(seeded.open).toEqual([1]);
        expect(expanded(seeded)).toEqual([false, true, false]);
        const explicit = await fixture(
            html`<hmi-accordion .open=${[0]} default-open="[1]" .items=${ITEMS}></hmi-accordion>`,
        );
        expect(explicit.open).toEqual([0]);
    });

    it('opens one section at a time by default, and fires hmi-open-change with the sorted indices', async () => {
        const el = await fixture(
            html`<hmi-accordion .items=${ITEMS}></hmi-accordion>`,
        );
        const seen: number[][] = [];
        el.addEventListener('hmi-open-change', (e) =>
            seen.push(
                (e as CustomEvent<AccordionOpenChangeDetail>).detail.open,
            ),
        );
        await click(el, 0);
        expect(expanded(el)).toEqual([true, false, false]);
        await click(el, 1);
        expect(expanded(el)).toEqual([false, true, false]);
        await click(el, 1);
        expect(expanded(el)).toEqual([false, false, false]);
        expect(seen).toEqual([[0], [1], []]);
    });

    it('keeps several open with multiple, sorted', async () => {
        const el = await fixture(
            html`<hmi-accordion multiple .items=${[...ITEMS.slice(0, 2), { title: 'C', body: 'c' }]}></hmi-accordion>`,
        );
        const seen: number[][] = [];
        el.addEventListener('hmi-open-change', (e) =>
            seen.push(
                (e as CustomEvent<AccordionOpenChangeDetail>).detail.open,
            ),
        );
        await click(el, 2);
        await click(el, 0);
        await click(el, 2);
        expect(seen).toEqual([[2], [0, 2], [0]]);
    });

    it('does not toggle a disabled item', async () => {
        const el = await fixture(
            html`<hmi-accordion .items=${ITEMS}></hmi-accordion>`,
        );
        expect(triggers(el)[2]?.disabled).toBe(true);
        await click(el, 2);
        expect(el.open).toEqual([]);
    });

    it('makes a closed panel inert and an open one not', async () => {
        const el = await fixture(
            html`<hmi-accordion .open=${[0]} .items=${ITEMS}></hmi-accordion>`,
        );
        expect(panels(el).map((p) => p.hasAttribute('inert'))).toEqual([
            false,
            true,
            true,
        ]);
        await click(el, 0);
        expect(panels(el)[0]?.hasAttribute('inert')).toBe(true);
        expect(panels(el)[0]?.getAttribute('data-open')).toBe('false');
    });

    it('lets a listener veto a toggle by setting open back', async () => {
        const el = await fixture(
            html`<hmi-accordion .open=${[0]} .items=${ITEMS}></hmi-accordion>`,
        );
        el.addEventListener('hmi-open-change', () => {
            el.open = [0];
        });
        await click(el, 1);
        expect(expanded(el)).toEqual([true, false, false]);
    });

    it('follows open set from outside, without firing events', async () => {
        const el = await fixture(
            html`<hmi-accordion .items=${ITEMS}></hmi-accordion>`,
        );
        let fired = 0;
        el.addEventListener('hmi-open-change', () => fired++);
        el.open = [1];
        await el.updateComplete;
        expect(expanded(el)).toEqual([false, true, false]);
        expect(fired).toBe(0);
    });

    it('takes a rich title and body from the title-<index> and body-<index> slots', async () => {
        const el = await fixture(
            html`<hmi-accordion .items=${ITEMS}
                ><b slot="title-0">Install it</b><p slot="body-1">Rich body</p></hmi-accordion
            >`,
        );
        const slot = (name: string) =>
            el.shadowRoot?.querySelector(
                `slot[name="${name}"]`,
            ) as HTMLSlotElement;
        expect(slot('title-0').assignedElements()).toHaveLength(1);
        expect(slot('title-1').assignedElements()).toHaveLength(0);
        expect(slot('body-1').assignedElements()).toHaveLength(1);
    });

    it('accepts items as a JSON attribute', async () => {
        const el = await fixture(
            html`<hmi-accordion items='[{"title":"A","body":"a"}]'></hmi-accordion>`,
        );
        expect(triggers(el)).toHaveLength(1);
    });

    it('collapses a closed panel to no height and shows an open one', async () => {
        const el = await fixture(
            html`<hmi-accordion .open=${[0]} .items=${ITEMS}></hmi-accordion>`,
        );
        el.style.setProperty('--duration-medium-1', '0ms');
        await el.updateComplete;
        expect(panels(el)[0]?.getBoundingClientRect().height).toBeGreaterThan(
            0,
        );
        expect(panels(el)[1]?.getBoundingClientRect().height).toBe(0);
    });
});

describe('Accordion (React wrapper)', () => {
    it('maps onOpenChange to hmi-open-change and takes items', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: number[][] = [];
        await act(async () => {
            root.render(
                createElement(Accordion, {
                    items: ITEMS,
                    onOpenChange: (e) => seen.push(e.detail.open),
                }),
            );
        });
        const el = host.querySelector('hmi-accordion') as HmiAccordion;
        await el.updateComplete;
        await click(el, 1);
        expect(seen).toEqual([[1]]);
        await act(async () => root.unmount());
    });
});
