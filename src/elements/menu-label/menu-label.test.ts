import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './menu-label.js';
import type { HmiMenuLabel } from './menu-label.js';
import { MenuLabel } from './menu-label.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiMenuLabel;
    await el.updateComplete;
    return el;
}

const base = (el: HmiMenuLabel) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-menu-label', () => {
    it('registers', () => {
        expect(customElements.get('hmi-menu-label')).toBeDefined();
    });

    it('is a block that projects its text into the base part', async () => {
        const el = await fixture(
            html`<hmi-menu-label>Workspace</hmi-menu-label>`,
        );
        expect(getComputedStyle(el).display).toBe('block');
        const slot = base(el).querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedNodes().map((node) => node.textContent)).toEqual([
            'Workspace',
        ]);
    });

    it('is set in small bold capitals from the token colour and padding', async () => {
        const el = await fixture(
            html`<hmi-menu-label
                style="--on-surface-variant: rgb(1, 2, 3); --space-4: 8px; --space-5: 10px; --space-2: 4px"
                >Workspace</hmi-menu-label
            >`,
        );
        const style = getComputedStyle(base(el));
        expect(style.color).toBe('rgb(1, 2, 3)');
        expect(style.textTransform).toBe('uppercase');
        expect(style.fontWeight).toBe('700');
        expect(style.fontSize).toBe('10px');
        expect(style.paddingTop).toBe('8px');
        expect(style.paddingLeft).toBe('10px');
        expect(style.paddingBottom).toBe('4px');
    });
});

describe('MenuLabel (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(createElement(MenuLabel, null, 'Danger zone'));
        });
        const el = host.querySelector('hmi-menu-label') as HmiMenuLabel;
        await el.updateComplete;
        expect(el.textContent).toBe('Danger zone');
        await act(async () => root.unmount());
    });
});
