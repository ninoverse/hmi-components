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

    it('ignores an invalid ratio and leaves the host style alone', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio ratio="nonsense" style="width: 200px; color: red"><div style="height: 30px"></div></hmi-aspect-ratio>`,
        );
        expect(el.style.color).toBe('red');
        expect(el.getAttribute('style')).not.toContain('aspect-ratio');
        expect(base(el).getBoundingClientRect().height).toBe(30);
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

    it('clips what overflows the frame', async () => {
        const el = await fixture(
            html`<hmi-aspect-ratio><div></div></hmi-aspect-ratio>`,
        );
        expect(getComputedStyle(base(el)).overflow).toBe('hidden');
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
