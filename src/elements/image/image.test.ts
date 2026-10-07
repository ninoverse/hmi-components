import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './image.js';
import type { HmiImage, ImageLoadDetail } from './image.js';
import { Image } from './image.react.js';

const GOOD =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='30'%3E%3Crect width='40' height='30' fill='%23e87a5d'/%3E%3C/svg%3E";
const GOOD2 =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='30'%3E%3Crect width='40' height='30' fill='%231f5b58'/%3E%3C/svg%3E";
const BAD = '/this-image-does-not-exist.png';

async function fixture(template: ReturnType<typeof html>): Promise<HmiImage> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-image') as HmiImage;
    await el.updateComplete;
    return el;
}

const part = (el: HmiImage, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const status = (el: HmiImage) => part(el, 'base').getAttribute('data-status');
const img = (el: HmiImage) =>
    el.shadowRoot?.querySelector('img') as HTMLImageElement;

async function until(el: HmiImage, wanted: string) {
    await el.updateComplete;
    for (let i = 0; i < 100 && status(el) !== wanted; i++) {
        await new Promise((r) => setTimeout(r, 20));
        await el.updateComplete;
    }
    expect(status(el)).toBe(wanted);
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-image', () => {
    it('registers', () => {
        expect(customElements.get('hmi-image')).toBeDefined();
    });

    it('renders the built-in image with the alt text and lazy loading, and clears the shimmer on load', async () => {
        const el = await fixture(
            html`<hmi-image src=${GOOD} alt="A cover"></hmi-image>`,
        );
        expect(img(el).getAttribute('alt')).toBe('A cover');
        expect(img(el).loading).toBe('lazy');
        expect(img(el).decoding).toBe('async');
        await until(el, 'loaded');
        expect(part(el, 'loader')).toBeNull();
    });

    it('fires hmi-load with the source', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const seen: string[] = [];
        render(
            html`<hmi-image src=${GOOD} alt="" @hmi-load=${(e: CustomEvent<ImageLoadDetail>) => seen.push(e.detail.src)}></hmi-image>`,
            host,
        );
        const el = host.querySelector('hmi-image') as HmiImage;
        await until(el, 'loaded');
        expect(seen).toHaveLength(1);
        expect(seen[0]).toBe(GOOD);
    });

    it('shows the fallback and fires hmi-error when the source fails', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const seen: string[] = [];
        render(
            html`<hmi-image src=${BAD} alt="" @hmi-error=${(e: CustomEvent<ImageLoadDetail>) => seen.push(e.detail.src)}></hmi-image>`,
            host,
        );
        const el = host.querySelector('hmi-image') as HmiImage;
        await until(el, 'error');
        expect(seen).toHaveLength(1);
        expect(part(el, 'fallback').querySelector('svg')).not.toBeNull();
        expect(part(el, 'media').hidden).toBe(true);
    });

    it('shows a slotted fallback on error', async () => {
        const el = await fixture(
            html`<hmi-image src=${BAD} alt=""><span slot="fallback">Gone</span></hmi-image>`,
        );
        await until(el, 'error');
        const slot = el.shadowRoot?.querySelector(
            'slot[name="fallback"]',
        ) as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
    });

    it('starts loading again when src changes, after a failure too', async () => {
        const el = await fixture(
            html`<hmi-image src=${BAD} alt=""></hmi-image>`,
        );
        await until(el, 'error');
        el.src = GOOD;
        await el.updateComplete;
        await until(el, 'loaded');
        expect(part(el, 'media').hidden).toBe(false);
        el.src = GOOD2;
        await el.updateComplete;
        await until(el, 'loaded');
    });

    it('resolves an image that is already complete before the element is ready', async () => {
        const first = await fixture(
            html`<hmi-image src=${GOOD} alt=""></hmi-image>`,
        );
        await until(first, 'loaded');
        const second = await fixture(
            html`<hmi-image src=${GOOD} alt=""></hmi-image>`,
        );
        await until(second, 'loaded');
    });

    it('reserves space with ratio, width and height, as pixels for numbers and numeric strings', async () => {
        const el = await fixture(
            html`<hmi-image src=${GOOD} alt="" ratio="2" width="280"></hmi-image>`,
        );
        const box = part(el, 'base').getBoundingClientRect();
        expect([box.width, box.height]).toEqual([280, 140]);
        el.height = 100;
        el.ratio = undefined;
        await el.updateComplete;
        expect(part(el, 'base').getBoundingClientRect().height).toBe(100);
        el.width = '50%';
        await el.updateComplete;
        expect(part(el, 'base').style.width).toBe('50%');
    });

    it('applies fit and position to the built-in image', async () => {
        const el = await fixture(
            html`<hmi-image src=${GOOD} alt="" fit="contain" position="top"></hmi-image>`,
        );
        const style = getComputedStyle(img(el));
        expect(style.objectFit).toBe('contain');
        expect(style.objectPosition).toBe('50% 0%');
    });

    it('uses the radius preset', async () => {
        const el = await fixture(
            html`<hmi-image src=${GOOD} alt="" radius="none"></hmi-image>`,
        );
        expect(el.radius).toBe('none');
        expect(el.getAttribute('radius')).toBe('none');
        expect(part(el, 'base').classList.contains('radius-none')).toBe(true);
    });

    it('takes the shimmer, none, or a custom background as the placeholder', async () => {
        const none = await fixture(
            html`<hmi-image src=${BAD} alt="" placeholder="none"></hmi-image>`,
        );
        expect(part(none, 'loader')).toBeNull();
        const custom = await fixture(
            html`<hmi-image src=${BAD} alt="" placeholder="#1f5b58"></hmi-image>`,
        );
        expect(part(custom, 'loader')).toBeNull();
        expect(part(custom, 'base').style.background).toContain(
            'rgb(31, 91, 88)',
        );
    });

    it('forwards loading, srcset, sizes, crossorigin and referrerpolicy to the built-in image', async () => {
        const el = await fixture(
            html`<hmi-image src=${GOOD} alt="" loading="eager" srcset="a.png 1x, b.png 2x" sizes="100vw" crossorigin="anonymous" referrerpolicy="no-referrer"></hmi-image>`,
        );
        const i = img(el);
        expect(i.loading).toBe('eager');
        expect(i.getAttribute('srcset')).toBe('a.png 1x, b.png 2x');
        expect(i.getAttribute('sizes')).toBe('100vw');
        expect(i.crossOrigin).toBe('anonymous');
        expect(i.referrerPolicy).toBe('no-referrer');
    });

    describe('slotted image', () => {
        it('replaces the built-in image, and its load clears the shimmer', async () => {
            const el = await fixture(
                html`<hmi-image ratio="1.5" width="200"><img src=${GOOD} alt="Mine" /></hmi-image>`,
            );
            const slot = el.shadowRoot?.querySelector(
                'slot:not([name])',
            ) as HTMLSlotElement;
            expect(slot.assignedElements()).toHaveLength(1);
            await until(el, 'loaded');
            const slotted = el.querySelector('img') as HTMLImageElement;
            expect(getComputedStyle(slotted).position).toBe('relative');
        });

        it('shows the fallback when the slotted image fails', async () => {
            const el = await fixture(
                html`<hmi-image><img src=${BAD} alt="" /></hmi-image>`,
            );
            await until(el, 'error');
            expect(part(el, 'media').hidden).toBe(true);
        });

        it('hears an image inside a slotted wrapper, such as a picture', async () => {
            const el = await fixture(
                html`<hmi-image><picture><img src=${GOOD} alt="" /></picture></hmi-image>`,
            );
            await until(el, 'loaded');
        });

        it('lets an absolutely positioned slotted image fill the shell', async () => {
            const el = await fixture(
                html`<hmi-image ratio="2" width="200"><img src=${GOOD} alt="" style="position: absolute; inset: 0" /></hmi-image>`,
            );
            await until(el, 'loaded');
            const slotted = el.querySelector('img') as HTMLImageElement;
            const shell = part(el, 'base').getBoundingClientRect();
            const box = slotted.getBoundingClientRect();
            expect([box.width, box.height]).toEqual([
                shell.width,
                shell.height,
            ]);
        });
    });
});

describe('Image (React wrapper)', () => {
    it('maps onLoad and onError to the events, and takes children as the slotted image', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: string[] = [];
        await act(async () => {
            root.render(
                createElement(
                    Image,
                    {
                        alt: 'x',
                        onLoad: () => seen.push('load'),
                        onError: () => seen.push('error'),
                    },
                    createElement('img', { src: GOOD, alt: 'x' }),
                ),
            );
        });
        const el = host.querySelector('hmi-image') as HmiImage;
        await until(el, 'loaded');
        expect(seen).toEqual(['load']);
        await act(async () => root.unmount());
    });
});
