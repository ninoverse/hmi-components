import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './bullet-chart.js';
import type { HmiBulletChart } from './bullet-chart.js';
import { BulletChart } from './bullet-chart.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-bullet-chart') as HmiBulletChart;
    await el.updateComplete;
    return el;
}

const all = (el: HmiBulletChart, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<SVGElement>(`[part~="${name}"]`) ?? [],
    );

const num = (el: Element | undefined, attr: string) =>
    Number(el?.getAttribute(attr));

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-bullet-chart', () => {
    it('registers', () => {
        expect(customElements.get('hmi-bullet-chart')).toBeDefined();
    });

    it('draws a named image of the default size', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart value="50"></hmi-bullet-chart>`,
        );
        const svg = all(el, 'base')[0] as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('aria-label')).toBe('Bullet chart');
        expect(svg.getAttribute('viewBox')).toBe('0 0 360 48');
    });

    it('names the image from label, then from caption', async () => {
        const named = await fixture(
            html`<hmi-bullet-chart label="Revenue against target" caption="Revenue"></hmi-bullet-chart>`,
        );
        expect(all(named, 'base')[0]?.getAttribute('aria-label')).toBe(
            'Revenue against target',
        );
        const captioned = await fixture(
            html`<hmi-bullet-chart caption="Revenue"></hmi-bullet-chart>`,
        );
        expect(all(captioned, 'base')[0]?.getAttribute('aria-label')).toBe(
            'Revenue',
        );
    });

    it('takes a size', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart width="200" height="40"></hmi-bullet-chart>`,
        );
        expect(all(el, 'base')[0]?.getAttribute('viewBox')).toBe('0 0 200 40');
    });

    it('draws the caption as visible text, and none without it', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart caption="Revenue" value="50"></hmi-bullet-chart>`,
        );
        const caption = all(el, 'caption')[0];
        expect(caption?.textContent?.trim()).toBe('Revenue');
        expect(caption?.getAttribute('text-anchor')).toBe('end');
        const bare = await fixture(
            html`<hmi-bullet-chart value="50"></hmi-bullet-chart>`,
        );
        expect(all(bare, 'caption')).toHaveLength(0);
    });

    it('makes room for the caption: the track starts at 100 with it, 4 without', async () => {
        const withCaption = await fixture(
            html`<hmi-bullet-chart caption="Revenue" value="50" max="100"></hmi-bullet-chart>`,
        );
        const measure = all(withCaption, 'measure')[0];
        expect(num(measure, 'x')).toBe(100);
        // The track is 360 - 100 - 4 = 256 wide: half of it.
        expect(num(measure, 'width')).toBeCloseTo(128, 3);
        const bare = await fixture(
            html`<hmi-bullet-chart value="50" max="100"></hmi-bullet-chart>`,
        );
        expect(num(all(bare, 'measure')[0], 'x')).toBe(4);
        expect(num(all(bare, 'measure')[0], 'width')).toBeCloseTo(176, 3);
    });

    it('sizes the measure bar from the value and rounds it', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart value="78" max="100" caption="R"></hmi-bullet-chart>`,
        );
        const measure = all(el, 'measure')[0];
        expect(num(measure, 'width')).toBeCloseTo(0.78 * 256, 3);
        expect(num(measure, 'y')).toBeCloseTo(48 * 0.32, 3);
        expect(num(measure, 'height')).toBeCloseTo(48 * 0.36, 3);
        expect(measure?.getAttribute('rx')).toBe('2');
    });

    it('stops the measure bar at the ends of the scale', async () => {
        const over = await fixture(
            html`<hmi-bullet-chart value="500" max="100"></hmi-bullet-chart>`,
        );
        expect(num(all(over, 'measure')[0], 'width')).toBeCloseTo(352, 3);
        const under = await fixture(
            html`<hmi-bullet-chart value="-5" min="0" max="100"></hmi-bullet-chart>`,
        );
        expect(num(all(under, 'measure')[0], 'width')).toBe(0);
    });

    it('defaults max to the largest of value, target, ranges and 1', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart
                value="40"
                target="160"
                .ranges=${[50, 120]}
            ></hmi-bullet-chart>`,
        );
        // The scale runs 0 to 160, so the value is a quarter of the 352 track.
        expect(num(all(el, 'measure')[0], 'width')).toBeCloseTo(88, 3);
        const small = await fixture(
            html`<hmi-bullet-chart value="0.5"></hmi-bullet-chart>`,
        );
        // Nothing larger than 1: the value is half of the scale.
        expect(num(all(small, 'measure')[0], 'width')).toBeCloseTo(176, 3);
    });

    it('draws a band per range, from min to max', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart
                caption="R"
                max="100"
                .ranges=${[50, 75]}
            ></hmi-bullet-chart>`,
        );
        const bands = all(el, 'band');
        expect(bands).toHaveLength(3);
        expect(num(bands[0], 'x')).toBe(100);
        expect(num(bands[1], 'x')).toBeCloseTo(228, 3);
        expect(num(bands[2], 'x')).toBeCloseTo(292, 3);
        expect(num(bands[2], 'x') + num(bands[2], 'width')).toBeCloseTo(356, 3);
        expect(num(bands[0], 'y')).toBeCloseTo(48 * 0.18, 3);
        expect(num(bands[0], 'height')).toBeCloseTo(48 * 0.64, 3);
    });

    it('draws one band without ranges, and ignores thresholds outside the scale', async () => {
        const one = await fixture(
            html`<hmi-bullet-chart max="100"></hmi-bullet-chart>`,
        );
        expect(all(one, 'band')).toHaveLength(1);
        const outside = await fixture(
            html`<hmi-bullet-chart max="100" .ranges=${[0, 50, 100, 200]}></hmi-bullet-chart>`,
        );
        expect(all(outside, 'band')).toHaveLength(2);
    });

    it('takes ranges as a property only: the attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart max="100" ranges="[50, 75]"></hmi-bullet-chart>`,
        );
        expect(all(el, 'band')).toHaveLength(1);
    });

    it('shades the bands from light to dark, cycling', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart
                style="--surface-container-high: rgb(1, 1, 1); --surface-container-highest: rgb(2, 2, 2); --outline-variant: rgb(3, 3, 3)"
                max="100"
                .ranges=${[20, 40, 60]}
            ></hmi-bullet-chart>`,
        );
        expect(all(el, 'band').map((b) => getComputedStyle(b).fill)).toEqual([
            'rgb(1, 1, 1)',
            'rgb(2, 2, 2)',
            'rgb(3, 3, 3)',
            'rgb(1, 1, 1)',
        ]);
    });

    it('fills the measure bar from color, defaulting to the primary token', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart
                style="--primary: rgb(1, 2, 3)"
                value="10"
            ></hmi-bullet-chart>`,
        );
        expect(getComputedStyle(all(el, 'measure')[0] as Element).fill).toBe(
            'rgb(1, 2, 3)',
        );
        const red = await fixture(
            html`<hmi-bullet-chart color="rgb(255, 0, 0)" value="10"></hmi-bullet-chart>`,
        );
        expect(getComputedStyle(all(red, 'measure')[0] as Element).fill).toBe(
            'rgb(255, 0, 0)',
        );
    });

    it('draws a target tick only with a target, a little taller than the track', async () => {
        const none = await fixture(
            html`<hmi-bullet-chart value="10"></hmi-bullet-chart>`,
        );
        expect(all(none, 'target')).toHaveLength(0);
        const el = await fixture(
            html`<hmi-bullet-chart
                caption="R"
                style="--on-background: rgb(9, 9, 9)"
                max="100"
                target="85"
            ></hmi-bullet-chart>`,
        );
        const tick = all(el, 'target')[0];
        expect(num(tick, 'x1')).toBeCloseTo(100 + 0.85 * 256, 3);
        expect(num(tick, 'x2')).toBeCloseTo(100 + 0.85 * 256, 3);
        expect(num(tick, 'y1')).toBeCloseTo(48 * 0.18 - 2, 3);
        expect(num(tick, 'y2')).toBeCloseTo(48 * 0.18 + 48 * 0.64 + 2, 3);
        const style = getComputedStyle(tick as Element);
        expect(style.stroke).toBe('rgb(9, 9, 9)');
        expect(style.strokeWidth).toBe('3px');
    });

    it('draws a target of zero', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart max="100" target="0"></hmi-bullet-chart>`,
        );
        expect(all(el, 'target')).toHaveLength(1);
    });

    it('updates when the value changes', async () => {
        const el = await fixture(
            html`<hmi-bullet-chart value="10" max="100"></hmi-bullet-chart>`,
        );
        const before = num(all(el, 'measure')[0], 'width');
        el.value = 80;
        await el.updateComplete;
        expect(num(all(el, 'measure')[0], 'width')).toBeGreaterThan(before);
    });
});

describe('BulletChart (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(BulletChart, {
                    caption: 'Revenue',
                    value: 78,
                    target: 85,
                    max: 100,
                    ranges: [50, 75],
                }),
            );
        });
        const el = host.querySelector('hmi-bullet-chart') as HmiBulletChart;
        await el.updateComplete;
        expect(el.value).toBe(78);
        expect(all(el, 'band')).toHaveLength(3);
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Revenue');
        await act(async () => root.unmount());
    });
});
