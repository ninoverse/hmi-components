import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './gauge.js';
import type { HmiGauge } from './gauge.js';
import { Gauge } from './gauge.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-gauge') as HmiGauge;
    await el.updateComplete;
    // Give the slot's `slotchange` a turn, and the re-render it causes.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    return el;
}

const part = (el: HmiGauge, name: string) =>
    el.shadowRoot?.querySelector(`[part~="${name}"]`) as HTMLElement | null;

// The numbers of an arc path: M x1,y1 A r,r 0 0 1 x2,y2.
const nums = (el: Element | null) =>
    (el?.getAttribute('d')?.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number);

// The dial, at size 200 and thickness 0.22: radius 96, stroke 21.12, arc radius 85.44.
const INNER = 96 - (96 * 0.22) / 2;
const DIAL_H = 100 + (96 * 0.22) / 2 + 4;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-gauge', () => {
    it('registers', () => {
        expect(customElements.get('hmi-gauge')).toBeDefined();
    });

    it('draws a named image the size of the dial', async () => {
        const el = await fixture(html`<hmi-gauge value="72"></hmi-gauge>`);
        const svg = el.shadowRoot?.querySelector('svg') as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Gauge: 72 of 100');
        expect(svg.getAttribute('width')).toBe('200');
        expect(Number(svg.getAttribute('height'))).toBeCloseTo(DIAL_H, 3);
    });

    it('names the image from label', async () => {
        const el = await fixture(
            html`<hmi-gauge value="72" label="CPU load"></hmi-gauge>`,
        );
        expect(
            el.shadowRoot?.querySelector('svg')?.getAttribute('aria-label'),
        ).toBe('CPU load');
    });

    it('takes a size', async () => {
        const el = await fixture(
            html`<hmi-gauge value="50" size="120"></hmi-gauge>`,
        );
        expect(el.shadowRoot?.querySelector('svg')?.getAttribute('width')).toBe(
            '120',
        );
        expect(part(el, 'base')?.style.width).toBe('120px');
    });

    it('draws the track as a half circle from left to right', async () => {
        const el = await fixture(html`<hmi-gauge value="50"></hmi-gauge>`);
        const [x1, y1, rx, , , , , x2, y2] = nums(part(el, 'track'));
        expect(x1).toBeCloseTo(100 - INNER, 3);
        expect(y1).toBeCloseTo(100, 3);
        expect(rx).toBeCloseTo(INNER, 3);
        expect(x2).toBeCloseTo(100 + INNER, 3);
        expect(y2).toBeCloseTo(100, 3);
        expect(part(el, 'track')?.getAttribute('stroke-width')).toBe(
            String(96 * 0.22),
        );
    });

    it('draws the value arc from the left to the value’s angle', async () => {
        const half = await fixture(html`<hmi-gauge value="50"></hmi-gauge>`);
        const [, , , , , , , hx, hy] = nums(part(half, 'value'));
        // 50 of 0..100 is straight up.
        expect(hx).toBeCloseTo(100, 3);
        expect(hy).toBeCloseTo(100 - INNER, 3);
        const full = await fixture(html`<hmi-gauge value="100"></hmi-gauge>`);
        expect(nums(part(full, 'value'))[7]).toBeCloseTo(100 + INNER, 3);
    });

    it('clamps the value to min and max', async () => {
        const over = await fixture(html`<hmi-gauge value="500"></hmi-gauge>`);
        expect(nums(part(over, 'value'))[7]).toBeCloseTo(100 + INNER, 3);
        const under = await fixture(html`<hmi-gauge value="-20"></hmi-gauge>`);
        expect(part(under, 'value')).toBeNull();
        const ranged = await fixture(
            html`<hmi-gauge value="15" min="10" max="20"></hmi-gauge>`,
        );
        expect(nums(part(ranged, 'value'))[8]).toBeCloseTo(100 - INNER, 3);
    });

    it('draws no value arc at the lower end of the scale', async () => {
        const el = await fixture(html`<hmi-gauge value="0"></hmi-gauge>`);
        expect(part(el, 'value')).toBeNull();
        expect(part(el, 'track')).not.toBeNull();
    });

    it('takes the thickness as a fraction of the radius', async () => {
        const el = await fixture(
            html`<hmi-gauge value="50" thickness="0.5"></hmi-gauge>`,
        );
        expect(part(el, 'track')?.getAttribute('stroke-width')).toBe('48');
        // The arc radius is 96 - 48 / 2.
        expect(nums(part(el, 'track'))[2]).toBeCloseTo(72, 3);
    });

    it('strokes the arcs from color and track-color, with their defaults', async () => {
        const el = await fixture(
            html`<hmi-gauge
                style="--primary: rgb(1, 2, 3); --surface-container-highest: rgb(4, 5, 6)"
                value="50"
            ></hmi-gauge>`,
        );
        expect(getComputedStyle(part(el, 'value') as Element).stroke).toBe(
            'rgb(1, 2, 3)',
        );
        expect(getComputedStyle(part(el, 'track') as Element).stroke).toBe(
            'rgb(4, 5, 6)',
        );
        const custom = await fixture(
            html`<hmi-gauge
                value="50"
                color="rgb(255, 0, 0)"
                track-color="rgb(0, 255, 0)"
            ></hmi-gauge>`,
        );
        expect(getComputedStyle(part(custom, 'value') as Element).stroke).toBe(
            'rgb(255, 0, 0)',
        );
        expect(getComputedStyle(part(custom, 'track') as Element).stroke).toBe(
            'rgb(0, 255, 0)',
        );
        expect(
            getComputedStyle(part(custom, 'track') as Element).strokeLinecap,
        ).toBe('round');
    });

    it('shows the value as the caption when nothing is slotted', async () => {
        const el = await fixture(html`<hmi-gauge value="72"></hmi-gauge>`);
        const caption = part(el, 'caption') as HTMLElement;
        expect(caption.hidden).toBe(false);
        expect(caption.textContent?.trim()).toBe('72');
        // The room for it is added under the dial.
        expect(
            Number.parseFloat(part(el, 'base')?.style.height ?? ''),
        ).toBeCloseTo(DIAL_H + 36, 3);
    });

    it('shows the slotted caption instead of the value', async () => {
        const el = await fixture(
            html`<hmi-gauge value="72"><span slot="caption">72%</span></hmi-gauge>`,
        );
        const slot = el.shadowRoot?.querySelector(
            'slot[name="caption"]',
        ) as HTMLSlotElement;
        expect(slot.assignedNodes()).toHaveLength(1);
        expect((part(el, 'caption') as HTMLElement).hidden).toBe(false);
    });

    it('draws just the dial with hide-value and no caption', async () => {
        const el = await fixture(
            html`<hmi-gauge value="72" hide-value></hmi-gauge>`,
        );
        expect((part(el, 'caption') as HTMLElement).hidden).toBe(true);
        expect(
            Number.parseFloat(part(el, 'base')?.style.height ?? ''),
        ).toBeCloseTo(DIAL_H, 3);
    });

    it('shows a slotted caption even with hide-value', async () => {
        const el = await fixture(
            html`<hmi-gauge value="72" hide-value><span slot="caption">Good</span></hmi-gauge>`,
        );
        expect((part(el, 'caption') as HTMLElement).hidden).toBe(false);
        expect(
            Number.parseFloat(part(el, 'base')?.style.height ?? ''),
        ).toBeCloseTo(DIAL_H + 36, 3);
    });

    it('sets the caption in the display font under the dial, centred', async () => {
        const el = await fixture(
            html`<hmi-gauge
                style="--on-background: rgb(9, 9, 9)"
                value="72"
            ></hmi-gauge>`,
        );
        const style = getComputedStyle(part(el, 'caption') as Element);
        expect(style.color).toBe('rgb(9, 9, 9)');
        expect(style.fontWeight).toBe('700');
        expect(style.justifyContent).toBe('center');
        // It starts at the dial's baseline.
        expect((part(el, 'caption') as HTMLElement).style.top).toBe('100px');
    });

    it('updates when the value changes', async () => {
        const el = await fixture(html`<hmi-gauge value="10"></hmi-gauge>`);
        const before = nums(part(el, 'value'))[7] ?? 0;
        el.value = 90;
        await el.updateComplete;
        expect(nums(part(el, 'value'))[7]).toBeGreaterThan(before);
        expect(part(el, 'caption')?.textContent?.trim()).toBe('90');
    });
});

describe('Gauge (React wrapper)', () => {
    it('mounts through the React wrapper, with the caption as a slotted child', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(
                    Gauge,
                    { value: 72, label: 'CPU load', hideValue: true },
                    createElement('span', { slot: 'caption' }, '72%'),
                ),
            );
        });
        const el = host.querySelector('hmi-gauge') as HmiGauge;
        await el.updateComplete;
        await new Promise((resolve) => setTimeout(resolve, 0));
        await el.updateComplete;
        expect(el.value).toBe(72);
        expect(el.hideValue).toBe(true);
        expect(
            el.shadowRoot?.querySelector('svg')?.getAttribute('aria-label'),
        ).toBe('CPU load');
        expect((part(el, 'caption') as HTMLElement).hidden).toBe(false);
        await act(async () => root.unmount());
    });
});
