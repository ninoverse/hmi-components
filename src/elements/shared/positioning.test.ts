import { html, LitElement, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { afterEach, describe, expect, it } from 'vitest';
import {
    type PlacementAlign,
    type PlacementSide,
    PositionController,
    placement,
} from './positioning.js';

const ANCHOR = {
    left: 100,
    top: 200,
    right: 220,
    bottom: 232,
    width: 120,
    height: 32,
};
const VIEWPORT = { width: 1000, height: 800 };
const at = (side: PlacementSide, align: PlacementAlign, offset = 6) =>
    placement({ anchor: ANCHOR, viewport: VIEWPORT, side, align, offset });

describe('placement', () => {
    it('puts a panel below the anchor, from its left edge, with the gap', () => {
        expect(at('bottom', 'start')).toEqual({
            top: '238px',
            right: 'auto',
            bottom: 'auto',
            left: '100px',
            translate: 'none',
        });
    });

    it('ends a bottom panel at the anchor’s right edge, measured from the far edge', () => {
        expect(at('bottom', 'end')).toMatchObject({
            top: '238px',
            left: 'auto',
            right: '780px',
        });
    });

    it('centres a bottom panel on the anchor, with a translate rather than a transform', () => {
        expect(at('bottom', 'center')).toMatchObject({
            top: '238px',
            left: '160px',
            translate: '-50% 0',
        });
    });

    it('puts a panel above the anchor by its bottom inset, so it grows upward', () => {
        expect(at('top', 'start')).toMatchObject({
            top: 'auto',
            bottom: '606px',
            left: '100px',
        });
    });

    it('puts a panel to the right of the anchor, from its top edge', () => {
        expect(at('right', 'start')).toMatchObject({
            left: '226px',
            right: 'auto',
            top: '200px',
            bottom: 'auto',
        });
    });

    it('puts a panel to the left of the anchor by its right inset', () => {
        expect(at('left', 'start')).toMatchObject({
            right: '906px',
            left: 'auto',
            top: '200px',
        });
    });

    it('ends and centres a side panel along the anchor’s height', () => {
        expect(at('right', 'end')).toMatchObject({
            bottom: '568px',
            top: 'auto',
        });
        expect(at('left', 'center')).toMatchObject({
            top: '216px',
            translate: '0 -50%',
        });
    });

    it('takes no gap when the offset is zero', () => {
        expect(at('bottom', 'start', 0).top).toBe('232px');
        expect(at('top', 'start', 0).bottom).toBe('600px');
    });
});

@customElement('x-position-host')
class PositionHost extends LitElement {
    align: PlacementAlign = 'start';
    gap = 4;
    readonly position = new PositionController(this, {
        anchor: () => this.renderRoot.querySelector('.anchor'),
        panel: () => this.renderRoot.querySelector<HTMLElement>('.panel'),
        align: () => this.align,
        offset: () => this.gap,
        matchWidth: true,
    });

    override render() {
        return html`<button class="anchor" style="display: block; width: 90px; height: 30px; margin: 50px 0 0 70px">anchor</button>
            <div class="panel" style="position: fixed; margin: 0">panel</div>`;
    }
}

async function fixture() {
    const host = document.createElement('div');
    document.body.append(host);
    render(html`<x-position-host></x-position-host>`, host);
    const el = host.querySelector('x-position-host') as PositionHost;
    await el.updateComplete;
    return el;
}

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const panel = (el: PositionHost) =>
    el.renderRoot.querySelector('.panel') as HTMLElement;
const anchor = (el: PositionHost) =>
    el.renderRoot.querySelector('.anchor') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('PositionController', () => {
    it('places the panel against the anchor on start, and writes the anchor’s width', async () => {
        const el = await fixture();
        el.position.start();
        const a = anchor(el).getBoundingClientRect();
        const p = panel(el).getBoundingClientRect();
        expect(p.top).toBeCloseTo(a.bottom + 4, 1);
        expect(p.left).toBeCloseTo(a.left, 1);
        expect(panel(el).style.getPropertyValue('--_anchor-width')).toBe(
            '90px',
        );
        el.position.stop();
    });

    it('follows the anchor when the window resizes', async () => {
        const el = await fixture();
        el.position.start();
        const before = panel(el).getBoundingClientRect().left;
        anchor(el).style.marginLeft = '170px';
        window.dispatchEvent(new Event('resize'));
        await frame();
        await frame();
        expect(panel(el).getBoundingClientRect().left).toBeCloseTo(
            before + 100,
            1,
        );
        el.position.stop();
    });

    it('follows the anchor when the anchor changes size', async () => {
        const el = await fixture();
        el.position.start();
        anchor(el).style.height = '60px';
        await frame();
        await frame();
        const a = anchor(el).getBoundingClientRect();
        expect(panel(el).getBoundingClientRect().top).toBeCloseTo(
            a.bottom + 4,
            1,
        );
        el.position.stop();
    });

    it('reads align again on every update', async () => {
        const el = await fixture();
        el.position.start();
        el.align = 'end';
        el.position.update();
        const a = anchor(el).getBoundingClientRect();
        expect(panel(el).getBoundingClientRect().right).toBeCloseTo(a.right, 1);
        el.position.stop();
    });

    it('reads the offset again on every update when it is a function', async () => {
        const el = await fixture();
        el.position.start();
        el.gap = 10;
        el.position.update();
        const a = anchor(el).getBoundingClientRect();
        expect(panel(el).getBoundingClientRect().top).toBeCloseTo(
            a.bottom + 10,
            1,
        );
        el.position.stop();
    });

    it('stops following on stop, and on disconnect', async () => {
        const el = await fixture();
        el.position.start();
        el.position.stop();
        const before = panel(el).style.left;
        anchor(el).style.marginLeft = '300px';
        window.dispatchEvent(new Event('resize'));
        await frame();
        await frame();
        expect(panel(el).style.left).toBe(before);
        el.position.start();
        el.remove();
        // Disconnected: the controller let go of the window.
        window.dispatchEvent(new Event('resize'));
        await frame();
    });

    it('does nothing without an anchor or a panel', async () => {
        const el = await fixture();
        panel(el).remove();
        expect(() => el.position.update()).not.toThrow();
    });
});
