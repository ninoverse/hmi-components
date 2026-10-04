import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './box.js';
import type { HmiBox } from './box.js';
import { Box } from './box.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiBox> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiBox;
    await el.updateComplete;
    return el;
}

/** The theme files are not loaded in the test page: give the tokens a value. */
function tokens(el: HTMLElement, values: Record<string, string>): void {
    for (const [name, value] of Object.entries(values)) {
        el.style.setProperty(name, value);
    }
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-box', () => {
    it('registers', () => {
        expect(customElements.get('hmi-box')).toBeDefined();
    });

    it('renders as a block that holds its content', async () => {
        const el = await fixture(html`<hmi-box><p>Hello</p></hmi-box>`);
        expect(getComputedStyle(el).display).toBe('block');
        const { width, height } = el.getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
        expect(
            el.shadowRoot?.querySelector('slot')?.assignedElements(),
        ).toHaveLength(1);
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-box></hmi-box>`);
        expect(el.background).toBe('none');
        expect(el.padding).toBe('none');
        expect(el.radius).toBe('none');
        expect(el.bordered).toBe(false);
        expect(getComputedStyle(el).paddingTop).toBe('0px');
    });

    it('reflects its properties', async () => {
        const el = await fixture(html`<hmi-box></hmi-box>`);
        el.background = 'surface';
        el.padding = 'large';
        el.radius = 'full';
        el.bordered = true;
        await el.updateComplete;
        expect(el.getAttribute('background')).toBe('surface');
        expect(el.getAttribute('padding')).toBe('large');
        expect(el.getAttribute('radius')).toBe('full');
        expect(el.hasAttribute('bordered')).toBe(true);
    });

    it('maps padding presets to the spacing tokens', async () => {
        const el = await fixture(html`<hmi-box padding="small"></hmi-box>`);
        tokens(el, {
            '--space-4': '10px',
            '--space-8': '20px',
            '--space-11': '30px',
        });
        expect(getComputedStyle(el).paddingLeft).toBe('10px');
        el.padding = 'medium';
        await el.updateComplete;
        expect(getComputedStyle(el).paddingLeft).toBe('20px');
        el.padding = 'large';
        await el.updateComplete;
        expect(getComputedStyle(el).paddingLeft).toBe('30px');
    });

    it('maps the background to its surface and text colours', async () => {
        const el = await fixture(
            html`<hmi-box background="surface-variant"></hmi-box>`,
        );
        tokens(el, {
            '--surface-variant': 'rgb(1, 2, 3)',
            '--on-surface-variant': 'rgb(4, 5, 6)',
        });
        const style = getComputedStyle(el);
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.color).toBe('rgb(4, 5, 6)');
    });

    it('maps the radius presets, leaf included', async () => {
        const el = await fixture(html`<hmi-box radius="small"></hmi-box>`);
        tokens(el, {
            '--corner-small': '3px',
            '--corner-tl': '12px',
            '--corner-tr': '2px',
            '--corner-br': '12px',
            '--corner-bl': '2px',
        });
        expect(getComputedStyle(el).borderTopLeftRadius).toBe('3px');
        el.radius = 'leaf';
        await el.updateComplete;
        const style = getComputedStyle(el);
        expect(style.borderTopLeftRadius).toBe('12px');
        expect(style.borderTopRightRadius).toBe('2px');
    });

    it('draws a one-unit border only when bordered', async () => {
        const el = await fixture(html`<hmi-box></hmi-box>`);
        tokens(el, { '--outline-variant': 'gray' });
        expect(getComputedStyle(el).borderTopWidth).toBe('0px');
        el.bordered = true;
        await el.updateComplete;
        const style = getComputedStyle(el);
        expect(style.borderTopWidth).toBe('1px');
        expect(style.borderTopStyle).toBe('solid');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Box,
                    { padding: 'small', radius: 'leaf', bordered: true },
                    'Content',
                ),
            );
        });
        const el = mount.querySelector('hmi-box') as HmiBox;
        await el.updateComplete;
        expect(el.padding).toBe('small');
        expect(el.radius).toBe('leaf');
        expect(el.bordered).toBe(true);
    });
});
