import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
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

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Stat,
                    { trend: 'up', divider: true },
                    createElement('span', { slot: 'label' }, 'Revenue'),
                    createElement('span', { slot: 'value' }, '$12.4k'),
                    createElement('span', { slot: 'delta' }, '8%'),
                ),
            );
        });
        const el = mount.querySelector('hmi-stat') as HmiStat;
        await settle(el);
        expect(el.trend).toBe('up');
        expect(el.divider).toBe(true);
        expect(displayOf(delta(el))).not.toBe('none');
    });
});
