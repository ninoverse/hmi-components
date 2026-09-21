import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './kbd.js';
import type { HmiKbd } from './kbd.js';
import { Kbd } from './kbd.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiKbd> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiKbd;
    await el.updateComplete;
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-kbd', () => {
    it('registers', () => {
        expect(customElements.get('hmi-kbd')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-kbd>⌘</hmi-kbd>`);
        expect(el.shadowRoot?.querySelector('[part="base"]')).not.toBeNull();
    });

    it('renders a <kbd> as the base node', async () => {
        const el = await fixture(html`<hmi-kbd>⌘</hmi-kbd>`);
        expect(el.shadowRoot?.querySelector('[part="base"]')?.localName).toBe(
            'kbd',
        );
    });

    it('reflects size', async () => {
        const el = await fixture(html`<hmi-kbd size="small">Ctrl</hmi-kbd>`);
        expect(el.size).toBe('small');
        el.size = 'medium';
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('medium');
    });

    it('defaults to medium', async () => {
        const el = await fixture(html`<hmi-kbd>Ctrl</hmi-kbd>`);
        expect(el.size).toBe('medium');
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-kbd><b>Ctrl</b></hmi-kbd>`);
        const slot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot');
        expect(slot?.assignedElements()).toHaveLength(1);
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-kbd>⌘</hmi-kbd>`);
        expect(
            el.shadowRoot?.querySelector('[part="base"]')?.getAttribute('role'),
        ).toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Kbd, { size: 'small' }, 'Ctrl'),
            );
        });
        const el = mount.querySelector('hmi-kbd') as HmiKbd;
        await el.updateComplete;
        expect(el.size).toBe('small');
        expect(el.textContent).toBe('Ctrl');
    });
});
