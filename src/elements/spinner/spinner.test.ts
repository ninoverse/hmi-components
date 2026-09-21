import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './spinner.js';
import type { HmiSpinner } from './spinner.js';
import { Spinner } from './spinner.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiSpinner> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiSpinner;
    await el.updateComplete;
    return el;
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
        expect(el.shadowRoot?.querySelector('[part="base"]')).not.toBeNull();
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
        const base = el.shadowRoot?.querySelector('[part="base"]');
        expect(base?.getAttribute('role')).toBe('status');
        expect(base?.getAttribute('aria-label')).toBe('Loading');
    });

    it('forwards label to aria-label', async () => {
        const el = await fixture(
            html`<hmi-spinner label="Fetching"></hmi-spinner>`,
        );
        expect(el.label).toBe('Fetching');
        el.label = 'Saving';
        await el.updateComplete;
        expect(
            el.shadowRoot
                ?.querySelector('[part="base"]')
                ?.getAttribute('aria-label'),
        ).toBe('Saving');
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
        await el.updateComplete;
        expect(el.size).toBe('large');
        expect(
            el.shadowRoot
                ?.querySelector('[part="base"]')
                ?.getAttribute('aria-label'),
        ).toBe('Fetching');
    });
});
