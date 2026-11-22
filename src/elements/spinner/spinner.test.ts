// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import '../button/button.js';
import './spinner.js';
import type { HmiSpinner } from './spinner.js';
import { Spinner } from './spinner.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiSpinner> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-spinner') as HmiSpinner;
    await el.updateComplete;
    return el;
}

const base = (el: HmiSpinner) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;

/* Waits for the frame after which the label joins the status. */
async function announced(el: HmiSpinner) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await el.updateComplete;
}

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

type AXNode = {
    ignored: boolean;
    role?: { value: string };
    name?: { value: string };
};

type FrameTree = {
    frame: { id: string; url: string };
    childFrames?: FrameTree[];
};

/* The accessibility tree of the frame the tests run in, as the browser
   computes it, with the nodes it ignores left out. */
async function axTree(): Promise<AXNode[]> {
    const session = cdp();
    await session.send('Accessibility.enable');
    /* The tests run in a frame of the runner's page: find it by its URL. */
    const { frameTree } = (await session.send('Page.getFrameTree')) as {
        frameTree: FrameTree;
    };
    const find = (tree: FrameTree): string | undefined =>
        tree.frame.url === location.href
            ? tree.frame.id
            : tree.childFrames?.map(find).find(Boolean);
    const frameId = find(frameTree);
    if (!frameId) throw new Error('The test frame is not in the frame tree');
    const { nodes } = (await session.send('Accessibility.getFullAXTree', {
        frameId,
    })) as { nodes: AXNode[] };
    return nodes.filter((node) => !node.ignored);
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-spinner', () => {
    it('registers', () => {
        expect(customElements.get('hmi-spinner')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-spinner></hmi-spinner>`);
        const { width, height } = base(el).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects size', async () => {
        const el = await fixture(
            html`<hmi-spinner size="large"></hmi-spinner>`,
        );
        expect(el.size).toBe('large');
        el.size = 'small';
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('small');
    });

    it('defaults to medium', async () => {
        const el = await fixture(html`<hmi-spinner></hmi-spinner>`);
        expect(el.size).toBe('medium');
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-spinner></hmi-spinner>`);
        expect(base(el).getAttribute('role')).toBe('status');
        expect(base(el).hasAttribute('aria-label')).toBe(false);
        expect(base(el).hasAttribute('aria-hidden')).toBe(false);
    });

    it('draws 14, 20 and 32px rings, and the host is the ring', async () => {
        for (const [size, px] of [
            ['small', 14],
            ['medium', 20],
            ['large', 32],
        ] as const) {
            const el = await fixture(
                html`<hmi-spinner size=${size}></hmi-spinner>`,
            );
            /* The ring spins, so its bounding box is the turned square's:
               its layout size is the offset one. */
            const ring = base(el);
            const host = el.getBoundingClientRect();
            expect(ring.offsetWidth).toBe(px);
            expect(ring.offsetHeight).toBe(px);
            expect(host.width).toBe(px);
            expect(host.height).toBe(px);
            document.body.replaceChildren();
        }
    });

    it('sits centred in a flex row', async () => {
        const el = await fixture(
            html`<div style="display: flex; align-items: center; height: 48px">
                <hmi-spinner></hmi-spinner>
            </div>`,
        );
        const row = (el.parentElement as HTMLElement).getBoundingClientRect();
        const ring = el.getBoundingClientRect();
        expect(base(el).offsetHeight).toBe(ring.height);
        expect(ring.top - row.top).toBe(row.bottom - ring.bottom);
    });

    it('sits on the baseline in a line of text', async () => {
        const el = await fixture(
            html`<p style="font-size: 32px; line-height: 1">
                Loading <hmi-spinner></hmi-spinner><span>x</span>
            </p>`,
        );
        const x = (
            el.nextElementSibling as HTMLElement
        ).getBoundingClientRect();
        const ring = el.getBoundingClientRect();
        /* An inline-block with no line inside it sits its bottom edge on the
           baseline, which is under the x, above its descender space. */
        expect(ring.bottom).toBeLessThan(x.bottom);
        expect(ring.bottom).toBeGreaterThan(x.top);
    });

    it('adds the label to the empty status a frame after it connects', async () => {
        const el = await fixture(html`<hmi-spinner></hmi-spinner>`);
        expect(base(el).textContent?.trim()).toBe('');
        await announced(el);
        expect(base(el).textContent?.trim()).toBe('Loading');
        const { width, height } = (
            base(el).firstElementChild as HTMLElement
        ).getBoundingClientRect();
        expect(width * height).toBeLessThanOrEqual(1);
    });

    it('changes the status text with label', async () => {
        const el = await fixture(
            html`<hmi-spinner label="Fetching"></hmi-spinner>`,
        );
        await announced(el);
        expect(base(el).textContent?.trim()).toBe('Fetching');
        el.label = 'Saving';
        await el.updateComplete;
        expect(base(el).textContent?.trim()).toBe('Saving');
    });

    it('empties the status again once it is moved', async () => {
        const el = await fixture(html`<hmi-spinner></hmi-spinner>`);
        await announced(el);
        const other = document.createElement('div');
        document.body.append(other);
        other.append(el);
        await el.updateComplete;
        expect(base(el).textContent?.trim()).toBe('');
        await announced(el);
        expect(base(el).textContent?.trim()).toBe('Loading');
    });

    it('is decorative with an empty label', async () => {
        const el = await fixture(html`<hmi-spinner label=""></hmi-spinner>`);
        await announced(el);
        expect(base(el).hasAttribute('role')).toBe(false);
        expect(base(el).getAttribute('aria-hidden')).toBe('true');
        expect(base(el).textContent?.trim()).toBe('');
        expect(base(el).offsetWidth).toBe(20);
        expect(base(el).offsetHeight).toBe(20);
    });

    it('leaves a button its own name when decorative', async () => {
        const el = await fixture(
            html`<hmi-button
                ><hmi-spinner slot="left-icon" size="small" label=""></hmi-spinner
                >Saving</hmi-button
            >`,
        );
        await announced(el);
        const buttons = (await axTree()).filter(
            (node) => node.role?.value === 'button',
        );
        expect(buttons.map((node) => node.name?.value)).toEqual(['Saving']);
        expect(
            (await axTree()).some((node) => node.role?.value === 'status'),
        ).toBe(false);
    });

    it('keeps spinning, slower, under reduced motion', async () => {
        const el = await fixture(html`<hmi-spinner></hmi-spinner>`);
        expect(getComputedStyle(base(el)).animationDuration).toBe('0.8s');
        await withMedia(
            [{ name: 'prefers-reduced-motion', value: 'reduce' }],
            () => {
                const ring = getComputedStyle(base(el));
                expect(ring.animationName).toBe('spinner-rotate');
                expect(ring.animationDuration).toBe('2.4s');
            },
        );
    });

    it('draws the arc alone in forced colors', async () => {
        const el = await fixture(html`<hmi-spinner></hmi-spinner>`);
        await withMedia([{ name: 'forced-colors', value: 'active' }], () => {
            /* Both borders in CanvasText would be a full ring with no spin
               to see: the arc keeps it, the track drops out. */
            const ring = getComputedStyle(base(el));
            const transparent = 'rgba(0, 0, 0, 0)';
            expect(ring.borderTopColor).not.toBe(transparent);
            expect(ring.borderRightColor).toBe(transparent);
            expect(ring.borderBottomColor).toBe(transparent);
            expect(ring.borderLeftColor).toBe(transparent);
        });
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Spinner, { size: 'large', label: 'Fetching' }),
            );
        });
        const el = mount.querySelector('hmi-spinner') as HmiSpinner;
        await announced(el);
        expect(el.size).toBe('large');
        expect(base(el).textContent?.trim()).toBe('Fetching');
    });
});
