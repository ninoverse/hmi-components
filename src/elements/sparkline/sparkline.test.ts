import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './sparkline.js';
import type { HmiSparkline } from './sparkline.js';
import { Sparkline } from './sparkline.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-sparkline') as HmiSparkline;
    await el.updateComplete;
    return el;
}

const part = (el: HmiSparkline, name: string) =>
    el.shadowRoot?.querySelector(`[part~="${name}"]`) as SVGElement | null;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-sparkline', () => {
    it('registers', () => {
        expect(customElements.get('hmi-sparkline')).toBeDefined();
    });

    it('renders nothing without data', async () => {
        const el = await fixture(html`<hmi-sparkline></hmi-sparkline>`);
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('takes data as a property only: a data attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-sparkline data="[1,2,3]"></hmi-sparkline>`,
        );
        expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('draws an image of the default size', async () => {
        const el = await fixture(
            html`<hmi-sparkline .data=${[1, 2, 3]}></hmi-sparkline>`,
        );
        const svg = part(el, 'base') as SVGElement;
        expect(svg.getAttribute('role')).toBe('img');
        expect(svg.getAttribute('width')).toBe('120');
        expect(svg.getAttribute('height')).toBe('32');
        expect(svg.getAttribute('viewBox')).toBe('0 0 120 32');
    });

    it('names the image from label, and has no name without it', async () => {
        const named = await fixture(
            html`<hmi-sparkline label="Upward trend" .data=${[1, 2]}></hmi-sparkline>`,
        );
        expect(part(named, 'base')?.getAttribute('aria-label')).toBe(
            'Upward trend',
        );
        const bare = await fixture(
            html`<hmi-sparkline .data=${[1, 2]}></hmi-sparkline>`,
        );
        expect(part(bare, 'base')?.hasAttribute('aria-label')).toBe(false);
    });

    it('draws the line through the points, scaled to the data range', async () => {
        const el = await fixture(
            html`<hmi-sparkline .data=${[0, 10, 5]}></hmi-sparkline>`,
        );
        expect(part(el, 'line')?.getAttribute('d')).toBe('M2,30 L60,2 L118,16');
        expect(part(el, 'line')?.getAttribute('stroke-width')).toBe('2');
    });

    it('centres a single point, and draws a flat line along the bottom', async () => {
        const single = await fixture(
            html`<hmi-sparkline .data=${[7]}></hmi-sparkline>`,
        );
        expect(part(single, 'line')?.getAttribute('d')).toBe('M60,30');
        const flat = await fixture(
            html`<hmi-sparkline .data=${[3, 3, 3]}></hmi-sparkline>`,
        );
        expect(part(flat, 'line')?.getAttribute('d')).toBe(
            'M2,30 L60,30 L118,30',
        );
    });

    it('scales to min and max when they are set', async () => {
        const el = await fixture(
            html`<hmi-sparkline min="0" max="20" .data=${[0, 10]}></hmi-sparkline>`,
        );
        expect(part(el, 'line')?.getAttribute('d')).toBe('M2,30 L118,16');
    });

    it('insets the plot by the stroke width', async () => {
        const el = await fixture(
            html`<hmi-sparkline stroke-width="4" .data=${[0, 10]}></hmi-sparkline>`,
        );
        expect(part(el, 'line')?.getAttribute('d')).toBe('M4,28 L116,4');
    });

    it('fills the area under the line only with area', async () => {
        const plain = await fixture(
            html`<hmi-sparkline .data=${[0, 10, 5]}></hmi-sparkline>`,
        );
        expect(part(plain, 'area')).toBeNull();
        const filled = await fixture(
            html`<hmi-sparkline area .data=${[0, 10, 5]}></hmi-sparkline>`,
        );
        expect(part(filled, 'area')?.getAttribute('d')).toBe(
            'M2,30 L60,2 L118,16 L118,30 L2,30 Z',
        );
        expect(
            Number(getComputedStyle(part(filled, 'area') as Element).opacity),
        ).toBeCloseTo(0.15);
    });

    it('draws a dot at the last point only with show-dot, and insets the plot for it', async () => {
        const plain = await fixture(
            html`<hmi-sparkline .data=${[0, 10, 5]}></hmi-sparkline>`,
        );
        expect(part(plain, 'dot')).toBeNull();
        const dotted = await fixture(
            html`<hmi-sparkline show-dot .data=${[0, 10, 5]}></hmi-sparkline>`,
        );
        const dot = part(dotted, 'dot') as SVGElement;
        expect(dot.getAttribute('r')).toBe('3');
        expect(dot.getAttribute('cx')).toBe('116');
        expect(dot.getAttribute('cy')).toBe('16');
    });

    it('colours the line, area and dot from color, tokens included', async () => {
        const el = await fixture(
            html`<hmi-sparkline
                style="--primary: rgb(1, 2, 3)"
                area
                show-dot
                .data=${[0, 10, 5]}
            ></hmi-sparkline>`,
        );
        for (const name of ['line', 'area', 'dot']) {
            const style = getComputedStyle(part(el, name) as Element);
            const painted = name === 'line' ? style.stroke : style.fill;
            expect(painted).toBe('rgb(1, 2, 3)');
        }
        el.color = 'rgb(9, 8, 7)';
        await el.updateComplete;
        expect(getComputedStyle(part(el, 'line') as Element).stroke).toBe(
            'rgb(9, 8, 7)',
        );
    });

    it('takes width and height', async () => {
        const el = await fixture(
            html`<hmi-sparkline width="200" height="48" .data=${[0, 10]}></hmi-sparkline>`,
        );
        const svg = part(el, 'base') as SVGElement;
        expect(svg.getAttribute('width')).toBe('200');
        expect(svg.getAttribute('viewBox')).toBe('0 0 200 48');
        expect(part(el, 'line')?.getAttribute('d')).toBe('M2,46 L198,2');
    });

    it('updates when the data changes', async () => {
        const el = await fixture(
            html`<hmi-sparkline .data=${[0, 10]}></hmi-sparkline>`,
        );
        el.data = [10, 0];
        await el.updateComplete;
        expect(part(el, 'line')?.getAttribute('d')).toBe('M2,2 L118,30');
    });
});

describe('Sparkline (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(Sparkline, {
                    data: [4, 8, 5],
                    label: 'Trend',
                    area: true,
                    showDot: true,
                    strokeWidth: 3,
                }),
            );
        });
        const el = host.querySelector('hmi-sparkline') as HmiSparkline;
        await el.updateComplete;
        expect(el.area).toBe(true);
        expect(el.showDot).toBe(true);
        expect(el.strokeWidth).toBe(3);
        expect(part(el, 'base')?.getAttribute('aria-label')).toBe('Trend');
        expect(part(el, 'dot')).not.toBeNull();
        await act(async () => root.unmount());
    });
});
