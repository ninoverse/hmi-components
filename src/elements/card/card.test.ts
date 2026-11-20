import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import '../heading/heading.js';
import '../link/link.js';
import '../meter/meter.js';
import '../progress/progress.js';
import '../slider/slider.js';
import '../text/text.js';
import './card.js';
import type { HmiCard } from './card.js';
import { Card } from './card.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiCard> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiCard;
    await el.updateComplete;
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-card', () => {
    it('registers', () => {
        expect(customElements.get('hmi-card')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-card>Hi</hmi-card>`);
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        const box = base?.getBoundingClientRect();
        expect(box?.width).toBeGreaterThan(0);
        expect(box?.height).toBeGreaterThan(0);
    });

    it('exposes base and panel on one node', async () => {
        const el = await fixture(html`<hmi-card>Hi</hmi-card>`);
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base?.getAttribute('part')).toBe('base panel');
    });

    it('reflects variant', async () => {
        const el = await fixture(html`<hmi-card variant="ink"></hmi-card>`);
        expect(el.variant).toBe('ink');
        el.variant = 'accent';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('accent');
    });

    it('boolean attribute presence', async () => {
        const el = await fixture(html`<hmi-card active></hmi-card>`);
        expect(el.active).toBe(true);
        el.removeAttribute('active');
        await el.updateComplete;
        expect(el.active).toBe(false);
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-card><p>Body</p></hmi-card>`);
        const slot =
            el.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
        expect(slot?.assignedElements()).toHaveLength(1);
    });

    it('projects the header and footer slots', async () => {
        const el = await fixture(html`
            <hmi-card>
                <span slot="footer">Foot</span>
                <p>Body</p>
                <h4 slot="header">Head</h4>
            </hmi-card>
        `);
        const named = (name: string) =>
            el.shadowRoot
                ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
                ?.assignedElements();
        expect(named('header')?.[0]?.textContent).toBe('Head');
        expect(named('footer')?.[0]?.textContent).toBe('Foot');
        expect(
            el.shadowRoot
                ?.querySelector<HTMLSlotElement>('slot:not([name])')
                ?.assignedElements(),
        ).toHaveLength(1);
    });

    it('renders the header slot before the body and the footer after', async () => {
        const el = await fixture(html`
            <hmi-card>
                <span slot="footer">Foot</span>
                <h4 slot="header">Head</h4>
            </hmi-card>
        `);
        const slots = [...(el.shadowRoot?.querySelectorAll('slot') ?? [])].map(
            (slot) => slot.getAttribute('name'),
        );
        expect(slots).toEqual(['header', null, 'footer']);
    });

    it('lets ::part(header) and ::part(footer) take a margin', async () => {
        const el = await fixture(html`
            <div>
                <style>
                    .parts::part(header) {
                        margin-bottom: 24px;
                    }
                    .parts::part(footer) {
                        margin-top: 16px;
                    }
                </style>
                <hmi-card class="parts">
                    <div slot="header">Head</div>
                    <p style="margin: 0">Body</p>
                    <div slot="footer">Foot</div>
                </hmi-card>
            </div>
        `);
        const card = el.querySelector('hmi-card') as HmiCard;
        await card.updateComplete;
        const top = (selector: string) =>
            (
                card.querySelector(selector) as HTMLElement
            ).getBoundingClientRect();
        expect(Math.round(top('p').top - top('[slot="header"]').bottom)).toBe(
            24,
        );
        expect(Math.round(top('[slot="footer"]').top - top('p').bottom)).toBe(
            16,
        );
    });

    it('takes no space for an empty header or footer', async () => {
        const el = await fixture(
            html`<hmi-card><p style="margin: 0">Body</p></hmi-card>`,
        );
        for (const name of ['header', 'footer']) {
            const slot = el.shadowRoot?.querySelector(`slot[name="${name}"]`);
            expect(slot?.getBoundingClientRect().height).toBe(0);
        }
    });

    it('wraps a long word inside the card', async () => {
        const el = await fixture(html`
            <hmi-card style="width: 200px">
                <p>Supercalifragilisticexpialidocious_identifier_1234567890</p>
            </hmi-card>
        `);
        const panel = el.shadowRoot?.querySelector('.panel') as HTMLElement;
        expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth);
    });

    it('fills the height a grid row stretches it to', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`
                <div style="display: grid; grid-template-columns: 1fr 1fr">
                    <hmi-card>Short</hmi-card>
                    <hmi-card><div style="height: 200px">Tall</div></hmi-card>
                </div>
            `,
            host,
        );
        const cards = [...host.querySelectorAll('hmi-card')] as HmiCard[];
        await Promise.all(cards.map((card) => card.updateComplete));
        const [short, tall] = cards.map(
            (card) =>
                (
                    card.shadowRoot?.querySelector('.panel') as HTMLElement
                ).getBoundingClientRect().height,
        );
        expect(short).toBe(tall);
        expect(short).toBe(cards[0]?.getBoundingClientRect().height);
    });

    it('sizes to its content on its own', async () => {
        const el = await fixture(
            html`<hmi-card><div style="height: 50px"></div></hmi-card>`,
        );
        const panel = el.shadowRoot?.querySelector('.panel') as HTMLElement;
        expect(el.getBoundingClientRect().height).toBe(
            panel.getBoundingClientRect().height,
        );
        expect(panel.getBoundingClientRect().height).toBeLessThan(200);
    });

    /* The tokens are set by hand, since the browser tests load no theme: each
       role gets a colour of its own, so the colour an element ends up with
       names the role it read. */
    const roles = [
        '--on-surface: rgb(1, 0, 0)',
        '--on-surface-variant: rgb(2, 0, 0)',
        '--ref-primary-40: rgb(3, 0, 0)',
        '--inverse-on-surface: rgb(0, 1, 0)',
        '--inverse-surface: rgb(0, 1, 0)',
        '--inverse-primary: rgb(0, 1, 0)',
        '--on-primary-container: rgb(0, 0, 1)',
        '--primary-container: rgb(0, 0, 1)',
        '--outline: rgb(9, 9, 9)',
        '--card-flat-border: rgb(8, 8, 8)',
    ].join('; ');
    /* A colour-mix() computes to oklab(), so each colour is painted on a
       canvas and read back as rgb(). */
    const canvas = document.createElement('canvas').getContext('2d', {
        willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    const colourOf = (node: Element | null | undefined) => {
        const inner = node?.shadowRoot?.querySelector('[part~="base"]') ?? node;
        canvas.fillStyle = getComputedStyle(inner as Element).color;
        canvas.fillRect(0, 0, 1, 1);
        const [r, g, b] = canvas.getImageData(0, 0, 1, 1).data;
        return `rgb(${r}, ${g}, ${b})`;
    };

    it('gives hmi-text, hmi-heading and hmi-link the colours of its surface', async () => {
        const el = await fixture(html`
            <div style=${roles}>
                <hmi-card data-v="default"
                    ><hmi-heading>Head</hmi-heading><hmi-text>Text</hmi-text
                    ><hmi-text tone="muted">Muted</hmi-text
                    ><hmi-link href="#">Link</hmi-link></hmi-card
                >
                <hmi-card data-v="ink" variant="ink"
                    ><hmi-heading>Head</hmi-heading><hmi-text>Text</hmi-text
                    ><hmi-text tone="muted">Muted</hmi-text
                    ><hmi-link href="#">Link</hmi-link
                    ><hmi-card data-v="nested"><hmi-text>Text</hmi-text></hmi-card></hmi-card
                >
                <hmi-card data-v="accent" variant="accent"
                    ><hmi-heading>Head</hmi-heading><hmi-text>Text</hmi-text
                    ><hmi-text tone="muted">Muted</hmi-text
                    ><hmi-link href="#">Link</hmi-link></hmi-card
                >
            </div>
        `);
        await Promise.all(
            [
                ...el.querySelectorAll(
                    'hmi-card, hmi-text, hmi-heading, hmi-link',
                ),
            ].map((node) => (node as HmiCard).updateComplete),
        );
        const card = (v: string) => el.querySelector(`[data-v="${v}"]`);
        const inCard = (v: string, selector: string) =>
            colourOf(card(v)?.querySelector(`:scope > ${selector}`));

        expect(inCard('default', 'hmi-heading')).toBe('rgb(1, 0, 0)');
        expect(inCard('default', 'hmi-text[tone="default"]')).toBe(
            'rgb(1, 0, 0)',
        );
        expect(inCard('default', 'hmi-text[tone="muted"]')).toBe(
            'rgb(2, 0, 0)',
        );
        expect(inCard('default', 'hmi-link')).toBe('rgb(3, 0, 0)');

        expect(inCard('ink', 'hmi-heading')).toBe('rgb(0, 1, 0)');
        expect(inCard('ink', 'hmi-text[tone="default"]')).toBe('rgb(0, 1, 0)');
        expect(inCard('ink', 'hmi-text[tone="muted"]')).toBe('rgb(0, 1, 0)');
        expect(inCard('ink', 'hmi-link')).toBe('rgb(0, 1, 0)');
        expect(inCard('nested', 'hmi-text')).toBe('rgb(1, 0, 0)');

        expect(inCard('accent', 'hmi-heading')).toBe('rgb(0, 0, 1)');
        expect(inCard('accent', 'hmi-text[tone="default"]')).toBe(
            'rgb(0, 0, 1)',
        );
        expect(inCard('accent', 'hmi-text[tone="muted"]')).toBe('rgb(0, 0, 1)');
        expect(inCard('accent', 'hmi-link')).toBe('rgb(3, 0, 0)');
    });

    it('outlines an active card and edges a flat one', async () => {
        const el = await fixture(html`
            <div style=${roles}>
                <hmi-card active>Active</hmi-card>
                <hmi-card variant="flat">Flat</hmi-card>
                <hmi-card variant="flat" active>Both</hmi-card>
            </div>
        `);
        const cards = [...el.querySelectorAll('hmi-card')] as HmiCard[];
        await Promise.all(cards.map((card) => card.updateComplete));
        const edge = (card: HmiCard) =>
            getComputedStyle(
                card.shadowRoot?.querySelector('.panel') as Element,
            ).borderTopColor;
        expect(cards.map(edge)).toEqual([
            'rgb(9, 9, 9)',
            'rgb(8, 8, 8)',
            'rgb(9, 9, 9)',
        ]);
    });

    it('embeds the liquid filter in its own root', async () => {
        const el = await fixture(html`<hmi-card>Hi</hmi-card>`);
        const filter = el.shadowRoot?.querySelector('filter');
        expect(filter?.id).toBe('liquid-glass');
        expect(
            el.shadowRoot?.querySelector('svg')?.getAttribute('aria-hidden'),
        ).toBe('true');
        expect(document.querySelector('filter#liquid-glass')).toBeNull();
    });

    it("gives the bars in an ink card the card's colours", async () => {
        const el = await fixture(html`<hmi-card
            variant="ink"
            style="--inverse-on-surface: rgb(255, 255, 255); --inverse-surface: rgb(0, 0, 0); --inverse-primary: rgb(1, 2, 3); --surface-container-high: rgb(9, 9, 9); --primary: rgb(8, 8, 8)"
        >
            <hmi-progress value="50" label="Upload"></hmi-progress>
            <hmi-meter value="0.5" label="Disk"></hmi-meter>
            <hmi-slider value="50" label="Volume"></hmi-slider>
            <hmi-card
                ><hmi-progress value="50" label="Nested"></hmi-progress
            ></hmi-card>
        </hmi-card>`);
        const [progress, nested] = [...el.querySelectorAll('hmi-progress')];
        const meter = el.querySelector('hmi-meter');
        const slider = el.querySelector('hmi-slider');
        if (!progress || !nested || !meter || !slider) throw new Error('bars');
        await Promise.all(
            [progress, nested, meter, slider].map((e) => e.updateComplete),
        );
        const style = (host: Element, selector: string) =>
            getComputedStyle(
                host.shadowRoot?.querySelector(selector) as Element,
            );
        /* The track is the card's text at 20% over the inverse surface; the
           fill the inverse primary. */
        const track = 'color(srgb 0.2 0.2 0.2)';
        expect(style(progress, '[part~="base"]').backgroundColor).toBe(track);
        expect(style(progress, '[part~="indicator"]').backgroundColor).toBe(
            'rgb(1, 2, 3)',
        );
        expect(style(meter, '[part~="base"]').backgroundColor).toBe(track);
        expect(style(slider, 'input').backgroundImage).toContain(track);
        expect(style(slider, 'input').backgroundImage).toContain(
            'rgb(1, 2, 3)',
        );
        /* A default card inside resets them, so its bars read the page's. */
        expect(style(nested, '[part~="base"]').backgroundColor).toBe(
            'rgb(9, 9, 9)',
        );
        expect(style(nested, '[part~="indicator"]').backgroundColor).toBe(
            'rgb(8, 8, 8)',
        );
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-card>Hi</hmi-card>`);
        expect(
            el.shadowRoot
                ?.querySelector('[part~="base"]')
                ?.getAttribute('role'),
        ).toBeNull();
        expect(el.getAttribute('role')).toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Card,
                    { variant: 'accent', active: true },
                    'Body',
                ),
            );
        });
        const el = mount.querySelector('hmi-card') as HmiCard;
        await el.updateComplete;
        expect(el.variant).toBe('accent');
        expect(el.active).toBe(true);
        expect(el.textContent).toBe('Body');
    });
});
