import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
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

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-skeleton', () => {
    it('registers', () => {
        expect(customElements.get('hmi-skeleton')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-skeleton></hmi-skeleton>`);
        expect(el.shadowRoot?.querySelector('[part="base"]')).not.toBeNull();
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
