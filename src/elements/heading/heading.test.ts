import { html, render } from 'lit';
import type * as React from 'react';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './heading.js';
import type { HeadingLevel, HmiHeading } from './heading.js';
import { Heading } from './heading.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiHeading> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-heading') as HmiHeading;
    await el.updateComplete;
    return el;
}

const base = (el: HmiHeading) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;
const style = (el: HmiHeading) => getComputedStyle(base(el));
const fontSize = (el: HmiHeading) => style(el).fontSize;

/* The lines the heading's text breaks into, measured on the slotted text. */
function lines(el: HmiHeading): DOMRect[] {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()];
    return rects.filter(
        (r, i) => r.width > 0 && rects.findIndex((q) => q.top === r.top) === i,
    );
}

const long = 'A heading far too long to fit in a hundred pixels';

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-heading', () => {
    it('registers', () => {
        expect(customElements.get('hmi-heading')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        expect(base(el).tagName).toBe('H2');
        const { width, height } = base(el).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects level', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        el.level = 4;
        await el.updateComplete;
        expect(el.getAttribute('level')).toBe('4');
        el.setAttribute('level', '5');
        await el.updateComplete;
        expect(el.level).toBe(5);
    });

    it('reflects size', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        el.size = 'xlarge';
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('xlarge');
        el.setAttribute('size', 'small');
        await el.updateComplete;
        expect(el.size).toBe('small');
    });

    it('reflects tone', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        el.tone = 'muted';
        await el.updateComplete;
        expect(el.getAttribute('tone')).toBe('muted');
        el.setAttribute('tone', 'primary');
        await el.updateComplete;
        expect(el.tone).toBe('primary');
    });

    it('boolean attribute presence', async () => {
        const el = await fixture(
            html`<hmi-heading truncate>Title</hmi-heading>`,
        );
        expect(el.truncate).toBe(true);
        el.removeAttribute('truncate');
        await el.updateComplete;
        expect(el.truncate).toBe(false);
        el.truncate = true;
        await el.updateComplete;
        expect(el.hasAttribute('truncate')).toBe(true);
    });

    it('projects default slot', async () => {
        const el = await fixture(
            html`<hmi-heading><em id="text">Title</em></hmi-heading>`,
        );
        const slot =
            el.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
        expect(slot?.assignedElements()).toEqual([el.querySelector('#text')]);
    });

    it('exposes roles', async () => {
        const el = await fixture(
            html`<hmi-heading level="1">Title</hmi-heading>`,
        );
        for (const level of [1, 2, 3, 4, 5, 6] as HeadingLevel[]) {
            el.level = level;
            await el.updateComplete;
            expect(base(el).tagName).toBe(`H${level}`);
        }
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        expect(el.level).toBe(2);
        expect(el.size).toBeUndefined();
        expect(el.tone).toBe('default');
        expect(el.truncate).toBe(false);
        expect(base(el).getBoundingClientRect().width).toBe(
            el.getBoundingClientRect().width,
        );
    });

    it('falls back to level 2 for an invalid level', async () => {
        const el = await fixture(
            html`<hmi-heading level="9">Title</hmi-heading>`,
        );
        expect(base(el).tagName).toBe('H2');
        expect(fontSize(el)).toBe('30px');
    });

    it('picks the default size from the level', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        const sizes: Record<HeadingLevel, string> = {
            1: '36px',
            2: '30px',
            3: '24px',
            4: '20px',
            5: '20px',
            6: '16px',
        };
        for (const [level, px] of Object.entries(sizes)) {
            el.level = Number(level) as HeadingLevel;
            await el.updateComplete;
            expect(fontSize(el)).toBe(px);
        }
    });

    it('lets size override the level independently', async () => {
        const el = await fixture(
            html`<hmi-heading level="1" size="xsmall">Title</hmi-heading>`,
        );
        expect(base(el).tagName).toBe('H1');
        expect(fontSize(el)).toBe('16px');
        el.size = 'xlarge';
        await el.updateComplete;
        expect(fontSize(el)).toBe('36px');
    });

    it('treats an empty size attribute as unset', async () => {
        const el = await fixture(
            html`<hmi-heading size="">Title</hmi-heading>`,
        );
        expect(fontSize(el)).toBe('30px');
    });

    it("keeps the level's size for a size it doesn't know", async () => {
        const el = await fixture(
            html`<hmi-heading level="3" size="huge">Title</hmi-heading>`,
        );
        expect(fontSize(el)).toBe('24px');
    });

    it('scales with --hmi-base', async () => {
        const el = await fixture(
            html`<hmi-heading style="--hmi-base: 10px">Title</hmi-heading>`,
        );
        expect(fontSize(el)).toBe('37.5px');
    });

    it('maps the tones to the text roles', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        el.style.cssText =
            '--on-surface: rgb(1, 1, 1); --on-surface-variant: rgb(2, 2, 2); --primary: rgb(3, 3, 3); --ref-primary-40: rgb(5, 5, 5)';
        el.parentElement?.style.setProperty('color', 'rgb(4, 4, 4)');
        const color = () => style(el).color;
        expect(color()).toBe('rgb(1, 1, 1)');
        el.tone = 'muted';
        await el.updateComplete;
        expect(color()).toBe('rgb(2, 2, 2)');
        el.tone = 'inherit';
        await el.updateComplete;
        expect(color()).toBe('rgb(4, 4, 4)');
    });

    it("paints the primary tone in the surface's link colour", async () => {
        const el = await fixture(
            html`<hmi-heading
                tone="primary"
                style="--primary: rgb(3, 3, 3); --ref-primary-40: rgb(5, 5, 5)"
                >Title</hmi-heading
            >`,
        );
        expect(style(el).color).toBe('rgb(5, 5, 5)');
        el.style.setProperty('--on-panel-link', 'rgb(6, 6, 6)');
        expect(style(el).color).toBe('rgb(6, 6, 6)');
    });

    it("takes the host's style", async () => {
        const el = await fixture(
            html`<hmi-heading
                tone="muted"
                style="--on-surface-variant: rgb(2, 2, 2); color: rgb(9, 8, 7); font-size: 14px; font-weight: 300; line-height: 2; font-family: monospace"
                >Title</hmi-heading
            >`,
        );
        const s = style(el);
        expect(s.color).toBe('rgb(9, 8, 7)');
        expect(s.fontSize).toBe('14px');
        expect(s.fontWeight).toBe('300');
        expect(s.lineHeight).toBe('28px');
        expect(s.fontFamily).toBe('monospace');
        expect(base(el).getBoundingClientRect().height).toBe(28);
    });

    it("takes the host's class", async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
            '.custom { color: rgb(9, 8, 7); font-size: 14px; letter-spacing: 0.5em }',
        );
        document.adoptedStyleSheets = [sheet];
        try {
            const el = await fixture(
                html`<hmi-heading class="custom">Title</hmi-heading>`,
            );
            expect(style(el).color).toBe('rgb(9, 8, 7)');
            expect(style(el).fontSize).toBe('14px');
            expect(style(el).letterSpacing).toBe('7px');
        } finally {
            document.adoptedStyleSheets = [];
        }
    });

    it('can still be styled through its base part', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
            '.custom::part(base) { color: rgb(9, 8, 7); font-size: 14px }',
        );
        document.adoptedStyleSheets = [sheet];
        try {
            const el = await fixture(
                html`<hmi-heading class="custom">Title</hmi-heading>`,
            );
            expect(style(el).color).toBe('rgb(9, 8, 7)');
            expect(style(el).fontSize).toBe('14px');
        } finally {
            document.adoptedStyleSheets = [];
        }
    });

    it('truncates to one line with an ellipsis', async () => {
        const el = await fixture(
            html`<hmi-heading truncate style="width: 100px">${long}</hmi-heading>`,
        );
        expect(lines(el)).toHaveLength(1);
        expect(base(el).scrollWidth).toBeGreaterThan(base(el).clientWidth);
        expect(base(el).getBoundingClientRect().width).toBe(100);
    });

    it('truncates beside its neighbour in a flex row', async () => {
        const host = document.createElement('div');
        host.style.cssText = 'display: flex; gap: 8px; width: 200px';
        document.body.append(host);
        render(
            html`<hmi-heading truncate>${long}</hmi-heading
                ><button style="flex: none; width: 50px">Edit</button>`,
            host,
        );
        const el = host.querySelector('hmi-heading') as HmiHeading;
        await el.updateComplete;
        expect(el.getBoundingClientRect().width).toBe(142);
        expect(base(el).scrollWidth).toBeGreaterThan(base(el).clientWidth);
        expect(lines(el)).toHaveLength(1);
    });

    it('wraps a word too long for its box', async () => {
        const el = await fixture(
            html`<hmi-heading style="width: 100px"
                >Supercalifragilisticexpialidocious</hmi-heading
            >`,
        );
        expect(base(el).scrollWidth).toBeLessThanOrEqual(base(el).clientWidth);
        expect(lines(el).length).toBeGreaterThan(1);
    });

    it('balances the lines of a heading that wraps', async () => {
        const el = await fixture(
            html`<hmi-heading level="3" style="width: max-content"
                >Pressure rising on line three again</hmi-heading
            >`,
        );
        /* One pixel short of one line: wrapping greedily leaves the last
           word alone on the second line. */
        const width = el.getBoundingClientRect().width;
        el.style.width = `${width - 1}px`;
        const [first, last] = [lines(el)[0], lines(el).at(-1)];
        expect(lines(el)).toHaveLength(2);
        expect(last?.width).toBeGreaterThan((first?.width ?? 0) * 0.5);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Heading,
                    {
                        level: 3,
                        tone: 'muted',
                        truncate: true,
                        style: {
                            '--on-surface-variant': 'rgb(2, 2, 2)',
                            color: 'rgb(9, 8, 7)',
                        } as React.CSSProperties,
                    },
                    'Title',
                ),
            );
        });
        const el = mount.querySelector('hmi-heading') as HmiHeading;
        await el.updateComplete;
        expect(el.level).toBe(3);
        expect(el.tone).toBe('muted');
        expect(el.truncate).toBe(true);
        expect(base(el).tagName).toBe('H3');
        expect(style(el).color).toBe('rgb(9, 8, 7)');
    });
});
