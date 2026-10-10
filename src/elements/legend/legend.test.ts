import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './legend.js';
import type { HmiLegend, LegendItem } from './legend.js';
import { Legend } from './legend.react.js';

const ITEMS: LegendItem[] = [
    { label: 'Revenue', color: 'rgb(255, 0, 0)' },
    { label: 'Costs', color: 'rgb(0, 128, 0)' },
    { label: 'Forecast', color: 'rgb(0, 0, 255)', inactive: true },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-legend') as HmiLegend;
    await el.updateComplete;
    return el;
}

const all = (el: HmiLegend, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-legend', () => {
    it('registers', () => {
        expect(customElements.get('hmi-legend')).toBeDefined();
    });

    it('renders a list with an entry per item', async () => {
        const el = await fixture(
            html`<hmi-legend .items=${ITEMS}></hmi-legend>`,
        );
        expect(el.shadowRoot?.querySelector('ul')).not.toBeNull();
        expect(all(el, 'item')).toHaveLength(3);
        expect(all(el, 'label').map((l) => l.textContent?.trim())).toEqual([
            'Revenue',
            'Costs',
            'Forecast',
        ]);
    });

    it('takes items as a property only: an items attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-legend items='[{"label":"A","color":"red"}]'></hmi-legend>`,
        );
        expect(all(el, 'item')).toHaveLength(0);
    });

    it('paints each swatch in its colour', async () => {
        const el = await fixture(
            html`<hmi-legend .items=${ITEMS}></hmi-legend>`,
        );
        const swatches = all(el, 'swatch');
        expect(getComputedStyle(swatches[0] as Element).backgroundColor).toBe(
            'rgb(255, 0, 0)',
        );
        expect(getComputedStyle(swatches[1] as Element).backgroundColor).toBe(
            'rgb(0, 128, 0)',
        );
    });

    it('resolves a token colour', async () => {
        const el = await fixture(
            html`<hmi-legend
                style="--primary: rgb(1, 2, 3)"
                .items=${[{ label: 'A', color: 'var(--primary)' }]}
            ></hmi-legend>`,
        );
        expect(
            getComputedStyle(all(el, 'swatch')[0] as Element).backgroundColor,
        ).toBe('rgb(1, 2, 3)');
    });

    it('draws an inactive swatch hollow, with a ring in its colour', async () => {
        const el = await fixture(
            html`<hmi-legend .items=${ITEMS}></hmi-legend>`,
        );
        const swatches = all(el, 'swatch');
        expect(swatches[0]?.hasAttribute('data-inactive')).toBe(false);
        expect(swatches[2]?.hasAttribute('data-inactive')).toBe(true);
        const style = getComputedStyle(swatches[2] as Element);
        expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
        expect(style.boxShadow).toContain('rgb(0, 0, 255)');
    });

    it('slots a rich label by position, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-legend .items=${ITEMS}><b slot="label-1">Spend</b></hmi-legend>`,
        );
        const slot = (n: number) =>
            el.shadowRoot?.querySelector<HTMLSlotElement>(
                `slot[name="label-${n}"]`,
            ) as HTMLSlotElement;
        expect(slot(1).assignedElements()[0]?.textContent).toBe('Spend');
        expect(slot(0).assignedElements()).toHaveLength(0);
        expect(slot(0).textContent?.trim()).toBe('Revenue');
    });

    it('defaults to center and aligns the row', async () => {
        const el = await fixture(
            html`<hmi-legend .items=${ITEMS}></hmi-legend>`,
        );
        const base = all(el, 'base')[0] as HTMLElement;
        expect(el.align).toBe('center');
        expect(el.getAttribute('align')).toBe('center');
        expect(getComputedStyle(base).justifyContent).toBe('center');
        el.align = 'start';
        await el.updateComplete;
        expect(getComputedStyle(base).justifyContent).toBe('flex-start');
        el.align = 'end';
        await el.updateComplete;
        expect(getComputedStyle(base).justifyContent).toBe('flex-end');
    });
});

describe('Legend (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(createElement(Legend, { items: ITEMS, align: 'end' }));
        });
        const el = host.querySelector('hmi-legend') as HmiLegend;
        await el.updateComplete;
        expect(all(el, 'item')).toHaveLength(3);
        expect(el.getAttribute('align')).toBe('end');
        await act(async () => root.unmount());
    });
});
