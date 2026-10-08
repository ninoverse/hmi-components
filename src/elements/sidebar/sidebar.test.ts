import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './sidebar.js';
import type { HmiSidebar, SidebarGroup, SidebarNavDetail } from './sidebar.js';
import { Sidebar } from './sidebar.react.js';

const GROUPS: SidebarGroup[] = [
    {
        label: 'Mail',
        items: [
            {
                value: 'inbox',
                label: 'Inbox',
                badge: '12',
                badgeVariant: 'primary',
            },
            { value: 'sent', label: 'Sent', href: '#sent' },
        ],
    },
    { items: [{ value: 'settings', label: 'Settings' }] },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-sidebar') as HmiSidebar;
    await el.updateComplete;
    return el;
}

/** Wait for slotchange handlers. */
const settle = () => new Promise((r) => setTimeout(r));

const all = (el: HmiSidebar, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

const slotOf = (el: HmiSidebar, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(
        `slot[name="${name}"]`,
    ) as HTMLSlotElement;

function onNav(el: HmiSidebar, cancel = false) {
    const seen: SidebarNavDetail[] = [];
    el.addEventListener('hmi-nav', (e) => {
        seen.push((e as CustomEvent<SidebarNavDetail>).detail);
        if (cancel) e.preventDefault();
    });
    return seen;
}

/** Click a link and report whether the browser would have followed it. */
function click(target: HTMLElement, init: MouseEventInit = {}) {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        composed: true,
        ...init,
    });
    target.dispatchEvent(event);
    return !event.defaultPrevented;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-sidebar', () => {
    it('registers', () => {
        expect(customElements.get('hmi-sidebar')).toBeDefined();
    });

    it('renders a named, panel-like aside with its groups and links', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}></hmi-sidebar>`,
        );
        const aside = el.shadowRoot?.querySelector('aside');
        expect(aside?.getAttribute('aria-label')).toBe('Sidebar');
        expect(aside?.getAttribute('part')).toBe('base panel');
        expect(el.shadowRoot?.querySelector('#liquid-glass')).not.toBeNull();
        expect(all(el, 'group')).toHaveLength(2);
        expect(
            all(el, 'link').map((l) =>
                l.textContent?.replace(/\s+/g, ' ').trim(),
            ),
        ).toEqual(['Inbox 12', 'Sent', 'Settings']);
    });

    it('names the landmark from label', async () => {
        const el = await fixture(
            html`<hmi-sidebar label="Menu" .groups=${GROUPS}></hmi-sidebar>`,
        );
        expect(
            el.shadowRoot?.querySelector('aside')?.getAttribute('aria-label'),
        ).toBe('Menu');
    });

    it('takes groups as a property only: a groups attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-sidebar groups='[{"items":[]}]'></hmi-sidebar>`,
        );
        expect(all(el, 'group')).toHaveLength(0);
    });

    it('draws a heading only for a group with a label', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}></hmi-sidebar>`,
        );
        expect(
            all(el, 'group-label').map((l) => l.textContent?.trim()),
        ).toEqual(['Mail']);
    });

    it('slots a rich group heading by position', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><b slot="group-0">Rich mail</b></hmi-sidebar
            >`,
        );
        expect(slotOf(el, 'group-0').assignedElements()[0]?.textContent).toBe(
            'Rich mail',
        );
    });

    it('marks the current link', async () => {
        const el = await fixture(
            html`<hmi-sidebar current="sent" .groups=${GROUPS}></hmi-sidebar>`,
        );
        const links = all(el, 'link');
        expect(links[1]?.getAttribute('aria-current')).toBe('page');
        expect(links[1]?.dataset.active).toBe('true');
        expect(links[0]?.hasAttribute('aria-current')).toBe(false);
    });

    it('uses # for a link without an href', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}></hmi-sidebar>`,
        );
        const links = all(el, 'link');
        expect(links[0]?.getAttribute('href')).toBe('#');
        expect(links[1]?.getAttribute('href')).toBe('#sent');
    });

    it('shows an icon only for a link that has one', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><svg slot="icon-inbox" viewBox="0 0 16 16"></svg
            ></hmi-sidebar>`,
        );
        await settle();
        const icons = all(el, 'icon');
        expect(icons[0]?.hidden).toBe(false);
        expect(icons[1]?.hidden).toBe(true);
        expect(slotOf(el, 'icon-inbox').assignedElements()).toHaveLength(1);
    });

    it('slots a rich label by value, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><i slot="label-sent">Outbox</i></hmi-sidebar
            >`,
        );
        expect(
            slotOf(el, 'label-sent').assignedElements()[0]?.textContent,
        ).toBe('Outbox');
        expect(slotOf(el, 'label-inbox').textContent?.trim()).toBe('Inbox');
    });

    it('lets an item slot replace a whole link', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><button slot="item-settings">Custom</button></hmi-sidebar
            >`,
        );
        expect(slotOf(el, 'item-settings').assignedElements()[0]?.tagName).toBe(
            'BUTTON',
        );
    });

    it('styles a slotted anchor like a link, current by aria-current', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><a slot="item-settings" href="#s" aria-current="page"
                    >Settings</a
                ></hmi-sidebar
            >`,
        );
        const a = el.querySelector('a') as HTMLElement;
        const style = getComputedStyle(a);
        expect(style.textDecorationLine).toBe('none');
        expect(style.fontWeight).toBe('600');
    });

    it('gives a slotted non-anchor the active weight but no link padding', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><span slot="item-settings" aria-current="page">Mine</span></hmi-sidebar
            >`,
        );
        const style = getComputedStyle(el.querySelector('span') as HTMLElement);
        expect(style.fontWeight).toBe('600');
        expect(style.paddingLeft).toBe('0px');
    });

    it('draws a badge with its variant, hiding it without text', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}></hmi-sidebar>`,
        );
        const badges = all(el, 'badge');
        expect(badges[0]?.getAttribute('variant')).toBe('primary');
        expect(badges[0]?.textContent?.trim()).toBe('12');
        expect(badges[1]?.hidden).toBe(true);
    });

    it('shows a badge for slotted content, inside the pill', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><b slot="badge-sent">new</b></hmi-sidebar
            >`,
        );
        await settle();
        const pill = all(el, 'badge')[1] as HTMLElement;
        expect(pill.hidden).toBe(false);
        expect(pill.contains(slotOf(el, 'badge-sent'))).toBe(true);
    });

    it('lets an end slot replace the pill', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}
                ><i slot="end-inbox">dot</i></hmi-sidebar
            >`,
        );
        expect(slotOf(el, 'end-inbox').assignedElements()[0]?.textContent).toBe(
            'dot',
        );
    });
});

describe('hmi-sidebar navigation', () => {
    it('fires hmi-nav with the value and href and lets the browser follow', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}></hmi-sidebar>`,
        );
        const seen = onNav(el);
        const [inbox, sent] = all(el, 'link') as HTMLElement[];
        expect(click(inbox as HTMLElement)).toBe(false);
        expect(click(sent as HTMLElement)).toBe(true);
        expect(seen).toEqual([
            { value: 'inbox', href: undefined },
            { value: 'sent', href: '#sent' },
        ]);
    });

    it('does not navigate when hmi-nav is cancelled', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}></hmi-sidebar>`,
        );
        onNav(el, true);
        expect(click(all(el, 'link')[1] as HTMLElement)).toBe(false);
    });

    it('leaves a modified click to the browser', async () => {
        const el = await fixture(
            html`<hmi-sidebar .groups=${GROUPS}></hmi-sidebar>`,
        );
        const seen = onNav(el, true);
        expect(
            click(all(el, 'link')[1] as HTMLElement, { ctrlKey: true }),
        ).toBe(true);
        expect(seen).toHaveLength(0);
    });

    it('is controlled: it keeps current until the consumer sets it', async () => {
        const el = await fixture(
            html`<hmi-sidebar current="inbox" .groups=${GROUPS}></hmi-sidebar>`,
        );
        click(all(el, 'link')[2] as HTMLElement);
        await el.updateComplete;
        expect(el.current).toBe('inbox');
        el.current = 'settings';
        await el.updateComplete;
        expect(all(el, 'link')[2]?.getAttribute('aria-current')).toBe('page');
    });
});

describe('Sidebar (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: SidebarNavDetail[] = [];
        await act(async () => {
            root.render(
                createElement(Sidebar, {
                    groups: GROUPS,
                    current: 'sent',
                    onNav: (e) => seen.push(e.detail),
                }),
            );
        });
        const el = host.querySelector('hmi-sidebar') as HmiSidebar;
        await el.updateComplete;
        expect(all(el, 'link')).toHaveLength(3);
        expect(all(el, 'link')[1]?.getAttribute('aria-current')).toBe('page');
        click(all(el, 'link')[0] as HTMLElement);
        expect(seen).toEqual([{ value: 'inbox', href: undefined }]);
        await act(async () => root.unmount());
    });
});
