import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './menu-separator.js';
import type { HmiMenuSeparator } from './menu-separator.js';
import { MenuSeparator } from './menu-separator.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiMenuSeparator;
    await el.updateComplete;
    return el;
}

const base = (el: HmiMenuSeparator) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-menu-separator', () => {
    it('registers', () => {
        expect(customElements.get('hmi-menu-separator')).toBeDefined();
    });

    it('is a block with a separator line in its base part', async () => {
        const el = await fixture(
            html`<hmi-menu-separator></hmi-menu-separator>`,
        );
        expect(getComputedStyle(el).display).toBe('block');
        expect(base(el).getAttribute('role')).toBe('separator');
    });

    it('draws a 1px line in the outline-variant colour', async () => {
        const el = await fixture(
            html`<hmi-menu-separator
                style="--outline-variant: rgb(4, 5, 6)"
            ></hmi-menu-separator>`,
        );
        const box = base(el).getBoundingClientRect();
        expect(box.height).toBe(1);
        expect(getComputedStyle(base(el)).backgroundColor).toBe('rgb(4, 5, 6)');
    });

    it('reaches past the padding of its container by half a base on each side', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<div id="menu" style="width: 200px; padding: 0 4px; display: flex; flex-direction: column">
                <hmi-menu-separator style="--space-2: 6px"></hmi-menu-separator>
            </div>`,
            host,
        );
        const el = host.querySelector('hmi-menu-separator') as HmiMenuSeparator;
        await el.updateComplete;
        const container = (
            host.querySelector('#menu') as HTMLElement
        ).getBoundingClientRect();
        const line = base(el).getBoundingClientRect();
        expect(line.left).toBeCloseTo(container.left, 1);
        expect(line.right).toBeCloseTo(container.right, 1);
        expect(getComputedStyle(el).marginTop).toBe('6px');
    });
});

describe('MenuSeparator (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(createElement(MenuSeparator));
        });
        const el = host.querySelector('hmi-menu-separator') as HmiMenuSeparator;
        await el.updateComplete;
        expect(base(el)).not.toBeNull();
        await act(async () => root.unmount());
    });
});
