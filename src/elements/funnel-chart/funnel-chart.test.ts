import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './funnel-chart.js';
import type { FunnelChartStage, HmiFunnelChart } from './funnel-chart.js';
import { FunnelChart } from './funnel-chart.react.js';

const STAGES: FunnelChartStage[] = [
    { label: 'Visited', value: 1200, color: 'rgb(255, 0, 0)' },
    { label: 'Signed up', value: 600 },
    { label: 'Activated', value: 300 },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-funnel-chart') as HmiFunnelChart;
    await el.updateComplete;
    return el;
}

const all = (el: HmiFunnelChart, name: string) =>
    Array.from(el.shadowRoot?.querySelectorAll(`[part~="${name}"]`) ?? []);

const num = (el: Element | undefined, attr: string) =>
    Number(el?.getAttribute(attr));

const pairs = (el: Element | undefined) =>
    (el?.getAttribute('points') ?? '')
        .split(' ')
        .map((p) => p.split(',').map(Number) as [number, number]);

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-funnel-chart', () => {
    it('registers', () => {
        expect(customElements.get('hmi-funnel-chart')).toBeDefined();
    });

    it('renders nothing without stages', async () => {
        const el = await fixture(html`<hmi-funnel-chart></hmi-funnel-chart>`);
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes stages as a property only: the attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart stages='[{"label":"A","value":1}]'></hmi-funnel-chart>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart .stages=${STAGES}></hmi-funnel-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Funnel chart');
        expect(svg.getAttribute('viewBox')).toBe('0 0 500 280');
    });

    it('names the image from label and takes a size', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart
                label="Signup funnel"
                width="400"
                height="200"
                .stages=${STAGES}
            ></hmi-funnel-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('aria-label')).toBe('Signup funnel');
        expect(svg.getAttribute('viewBox')).toBe('0 0 400 200');
    });

    it('draws a centred band per stage, narrowing from one stage to the next', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart .stages=${STAGES}></hmi-funnel-chart>`,
        );
        const bands = all(el, 'band');
        expect(bands).toHaveLength(3);
        // The funnel is 500 - 180 = 320 wide, centred at 160. Bands are 272 / 3 high, 4 apart.
        const h = (280 - 8) / 3;
        const [tl, tr, br, bl] = pairs(bands[0]) as [number, number][];
        expect(tl?.[0]).toBeCloseTo(0, 3);
        expect(tr?.[0]).toBeCloseTo(320, 3);
        expect(br?.[0]).toBeCloseTo(240, 3);
        expect(bl?.[0]).toBeCloseTo(80, 3);
        expect(tl?.[1]).toBeCloseTo(0, 3);
        expect(bl?.[1]).toBeCloseTo(h, 3);
        // The second band starts a gap below the first.
        expect(pairs(bands[1])[0]?.[1]).toBeCloseTo(h + 4, 3);
    });

    it('ends the last band at its own width', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart .stages=${STAGES}></hmi-funnel-chart>`,
        );
        const [tl, tr, br, bl] = pairs(all(el, 'band')[2]) as [
            number,
            number,
        ][];
        // 300 of 1200 is a quarter of 320, top and bottom.
        expect((tr?.[0] ?? 0) - (tl?.[0] ?? 0)).toBeCloseTo(80, 3);
        expect((br?.[0] ?? 0) - (bl?.[0] ?? 0)).toBeCloseTo(80, 3);
    });

    it('takes the gap and the label column width', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart
                gap="10"
                label-width="100"
                .stages=${STAGES}
            ></hmi-funnel-chart>`,
        );
        const h = (280 - 20) / 3;
        expect(pairs(all(el, 'band')[1])[0]?.[1]).toBeCloseTo(h + 10, 3);
        // The funnel is 400 wide now: the first band spans all of it.
        expect(pairs(all(el, 'band')[0])[1]?.[0]).toBeCloseTo(400, 3);
        expect(num(all(el, 'stage-label')[0], 'x')).toBe(412);
    });

    it('puts each label in the right-hand column, centred on its band', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart .stages=${STAGES}></hmi-funnel-chart>`,
        );
        const labels = all(el, 'stage-label');
        expect(labels.map((l) => l.textContent?.trim())).toEqual([
            'Visited',
            'Signed up',
            'Activated',
        ]);
        expect(num(labels[0], 'x')).toBe(332);
        expect(num(labels[0], 'y')).toBeCloseTo((280 - 8) / 3 / 2, 3);
        expect(labels[0]?.getAttribute('text-anchor')).toBe('start');
    });

    it('appends the value and its share of the largest stage with show-values', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart show-values .stages=${STAGES}></hmi-funnel-chart>`,
        );
        expect(
            all(el, 'stage-label').map((l) => l.textContent?.trim()),
        ).toEqual([
            'Visited · 1200 (100%)',
            'Signed up · 600 (50%)',
            'Activated · 300 (25%)',
        ]);
    });

    it('fills each band from its colour, then the default palette in turn', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart
                style="--tertiary: rgb(4, 5, 6); --secondary: rgb(7, 8, 9)"
                .stages=${STAGES}
            ></hmi-funnel-chart>`,
        );
        expect(all(el, 'band').map((b) => getComputedStyle(b).fill)).toEqual([
            'rgb(255, 0, 0)',
            'rgb(4, 5, 6)',
            'rgb(7, 8, 9)',
        ]);
    });

    it('sets the labels in the on-surface token', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart
                style="--on-surface: rgb(9, 9, 9)"
                .stages=${STAGES}
            ></hmi-funnel-chart>`,
        );
        const style = getComputedStyle(all(el, 'stage-label')[0] as Element);
        expect(style.fill).toBe('rgb(9, 9, 9)');
        expect(style.fontWeight).toBe('600');
    });

    it('updates when the stages change', async () => {
        const el = await fixture(
            html`<hmi-funnel-chart .stages=${STAGES}></hmi-funnel-chart>`,
        );
        el.stages = [{ label: 'A', value: 1 }];
        await el.updateComplete;
        expect(all(el, 'band')).toHaveLength(1);
    });
});

describe('FunnelChart (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(FunnelChart, {
                    stages: STAGES,
                    label: 'Signup funnel',
                    showValues: true,
                }),
            );
        });
        const el = host.querySelector('hmi-funnel-chart') as HmiFunnelChart;
        await el.updateComplete;
        expect(el.showValues).toBe(true);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe(
            'Signup funnel',
        );
        expect(all(el, 'band')).toHaveLength(3);
        await act(async () => root.unmount());
    });
});
