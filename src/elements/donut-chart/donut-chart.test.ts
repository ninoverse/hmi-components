import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './donut-chart.js';
import type { DonutChartSegment, HmiDonutChart } from './donut-chart.js';
import { DonutChart } from './donut-chart.react.js';

const SEGMENTS: DonutChartSegment[] = [
    { label: 'A', value: 50, color: 'rgb(255, 0, 0)' },
    { label: 'B', value: 50 },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-donut-chart') as HmiDonutChart;
    await el.updateComplete;
    // Give the slot's `slotchange` a turn.
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

const all = (el: HmiDonutChart, name: string) =>
    Array.from(el.shadowRoot?.querySelectorAll(`[part~="${name}"]`) ?? []);

// The numbers of an arc path: M x,y A r,r 0 large 1 x,y L x,y A r,r 0 large 0 x,y Z,
// so the outer arc ends at index 7, 8.
const nums = (d: string | null) =>
    (d?.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number);

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-donut-chart', () => {
    it('registers', () => {
        expect(customElements.get('hmi-donut-chart')).toBeDefined();
    });

    it('renders nothing without segments, or with a total of zero', async () => {
        const none = await fixture(html`<hmi-donut-chart></hmi-donut-chart>`);
        expect(none.shadowRoot?.querySelector('svg')).toBeNull();
        const zero = await fixture(
            html`<hmi-donut-chart .segments=${[{ label: 'A', value: 0 }]}></hmi-donut-chart>`,
        );
        expect(zero.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes segments as a property only: the attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-donut-chart segments='[{"label":"A","value":1}]'></hmi-donut-chart>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-donut-chart .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        const svg = el.shadowRoot?.querySelector('svg') as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Donut chart');
        expect(svg.getAttribute('viewBox')).toBe('0 0 220 220');
        const base = all(el, 'base')[0] as HTMLElement;
        expect(base.style.width).toBe('220px');
        expect(base.style.height).toBe('220px');
    });

    it('names the image from label and takes a size', async () => {
        const el = await fixture(
            html`<hmi-donut-chart label="Traffic" size="120" .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        const svg = el.shadowRoot?.querySelector('svg') as SVGElement;
        expect(svg.getAttribute('aria-label')).toBe('Traffic');
        expect(svg.getAttribute('viewBox')).toBe('0 0 120 120');
    });

    it('draws one arc per segment', async () => {
        const el = await fixture(
            html`<hmi-donut-chart .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        expect(all(el, 'segment')).toHaveLength(2);
    });

    it('sizes the ring from the radius and the thickness', async () => {
        const el = await fixture(
            html`<hmi-donut-chart .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        const d = all(el, 'segment')[0]?.getAttribute('d') ?? '';
        // Outer radius 108 (110 - 2), inner radius 108 * (1 - 0.32).
        expect(d).toContain('A108,108 0 0 1');
        expect(d).toMatch(/A73\.4\d*,73\.4\d* 0 0 0/);
    });

    it('leaves a gap between segments, in degrees', async () => {
        const el = await fixture(
            html`<hmi-donut-chart gap="0" .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        const [a, b] = all(el, 'segment').map((s) => nums(s.getAttribute('d')));
        // With no gap, the first arc ends where the second starts: the bottom.
        expect(a?.[7]).toBeCloseTo(b?.[0] ?? Number.NaN, 3);
        expect(a?.[8]).toBeCloseTo(b?.[1] ?? Number.NaN, 3);
        const gapped = await fixture(
            html`<hmi-donut-chart gap="10" .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        const [c, d] = all(gapped, 'segment').map((s) =>
            nums(s.getAttribute('d')),
        );
        expect(c?.[7]).not.toBeCloseTo(d?.[0] ?? Number.NaN, 1);
    });

    it('draws the large-arc flag for a segment over half the ring', async () => {
        const el = await fixture(
            html`<hmi-donut-chart
                .segments=${[
                    { label: 'A', value: 75 },
                    { label: 'B', value: 25 },
                ]}
            ></hmi-donut-chart>`,
        );
        const [big, small] = all(el, 'segment');
        expect(big?.getAttribute('d')).toContain('A108,108 0 1 1');
        expect(small?.getAttribute('d')).toContain('A108,108 0 0 1');
    });

    it('draws a lone full segment even with no gap', async () => {
        const el = await fixture(
            html`<hmi-donut-chart gap="0" .segments=${[{ label: 'A', value: 10 }]}></hmi-donut-chart>`,
        );
        const d = nums(all(el, 'segment')[0]?.getAttribute('d') ?? '');
        // The arc's end is off its start, and it is a large arc.
        expect(d[7]).not.toBe(d[0]);
        expect(all(el, 'segment')[0]?.getAttribute('d')).toContain('0 1 1');
    });

    it('ignores a negative value', async () => {
        const el = await fixture(
            html`<hmi-donut-chart
                .segments=${[
                    { label: 'A', value: 10 },
                    { label: 'B', value: -5 },
                ]}
            ></hmi-donut-chart>`,
        );
        expect(all(el, 'segment')).toHaveLength(2);
        expect(all(el, 'segment')[0]?.getAttribute('d')).toContain('0 1 1');
    });

    it('fills each arc from its colour, then the default palette in turn', async () => {
        const el = await fixture(
            html`<hmi-donut-chart
                style="--primary: rgb(1, 1, 1); --tertiary: rgb(2, 2, 2); --secondary: rgb(3, 3, 3)"
                .segments=${[
                    { label: 'A', value: 1, color: 'rgb(255, 0, 0)' },
                    { label: 'B', value: 1 },
                    { label: 'C', value: 1 },
                ]}
            ></hmi-donut-chart>`,
        );
        // A set colour wins; a missing one takes the palette entry at its own index.
        expect(all(el, 'segment').map((s) => getComputedStyle(s).fill)).toEqual(
            ['rgb(255, 0, 0)', 'rgb(2, 2, 2)', 'rgb(3, 3, 3)'],
        );
    });

    it('hides the centre until something is slotted', async () => {
        const el = await fixture(
            html`<hmi-donut-chart .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        expect((all(el, 'center')[0] as HTMLElement).hidden).toBe(true);
    });

    it('shows the slotted centre label over the hole', async () => {
        const el = await fixture(
            html`<hmi-donut-chart .segments=${SEGMENTS}>
                <span slot="center-label">1.2k</span>
            </hmi-donut-chart>`,
        );
        const center = all(el, 'center')[0] as HTMLElement;
        expect(center.hidden).toBe(false);
        // The hole is a square of twice the inner radius, centred.
        const inner = 108 * (1 - 0.32);
        expect(Number.parseFloat(center.style.left)).toBeCloseTo(
            110 - inner,
            3,
        );
        expect(Number.parseFloat(center.style.top)).toBeCloseTo(110 - inner, 3);
        expect(Number.parseFloat(center.style.width)).toBeCloseTo(inner * 2, 3);
        expect(Number.parseFloat(center.style.height)).toBeCloseTo(
            inner * 2,
            3,
        );
        const slot = center.querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedNodes()).toHaveLength(1);
    });

    it('lays the centre label out in the middle, in the display font', async () => {
        const el = await fixture(
            html`<hmi-donut-chart .segments=${SEGMENTS}>
                <span slot="center-label">1.2k</span>
            </hmi-donut-chart>`,
        );
        const style = getComputedStyle(all(el, 'center')[0] as Element);
        expect(style.display).toBe('flex');
        expect(style.justifyContent).toBe('center');
        expect(style.fontWeight).toBe('700');
    });

    it('updates when the segments change', async () => {
        const el = await fixture(
            html`<hmi-donut-chart .segments=${SEGMENTS}></hmi-donut-chart>`,
        );
        el.segments = [{ label: 'A', value: 1 }];
        await el.updateComplete;
        expect(all(el, 'segment')).toHaveLength(1);
    });
});

describe('DonutChart (React wrapper)', () => {
    it('mounts through the React wrapper, with the centre as a slotted child', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(
                    DonutChart,
                    { segments: SEGMENTS, label: 'Traffic', size: 160 },
                    createElement('span', { slot: 'center-label' }, '1.2k'),
                ),
            );
        });
        const el = host.querySelector('hmi-donut-chart') as HmiDonutChart;
        await el.updateComplete;
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.size).toBe(160);
        expect(
            el.shadowRoot?.querySelector('svg')?.getAttribute('aria-label'),
        ).toBe('Traffic');
        expect(all(el, 'segment')).toHaveLength(2);
        expect((all(el, 'center')[0] as HTMLElement).hidden).toBe(false);
        await act(async () => root.unmount());
    });
});
