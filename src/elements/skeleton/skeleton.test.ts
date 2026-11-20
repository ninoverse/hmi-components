// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import '../card/card.js';
import './skeleton.js';
import type { HmiSkeleton } from './skeleton.js';
import { Skeleton } from './skeleton.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiSkeleton> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiSkeleton;
    await el.updateComplete;
    return el;
}

const base = (el: HmiSkeleton) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;
const highlight = (el: HmiSkeleton) => getComputedStyle(base(el), '::after');

/* Runs `check` with media features emulated, then clears them. */
async function withMedia(
    features: { name: string; value: string }[],
    check: () => void | Promise<void>,
) {
    const session = cdp();
    await session.send('Emulation.setEmulatedMedia', { features });
    try {
        await check();
    } finally {
        await session.send('Emulation.setEmulatedMedia', { features: [] });
    }
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-skeleton', () => {
    it('registers', () => {
        expect(customElements.get('hmi-skeleton')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        const { width, height } = base(el).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects variant', async () => {
        const el = await fixture(
            html`<hmi-skeleton variant="circle"></hmi-skeleton>`,
        );
        expect(el.variant).toBe('circle');
        el.variant = 'rect';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('rect');
    });

    it('defaults to the text variant', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        expect(el.variant).toBe('text');
    });

    it('is aria-hidden by default', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        expect(el.getAttribute('aria-hidden')).toBe('true');
    });

    it('lets the consumer override aria-hidden', async () => {
        const el = await fixture(
            html`<hmi-skeleton aria-hidden="false"></hmi-skeleton>`,
        );
        expect(el.getAttribute('aria-hidden')).toBe('false');
    });

    it('writes numeric sizes to the host as px', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        el.width = 40;
        el.height = 40;
        el.radius = 4;
        await el.updateComplete;
        expect(el.style.width).toBe('40px');
        expect(el.style.height).toBe('40px');
        expect(el.style.borderRadius).toBe('4px');
    });

    it('passes string sizes through as authored', async () => {
        const el = await fixture(
            html`<hmi-skeleton width="80%" height="1.5rem"></hmi-skeleton>`,
        );
        expect(el.style.width).toBe('80%');
        expect(el.style.height).toBe('1.5rem');
    });

    it('clears a size when the property goes away', async () => {
        const el = await fixture(
            html`<hmi-skeleton width="50%"></hmi-skeleton>`,
        );
        expect(el.style.width).toBe('50%');
        el.width = undefined;
        await el.updateComplete;
        expect(el.style.width).toBe('');
    });

    it('reads a bare number attribute as px', async () => {
        const el = await fixture(
            html`<hmi-skeleton
                width="240"
                height="24.5"
                radius="12"
            ></hmi-skeleton>`,
        );
        expect(el.style.width).toBe('240px');
        expect(el.style.height).toBe('24.5px');
        expect(el.style.borderRadius).toBe('12px');
        expect(el.getBoundingClientRect().width).toBe(240);
    });

    it("leaves the host's own style when a size is empty", async () => {
        const el = await fixture(
            html`<hmi-skeleton style="width: 50%" width=""></hmi-skeleton>`,
        );
        expect(el.style.width).toBe('50%');
        el.height = undefined;
        el.radius = '';
        await el.updateComplete;
        expect(el.style.width).toBe('50%');
    });

    it('keeps a circle given one size round', async () => {
        const el = await fixture(
            html`<hmi-skeleton variant="circle" width="64px"></hmi-skeleton>`,
        );
        const { width, height } = el.getBoundingClientRect();
        expect(width).toBe(64);
        expect(height).toBe(64);
        el.variant = 'rect';
        await el.updateComplete;
        expect(el.style.width).toBe('64px');
        expect(el.style.height).toBe('');
    });

    it('sweeps from the inline start in both directions', async () => {
        const ltr = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        expect(highlight(ltr).animationName).toBe('skeleton-shimmer');
        const rtl = await fixture(
            html`<div dir="rtl"><hmi-skeleton></hmi-skeleton></div>`,
        ).then((div) => div.firstElementChild as HmiSkeleton);
        await rtl.updateComplete;
        expect(highlight(rtl).animationName).toBe('skeleton-shimmer-rtl');
    });

    it('moves the highlight with transform, not the background', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        expect(getComputedStyle(base(el)).animationName).toBe('none');
        const [sweep] = base(el).getAnimations({ subtree: true });
        const frames = (sweep?.effect as KeyframeEffect).getKeyframes();
        expect(frames.map((frame) => frame.transform)).toEqual([
            'translateX(-75%)',
            'translateX(-25%)',
        ]);
    });

    it('stops the highlight under reduced motion', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        await withMedia(
            [{ name: 'prefers-reduced-motion', value: 'reduce' }],
            () => {
                expect(highlight(el).display).toBe('none');
                expect(base(el).getAnimations({ subtree: true })).toEqual([]);
            },
        );
    });

    it('draws its edge in forced colors', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        await withMedia([{ name: 'forced-colors', value: 'active' }], () => {
            /* Forced colors drop the fill: the surface keeps an edge in the
               text's colour. */
            const surface = getComputedStyle(base(el));
            expect(surface.borderTopStyle).toBe('solid');
            expect(surface.borderTopColor).toBe(surface.color);
        });
    });

    it("takes an ink card's track colour before the hooks", async () => {
        /* The ink card sets --on-panel-track for what it holds; set here on
           the host, it must win over the hooks. */
        const inCard = await fixture(
            html`<hmi-skeleton
                style="--on-panel-track: rgb(1, 2, 3); --on-panel: rgb(255, 255, 255); --skeleton-bg: rgb(4, 5, 6); --skeleton-highlight: rgb(7, 8, 9)"
            ></hmi-skeleton>`,
        );
        expect(getComputedStyle(base(inCard)).backgroundColor).toBe(
            'rgb(1, 2, 3)',
        );
        expect(highlight(inCard).backgroundImage).not.toContain('rgb(7, 8, 9)');
        const hooked = await fixture(
            html`<hmi-skeleton
                style="--skeleton-bg: rgb(4, 5, 6); --skeleton-highlight: rgb(7, 8, 9)"
            ></hmi-skeleton>`,
        );
        expect(getComputedStyle(base(hooked)).backgroundColor).toBe(
            'rgb(4, 5, 6)',
        );
        expect(highlight(hooked).backgroundImage).toContain('rgb(7, 8, 9)');
    });

    it('follows the ink card it sits in', async () => {
        const host = await fixture(
            html`<hmi-card
                variant="ink"
                style="--inverse-surface: rgb(0, 0, 0); --inverse-on-surface: rgb(255, 255, 255); --surface-container-high: rgb(250, 250, 250)"
                ><hmi-skeleton></hmi-skeleton
            ></hmi-card>`,
        );
        const el = host.querySelector('hmi-skeleton') as HmiSkeleton;
        await el.updateComplete;
        /* The card's text, white, at 20% over its black surface, where the
           skeleton would otherwise paint the near-white container. */
        expect(getComputedStyle(base(el)).backgroundColor).toBe(
            'color(srgb 0.2 0.2 0.2)',
        );
    });

    it('paints a shimmer surface that fills the host', async () => {
        const el = await fixture(
            html`<hmi-skeleton variant="circle"></hmi-skeleton>`,
        );
        const base = el.shadowRoot?.querySelector(
            '[part="base"]',
        ) as HTMLElement;
        /* An inline <span> would ignore width/height and collapse to 0x0,
           making the skeleton invisible. */
        expect(getComputedStyle(base).display).toBe('block');
        const host = el.getBoundingClientRect();
        const painted = base.getBoundingClientRect();
        expect(host.width).toBeGreaterThan(0);
        expect(painted.width).toBe(host.width);
        expect(painted.height).toBe(host.height);
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        expect(
            el.shadowRoot?.querySelector('[part="base"]')?.getAttribute('role'),
        ).toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Skeleton, {
                    variant: 'circle',
                    width: 40,
                    height: 40,
                }),
            );
        });
        const el = mount.querySelector('hmi-skeleton') as HmiSkeleton;
        await el.updateComplete;
        expect(el.variant).toBe('circle');
        expect(el.style.width).toBe('40px');
        expect(el.style.height).toBe('40px');
    });
});
