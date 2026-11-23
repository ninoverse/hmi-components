// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import './stat.js';
import type { HmiStat } from './stat.js';
import { Stat } from './stat.react.js';

/** Resolves after the slotchange events and the update they request. */
async function settle(el: HmiStat): Promise<void> {
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await el.updateComplete;
}

async function fixture(template: ReturnType<typeof html>): Promise<HmiStat> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiStat;
    await settle(el);
    return el;
}

const part = (el: HmiStat, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const delta = (el: HmiStat) =>
    el.shadowRoot?.querySelector<HTMLElement>('.delta') as HTMLElement;
const displayOf = (node: Element) => getComputedStyle(node).display;
const arrowPath = (el: HmiStat) =>
    delta(el).querySelector('path')?.getAttribute('d');

type AXNode = {
    ignored: boolean;
    role?: { value: string };
    name?: { value: string };
};

type FrameTree = {
    frame: { id: string; url: string };
    childFrames?: FrameTree[];
};

/* The accessibility tree of the frame the tests run in, as the browser
   computes it, with the nodes it ignores left out. */
async function axTree(): Promise<AXNode[]> {
    const session = cdp();
    await session.send('Accessibility.enable');
    /* The tests run in a frame of the runner's page: find it by its URL. */
    const { frameTree } = (await session.send('Page.getFrameTree')) as {
        frameTree: FrameTree;
    };
    const find = (tree: FrameTree): string | undefined =>
        tree.frame.url === location.href
            ? tree.frame.id
            : tree.childFrames?.map(find).find(Boolean);
    const frameId = find(frameTree);
    if (!frameId) throw new Error('The test frame is not in the frame tree');
    const { nodes } = (await session.send('Accessibility.getFullAXTree', {
        frameId,
    })) as { nodes: AXNode[] };
    return nodes.filter((node) => !node.ignored);
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-stat', () => {
    it('registers', () => {
        expect(customElements.get('hmi-stat')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(
            html`<hmi-stat
                ><span slot="label">Revenue</span
                ><span slot="value">$12.4k</span></hmi-stat
            >`,
        );
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('has no trend by default and reflects it', async () => {
        const el = await fixture(html`<hmi-stat></hmi-stat>`);
        expect(el.trend).toBeUndefined();
        el.trend = 'down';
        await el.updateComplete;
        expect(el.getAttribute('trend')).toBe('down');
    });

    it('slots the label, value and icon', async () => {
        const el = await fixture(
            html`<hmi-stat
                ><span slot="label">Users</span
                ><span slot="value">42</span
                ><svg slot="icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg
            ></hmi-stat>`,
        );
        const assigned = (name: string) =>
            el.shadowRoot
                ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
                ?.assignedElements() ?? [];
        expect(assigned('label')).toHaveLength(1);
        expect(assigned('value')).toHaveLength(1);
        expect(assigned('icon')).toHaveLength(1);
        const { width } = (
            el.querySelector('svg') as Element
        ).getBoundingClientRect();
        expect(width).toBe(16);
    });

    it('draws no footer without a delta or help text', async () => {
        const el = await fixture(
            html`<hmi-stat trend="up"
                ><span slot="value">1</span></hmi-stat
            >`,
        );
        expect(displayOf(part(el, 'footer'))).toBe('none');
    });

    it('draws the footer for help text alone', async () => {
        const el = await fixture(
            html`<hmi-stat><span slot="help-text">vs last month</span></hmi-stat>`,
        );
        expect(displayOf(part(el, 'footer'))).not.toBe('none');
        expect(displayOf(delta(el))).toBe('none');
    });

    it('shows the delta and its arrow only with a trend', async () => {
        const el = await fixture(
            html`<hmi-stat><span slot="delta">8%</span></hmi-stat>`,
        );
        expect(displayOf(part(el, 'footer'))).toBe('none');
        el.trend = 'up';
        await settle(el);
        expect(displayOf(part(el, 'footer'))).not.toBe('none');
        expect(displayOf(delta(el))).not.toBe('none');
        const arrow = delta(el).querySelector('svg');
        expect(arrow?.namespaceURI).toBe('http://www.w3.org/2000/svg');
        expect(arrow?.getAttribute('aria-hidden')).toBe('true');
        expect(arrow?.querySelector('path')?.getAttribute('d')).toBe(
            'M3 11l5-5 5 5',
        );
        el.trend = 'down';
        await settle(el);
        expect(delta(el).querySelector('path')?.getAttribute('d')).toBe(
            'M3 5l5 5 5-5',
        );
        el.trend = 'neutral';
        await settle(el);
        expect(delta(el).querySelector('path')?.getAttribute('d')).toBe(
            'M3 8h10',
        );
    });

    it('follows slotted content added and removed later', async () => {
        const el = await fixture(html`<hmi-stat trend="up"></hmi-stat>`);
        expect(displayOf(part(el, 'footer'))).toBe('none');
        const help = document.createElement('span');
        help.slot = 'help-text';
        help.textContent = 'note';
        el.append(help);
        await settle(el);
        expect(displayOf(part(el, 'footer'))).not.toBe('none');
        help.remove();
        await settle(el);
        expect(displayOf(part(el, 'footer'))).toBe('none');
    });

    it('draws the footer rule only with divider', async () => {
        const el = await fixture(
            html`<hmi-stat><span slot="help-text">note</span></hmi-stat>`,
        );
        expect(el.divider).toBe(false);
        expect(getComputedStyle(part(el, 'footer')).borderTopWidth).toBe('0px');
        // the theme files are not loaded in the test page: give the rule its
        // colour token, or the shorthand is invalid at computed-value time
        el.style.setProperty('--outline-variant', 'gray');
        el.divider = true;
        await el.updateComplete;
        expect(el.hasAttribute('divider')).toBe(true);
        const style = getComputedStyle(part(el, 'footer'));
        expect(style.borderTopWidth).toBe('1px');
        expect(style.borderTopStyle).toBe('dashed');
    });

    it('draws an unknown trend as neutral, and an empty one as none', async () => {
        const el = await fixture(
            html`<hmi-stat trend="sideways"><span slot="delta">8%</span></hmi-stat>`,
        );
        expect(displayOf(delta(el))).not.toBe('none');
        expect(arrowPath(el)).toBe('M3 8h10');
        expect(delta(el).dataset.tone).toBe('neutral');
        el.setAttribute('trend', '');
        await settle(el);
        expect(displayOf(part(el, 'footer'))).toBe('none');
        expect(delta(el).querySelector('svg')).toBeNull();
    });

    it('colours the delta from its tone, which follows the trend', async () => {
        const el = await fixture(
            html`<hmi-stat
                trend="up"
                style="--on-success-container: rgb(0, 128, 0); --on-error-container: rgb(255, 0, 0); --on-surface-variant: rgb(0, 0, 255)"
                ><span slot="delta">8%</span></hmi-stat
            >`,
        );
        const colour = () => getComputedStyle(delta(el)).color;
        expect(el.tone).toBeUndefined();
        expect(colour()).toBe('rgb(0, 128, 0)');
        el.trend = 'down';
        await settle(el);
        expect(colour()).toBe('rgb(255, 0, 0)');
        el.trend = 'neutral';
        await settle(el);
        expect(colour()).toBe('rgb(0, 0, 255)');
        // a fall that is good news: a down arrow, coloured positive
        el.trend = 'down';
        el.tone = 'positive';
        await settle(el);
        expect(el.getAttribute('tone')).toBe('positive');
        expect(arrowPath(el)).toBe('M3 5l5 5 5-5');
        expect(colour()).toBe('rgb(0, 128, 0)');
        el.tone = 'neutral';
        await settle(el);
        expect(colour()).toBe('rgb(0, 0, 255)');
        // an unknown tone follows the trend
        el.setAttribute('tone', 'great');
        await settle(el);
        expect(colour()).toBe('rgb(255, 0, 0)');
    });

    it('is a group named by its label, with the direction in words', async () => {
        await fixture(
            html`<div>
                <hmi-stat trend="up"
                    ><span slot="label">Revenue</span
                    ><span slot="value">$12.4k</span
                    ><span slot="delta">8%</span></hmi-stat
                ><hmi-stat trend="down" trend-label="in calo"
                    ><span slot="label">Churn</span
                    ><span slot="value">2%</span
                    ><span slot="delta">1%</span></hmi-stat
                ><hmi-stat trend="neutral"
                    ><span slot="label">Tickets</span
                    ><span slot="value">31</span
                    ><span slot="delta">0</span></hmi-stat
                >
            </div>`,
        );
        const nodes = await axTree();
        const groups = nodes
            .filter((node) => node.role?.value === 'group')
            .map((node) => node.name?.value?.toLowerCase());
        /* Chromium exposes the label's text-transform: uppercase. */
        expect(groups).toEqual(['revenue', 'churn', 'tickets']);
        const text = nodes
            .filter((node) => node.role?.value === 'StaticText')
            .map((node) => node.name?.value?.trim());
        /* The full tree lists its nodes out of reading order. */
        expect(text.sort()).toEqual(
            [
                'REVENUE',
                '$12.4k',
                'up',
                '8%',
                'CHURN',
                '2%',
                'in calo',
                '1%',
                'TICKETS',
                '31',
                'no change',
                '0',
            ].sort(),
        );
        const word = document
            .querySelector('hmi-stat')
            ?.shadowRoot?.querySelector('.trend') as HTMLElement;
        expect(word.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    });

    it('fills the height of a row that stretches it', async () => {
        const host = await fixture(
            html`<div
                style="display: grid; grid-template-columns: 1fr 1fr; width: 600px"
            >
                <hmi-stat
                    ><span slot="label">Open tickets</span
                    ><span slot="value">31</span></hmi-stat
                ><hmi-stat trend="up"
                    ><span slot="label">Revenue</span
                    ><span slot="value">$12.4k</span
                    ><span slot="delta">8%</span
                    ><span slot="help-text">vs last month</span></hmi-stat
                >
            </div>`,
        );
        const [short, tall] = [
            ...(host as HTMLElement).querySelectorAll('hmi-stat'),
        ] as HmiStat[];
        await settle(short as HmiStat);
        await settle(tall as HmiStat);
        const height = (el: HmiStat) =>
            part(el, 'base').getBoundingClientRect().height;
        expect(height(short as HmiStat)).toBeGreaterThan(0);
        expect(height(short as HmiStat)).toBe(height(tall as HmiStat));
        expect(height(short as HmiStat)).toBe(
            (short as HmiStat).getBoundingClientRect().height,
        );
    });

    it('wraps a long value inside a narrow stat', async () => {
        const el = await fixture(
            html`<hmi-stat style="width: 180px"
                ><span slot="value">$1,234,567,890</span></hmi-stat
            >`,
        );
        const surface = part(el, 'base').getBoundingClientRect();
        const value = (
            el.querySelector('[slot="value"]') as HTMLElement
        ).getBoundingClientRect();
        expect(value.right).toBeLessThanOrEqual(surface.right);
    });

    it('draws the footer rule from --stat-divider, as journal does', async () => {
        const el = await fixture(
            html`<hmi-stat
                style="--outline-variant: gray; --space-2: 2px; --space-3: 3px"
                ><span slot="help-text">note</span></hmi-stat
            >`,
        );
        const footer = () => getComputedStyle(part(el, 'footer'));
        expect(footer().borderTopWidth).toBe('0px');
        expect(footer().paddingTop).toBe('0px');
        el.style.setProperty('--stat-divider', '1');
        await settle(el);
        expect(footer().borderTopWidth).toBe('1px');
        expect(footer().borderTopStyle).toBe('dashed');
        expect(footer().paddingTop).toBe('3px');
        expect(footer().marginTop).toBe('2px');
    });

    it('paints its surface from the panel tokens', async () => {
        const el = await fixture(
            html`<hmi-stat
                style="--panel-bg: rgb(1, 2, 3); --panel-border: rgb(4, 5, 6); --panel-filter: blur(2px)"
                ><span slot="value">1</span></hmi-stat
            >`,
        );
        const style = getComputedStyle(part(el, 'panel'));
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.borderTopColor).toBe('rgb(4, 5, 6)');
        expect(style.backdropFilter).toBe('blur(2px)');
    });

    it('sizes any slotted icon, and the icon part is a box', async () => {
        const el = await fixture(
            html`<hmi-stat
                ><span slot="label">Users</span
                ><img
                    slot="icon"
                    alt=""
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='156' height='156'/%3E"
            /></hmi-stat>`,
        );
        const img = el.querySelector('img') as HTMLImageElement;
        await img.decode();
        const { width, height } = img.getBoundingClientRect();
        expect([width, height]).toEqual([16, 16]);
        const icon = part(el, 'icon');
        expect(icon.localName).toBe('span');
        expect(icon.getBoundingClientRect().width).toBe(16);
    });

    it('keeps no icon box without an icon', async () => {
        const el = await fixture(
            html`<hmi-stat><span slot="label">Users</span></hmi-stat>`,
        );
        expect(displayOf(part(el, 'icon'))).toBe('none');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Stat,
                    {
                        trend: 'down',
                        tone: 'positive',
                        trendLabel: 'in calo',
                        divider: true,
                    },
                    createElement('span', { slot: 'label' }, 'Revenue'),
                    createElement('span', { slot: 'value' }, '$12.4k'),
                    createElement('span', { slot: 'delta' }, '8%'),
                ),
            );
        });
        const el = mount.querySelector('hmi-stat') as HmiStat;
        await settle(el);
        expect(el.trend).toBe('down');
        expect(el.tone).toBe('positive');
        expect(el.trendLabel).toBe('in calo');
        expect(el.divider).toBe(true);
        expect(displayOf(delta(el))).not.toBe('none');
    });
});
