import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './tabs.js';
import type { HmiTabs, TabOption, TabsChangeDetail } from './tabs.js';
import { Tabs } from './tabs.react.js';

const OPTIONS: TabOption[] = [
    { value: 'inbox', label: 'Inbox', badge: '12' },
    { value: 'sent', label: 'Sent' },
    {
        value: 'archive',
        label: 'Archive',
        badge: '24',
        badgeVariant: 'success',
    },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-tabs') as HmiTabs;
    await el.updateComplete;
    return el;
}

/** Wait for slotchange handlers. */
const settle = () => new Promise((r) => setTimeout(r));

const all = (el: HmiTabs, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

const slotOf = (el: HmiTabs, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(
        `slot[name="${name}"]`,
    ) as HTMLSlotElement;

const text = (n: Element | undefined) =>
    n?.textContent?.replace(/\s+/g, ' ').trim();

function onChange(el: HmiTabs) {
    const seen: string[] = [];
    el.addEventListener('hmi-change', (e) =>
        seen.push((e as CustomEvent<TabsChangeDetail>).detail.value),
    );
    return seen;
}

const key = (target: Element, k: string) =>
    target.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: k,
            bubbles: true,
            cancelable: true,
        }),
    );

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-tabs', () => {
    it('registers', () => {
        expect(customElements.get('hmi-tabs')).toBeDefined();
    });

    it('renders a tab list with a tab per option', async () => {
        const el = await fixture(
            html`<hmi-tabs .options=${OPTIONS}></hmi-tabs>`,
        );
        expect(all(el, 'base')[0]?.getAttribute('role')).toBe('tablist');
        const tabs = all(el, 'tab');
        expect(tabs).toHaveLength(3);
        expect(tabs.every((t) => t.getAttribute('role') === 'tab')).toBe(true);
        expect(tabs.map((t) => text(t))).toEqual([
            'Inbox 12',
            'Sent',
            'Archive 24',
        ]);
    });

    it('names the tab list from label', async () => {
        const el = await fixture(
            html`<hmi-tabs label="Folders" .options=${OPTIONS}></hmi-tabs>`,
        );
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Folders');
        const bare = await fixture(
            html`<hmi-tabs .options=${OPTIONS}></hmi-tabs>`,
        );
        expect(all(bare, 'base')[0]?.hasAttribute('aria-label')).toBe(false);
    });

    it('takes options as a property only: an options attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-tabs options='[{"value":"a","label":"A"}]'></hmi-tabs>`,
        );
        expect(all(el, 'tab')).toHaveLength(0);
    });

    it('marks the active tab selected', async () => {
        const el = await fixture(
            html`<hmi-tabs value="sent" .options=${OPTIONS}></hmi-tabs>`,
        );
        const tabs = all(el, 'tab');
        expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual([
            'false',
            'true',
            'false',
        ]);
        expect(tabs[1]?.dataset.active).toBe('true');
    });

    it('is one tab stop: the active tab, or the first when none is', async () => {
        const stops = (el: HmiTabs) =>
            all(el, 'tab').map((t) => t.getAttribute('tabindex'));
        expect(
            stops(
                await fixture(
                    html`<hmi-tabs value="sent" .options=${OPTIONS}></hmi-tabs>`,
                ),
            ),
        ).toEqual(['-1', '0', '-1']);
        expect(
            stops(
                await fixture(html`<hmi-tabs .options=${OPTIONS}></hmi-tabs>`),
            ),
        ).toEqual(['0', '-1', '-1']);
    });

    it('defaults the variant to pill, and reflects it', async () => {
        const el = await fixture(
            html`<hmi-tabs .options=${OPTIONS}></hmi-tabs>`,
        );
        expect(el.variant).toBe('pill');
        expect(el.getAttribute('variant')).toBe('pill');
        el.variant = 'underline';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('underline');
    });

    it('slots a rich label by value, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-tabs .options=${OPTIONS}
                ><i slot="label-sent">Outbox</i></hmi-tabs
            >`,
        );
        expect(
            slotOf(el, 'label-sent').assignedElements()[0]?.textContent,
        ).toBe('Outbox');
        expect(text(slotOf(el, 'label-inbox'))).toBe('Inbox');
    });

    it('shows an icon only for a tab that has one', async () => {
        const el = await fixture(
            html`<hmi-tabs .options=${OPTIONS}
                ><svg slot="icon-inbox" viewBox="0 0 16 16"></svg
            ></hmi-tabs>`,
        );
        await settle();
        const icons = all(el, 'icon');
        expect(icons[0]?.hidden).toBe(false);
        expect(icons[1]?.hidden).toBe(true);
    });
});

describe('hmi-tabs badges', () => {
    it('draws a badge, primary on the active tab and default on the others', async () => {
        const el = await fixture(
            html`<hmi-tabs value="inbox" .options=${OPTIONS}></hmi-tabs>`,
        );
        const badges = all(el, 'badge');
        expect(text(badges[0])).toBe('12');
        expect(badges[0]?.getAttribute('variant')).toBe('primary');
        expect(badges[1]?.hidden).toBe(true);
        el.value = 'sent';
        await el.updateComplete;
        expect(all(el, 'badge')[0]?.getAttribute('variant')).toBe('default');
    });

    it('lets badgeVariant override the automatic variant', async () => {
        const el = await fixture(
            html`<hmi-tabs value="archive" .options=${OPTIONS}></hmi-tabs>`,
        );
        expect(all(el, 'badge')[2]?.getAttribute('variant')).toBe('success');
    });

    it('shows a badge for slotted content, inside the pill', async () => {
        const el = await fixture(
            html`<hmi-tabs .options=${OPTIONS}
                ><b slot="badge-sent">new</b></hmi-tabs
            >`,
        );
        await settle();
        const pill = all(el, 'badge')[1] as HTMLElement;
        expect(pill.hidden).toBe(false);
        expect(pill.contains(slotOf(el, 'badge-sent'))).toBe(true);
    });

    it('lets an end slot replace the pill', async () => {
        const el = await fixture(
            html`<hmi-tabs .options=${OPTIONS}
                ><i slot="end-inbox">dot</i></hmi-tabs
            >`,
        );
        expect(slotOf(el, 'end-inbox').assignedElements()[0]?.textContent).toBe(
            'dot',
        );
    });
});

describe('hmi-tabs changes', () => {
    it('fires hmi-change when another tab is chosen', async () => {
        const el = await fixture(
            html`<hmi-tabs value="inbox" .options=${OPTIONS}></hmi-tabs>`,
        );
        const seen = onChange(el);
        all(el, 'tab')[2]?.click();
        expect(seen).toEqual(['archive']);
    });

    it('does not fire for the tab that is already active', async () => {
        const el = await fixture(
            html`<hmi-tabs value="inbox" .options=${OPTIONS}></hmi-tabs>`,
        );
        const seen = onChange(el);
        all(el, 'tab')[0]?.click();
        expect(seen).toEqual([]);
    });

    it('is controlled: it keeps the active tab until the consumer sets value', async () => {
        const el = await fixture(
            html`<hmi-tabs value="inbox" .options=${OPTIONS}></hmi-tabs>`,
        );
        all(el, 'tab')[1]?.click();
        await el.updateComplete;
        expect(el.value).toBe('inbox');
        expect(all(el, 'tab')[0]?.getAttribute('aria-selected')).toBe('true');
        el.value = 'sent';
        await el.updateComplete;
        expect(all(el, 'tab')[1]?.getAttribute('aria-selected')).toBe('true');
    });

    it('moves focus and chooses with the arrow keys, wrapping at the ends', async () => {
        const el = await fixture(
            html`<hmi-tabs value="inbox" .options=${OPTIONS}></hmi-tabs>`,
        );
        const seen = onChange(el);
        const tabs = all(el, 'tab');
        key(tabs[0] as Element, 'ArrowRight');
        expect(el.shadowRoot?.activeElement).toBe(tabs[1]);
        key(tabs[0] as Element, 'ArrowLeft');
        expect(el.shadowRoot?.activeElement).toBe(tabs[2]);
        expect(seen).toEqual(['sent', 'archive']);
    });

    it('jumps to the first and last tab with Home and End', async () => {
        const el = await fixture(
            html`<hmi-tabs value="sent" .options=${OPTIONS}></hmi-tabs>`,
        );
        const seen = onChange(el);
        const tabs = all(el, 'tab');
        key(tabs[1] as Element, 'End');
        key(tabs[1] as Element, 'Home');
        expect(seen).toEqual(['archive', 'inbox']);
    });

    it('ignores other keys', async () => {
        const el = await fixture(
            html`<hmi-tabs value="inbox" .options=${OPTIONS}></hmi-tabs>`,
        );
        const seen = onChange(el);
        key(all(el, 'tab')[0] as Element, 'a');
        key(all(el, 'tab')[0] as Element, 'ArrowDown');
        expect(seen).toEqual([]);
    });
});

describe('hmi-tabs indicator', () => {
    const marker = (el: HmiTabs) => all(el, 'indicator')[0] as HTMLElement;
    const x = (el: HmiTabs) =>
        Number.parseFloat(
            /translateX\((.*)px\)/.exec(marker(el).style.transform)?.[1] ??
                'NaN',
        );
    const offset = (el: HmiTabs, index: number) =>
        (all(el, 'tab')[index] as HTMLElement).getBoundingClientRect().left -
        (all(el, 'base')[0] as HTMLElement).getBoundingClientRect().left;
    /** The badges render a frame after the tabs, and the resize observer then re-measures. */
    const frames = () =>
        new Promise((r) =>
            requestAnimationFrame(() => requestAnimationFrame(r)),
        );

    it('sits under the active tab', async () => {
        const el = await fixture(
            html`<hmi-tabs value="sent" .options=${OPTIONS}></hmi-tabs>`,
        );
        await frames();
        expect(marker(el).style.opacity).toBe('1');
        expect(x(el)).toBeCloseTo(offset(el, 1), 1);
        expect(Number.parseFloat(marker(el).style.width)).toBeCloseTo(
            (all(el, 'tab')[1] as HTMLElement).getBoundingClientRect().width,
            1,
        );
    });

    it('follows the active tab when value changes', async () => {
        const el = await fixture(
            html`<hmi-tabs value="inbox" .options=${OPTIONS}></hmi-tabs>`,
        );
        el.value = 'archive';
        await el.updateComplete;
        await frames();
        expect(x(el)).toBeCloseTo(offset(el, 2), 1);
    });

    it('is hidden when no tab is active', async () => {
        const el = await fixture(
            html`<hmi-tabs .options=${OPTIONS}></hmi-tabs>`,
        );
        expect(getComputedStyle(marker(el)).opacity).toBe('0');
    });

    it('moves again when the strip is resized', async () => {
        const el = await fixture(
            html`<hmi-tabs value="sent" .options=${OPTIONS}>
                <span slot="label-inbox" style="display:inline-block;width:40px"></span>
            </hmi-tabs>`,
        );
        await frames();
        const before = x(el);
        (el.querySelector('span') as HTMLElement).style.width = '200px';
        await frames();
        expect(x(el)).toBeGreaterThan(before + 100);
        expect(x(el)).toBeCloseTo(offset(el, 1), 1);
    });
});

describe('Tabs (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: string[] = [];
        await act(async () => {
            root.render(
                createElement(Tabs, {
                    options: OPTIONS,
                    value: 'sent',
                    variant: 'underline',
                    onChange: (e) => seen.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector('hmi-tabs') as HmiTabs;
        await el.updateComplete;
        expect(el.value).toBe('sent');
        expect(el.getAttribute('variant')).toBe('underline');
        expect(all(el, 'tab')).toHaveLength(3);
        all(el, 'tab')[0]?.click();
        expect(seen).toEqual(['inbox']);
        await act(async () => root.unmount());
    });
});
