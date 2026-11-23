/// <reference types="vite/client" />
// The Playwright provider's types give `cdp()` its `send`.
/// <reference types="@vitest/browser-playwright" />
import { html, nothing, render } from 'lit';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cdp, page } from 'vitest/browser';
import baseCss from '../../../public/css/base.css?inline';
import defaultColour from '../../../public/css/themes/color/default.css?inline';
import forestColour from '../../../public/css/themes/color/forest.css?inline';
import oceanColour from '../../../public/css/themes/color/ocean.css?inline';
import constantsCss from '../../../public/css/themes/constants.css?inline';
import glassCss from '../../../public/css/themes/material/glass.css?inline';
import liquidCss from '../../../public/css/themes/material/liquid.css?inline';
import defaultStructure from '../../../public/css/themes/structure/default.css?inline';
import journalStructure from '../../../public/css/themes/structure/journal.css?inline';
import pixelStructure from '../../../public/css/themes/structure/pixel.css?inline';
import roundedStructure from '../../../public/css/themes/structure/rounded.css?inline';
import sharpStructure from '../../../public/css/themes/structure/sharp.css?inline';
import '../card/card.js';
import '../heading/heading.js';
import '../link/link.js';
import '../stat/stat.js';
import '../text/text.js';
import { renderLiquidFilter } from './panel.js';

/* Text contrast in every look: 3 colours x 5 structures x 3 materials, light
   and dark. contrast.ssr.test.ts reads hex values from the colour files, so it
   sees the text tokens on the surface tokens alone. This loads the real theme
   files, paints each pair, and measures what the page shows: the panels' own
   text roles, the translucent glass and liquid surfaces blended over the page
   (liquid's carries a gradient sheen and a refraction filter), and hmi-text,
   hmi-heading and hmi-link inside a card, and hmi-stat's text, its delta in
   each tone.

   For each look it takes one screenshot with the text hidden, then compares
   each text's computed colour with every background pixel under its line
   boxes, and keeps the worst. Text straight on the page may sit anywhere on
   the glass and liquid backdrop, so it is compared with every pixel of the
   viewport, in a second screenshot with the fixture hidden. Large text (24px, or 18.66px at 700) needs 3:1,
   the rest 4.5:1: WCAG AA. */

const colours = ['default', 'ocean', 'forest'] as const;
const structures = ['default', 'rounded', 'sharp', 'pixel', 'journal'] as const;
const materials = ['solid', 'glass', 'liquid'] as const;
const schemes = ['light', 'dark'] as const;

/* Pairs known to fail, each until the review that fixes it. A pair listed here
   that passes in every look fails the test, so the entry goes with its fix. */
const expected: ReadonlyArray<{
    why: string;
    matches: (f: Failure) => boolean;
}> = [
    {
        why: 'card finding 8: --ref-primary-40 on the default colour, until HMI-23',
        matches: (f) =>
            f.colour === 'default' &&
            f.target.endsWith(' hmi-link') &&
            !f.target.startsWith('ink '),
    },
];

type Failure = {
    look: string;
    colour: string;
    material: string;
    scheme: string;
    target: string;
    ratio: number;
    min: number;
};

/* A surface the page paints straight from a token, with the panel filter the
   panel-like elements put behind it. */
const panel = (token: string) => html`
    <div
        class="panel"
        style="background: var(${token}); backdrop-filter: var(--panel-filter)"
    >
        <p data-t="${token} text">Body copy</p>
        <p class="muted" data-t="${token} muted">Muted copy</p>
        <hmi-text data-t="${token} hmi-text">hmi-text copy</hmi-text>
        <hmi-text tone="muted" data-t="${token} hmi-text muted"
            >Muted hmi-text</hmi-text
        >
        <hmi-link href="#" data-t="${token} hmi-link">A link</hmi-link>
    </div>
`;

const card = (variant: string) => html`
    <hmi-card variant=${variant === 'active' ? 'default' : variant} ?active=${variant === 'active'}>
        <hmi-heading slot="header" level="3" size="small" data-t="${variant} card hmi-heading"
            >Heading</hmi-heading
        >
        <p data-t="${variant} card text">Inherited copy</p>
        <hmi-text data-t="${variant} card hmi-text">hmi-text copy</hmi-text>
        <hmi-text tone="muted" data-t="${variant} card hmi-text muted"
            >Muted hmi-text</hmi-text
        >
        <hmi-link slot="footer" href="#" data-t="${variant} card hmi-link"
            >A link</hmi-link
        >
    </hmi-card>
`;

const stat = (trend: string, tone?: string, where = '') => {
    const t = `${where}stat ${trend}${tone ? ` ${tone}` : ''}`;
    return html`
        <hmi-stat trend=${trend} tone=${tone ?? nothing}>
            <span slot="label" data-t="${t} label">Revenue</span>
            <span slot="value" data-t="${t} value">$12.4k</span>
            <span slot="delta" data-t="${t} delta">8%</span>
            <span slot="help-text" data-t="${t} help">vs last month</span>
        </hmi-stat>
    `;
};

const fixture = html`
    ${renderLiquidFilter()}
    <div class="page" data-t-scope>
        <p data-t="page text">Body copy</p>
        <p class="muted" data-t="page muted">Muted copy</p>
        <hmi-link href="#" data-t="page hmi-link">A link</hmi-link>
    </div>
    <div class="row">
        ${['--panel-bg', '--panel-bg-strong', '--drawer-bg', '--listbox-bg', '--palette-bg'].map(panel)}
    </div>
    <div class="row">${['default', 'flat', 'active', 'ink', 'accent'].map(card)}</div>
    <div class="row">
        ${stat('up')} ${stat('down')} ${stat('neutral')}
        ${stat('down', 'positive')} ${stat('up', 'negative')}
        <hmi-card variant="ink">${stat('down', undefined, 'ink card ')}</hmi-card>
    </div>
`;

const fixtureCss = `
    #themes { display: grid; gap: 16px; padding: 16px; width: 1200px; }
    #themes .row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
    #themes .panel { padding: 16px; color: var(--on-surface); }
    #themes p { margin: 0 0 8px; }
    #themes .muted { color: var(--on-surface-variant); }
    #themes.hide-text [data-t] { visibility: hidden; }
    #themes.hide-all { visibility: hidden; }
    #backdrop { position: fixed; inset: 0; pointer-events: none; }
`;

/* An sRGB colour as the page paints it, read back through a canvas, which
   parses every CSS colour syntax, color-mix() and oklab() included. */
const probe = document.createElement('canvas').getContext('2d', {
    willReadFrequently: true,
}) as CanvasRenderingContext2D;
function rgba(colour: string): [number, number, number, number] {
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = colour;
    probe.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0, a = 0] = probe.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
}

const linear = Array.from({ length: 256 }, (_, v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
});

function luminance(r: number, g: number, b: number): number {
    const channel = (v: number) => linear[Math.round(v)] ?? 0;
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: number, b: number): number {
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/* The node whose style the text takes: a slotted text inherits from its slot. */
function textStyle(el: Element): CSSStyleDeclaration {
    const slot = el.shadowRoot?.querySelector('slot:not([name])');
    return getComputedStyle(slot ?? el);
}

async function pixels(el: HTMLElement): Promise<ImageData> {
    const shot = await page.screenshot({
        element: el,
        save: false,
        base64: true,
    });
    const image = new Image();
    image.src = `data:image/png;base64,${shot}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.width, image.height);
}

const frame = () =>
    new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

async function measure(
    root: HTMLElement,
): Promise<Pick<Failure, 'target' | 'ratio' | 'min'>[]> {
    const targets = [...root.querySelectorAll<HTMLElement>('[data-t]')];
    const origin = root.getBoundingClientRect();
    const measured = targets.map((el) => {
        const style = textStyle(el);
        const size = Number.parseFloat(style.fontSize);
        const large =
            size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
        const range = document.createRange();
        range.selectNodeContents(el);
        return {
            target: el.dataset.t as string,
            colour: rgba(style.color),
            min: large ? 3 : 4.5,
            rects: [...range.getClientRects()].filter(
                (r) => r.width && r.height,
            ),
        };
    });
    root.classList.add('hide-text');
    await frame();
    const bg = await pixels(root);
    root.classList.replace('hide-text', 'hide-all');
    await frame();
    const view = await pixels(backdrop);
    root.classList.remove('hide-all');
    const scale = bg.width / origin.width;
    const whole = [{ x0: 0, y0: 0, x1: view.width, y1: view.height }];

    return measured.map(({ target, colour, min, rects }) => {
        const boxes = target.startsWith('page ')
            ? whole
            : rects.map((rect) => ({
                  x0: Math.max(
                      0,
                      Math.floor((rect.left - origin.left) * scale),
                  ),
                  y0: Math.max(0, Math.floor((rect.top - origin.top) * scale)),
                  x1: Math.min(
                      bg.width,
                      Math.ceil((rect.right - origin.left) * scale),
                  ),
                  y1: Math.min(
                      bg.height,
                      Math.ceil((rect.bottom - origin.top) * scale),
                  ),
              }));
        /* The backdrop's gradients are smooth: every second pixel of the
           viewport finds their extremes, in a quarter of the time. */
        const [image, step] = target.startsWith('page ') ? [view, 2] : [bg, 1];
        return { target, ratio: worst(image, colour, boxes, step), min };
    });
}

/* The lowest contrast of a text colour over the pixels in the boxes. */
function worst(
    image: ImageData,
    [r, g, b, a]: readonly number[],
    boxes: ReadonlyArray<{ x0: number; y0: number; x1: number; y1: number }>,
    step: number,
): number {
    const alpha = a ?? 1;
    let low = Number.POSITIVE_INFINITY;
    for (const { x0, y0, x1, y1 } of boxes) {
        for (let y = y0; y < y1; y += step) {
            for (let x = x0; x < x1; x += step) {
                const i = (y * image.width + x) * 4;
                const br = image.data[i] ?? 0;
                const bgr = image.data[i + 1] ?? 0;
                const bb = image.data[i + 2] ?? 0;
                // A translucent text colour blends over what is under it.
                const fore = luminance(
                    (r ?? 0) * alpha + br * (1 - alpha),
                    (g ?? 0) * alpha + bgr * (1 - alpha),
                    (b ?? 0) * alpha + bb * (1 - alpha),
                );
                low = Math.min(low, ratio(fore, luminance(br, bgr, bb)));
            }
        }
    }
    return low;
}

const style = document.createElement('style');
const root = document.createElement('div');
root.id = 'themes';
const backdrop = document.createElement('div');
backdrop.id = 'backdrop';

beforeAll(async () => {
    await page.viewport(1240, 900);
    style.textContent = [
        constantsCss,
        defaultColour,
        oceanColour,
        forestColour,
        defaultStructure,
        roundedStructure,
        sharpStructure,
        pixelStructure,
        journalStructure,
        glassCss,
        liquidCss,
        baseCss,
        fixtureCss,
    ].join('\n');
    document.head.append(style);
    document.body.append(root, backdrop);
    render(fixture, root);
    await Promise.all(
        [
            ...root.querySelectorAll(
                'hmi-card, hmi-text, hmi-heading, hmi-link, hmi-stat',
            ),
        ].map(
            (el) =>
                (el as HTMLElement & { updateComplete: Promise<unknown> })
                    .updateComplete,
        ),
    );
});

afterAll(async () => {
    root.remove();
    backdrop.remove();
    style.remove();
    for (const name of ['data-theme', 'data-structure', 'data-material']) {
        document.documentElement.removeAttribute(name);
    }
    await cdp().send('Emulation.setEmulatedMedia', { features: [] });
});

const failures: Failure[] = [];

describe('text meets AA in every look', () => {
    for (const scheme of schemes) {
        for (const colour of colours) {
            it(`${colour}, ${scheme}`, async () => {
                await cdp().send('Emulation.setEmulatedMedia', {
                    features: [{ name: 'prefers-color-scheme', value: scheme }],
                });
                const found: Failure[] = [];
                const html = document.documentElement;
                for (const structure of structures) {
                    for (const material of materials) {
                        html.setAttribute('data-theme', colour);
                        html.setAttribute('data-structure', structure);
                        html.setAttribute('data-material', material);
                        await frame();
                        const look = `${colour} ${structure} ${material} ${scheme}`;
                        for (const m of await measure(root)) {
                            if (m.ratio < m.min) {
                                found.push({
                                    ...m,
                                    look,
                                    colour,
                                    material,
                                    scheme,
                                });
                            }
                        }
                    }
                }
                failures.push(...found);
                const unexpected = found
                    .filter((f) => !expected.some((e) => e.matches(f)))
                    .map(
                        (f) =>
                            `${f.target} in ${f.look}: ${f.ratio.toFixed(2)}:1, under ${f.min}:1`,
                    );
                expect(unexpected).toEqual([]);
            });
        }
    }

    it('still fails each expected pair', () => {
        const fixed = expected
            .filter((e) => !failures.some((f) => e.matches(f)))
            .map((e) => e.why);
        expect(fixed).toEqual([]);
    });
});
