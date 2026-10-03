import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './banner.js';
import type { HmiBanner } from './banner.js';
import { Banner } from './banner.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiBanner> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiBanner;
    await el.updateComplete;
    return el;
}

function slotted(el: HmiBanner, name?: string): Element[] {
    const selector = name ? `slot[name="${name}"]` : 'slot:not([name])';
    return (
        el.shadowRoot
            ?.querySelector<HTMLSlotElement>(selector)
            ?.assignedElements() ?? []
    );
}

const part = (el: HmiBanner, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-banner', () => {
    it('registers', () => {
        expect(customElements.get('hmi-banner')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-banner>Saved</hmi-banner>`);
        const { width, height } = (
            part(el, 'base') as Element
        ).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects variant', async () => {
        const el = await fixture(
            html`<hmi-banner variant="danger">Failed</hmi-banner>`,
        );
        expect(el.variant).toBe('danger');
        el.variant = 'success';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('success');
    });

    it('defaults to info', async () => {
        const el = await fixture(html`<hmi-banner>Saved</hmi-banner>`);
        expect(el.variant).toBe('info');
        expect(el.getAttribute('variant')).toBe('info');
    });

    it('reflects dismissible as presence', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        expect(el.dismissible).toBe(true);
        el.dismissible = false;
        await el.updateComplete;
        expect(el.hasAttribute('dismissible')).toBe(false);
        expect(part(el, 'dismiss')).toBeNull();
    });

    it('shows the dismiss button only when dismissible', async () => {
        const plain = await fixture(html`<hmi-banner>Saved</hmi-banner>`);
        expect(part(plain, 'dismiss')).toBeNull();
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        expect(part(el, 'dismiss')).not.toBeNull();
    });

    it('labels the dismiss button from dismiss-label', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        expect(part(el, 'dismiss')?.getAttribute('aria-label')).toBe('Dismiss');
        el.dismissLabel = 'Close';
        await el.updateComplete;
        expect(part(el, 'dismiss')?.getAttribute('aria-label')).toBe('Close');
        const attr = await fixture(
            html`<hmi-banner dismissible dismiss-label="Fermer">Saved</hmi-banner>`,
        );
        expect(attr.dismissLabel).toBe('Fermer');
    });

    it('dispatches hmi-dismiss and hides itself', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        let detail: unknown;
        el.addEventListener('hmi-dismiss', (e) => {
            detail = (e as CustomEvent).detail;
        });
        part(el, 'dismiss')?.click();
        expect(detail).toEqual({});
        expect(el.hidden).toBe(true);
        expect(getComputedStyle(el).display).toBe('none');
    });

    it('stays visible when hmi-dismiss is cancelled', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        el.addEventListener('hmi-dismiss', (e) => e.preventDefault());
        part(el, 'dismiss')?.click();
        expect(el.hidden).toBe(false);
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-banner><b>Saved</b></hmi-banner>`);
        expect(slotted(el)).toHaveLength(1);
    });

    it('projects title slot', async () => {
        const el = await fixture(
            html`<hmi-banner><span slot="title">Saved</span>Body</hmi-banner>`,
        );
        expect(slotted(el, 'title')).toHaveLength(1);
    });

    it('projects action slot', async () => {
        const el = await fixture(
            html`<hmi-banner><button slot="action">Undo</button>Body</hmi-banner>`,
        );
        expect(slotted(el, 'action')).toHaveLength(1);
    });

    it('projects icon slot, replacing the built-in icon', async () => {
        const plain = await fixture(html`<hmi-banner>Body</hmi-banner>`);
        expect(
            plain.shadowRoot?.querySelector('slot[name="icon"] svg'),
        ).not.toBeNull();
        const custom = await fixture(
            html`<hmi-banner><svg slot="icon"></svg>Body</hmi-banner>`,
        );
        expect(slotted(custom, 'icon')).toHaveLength(1);
    });

    it('draws the built-in icon as real SVG shapes', async () => {
        const el = await fixture(html`<hmi-banner>Body</hmi-banner>`);
        const shape = el.shadowRoot?.querySelector('.icon svg circle');
        expect(shape?.namespaceURI).toBe('http://www.w3.org/2000/svg');
        const { width, height } = (
            el.shadowRoot?.querySelector('.icon svg') as Element
        ).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('exposes roles', async () => {
        const role = async (variant: string) =>
            part(
                await fixture(
                    html`<hmi-banner variant=${variant}>Body</hmi-banner>`,
                ),
                'base',
            )?.getAttribute('role');
        expect(await role('danger')).toBe('alert');
        expect(await role('warning')).toBe('alert');
        expect(await role('info')).toBe('status');
        expect(await role('success')).toBe('status');
        const el = await fixture(html`<hmi-banner>Body</hmi-banner>`);
        expect(part(el, 'icon')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        let dismissed = 0;
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Banner,
                    {
                        variant: 'warning',
                        dismissible: true,
                        onDismiss: () => {
                            dismissed += 1;
                        },
                    },
                    createElement('span', { slot: 'title' }, 'Heads up'),
                    'Disk almost full.',
                ),
            );
        });
        const el = mount.querySelector('hmi-banner') as HmiBanner;
        await el.updateComplete;
        expect(el.variant).toBe('warning');
        expect(el.dismissible).toBe(true);
        expect(slotted(el, 'title')).toHaveLength(1);
        part(el, 'dismiss')?.click();
        expect(dismissed).toBe(1);
    });
});
