import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './carousel.js';
import type { CarouselIndexChangeDetail, HmiCarousel } from './carousel.js';
import { Carousel } from './carousel.react.js';

const slides = html`<div id="a">One</div><div id="b">Two</div><div id="c">Three</div>`;

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiCarousel> {
    const host = document.createElement('div');
    host.style.width = '400px';
    // Away from the test pointer's resting place: a hover would pause autoplay.
    host.style.marginLeft = '1000px';
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-carousel') as HmiCarousel;
    await el.updateComplete;
    await el.updateComplete;
    return el;
}

const part = (el: HmiCarousel, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const dots = (el: HmiCarousel) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[part~="dot"]') ??
            [],
    );
const slideEls = (el: HmiCarousel) => Array.from(el.children) as HTMLElement[];
const transform = (el: HmiCarousel) => part(el, 'track').style.transform;

async function click(el: HmiCarousel, target: HTMLElement) {
    target.click();
    await el.updateComplete;
}

const key = async (el: HmiCarousel, k: string, target?: Element) => {
    target ??= el.children[0] as Element;
    target.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: k,
            bubbles: true,
            composed: true,
            cancelable: true,
        }),
    );
    await el.updateComplete;
};

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-carousel', () => {
    it('registers', () => {
        expect(customElements.get('hmi-carousel')).toBeDefined();
    });

    it('names the region, and gives each slide group semantics and a position label', async () => {
        const el = await fixture(
            html`<hmi-carousel label="Highlights">${slides}</hmi-carousel>`,
        );
        const region = part(el, 'base');
        expect(region.getAttribute('aria-roledescription')).toBe('carousel');
        expect(region.getAttribute('aria-label')).toBe('Highlights');
        expect(slideEls(el).map((s) => s.getAttribute('role'))).toEqual([
            'group',
            'group',
            'group',
        ]);
        expect(
            slideEls(el).map((s) => s.getAttribute('aria-roledescription')),
        ).toEqual(['slide', 'slide', 'slide']);
        expect(slideEls(el).map((s) => s.getAttribute('aria-label'))).toEqual([
            '1 of 3',
            '2 of 3',
            '3 of 3',
        ]);
    });

    it('has the default region name', async () => {
        const el = await fixture(html`<hmi-carousel>${slides}</hmi-carousel>`);
        expect(part(el, 'base').getAttribute('aria-label')).toBe('Carousel');
    });

    it('shows the first slide, and makes the others inert', async () => {
        const el = await fixture(html`<hmi-carousel>${slides}</hmi-carousel>`);
        expect(transform(el)).toBe('translateX(0%)');
        expect(slideEls(el).map((s) => s.hasAttribute('inert'))).toEqual([
            false,
            true,
            true,
        ]);
        const first = slideEls(el)[0]?.getBoundingClientRect();
        expect(first?.width).toBe(400);
    });

    it('starts at default-index, and index wins when set', async () => {
        const seeded = await fixture(
            html`<hmi-carousel default-index="1">${slides}</hmi-carousel>`,
        );
        expect(seeded.index).toBe(1);
        expect(transform(seeded)).toBe('translateX(-100%)');
        const explicit = await fixture(
            html`<hmi-carousel index="2" default-index="1">${slides}</hmi-carousel>`,
        );
        expect(explicit.index).toBe(2);
    });

    it('clamps an index past the last slide', async () => {
        const el = await fixture(
            html`<hmi-carousel index="9">${slides}</hmi-carousel>`,
        );
        expect(transform(el)).toBe('translateX(-200%)');
        expect(dots(el)[2]?.getAttribute('aria-selected')).toBe('true');
    });

    it('moves with the arrows and fires hmi-index-change, wrapping by default', async () => {
        const el = await fixture(html`<hmi-carousel>${slides}</hmi-carousel>`);
        const seen: number[] = [];
        el.addEventListener('hmi-index-change', (e) =>
            seen.push(
                (e as CustomEvent<CarouselIndexChangeDetail>).detail.index,
            ),
        );
        await click(el, part(el, 'next'));
        await click(el, part(el, 'next'));
        await click(el, part(el, 'next'));
        await click(el, part(el, 'prev'));
        expect(seen).toEqual([1, 2, 0, 2]);
        expect(transform(el)).toBe('translateX(-200%)');
        expect(slideEls(el).map((s) => s.hasAttribute('inert'))).toEqual([
            true,
            true,
            false,
        ]);
    });

    it('stops at the ends with no-loop, and disables the arrow there', async () => {
        const el = await fixture(
            html`<hmi-carousel no-loop>${slides}</hmi-carousel>`,
        );
        expect((part(el, 'prev') as HTMLButtonElement).disabled).toBe(true);
        expect((part(el, 'next') as HTMLButtonElement).disabled).toBe(false);
        const seen: number[] = [];
        el.addEventListener('hmi-index-change', (e) =>
            seen.push(
                (e as CustomEvent<CarouselIndexChangeDetail>).detail.index,
            ),
        );
        await key(el, 'ArrowLeft');
        expect(seen).toEqual([]);
        await click(el, part(el, 'next'));
        await click(el, part(el, 'next'));
        await click(el, part(el, 'next'));
        expect(seen).toEqual([1, 2]);
        expect((part(el, 'next') as HTMLButtonElement).disabled).toBe(true);
    });

    it('moves with the left and right arrow keys, but not while typing in a field', async () => {
        const el = await fixture(
            html`<hmi-carousel>${slides}<div><input id="field" /></div></hmi-carousel>`,
        );
        await key(el, 'ArrowRight');
        expect(el.index).toBe(1);
        await key(el, 'ArrowLeft');
        expect(el.index).toBe(0);
        const field = el.querySelector('#field') as HTMLInputElement;
        await key(el, 'ArrowRight', field);
        expect(el.index).toBe(0);
    });

    it('renders a dot per slide as a tablist, and goes to a slide on a click', async () => {
        const el = await fixture(html`<hmi-carousel>${slides}</hmi-carousel>`);
        expect(part(el, 'dots').getAttribute('role')).toBe('tablist');
        expect(dots(el).map((d) => d.getAttribute('aria-label'))).toEqual([
            'Go to slide 1',
            'Go to slide 2',
            'Go to slide 3',
        ]);
        expect(dots(el).map((d) => d.getAttribute('aria-selected'))).toEqual([
            'true',
            'false',
            'false',
        ]);
        await click(el, dots(el)[2] as HTMLElement);
        expect(el.index).toBe(2);
        expect(dots(el).map((d) => d.getAttribute('data-active'))).toEqual([
            'false',
            'false',
            'true',
        ]);
    });

    it('takes the button names from prev-label, next-label and dot-label', async () => {
        const el = await fixture(
            html`<hmi-carousel prev-label="Anterior" next-label="Siguiente" dot-label="Ir a {n}">${slides}</hmi-carousel>`,
        );
        expect(part(el, 'prev').getAttribute('aria-label')).toBe('Anterior');
        expect(part(el, 'next').getAttribute('aria-label')).toBe('Siguiente');
        expect(dots(el)[1]?.getAttribute('aria-label')).toBe('Ir a 2');
    });

    it('hides the arrows with hide-arrows and the dots with hide-dots', async () => {
        const el = await fixture(
            html`<hmi-carousel hide-arrows hide-dots>${slides}</hmi-carousel>`,
        );
        expect(part(el, 'prev')).toBeNull();
        expect(part(el, 'dots')).toBeNull();
        expect(el.hideArrows && el.hideDots).toBe(true);
    });

    it('has no arrows or dots for a single slide', async () => {
        const el = await fixture(
            html`<hmi-carousel><div>Only</div></hmi-carousel>`,
        );
        expect(part(el, 'next')).toBeNull();
        expect(part(el, 'dots')).toBeNull();
    });

    it('lets a listener veto a change by setting index back', async () => {
        const el = await fixture(html`<hmi-carousel>${slides}</hmi-carousel>`);
        el.addEventListener('hmi-index-change', () => {
            el.index = 0;
        });
        await click(el, part(el, 'next'));
        await el.updateComplete;
        expect(transform(el)).toBe('translateX(0%)');
    });

    it('follows index set from outside, without firing events', async () => {
        const el = await fixture(html`<hmi-carousel>${slides}</hmi-carousel>`);
        let fired = 0;
        el.addEventListener('hmi-index-change', () => fired++);
        el.index = 2;
        await el.updateComplete;
        expect(transform(el)).toBe('translateX(-200%)');
        expect(fired).toBe(0);
    });

    it('follows slides added later', async () => {
        const el = await fixture(html`<hmi-carousel>${slides}</hmi-carousel>`);
        const extra = document.createElement('div');
        el.append(extra);
        await new Promise((r) => setTimeout(r, 30));
        await el.updateComplete;
        expect(dots(el)).toHaveLength(4);
        expect(extra.getAttribute('aria-label')).toBe('4 of 4');
    });

    describe('autoplay', () => {
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const counter = (el: HmiCarousel) => {
            const seen: number[] = [];
            el.addEventListener('hmi-index-change', (e) =>
                seen.push(
                    (e as CustomEvent<CarouselIndexChangeDetail>).detail.index,
                ),
            );
            return seen;
        };

        it('advances on the interval, and pauses while the pointer is over it', async () => {
            const el = await fixture(
                html`<hmi-carousel auto-play="40">${slides}</hmi-carousel>`,
            );
            const seen = counter(el);
            await wait(130);
            expect(seen.length).toBeGreaterThan(0);
            part(el, 'base').dispatchEvent(new MouseEvent('mouseenter'));
            const at = seen.length;
            await wait(150);
            expect(seen.length).toBe(at);
            part(el, 'base').dispatchEvent(new MouseEvent('mouseleave'));
            await wait(130);
            expect(seen.length).toBeGreaterThan(at);
        });

        it('pauses while focus is inside, and stops when disconnected', async () => {
            const el = await fixture(
                html`<hmi-carousel auto-play="40">${slides}</hmi-carousel>`,
            );
            const seen = counter(el);
            (part(el, 'next') as HTMLButtonElement).focus();
            await wait(20);
            const at = seen.length;
            await wait(150);
            expect(seen.length).toBe(at);
            el.remove();
            await wait(150);
            expect(seen.length).toBe(at);
        });

        it('does not advance without auto-play', async () => {
            const el = await fixture(
                html`<hmi-carousel>${slides}</hmi-carousel>`,
            );
            const seen = counter(el);
            await wait(120);
            expect(seen).toEqual([]);
        });
    });
});

describe('Carousel (React wrapper)', () => {
    it('takes children as slides and maps onIndexChange', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: number[] = [];
        await act(async () => {
            root.render(
                createElement(
                    Carousel,
                    {
                        onIndexChange: (e) => seen.push(e.detail.index),
                        noLoop: true,
                    },
                    createElement('div', { key: 'a' }, 'One'),
                    createElement('div', { key: 'b' }, 'Two'),
                ),
            );
        });
        const el = host.querySelector('hmi-carousel') as HmiCarousel;
        await el.updateComplete;
        await new Promise((r) => setTimeout(r, 30));
        await el.updateComplete;
        await click(el, part(el, 'next'));
        expect(seen).toEqual([1]);
        expect(el.noLoop).toBe(true);
        await act(async () => root.unmount());
    });
});
