// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import '../card/card.js';
import './divider.js';
import type { HmiDivider } from './divider.js';
import { Divider } from './divider.react.js';

/** Resolves after the slotchange event and the update it requests. */
async function settle(el: HmiDivider): Promise<void> {
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await el.updateComplete;
}

async function fixture(template: ReturnType<typeof html>): Promise<HmiDivider> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiDivider;
    await settle(el);
    return el;
}

const part = (el: HmiDivider, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const lines = (el: HmiDivider) => [
    ...(el.shadowRoot?.querySelectorAll<HTMLElement>('.line') ?? []),
];

/** The theme files are not loaded in the test page: give the tokens a value. */
function tokens(el: HTMLElement, values: Record<string, string>): void {
    for (const [name, value] of Object.entries(values)) {
        el.style.setProperty(name, value);
    }
}

/** Renders a divider into a parent styled by `css`. */
async function inParent(
    css: string,
    template: ReturnType<typeof html>,
): Promise<HmiDivider> {
    const host = document.createElement('div');
    host.style.cssText = css;
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-divider') as HmiDivider;
    await settle(el);
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.removeAttribute('style');
});

describe('hmi-divider', () => {
    it('registers', () => {
        expect(customElements.get('hmi-divider')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-divider></hmi-divider>`);
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBe(1);
    });

    it('draws a one-pixel horizontal rule by default', async () => {
        const el = await fixture(
            html`<hmi-divider style="width: 200px"></hmi-divider>`,
        );
        expect(el.orientation).toBe('horizontal');
        expect(el.align).toBe('center');
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBe(200);
        expect(height).toBe(1);
    });

    it('reflects orientation and align', async () => {
        const el = await fixture(html`<hmi-divider></hmi-divider>`);
        el.orientation = 'vertical';
        el.align = 'end';
        await el.updateComplete;
        expect(el.getAttribute('orientation')).toBe('vertical');
        expect(el.getAttribute('align')).toBe('end');
        el.setAttribute('orientation', 'horizontal');
        el.setAttribute('align', 'start');
        await el.updateComplete;
        expect(el.orientation).toBe('horizontal');
        expect(el.align).toBe('start');
    });

    it('projects default slot', async () => {
        const el = await fixture(
            html`<hmi-divider><strong>Today</strong></hmi-divider>`,
        );
        const slot = part(el, 'label').querySelector('slot');
        expect(slot?.assignedElements()[0]?.localName).toBe('strong');
    });

    it('is a separator with its orientation when plain', async () => {
        const el = await fixture(html`<hmi-divider></hmi-divider>`);
        const base = part(el, 'base');
        expect(base.getAttribute('role')).toBe('separator');
        expect(base.getAttribute('aria-orientation')).toBe('horizontal');
        el.orientation = 'vertical';
        await el.updateComplete;
        expect(base.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('stretches a vertical rule to its flex row', async () => {
        const host = document.createElement('div');
        host.style.cssText = 'display: flex; height: 80px';
        host.innerHTML =
            '<span>a</span><hmi-divider orientation="vertical"></hmi-divider><span>b</span>';
        document.body.append(host);
        const el = host.querySelector('hmi-divider') as HmiDivider;
        await settle(el);
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBe(1);
        expect(height).toBe(80);
    });

    it('gives a vertical rule a minimum height of 1.5 base units', async () => {
        const el = await fixture(
            html`<hmi-divider orientation="vertical"></hmi-divider>`,
        );
        expect(el.getBoundingClientRect().height).toBe(12);
    });

    it('shows its label with a rule on each side, and is no longer a separator', async () => {
        const el = await fixture(
            html`<hmi-divider style="width: 300px">OR</hmi-divider>`,
        );
        const base = part(el, 'base');
        expect(base.classList.contains('labeled')).toBe(true);
        expect(base.hasAttribute('role')).toBe(false);
        expect(base.hasAttribute('aria-orientation')).toBe(false);
        expect(getComputedStyle(part(el, 'label')).display).toBe('block');
        const [first, second] = lines(el) as [HTMLElement, HTMLElement];
        for (const line of [first, second]) {
            expect(getComputedStyle(line).display).toBe('block');
            expect(line.getAttribute('aria-hidden')).toBe('true');
        }
        expect(first.getBoundingClientRect().width).toBeGreaterThan(50);
        expect(
            part(el, 'label').querySelector('slot')?.assignedNodes().length,
        ).toBeGreaterThan(0);
    });

    it('ignores whitespace as a label', async () => {
        const el = await fixture(html`<hmi-divider> </hmi-divider>`);
        expect(part(el, 'base').classList.contains('labeled')).toBe(false);
    });

    it('is never labelled when vertical', async () => {
        const el = await fixture(
            html`<hmi-divider orientation="vertical">OR</hmi-divider>`,
        );
        expect(part(el, 'base').classList.contains('labeled')).toBe(false);
        expect(part(el, 'base').getAttribute('role')).toBe('separator');
    });

    it('anchors the label to the start or the end', async () => {
        const el = await fixture(
            html`<hmi-divider align="start" style="width: 300px">OR</hmi-divider>`,
        );
        const [first, second] = lines(el) as [HTMLElement, HTMLElement];
        expect(first.getBoundingClientRect().width).toBe(12);
        expect(second.getBoundingClientRect().width).toBeGreaterThan(100);
        el.align = 'end';
        await el.updateComplete;
        expect(second.getBoundingClientRect().width).toBe(12);
        expect(first.getBoundingClientRect().width).toBeGreaterThan(100);
    });

    it('follows a label added and removed later', async () => {
        const el = await fixture(html`<hmi-divider></hmi-divider>`);
        const label = document.createElement('span');
        label.textContent = 'OR';
        el.append(label);
        await settle(el);
        expect(part(el, 'base').classList.contains('labeled')).toBe(true);
        label.remove();
        await settle(el);
        expect(part(el, 'base').classList.contains('labeled')).toBe(false);
        expect(part(el, 'base').getAttribute('role')).toBe('separator');
    });

    /* The host was a block of auto width, which a flex row, a centred column
       or a centred grid cell shrink to its content: 0px for a plain rule.
       v5's <hr> had width: 100%. */
    for (const [where, css] of [
        ['a flex row', 'display: flex; width: 300px'],
        [
            'a centred flex column',
            'display: flex; flex-direction: column; align-items: center; width: 300px',
        ],
        [
            'a centred grid cell',
            'display: grid; justify-items: center; width: 300px',
        ],
    ] as const) {
        it(`fills ${where}`, async () => {
            const el = await inParent(css, html`<hmi-divider></hmi-divider>`);
            expect(part(el, 'base').getBoundingClientRect().width).toBe(300);
        });
    }

    it('shares a flex row with its neighbours and keeps a margin inside', async () => {
        const row = await inParent(
            'display: flex; width: 300px',
            html`<span style="width: 100px; flex: none"></span
                ><hmi-divider></hmi-divider>`,
        );
        expect(row.getBoundingClientRect().width).toBe(200);
        const margined = await inParent(
            'width: 300px',
            html`<hmi-divider style="margin-inline: 20px"></hmi-divider>`,
        );
        expect(margined.getBoundingClientRect().width).toBe(260);
    });

    it('keeps a vertical rule one pixel wide', async () => {
        const el = await inParent(
            'display: flex; width: 300px; height: 40px',
            html`<hmi-divider orientation="vertical"></hmi-divider>`,
        );
        expect(el.getBoundingClientRect().width).toBe(1);
    });

    it('draws its rules in --outline', async () => {
        tokens(document.documentElement, {
            '--outline': 'rgb(1, 2, 3)',
            '--outline-variant': 'rgb(200, 200, 200)',
        });
        const plain = await fixture(html`<hmi-divider></hmi-divider>`);
        const labelled = await fixture(html`<hmi-divider>OR</hmi-divider>`);
        const vertical = await fixture(
            html`<hmi-divider orientation="vertical"></hmi-divider>`,
        );
        for (const node of [
            part(plain, 'base'),
            part(vertical, 'base'),
            ...lines(labelled),
        ]) {
            expect(getComputedStyle(node).backgroundColor).toBe('rgb(1, 2, 3)');
        }
    });

    /* A card sets --on-panel-variant for its own surface, which hmi-text
       reads before --on-surface-variant; the label read the surface role
       alone, so in an ink card it drew dark text on the dark card. */
    it("takes the card's muted text colour for its label", async () => {
        tokens(document.documentElement, {
            '--on-surface-variant': 'rgb(80, 80, 80)',
            '--inverse-on-surface': 'rgb(250, 250, 250)',
            '--inverse-surface': 'rgb(250, 250, 250)',
        });
        await fixture(
            html`<hmi-card variant="ink"
                ><hmi-divider>OR</hmi-divider
                ><span style="color: var(--on-panel-variant)"></span
            ></hmi-card>`,
        );
        const el = document.querySelector('hmi-divider') as HmiDivider;
        const probe = document.querySelector('hmi-card span') as HTMLElement;
        await settle(el);
        expect(getComputedStyle(part(el, 'label')).color).toBe(
            getComputedStyle(probe).color,
        );
        expect(getComputedStyle(probe).color).not.toBe('rgb(80, 80, 80)');
        const page = await fixture(html`<hmi-divider>OR</hmi-divider>`);
        expect(getComputedStyle(part(page, 'label')).color).toBe(
            'rgb(80, 80, 80)',
        );
    });

    it('keeps its rules in forced colors', async () => {
        const plain = await fixture(html`<hmi-divider></hmi-divider>`);
        const labelled = await fixture(html`<hmi-divider>OR</hmi-divider>`);
        const session = cdp();
        await session.send('Emulation.setEmulatedMedia', {
            features: [{ name: 'forced-colors', value: 'active' }],
        });
        try {
            /* Forced colors repaint a background as Canvas, the page's own,
               so a rule drawn by its background disappears. */
            for (const node of [part(plain, 'base'), ...lines(labelled)]) {
                const style = getComputedStyle(node);
                expect(style.forcedColorAdjust).toBe('none');
                expect(style.backgroundColor).toBe(
                    getComputedStyle(part(labelled, 'label')).color,
                );
            }
        } finally {
            await session.send('Emulation.setEmulatedMedia', { features: [] });
        }
    });

    it('wraps a long label and keeps a short rule on each side', async () => {
        const el = await inParent(
            'width: 200px',
            html`<hmi-divider>Or continue with your email address instead</hmi-divider>`,
        );
        const label = part(el, 'label').getBoundingClientRect();
        expect(label.right).toBeLessThanOrEqual(
            el.getBoundingClientRect().right,
        );
        expect(label.height).toBeGreaterThan(30);
        for (const line of lines(el)) {
            expect(line.getBoundingClientRect().width).toBe(12);
        }
    });

    /* A browser maps an align attribute to text-align, which inherits. The
       host resets it, and the label aligns itself where align puts it. */
    it('aligns its label text with align, and resets the host', async () => {
        const el = await fixture(
            html`<hmi-divider align="end"><span>Two lines</span></hmi-divider>`,
        );
        expect(getComputedStyle(el).textAlign).toBe('start');
        expect(getComputedStyle(part(el, 'label')).textAlign).toBe('end');
        el.align = 'center';
        await el.updateComplete;
        expect(getComputedStyle(part(el, 'label')).textAlign).toBe('center');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Divider, { align: 'start' }, 'OR'),
            );
        });
        const el = mount.querySelector('hmi-divider') as HmiDivider;
        await settle(el);
        expect(el.align).toBe('start');
        expect(part(el, 'base').classList.contains('labeled')).toBe(true);
    });
});
