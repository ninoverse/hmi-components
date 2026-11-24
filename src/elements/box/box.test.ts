// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import '../card/card.js';
import '../text/text.js';
import './box.js';
import type { HmiBox } from './box.js';
import { Box } from './box.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiBox> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-box') as HmiBox;
    await el.updateComplete;
    return el;
}

/** The theme files are not loaded in the test page: give the tokens a value. */
function tokens(el: HTMLElement, values: Record<string, string>): void {
    for (const [name, value] of Object.entries(values)) {
        el.style.setProperty(name, value);
    }
}

/** The card's text colours that a box with a surface of its own resets. */
const panelTokens = [
    '--on-panel',
    '--on-panel-variant',
    '--on-panel-link',
    '--on-panel-track',
    '--on-panel-fill',
    '--on-panel-success',
    '--on-panel-warning',
    '--on-panel-error',
];

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.removeAttribute('style');
});

describe('hmi-box', () => {
    it('registers', () => {
        expect(customElements.get('hmi-box')).toBeDefined();
    });

    /* The host is the box: the shadow root holds only a slot, so there is no
       base part, and the host is what has to take up space. */
    it('renders', async () => {
        const el = await fixture(html`<hmi-box><p>Hello</p></hmi-box>`);
        expect(getComputedStyle(el).display).toBe('block');
        expect(el.shadowRoot?.querySelector('[part]')).toBeNull();
        const { width, height } = el.getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-box></hmi-box>`);
        expect(el.background).toBe('none');
        expect(el.padding).toBe('none');
        expect(el.radius).toBe('none');
        expect(el.bordered).toBe(false);
        expect(getComputedStyle(el).paddingTop).toBe('0px');
    });

    for (const [prop, value] of [
        ['background', 'surface'],
        ['padding', 'large'],
        ['radius', 'full'],
    ] as const) {
        it(`reflects ${prop}`, async () => {
            const el = await fixture(html`<hmi-box></hmi-box>`);
            (el as unknown as Record<string, string>)[prop] = value;
            await el.updateComplete;
            expect(el.getAttribute(prop)).toBe(value);
            el.setAttribute(prop, 'small');
            await el.updateComplete;
            expect((el as unknown as Record<string, string>)[prop]).toBe(
                'small',
            );
        });
    }

    it('reflects bordered', async () => {
        const el = await fixture(html`<hmi-box></hmi-box>`);
        el.bordered = true;
        await el.updateComplete;
        expect(el.hasAttribute('bordered')).toBe(true);
        el.bordered = false;
        await el.updateComplete;
        expect(el.hasAttribute('bordered')).toBe(false);
    });

    it('boolean attribute presence', async () => {
        const el = await fixture(html`<hmi-box bordered></hmi-box>`);
        expect(el.bordered).toBe(true);
        el.removeAttribute('bordered');
        await el.updateComplete;
        expect(el.bordered).toBe(false);
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-box><p>Hello</p></hmi-box>`);
        const slot = el.shadowRoot?.querySelector('slot:not([name])');
        expect((slot as HTMLSlotElement).assignedElements()).toEqual([
            el.querySelector('p'),
        ]);
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

    /* An ink card sets --on-panel to its light ink, which hmi-text reads
       before --on-surface. A box that paints its own light surface inside it
       has to give its content the surface roles back. */
    it('gives its content the surface text colours inside an ink card', async () => {
        tokens(document.documentElement, {
            '--on-surface': 'rgb(10, 10, 10)',
            '--inverse-on-surface': 'rgb(250, 250, 250)',
        });
        const el = await fixture(
            html`<hmi-card variant="ink"
                ><hmi-box background="surface"><hmi-text>On the box</hmi-text></hmi-box
                ><hmi-box><hmi-text>On the card</hmi-text></hmi-box></hmi-card
            >`,
        );
        const [onBox, onCard] = document.querySelectorAll('hmi-text');
        expect(getComputedStyle(onBox as Element).color).toBe(
            'rgb(10, 10, 10)',
        );
        for (const name of panelTokens) {
            expect(getComputedStyle(el).getPropertyValue(name), name).toBe('');
        }
        // A box with no surface of its own passes the card's colours through.
        expect(getComputedStyle(onCard as Element).color).toBe(
            'rgb(250, 250, 250)',
        );
    });

    it('keeps its edge in forced colors', async () => {
        const el = await fixture(
            html`<hmi-box background="surface" padding="small">Hi</hmi-box>`,
        );
        const plain = await fixture(html`<hmi-box>Hi</hmi-box>`);
        const session = cdp();
        await session.send('Emulation.setEmulatedMedia', {
            features: [{ name: 'forced-colors', value: 'active' }],
        });
        try {
            /* Forced colors repaint the surface as Canvas, the page's own,
               so a box drawn by its background alone loses its edge. An
               outline inside the edge marks it without changing its size. */
            const style = getComputedStyle(el);
            expect(style.outlineStyle).toBe('solid');
            expect(style.outlineWidth).toBe('1px');
            expect(style.outlineColor).toBe(style.color);
            expect(getComputedStyle(plain).outlineStyle).toBe('none');
            el.bordered = true;
            await el.updateComplete;
            expect(getComputedStyle(el).outlineStyle).toBe('none');
        } finally {
            await session.send('Emulation.setEmulatedMedia', { features: [] });
        }
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
