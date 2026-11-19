import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import './kbd.js';
import type { HmiKbd } from './kbd.js';
import { Kbd } from './kbd.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiKbd> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-kbd') as HmiKbd;
    await el.updateComplete;
    return el;
}

const base = (el: HmiKbd) =>
    el.shadowRoot?.querySelector('[part~="base"]') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
});

describe('hmi-kbd', () => {
    it('registers', () => {
        expect(customElements.get('hmi-kbd')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-kbd>⌘</hmi-kbd>`);
        const box = base(el).getBoundingClientRect();
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
    });

    it('renders a <kbd> as the base node', async () => {
        const el = await fixture(html`<hmi-kbd>⌘</hmi-kbd>`);
        expect(base(el).localName).toBe('kbd');
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
        expect(base(el).getAttribute('role')).toBeNull();
        expect(el.shadowRoot?.querySelector('[aria-hidden]')).toBeNull();
    });

    /* A symbol is read as its glyph; the host has no role, so aria-label on
       it is ignored. The label is read in place of the glyph. */
    it('reads a label in place of the slotted glyph', async () => {
        const el = await fixture(html`<hmi-kbd label="Command">⌘</hmi-kbd>`);
        const keys = el.shadowRoot?.querySelector('.keys');
        expect(keys?.getAttribute('aria-hidden')).toBe('true');
        expect(keys?.querySelector('slot')).not.toBeNull();
        const name = el.shadowRoot?.querySelector('.name') as HTMLElement;
        expect(name.textContent).toBe('Command');
        expect(name.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    });

    it('draws the label as the text when the slot is empty', async () => {
        const el = await fixture(html`<hmi-kbd label="Escape"></hmi-kbd>`);
        expect(base(el).hidden).toBe(false);
        expect(
            el.shadowRoot?.querySelector('.keys')?.hasAttribute('aria-hidden'),
        ).toBe(true);
        const text = el.shadowRoot?.querySelector('.text') as HTMLElement;
        expect(text.textContent).toBe('Escape');
        expect(text.getBoundingClientRect().width).toBeGreaterThan(1);
    });

    it('draws nothing without a label or slotted content', async () => {
        const el = await fixture(html`<hmi-kbd> </hmi-kbd>`);
        expect(base(el).hidden).toBe(true);
        expect(base(el).getBoundingClientRect().width).toBe(0);
        el.textContent = 'K';
        await new Promise((r) => setTimeout(r));
        await el.updateComplete;
        expect(base(el).hidden).toBe(false);
    });

    it('draws its edge in --outline', async () => {
        const el = await fixture(
            html`<div style="--outline: rgb(1, 2, 3); --outline-variant: rgb(9, 9, 9)">
                <hmi-kbd>K</hmi-kbd>
            </div>`,
        );
        const style = getComputedStyle(base(el));
        expect(style.borderTopColor).toBe('rgb(1, 2, 3)');
        expect(style.borderBottomColor).toBe('rgb(1, 2, 3)');
        expect(style.boxShadow).toContain('rgb(1, 2, 3)');
    });

    it('takes its font from --kbd-font, else --font-display, after the key symbols', async () => {
        const plain = await fixture(
            html`<div style="--font-display: serif"><hmi-kbd>K</hmi-kbd></div>`,
        );
        expect(getComputedStyle(base(plain)).fontFamily).toBe(
            'hmi-key-symbols, serif',
        );
        document.body.replaceChildren();
        const hooked = await fixture(
            html`<div style="--font-display: serif; --kbd-font: monospace">
                <hmi-kbd>K</hmi-kbd>
            </div>`,
        );
        expect(getComputedStyle(base(hooked)).fontFamily).toBe(
            'hmi-key-symbols, monospace',
        );
    });

    it('keeps its size in body text and follows larger text', async () => {
        const sizes = async (font: string) => {
            const medium = await fixture(
                html`<div style="font-size: ${font}">
                    <hmi-kbd>K</hmi-kbd><hmi-kbd size="small">K</hmi-kbd>
                </div>`,
            );
            const small = medium.nextElementSibling as HmiKbd;
            await small.updateComplete;
            const out = [medium, small].map(
                (k) => getComputedStyle(base(k)).fontSize,
            );
            document.body.replaceChildren();
            return out;
        };
        expect(await sizes('16px')).toEqual(['12px', '10px']);
        expect(await sizes('12px')).toEqual(['12px', '10px']);
        expect(await sizes('40px')).toEqual(['30px', '25px']);
    });

    it('warns about an unknown size and draws it as medium', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const el = await fixture(
            html`<div style="font-size: 16px"><hmi-kbd size="large">K</hmi-kbd></div>`,
        );
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("'large'"));
        expect(getComputedStyle(base(el)).fontSize).toBe('12px');
        warn.mockClear();
        el.size = 'small';
        await el.updateComplete;
        expect(warn).not.toHaveBeenCalled();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Kbd, { size: 'small', label: 'Control' }, 'Ctrl'),
            );
        });
        const el = mount.querySelector('hmi-kbd') as HmiKbd;
        await el.updateComplete;
        expect(el.size).toBe('small');
        expect(el.label).toBe('Control');
        expect(el.textContent).toBe('Ctrl');
    });
});
