import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './code.js';
import type { HmiCode } from './code.js';
import { Code } from './code.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiCode> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiCode;
    await el.updateComplete;
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-code', () => {
    it('registers', () => {
        expect(customElements.get('hmi-code')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-code>npm i</hmi-code>`);
        expect(el.shadowRoot?.querySelector('[part="base"]')).not.toBeNull();
    });

    it('reflects block', async () => {
        const el = await fixture(html`<hmi-code>npm i</hmi-code>`);
        expect(el.hasAttribute('block')).toBe(false);
        el.block = true;
        await el.updateComplete;
        expect(el.getAttribute('block')).toBe('');
    });

    it('boolean attribute presence', async () => {
        const el = await fixture(html`<hmi-code block>npm i</hmi-code>`);
        expect(el.block).toBe(true);
        el.removeAttribute('block');
        await el.updateComplete;
        expect(el.block).toBe(false);
    });

    it('renders an inline <code> by default', async () => {
        const el = await fixture(html`<hmi-code>npm i</hmi-code>`);
        expect(el.shadowRoot?.querySelector('[part="base"]')?.localName).toBe(
            'code',
        );
        expect(el.shadowRoot?.querySelector('[part="content"]')).toBeNull();
    });

    it('renders <pre><code> when block is set', async () => {
        const el = await fixture(html`<hmi-code block>const x = 1;</hmi-code>`);
        const base = el.shadowRoot?.querySelector('[part="base"]');
        const content = el.shadowRoot?.querySelector('[part="content"]');
        expect(base?.localName).toBe('pre');
        expect(content?.localName).toBe('code');
        expect(content?.parentElement).toBe(base);
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-code><b>npm i</b></hmi-code>`);
        const slot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot');
        expect(slot?.assignedElements()).toHaveLength(1);
    });

    it('keeps the slot inside the <code> through a mode switch', async () => {
        const el = await fixture(html`<hmi-code>npm i</hmi-code>`);
        expect(
            el.shadowRoot?.querySelector('slot')?.parentElement?.localName,
        ).toBe('code');
        el.block = true;
        await el.updateComplete;
        const slot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot');
        expect(slot?.parentElement?.getAttribute('part')).toBe('content');
        expect(slot?.assignedNodes()[0]?.textContent).toBe('npm i');
    });

    it('preserves snippet whitespace in block mode', async () => {
        const el = await fixture(
            html`<hmi-code block>a
    b</hmi-code>`,
        );
        const pre = el.shadowRoot?.querySelector(
            '[part="base"]',
        ) as HTMLElement;
        expect(getComputedStyle(pre).whiteSpace).toBe('pre');
        expect(el.textContent).toBe('a\n    b');
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-code>npm i</hmi-code>`);
        expect(
            el.shadowRoot?.querySelector('[part="base"]')?.getAttribute('role'),
        ).toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Code, { block: true }, 'const x = 42;'),
            );
        });
        const el = mount.querySelector('hmi-code') as HmiCode;
        await el.updateComplete;
        expect(el.block).toBe(true);
        expect(el.textContent).toBe('const x = 42;');
        expect(el.shadowRoot?.querySelector('[part="base"]')?.localName).toBe(
            'pre',
        );
    });
});
