import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './alert.js';
import type { HmiAlert } from './alert.js';
import { Alert } from './alert.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiAlert> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiAlert;
    await el.updateComplete;
    return el;
}

function slotted(el: HmiAlert, name?: string): Element[] {
    const selector = name ? `slot[name="${name}"]` : 'slot:not([name])';
    return (
        el.shadowRoot
            ?.querySelector<HTMLSlotElement>(selector)
            ?.assignedElements() ?? []
    );
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-alert', () => {
    it('registers', () => {
        expect(customElements.get('hmi-alert')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-alert>Saved</hmi-alert>`);
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base).not.toBeNull();
        const { width, height } = (base as Element).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects variant', async () => {
        const el = await fixture(
            html`<hmi-alert variant="danger">Failed</hmi-alert>`,
        );
        expect(el.variant).toBe('danger');
        el.variant = 'success';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('success');
    });

    it('defaults to info', async () => {
        const el = await fixture(html`<hmi-alert>Saved</hmi-alert>`);
        expect(el.variant).toBe('info');
        expect(el.getAttribute('variant')).toBe('info');
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-alert><b>Saved</b></hmi-alert>`);
        expect(slotted(el)).toHaveLength(1);
    });

    it('projects title slot', async () => {
        const el = await fixture(
            html`<hmi-alert><span slot="title">Heads up</span>Body</hmi-alert>`,
        );
        expect(slotted(el, 'title')).toHaveLength(1);
    });

    it('projects action slot', async () => {
        const el = await fixture(
            html`<hmi-alert><button slot="action">Retry</button>Body</hmi-alert>`,
        );
        expect(slotted(el, 'action')).toHaveLength(1);
    });

    it('projects icon slot, replacing the built-in icon', async () => {
        const plain = await fixture(html`<hmi-alert>Body</hmi-alert>`);
        expect(
            plain.shadowRoot?.querySelector('slot[name="icon"] svg'),
        ).not.toBeNull();
        const custom = await fixture(
            html`<hmi-alert><svg slot="icon"></svg>Body</hmi-alert>`,
        );
        expect(slotted(custom, 'icon')).toHaveLength(1);
    });

    it('draws the built-in icon as real SVG shapes', async () => {
        const el = await fixture(html`<hmi-alert>Body</hmi-alert>`);
        const shape = el.shadowRoot?.querySelector('.icon svg circle');
        expect(shape?.namespaceURI).toBe('http://www.w3.org/2000/svg');
        const { width, height } = (
            el.shadowRoot?.querySelector('.icon svg') as Element
        ).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('draws a different built-in icon per variant', async () => {
        const markup = async (variant: string) => {
            const el = await fixture(
                html`<hmi-alert variant=${variant}>Body</hmi-alert>`,
            );
            return el.shadowRoot?.querySelector('.icon svg')?.innerHTML;
        };
        const all = await Promise.all(
            ['info', 'success', 'warning', 'danger'].map(markup),
        );
        expect(new Set(all).size).toBe(4);
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-alert>Saved</hmi-alert>`);
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base?.getAttribute('role')).toBeNull();
        expect(
            el.shadowRoot?.querySelector('svg')?.getAttribute('aria-hidden'),
        ).toBe('true');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Alert,
                    { variant: 'warning' },
                    createElement('span', { slot: 'title' }, 'Heads up'),
                    'Disk almost full.',
                ),
            );
        });
        const el = mount.querySelector('hmi-alert') as HmiAlert;
        await el.updateComplete;
        expect(el.variant).toBe('warning');
        expect(slotted(el, 'title')).toHaveLength(1);
    });
});
