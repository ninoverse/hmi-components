import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './aspect-ratio.js';
import type { HmiAspectRatio } from './aspect-ratio.js';
import { AspectRatio } from './aspect-ratio.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiAspectRatio> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiAspectRatio;
    await el.updateComplete;
    return el;
}

const base = (el: HmiAspectRatio) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-aspect-ratio', () => {
    it('registers', () => {
        expect(customElements.get('hmi-aspect-ratio')).toBeDefined();
    });

    it('defaults to a square frame', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio style="width: 200px"><div></div></hmi-aspect-ratio>`,
        );
        expect(el.ratio).toBe(1);
        const { width, height } = base(el).getBoundingClientRect();
        expect(width).toBe(200);
        expect(height).toBe(200);
    });

    it('reads a CSS ratio string', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="2/1" style="width: 200px"><div></div></hmi-aspect-ratio>`,
        );
        expect(el.ratio).toBe('2/1');
        expect(base(el).getBoundingClientRect().height).toBe(100);
    });

    it('reads a numeric attribute as a number', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="2" style="width: 200px"><div></div></hmi-aspect-ratio>`,
        );
        expect(el.ratio).toBe(2);
        expect(base(el).getBoundingClientRect().height).toBe(100);
    });

    it('takes a number through the property', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio .ratio=${4} style="width: 200px"><div></div></hmi-aspect-ratio>`,
        );
        expect(base(el).getBoundingClientRect().height).toBe(50);
        el.ratio = '1/2';
        await el.updateComplete;
        expect(base(el).getBoundingClientRect().height).toBe(400);
    });

    it('draws an unusable ratio as the default square, and leaves the host style alone', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="nonsense" style="width: 200px; color: red"><div style="height: 30px"></div></hmi-aspect-ratio>`,
        );
        expect(el.style.color).toBe('red');
        expect(el.getAttribute('style')).not.toContain('aspect-ratio');
        expect(base(el).getBoundingClientRect().height).toBe(200);
        for (const ratio of ['3:2', '', '0', '-2', '16/0']) {
            el.setAttribute('ratio', ratio);
            await el.updateComplete;
            expect(base(el).getBoundingClientRect().height, ratio).toBe(200);
        }
    });

    it('goes back to the default when the ratio is removed, not to the last one', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="2" style="width: 200px"><div></div></hmi-aspect-ratio>`,
        );
        expect(base(el).getBoundingClientRect().height).toBe(100);
        el.removeAttribute('ratio');
        await el.updateComplete;
        expect(base(el).getBoundingClientRect().height).toBe(200);
        el.ratio = '4';
        await el.updateComplete;
        (el as { ratio: unknown }).ratio = undefined;
        await el.updateComplete;
        expect(base(el).getBoundingClientRect().height).toBe(200);
    });

    it('fills its row in a flex container, as v5 did', async () => {
        const el = await fixture(
            html`<div style="display: flex; width: 300px"><hmi-aspect-ratio ratio="2"><div></div></hmi-aspect-ratio></div>`,
        );
        const frame = el.firstElementChild as HmiAspectRatio;
        await frame.updateComplete;
        expect(frame.getBoundingClientRect().width).toBe(300);
        expect(base(frame).getBoundingClientRect().height).toBe(150);
    });

    it('takes a height set on the host, and clips to it', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="16/9" style="width: 200px; height: 60px"><div></div></hmi-aspect-ratio>`,
        );
        expect(base(el).getBoundingClientRect().height).toBe(60);
        expect(
            (el.children[0] as HTMLElement).getBoundingClientRect().height,
        ).toBe(60);
        expect(getComputedStyle(el).overflow).toBe('hidden');
    });

    it('clips its content to a radius set on the host', async () => {
        const el = await fixture(
            html`<div style="display: grid; grid-template-columns: 200px 200px">
                <hmi-aspect-ratio ratio="2" style="border-radius: 40px"><div style="background: red"></div></hmi-aspect-ratio>
                <hmi-aspect-ratio ratio="1"><div></div></hmi-aspect-ratio>
            </div>`,
        );
        const frame = el.firstElementChild as HmiAspectRatio;
        await frame.updateComplete;
        /* the grid row stretches the host to 200px; the frame is 100px */
        expect(frame.getBoundingClientRect().height).toBe(200);
        const { left, top, bottom } = base(frame).getBoundingClientRect();
        const child = frame.children[0];
        expect(document.elementFromPoint(left + 3, top + 3)).not.toBe(child);
        expect(document.elementFromPoint(left + 3, bottom - 3)).not.toBe(child);
        expect(document.elementFromPoint(left + 40, top + 50)).toBe(child);
    });

    it('stretches the first child to fill the frame', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="2" style="width: 200px"
                ><div></div
                ><div style="height: 5px"></div
            ></hmi-aspect-ratio>`,
        );
        const first = el.children[0] as HTMLElement;
        const { width, height } = first.getBoundingClientRect();
        expect(width).toBe(200);
        expect(height).toBe(100);
        expect(getComputedStyle(first).objectFit).toBe('cover');
        expect(getComputedStyle(el.children[1] as Element).objectFit).toBe(
            'fill',
        );
    });

    it('keeps a padded or bordered first child inside the frame', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="2" style="width: 200px"
                ><div style="padding: 10px; border: 2px solid"></div
            ></hmi-aspect-ratio>`,
        );
        const { width, height } = (
            el.children[0] as HTMLElement
        ).getBoundingClientRect();
        expect(width).toBe(200);
        expect(height).toBe(100);
    });

    it('clips what overflows the frame', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio><div></div></hmi-aspect-ratio>`,
        );
        expect(getComputedStyle(base(el)).overflow).toBe('hidden');
    });

    it('projects the default slot', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio><img alt="" /></hmi-aspect-ratio>`,
        );
        const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedElements()).toEqual([el.children[0]]);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    AspectRatio,
                    { ratio: 2, style: { width: 200 } },
                    createElement('div'),
                ),
            );
        });
        const el = mount.querySelector('hmi-aspect-ratio') as HmiAspectRatio;
        await el.updateComplete;
        expect(el.ratio).toBe(2);
        expect(base(el).getBoundingClientRect().height).toBe(100);
    });
});
