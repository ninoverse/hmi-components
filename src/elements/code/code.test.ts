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
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base).not.toBeNull();
        const { width, height } = (base as Element).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
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

    it('keeps code left to right in right-to-left text', async () => {
        const el = await fixture(
            html`<p dir="rtl"><hmi-code block>const x = 42;</hmi-code></p>`,
        );
        const code = el.querySelector('hmi-code') as HmiCode;
        await code.updateComplete;
        const base = code.shadowRoot?.querySelector(
            '[part~="base"]',
        ) as HTMLElement;
        const style = getComputedStyle(base);
        expect(style.direction).toBe('ltr');
        expect(style.unicodeBidi).toBe('isolate');
        expect(style.textAlign).toBe('start');
    });

    it('takes the direction its own dir gives it', async () => {
        const el = await fixture(html`<hmi-code dir="rtl">x = 42;</hmi-code>`);
        const base = el.shadowRoot?.querySelector(
            '[part~="base"]',
        ) as HTMLElement;
        expect(getComputedStyle(base).direction).toBe('rtl');
    });

    it('isolates inline code from the text around it', async () => {
        const el = await fixture(html`<hmi-code>x = 42;</hmi-code>`);
        const base = el.shadowRoot?.querySelector(
            '[part~="base"]',
        ) as HTMLElement;
        expect(getComputedStyle(base).unicodeBidi).toBe('isolate');
    });

    it('wraps a long inline command to its column', async () => {
        const el = await fixture(
            html`<p style="width: 200px; margin: 0">
                Run
                <hmi-code
                    >pnpm --filter @ninoverse/hmi-components exec vitest run --project browser</hmi-code
                >
                now.
            </p>`,
        );
        const code = el.querySelector('hmi-code') as HmiCode;
        await code.updateComplete;
        const base = code.shadowRoot?.querySelector(
            '[part~="base"]',
        ) as HTMLElement;
        const lines = base.getClientRects();
        expect(lines.length).toBeGreaterThan(1);
        for (const line of lines) {
            expect(line.right).toBeLessThanOrEqual(
                el.getBoundingClientRect().right + 0.5,
            );
        }
        expect(getComputedStyle(base).boxDecorationBreak).toBe('clone');
    });

    it('sizes block text from the text around it, as inline', async () => {
        const el = await fixture(
            html`<div style="font-size: 20px">
                <hmi-code>npm i</hmi-code><hmi-code block>npm i</hmi-code>
            </div>`,
        );
        const [inline, block] = [...el.querySelectorAll('hmi-code')] as [
            HmiCode,
            HmiCode,
        ];
        await block.updateComplete;
        const size = (code: HmiCode) =>
            getComputedStyle(
                code.shadowRoot?.querySelector('[part~="base"]') as Element,
            ).fontSize;
        expect(size(inline)).toBe('18px');
        expect(size(block)).toBe('18px');
    });

    it('is a tab stop only while a block scrolls', async () => {
        const el = await fixture(
            html`<hmi-code block style="width: 200px"
                >const message = 'far longer than the box it sits in';</hmi-code
            >`,
        );
        const base = () =>
            el.shadowRoot?.querySelector('[part~="base"]') as HTMLElement;
        await expect.poll(() => base().getAttribute('tabindex')).toBe('0');
        el.style.width = '2000px';
        await expect.poll(() => base().hasAttribute('tabindex')).toBe(false);
        el.style.width = '200px';
        await expect.poll(() => base().getAttribute('tabindex')).toBe('0');
        el.block = false;
        await el.updateComplete;
        expect(base().hasAttribute('tabindex')).toBe(false);
    });

    it('is no tab stop when a block fits', async () => {
        const el = await fixture(html`<hmi-code block>npm i</hmi-code>`);
        await new Promise((r) =>
            requestAnimationFrame(() => requestAnimationFrame(r)),
        );
        expect(
            el.shadowRoot
                ?.querySelector('[part~="base"]')
                ?.hasAttribute('tabindex'),
        ).toBe(false);
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
