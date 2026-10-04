import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './text.js';
import type { HmiText, TextSize } from './text.js';
import { Text } from './text.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiText> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiText;
    await el.updateComplete;
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-text', () => {
    it('registers', () => {
        expect(customElements.get('hmi-text')).toBeDefined();
    });

    it('is the text itself: a block with no inner element', async () => {
        const el = await fixture(html`<hmi-text>Copy</hmi-text>`);
        const style = getComputedStyle(el);
        expect(style.display).toBe('block');
        expect(style.fontSize).toBe('14px');
        expect(style.fontWeight).toBe('400');
        expect(style.lineHeight).toBe('21px');
        expect(style.marginTop).toBe('0px');
        expect(el.shadowRoot?.querySelectorAll('p, span, div')).toHaveLength(0);
        expect(el.textContent).toBe('Copy');
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-text>Copy</hmi-text>`);
        expect(el.size).toBe('medium');
        expect(el.weight).toBe('regular');
        expect(el.tone).toBe('default');
        expect(el.align).toBeUndefined();
        expect(el.truncate).toBe(false);
        expect(el.inline).toBe(false);
    });

    it('maps the size scale to base units', async () => {
        const el = await fixture(html`<hmi-text>Copy</hmi-text>`);
        const sizes: Record<TextSize, string> = {
            xsmall: '11px',
            small: '12px',
            medium: '14px',
            large: '16px',
            xlarge: '20px',
        };
        for (const [size, px] of Object.entries(sizes)) {
            el.size = size as TextSize;
            await el.updateComplete;
            expect(getComputedStyle(el).fontSize).toBe(px);
            expect(el.getAttribute('size')).toBe(size);
        }
    });

    it('maps the weights', async () => {
        const el = await fixture(html`<hmi-text>Copy</hmi-text>`);
        for (const [weight, value] of [
            ['medium', '500'],
            ['semibold', '600'],
            ['bold', '700'],
            ['regular', '400'],
        ] as const) {
            el.weight = weight;
            await el.updateComplete;
            expect(getComputedStyle(el).fontWeight).toBe(value);
        }
    });

    it('maps the tones to the text roles', async () => {
        const el = await fixture(html`<hmi-text>Copy</hmi-text>`);
        el.style.cssText =
            '--on-surface: rgb(1, 1, 1); --on-surface-variant: rgb(2, 2, 2); --primary: rgb(3, 3, 3); --error: rgb(4, 4, 4)';
        (el.parentElement as HTMLElement).style.color = 'rgb(5, 5, 5)';
        expect(getComputedStyle(el).color).toBe('rgb(1, 1, 1)');
        for (const [tone, color] of [
            ['muted', 'rgb(2, 2, 2)'],
            ['primary', 'rgb(3, 3, 3)'],
            ['error', 'rgb(4, 4, 4)'],
            ['inherit', 'rgb(5, 5, 5)'],
        ] as const) {
            el.tone = tone;
            await el.updateComplete;
            expect(getComputedStyle(el).color).toBe(color);
        }
    });

    it('aligns the text', async () => {
        const el = await fixture(html`<hmi-text>Copy</hmi-text>`);
        for (const align of ['start', 'center', 'end'] as const) {
            el.align = align;
            await el.updateComplete;
            expect(getComputedStyle(el).textAlign).toBe(align);
            expect(el.getAttribute('align')).toBe(align);
        }
    });

    it('truncates to one line with an ellipsis', async () => {
        const el = await fixture(
            html`<hmi-text truncate style="width: 100px"
                >A line far too long to fit in a hundred pixels</hmi-text
            >`,
        );
        const style = getComputedStyle(el);
        expect(style.whiteSpace).toBe('nowrap');
        expect(style.overflow).toBe('hidden');
        expect(style.textOverflow).toBe('ellipsis');
        expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
    });

    it('sits inside a sentence when inline', async () => {
        const host = document.createElement('p');
        host.innerHTML = 'Before <hmi-text inline>middle</hmi-text> after';
        document.body.append(host);
        const el = host.querySelector('hmi-text') as HmiText;
        await el.updateComplete;
        expect(getComputedStyle(el).display).toBe('inline');
        expect(host.getBoundingClientRect().height).toBeLessThan(40);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Text,
                    {
                        size: 'large',
                        weight: 'bold',
                        tone: 'error',
                        truncate: true,
                    },
                    'Copy',
                ),
            );
        });
        const el = mount.querySelector('hmi-text') as HmiText;
        await el.updateComplete;
        expect(el.size).toBe('large');
        expect(el.weight).toBe('bold');
        expect(el.tone).toBe('error');
        expect(el.truncate).toBe(true);
    });
});
