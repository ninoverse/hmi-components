import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './chart-tooltip.js';
import type { ChartTooltipItem, HmiChartTooltip } from './chart-tooltip.js';
import { ChartTooltip } from './chart-tooltip.react.js';

const ITEMS: ChartTooltipItem[] = [
    { label: 'Revenue', value: '$48.2k', color: 'rgb(255, 0, 0)' },
    { label: 'Costs', value: '$31.7k' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-chart-tooltip') as HmiChartTooltip;
    await el.updateComplete;
    return el;
}

const settle = () => new Promise((r) => setTimeout(r));

const all = (el: HmiChartTooltip, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

const slotOf = (el: HmiChartTooltip, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(
        `slot[name="${name}"]`,
    ) as HTMLSlotElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-chart-tooltip', () => {
    it('registers', () => {
        expect(customElements.get('hmi-chart-tooltip')).toBeDefined();
    });

    it('is a panel-like tooltip with the liquid filter in its own root', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip .items=${ITEMS}></hmi-chart-tooltip>`,
        );
        const card = all(el, 'base')[0] as HTMLElement;
        expect(card.getAttribute('part')).toBe('base panel');
        expect(card.getAttribute('role')).toBe('tooltip');
        expect(el.shadowRoot?.querySelector('#liquid-glass')).not.toBeNull();
    });

    it('renders a row per item with its label and value', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip .items=${ITEMS}></hmi-chart-tooltip>`,
        );
        expect(all(el, 'row')).toHaveLength(2);
        expect(all(el, 'label').map((n) => n.textContent?.trim())).toEqual([
            'Revenue',
            'Costs',
        ]);
        expect(all(el, 'value').map((n) => n.textContent?.trim())).toEqual([
            '$48.2k',
            '$31.7k',
        ]);
    });

    it('takes items as a property only: an items attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip items='[{"label":"A","value":"1"}]'></hmi-chart-tooltip>`,
        );
        expect(all(el, 'row')).toHaveLength(0);
    });

    it('draws a swatch only for a row with a colour', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip .items=${ITEMS}></hmi-chart-tooltip>`,
        );
        const rows = all(el, 'row');
        expect(rows[0]?.querySelector('[part~="swatch"]')).not.toBeNull();
        expect(rows[1]?.querySelector('[part~="swatch"]')).toBeNull();
        expect(
            getComputedStyle(all(el, 'swatch')[0] as Element).backgroundColor,
        ).toBe('rgb(255, 0, 0)');
    });

    it('shows the heading, and hides it when there is none', async () => {
        const withHeading = await fixture(
            html`<hmi-chart-tooltip heading="Jan 2026" .items=${ITEMS}></hmi-chart-tooltip>`,
        );
        const heading = all(withHeading, 'heading')[0] as HTMLElement;
        expect(heading.hidden).toBe(false);
        expect(heading.textContent?.trim()).toBe('Jan 2026');
        const bare = await fixture(
            html`<hmi-chart-tooltip .items=${ITEMS}></hmi-chart-tooltip>`,
        );
        await settle();
        expect(all(bare, 'heading')[0]?.hidden).toBe(true);
    });

    it('shows a slotted heading even without heading text', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip .items=${ITEMS}
                ><b slot="heading">Q1</b></hmi-chart-tooltip
            >`,
        );
        await settle();
        expect(all(el, 'heading')[0]?.hidden).toBe(false);
        expect(slotOf(el, 'heading').assignedElements()[0]?.textContent).toBe(
            'Q1',
        );
    });

    it('slots a rich label and value by position, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip .items=${ITEMS}>
                <i slot="label-1">Spend</i>
                <b slot="value-0">48k</b>
            </hmi-chart-tooltip>`,
        );
        expect(slotOf(el, 'label-1').assignedElements()[0]?.textContent).toBe(
            'Spend',
        );
        expect(slotOf(el, 'value-0').assignedElements()[0]?.textContent).toBe(
            '48k',
        );
        expect(slotOf(el, 'label-0').textContent?.trim()).toBe('Revenue');
    });

    it('ignores the pointer, so it never covers what it points at', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip .items=${ITEMS}></hmi-chart-tooltip>`,
        );
        expect(getComputedStyle(el).pointerEvents).toBe('none');
    });

    it('paints from the ink panel token', async () => {
        const el = await fixture(
            html`<hmi-chart-tooltip
                style="--panel-ink-bg: rgb(10, 20, 30)"
                .items=${ITEMS}
            ></hmi-chart-tooltip>`,
        );
        expect(
            getComputedStyle(all(el, 'base')[0] as Element).backgroundColor,
        ).toBe('rgb(10, 20, 30)');
    });
});

describe('ChartTooltip (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(ChartTooltip, {
                    heading: 'Jan 2026',
                    items: ITEMS,
                }),
            );
        });
        const el = host.querySelector('hmi-chart-tooltip') as HmiChartTooltip;
        await el.updateComplete;
        expect(el.heading).toBe('Jan 2026');
        expect(all(el, 'row')).toHaveLength(2);
        await act(async () => root.unmount());
    });
});
