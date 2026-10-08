import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import './navbar.js';
import type { HmiNavbar, NavbarLink, NavbarNavDetail } from './navbar.js';
import { Navbar } from './navbar.react.js';

const LINKS: NavbarLink[] = [
    { value: 'overview', label: 'Overview', href: '#overview' },
    { value: 'reports', label: 'Reports', badge: '3', badgeVariant: 'primary' },
    { value: 'people', label: 'People' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-navbar') as HmiNavbar;
    await el.updateComplete;
    return el;
}

/** Wait for slotchange handlers, then for the render they trigger. */
async function settle(el: HmiNavbar) {
    await new Promise((r) => setTimeout(r));
    await el.updateComplete;
}

const all = (el: HmiNavbar, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

const slotOf = (el: HmiNavbar, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(
        `slot[name="${name}"]`,
    ) as HTMLSlotElement;

function onNav(el: HmiNavbar, cancel = false) {
    const seen: NavbarNavDetail[] = [];
    el.addEventListener('hmi-nav', (e) => {
        seen.push((e as CustomEvent<NavbarNavDetail>).detail);
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

describe('hmi-navbar', () => {
    beforeAll(async () => {
        await page.viewport(1000, 800);
    });

    afterAll(async () => {
        await page.viewport(414, 896);
    });

    it('registers', () => {
        expect(customElements.get('hmi-navbar')).toBeDefined();
    });

    it('renders a named nav, panel-like, with a link per entry', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        const nav = el.shadowRoot?.querySelector('nav');
        expect(nav?.getAttribute('aria-label')).toBe('Main');
        expect(nav?.getAttribute('part')).toBe('base panel');
        expect(el.shadowRoot?.querySelector('#liquid-glass')).not.toBeNull();
        expect(
            all(el, 'link').map((l) =>
                l.textContent?.replace(/\s+/g, ' ').trim(),
            ),
        ).toEqual(['Overview', 'Reports 3', 'People']);
    });

    it('names the landmark from label', async () => {
        const el = await fixture(
            html`<hmi-navbar label="Principal" .links=${LINKS}></hmi-navbar>`,
        );
        expect(
            el.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'),
        ).toBe('Principal');
    });

    it('takes links as a property only: a links attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-navbar links='[{"value":"a","label":"A"}]'></hmi-navbar>`,
        );
        expect(all(el, 'link')).toHaveLength(0);
    });

    it('marks the current link', async () => {
        const el = await fixture(
            html`<hmi-navbar current="reports" .links=${LINKS}></hmi-navbar>`,
        );
        const links = all(el, 'link');
        expect(links[1]?.getAttribute('aria-current')).toBe('page');
        expect(links[1]?.dataset.active).toBe('true');
        expect(links[0]?.hasAttribute('aria-current')).toBe(false);
        expect(links[0]?.dataset.active).toBe('false');
    });

    it('uses # for a link without an href', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        const links = all(el, 'link');
        expect(links[0]?.getAttribute('href')).toBe('#overview');
        expect(links[1]?.getAttribute('href')).toBe('#');
    });

    it('draws a monogram and the text for a text brand', async () => {
        const el = await fixture(
            html`<hmi-navbar brand="Ninoverse"></hmi-navbar>`,
        );
        expect(all(el, 'brand-mark')[0]?.textContent?.trim()).toBe('n');
        expect(all(el, 'brand')[0]?.textContent).toContain('Ninoverse');
        expect(all(el, 'brand')[0]?.hidden).toBe(false);
    });

    it('lets a brand slot replace the monogram and the text', async () => {
        const el = await fixture(
            html`<hmi-navbar brand="Ninoverse"
                ><b slot="brand">Custom</b></hmi-navbar
            >`,
        );
        await settle(el);
        expect(slotOf(el, 'brand').assignedElements()[0]?.textContent).toBe(
            'Custom',
        );
    });

    it('shows a brand slot even without brand text, and hides an empty brand', async () => {
        const slotted = await fixture(
            html`<hmi-navbar><b slot="brand">Logo</b></hmi-navbar>`,
        );
        await settle(slotted);
        expect(all(slotted, 'brand')[0]?.hidden).toBe(false);
        const empty = await fixture(html`<hmi-navbar></hmi-navbar>`);
        await settle(empty);
        expect(all(empty, 'brand')[0]?.hidden).toBe(true);
    });

    it('slots a rich label by value, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}
                ><i slot="label-people">Folks</i></hmi-navbar
            >`,
        );
        expect(
            slotOf(el, 'label-people').assignedElements()[0]?.textContent,
        ).toBe('Folks');
        expect(slotOf(el, 'label-overview').assignedElements()).toHaveLength(0);
        expect(slotOf(el, 'label-overview').textContent?.trim()).toBe(
            'Overview',
        );
    });

    it('lets an item slot replace a whole link', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}
                ><button slot="item-people">Menu</button></hmi-navbar
            >`,
        );
        expect(slotOf(el, 'item-people').assignedElements()[0]?.tagName).toBe(
            'BUTTON',
        );
        expect(
            all(el, 'link')
                .filter((l) => l.checkVisibility())
                .map((l) => l.textContent?.replace(/\s+/g, ' ').trim()),
        ).toEqual(['Overview', 'Reports 3']);
    });

    it('styles a slotted anchor like a link, current by aria-current', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}
                ><a slot="item-people" href="#p" aria-current="page"
                    >People</a
                ></hmi-navbar
            >`,
        );
        const a = el.querySelector('a') as HTMLElement;
        const style = getComputedStyle(a);
        expect(style.textDecorationLine).toBe('none');
        expect(style.fontWeight).toBe('600');
    });

    it('draws a badge with its variant, and hides it without text', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        const badges = all(el, 'badge');
        expect(badges[1]?.getAttribute('variant')).toBe('primary');
        expect(badges[1]?.textContent?.trim()).toBe('3');
        expect(badges[0]?.hidden).toBe(true);
        expect(badges[2]?.getAttribute('variant')).toBe('default');
    });

    it('shows a badge for slotted content, inside the pill', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}
                ><b slot="badge-people">new</b></hmi-navbar
            >`,
        );
        await settle(el);
        const pill = all(el, 'badge')[2] as HTMLElement;
        expect(pill.hidden).toBe(false);
        expect(
            slotOf(el, 'badge-people').assignedElements()[0]?.textContent,
        ).toBe('new');
        expect(pill.contains(slotOf(el, 'badge-people'))).toBe(true);
    });

    it('lets an end slot replace the pill', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}
                ><i slot="end-reports">dot</i></hmi-navbar
            >`,
        );
        expect(
            slotOf(el, 'end-reports').assignedElements()[0]?.textContent,
        ).toBe('dot');
    });

    it('puts a right slot in the trailing area and hides it when empty', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}
                ><button slot="right">Go</button></hmi-navbar
            >`,
        );
        await settle(el);
        expect(all(el, 'cta')[0]?.hidden).toBe(false);
        const bare = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        await settle(bare);
        expect(all(bare, 'cta')[0]?.hidden).toBe(true);
    });
});

describe('hmi-navbar navigation', () => {
    it('fires hmi-nav with the value and href and lets the browser follow', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        const seen = onNav(el);
        const [overview, reports] = all(el, 'link') as HTMLElement[];
        expect(click(overview as HTMLElement)).toBe(true);
        expect(click(reports as HTMLElement)).toBe(false);
        expect(seen).toEqual([
            { value: 'overview', href: '#overview' },
            { value: 'reports', href: undefined },
        ]);
    });

    it('does not navigate when hmi-nav is cancelled', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        onNav(el, true);
        expect(click(all(el, 'link')[0] as HTMLElement)).toBe(false);
    });

    it('leaves a modified click to the browser', async () => {
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        const seen = onNav(el, true);
        expect(
            click(all(el, 'link')[0] as HTMLElement, { metaKey: true }),
        ).toBe(true);
        expect(seen).toHaveLength(0);
    });

    it('is controlled: it keeps current until the consumer sets it', async () => {
        const el = await fixture(
            html`<hmi-navbar current="overview" .links=${LINKS}></hmi-navbar>`,
        );
        click(all(el, 'link')[2] as HTMLElement);
        await el.updateComplete;
        expect(el.current).toBe('overview');
        el.current = 'people';
        await el.updateComplete;
        expect(all(el, 'link')[2]?.getAttribute('aria-current')).toBe('page');
    });
});

describe('hmi-navbar collapse', () => {
    afterAll(async () => {
        await page.viewport(414, 896);
    });

    const toggle = (el: HmiNavbar) => all(el, 'toggle')[0] as HTMLButtonElement;
    const links = (el: HmiNavbar) =>
        el.shadowRoot?.querySelector('.links') as HTMLElement;

    it('shows the links and no toggle on a wide screen', async () => {
        await page.viewport(1000, 800);
        const el = await fixture(
            html`<hmi-navbar brand="N" .links=${LINKS}></hmi-navbar>`,
        );
        expect(getComputedStyle(toggle(el)).display).toBe('none');
        expect(links(el).checkVisibility()).toBe(true);
    });

    it('collapses the links behind the toggle on a narrow screen, and opens them', async () => {
        await page.viewport(400, 800);
        const el = await fixture(
            html`<hmi-navbar brand="N" .links=${LINKS}></hmi-navbar>`,
        );
        expect(getComputedStyle(toggle(el)).display).not.toBe('none');
        expect(links(el).checkVisibility()).toBe(false);
        expect(toggle(el).getAttribute('aria-expanded')).toBe('false');
        expect(toggle(el).getAttribute('aria-label')).toBe(
            'Toggle navigation menu',
        );
        toggle(el).click();
        await el.updateComplete;
        expect(toggle(el).getAttribute('aria-expanded')).toBe('true');
        expect(links(el).checkVisibility()).toBe(true);
        expect(
            el.shadowRoot?.getElementById(
                toggle(el).getAttribute('aria-controls') as string,
            ),
        ).not.toBeNull();
    });

    it('closes the menu when a link is chosen', async () => {
        await page.viewport(400, 800);
        const el = await fixture(
            html`<hmi-navbar .links=${LINKS}></hmi-navbar>`,
        );
        toggle(el).click();
        await el.updateComplete;
        click(all(el, 'link')[0] as HTMLElement);
        await el.updateComplete;
        expect(toggle(el).getAttribute('aria-expanded')).toBe('false');
    });

    it('has no toggle without links or trailing content', async () => {
        await page.viewport(400, 800);
        const el = await fixture(html`<hmi-navbar brand="N"></hmi-navbar>`);
        await settle(el);
        expect(all(el, 'toggle')).toHaveLength(0);
    });

    it('has a toggle for trailing content alone', async () => {
        await page.viewport(400, 800);
        const el = await fixture(
            html`<hmi-navbar><button slot="right">Go</button></hmi-navbar>`,
        );
        await settle(el);
        expect(all(el, 'toggle')).toHaveLength(1);
    });

    it('names the toggle from toggle-label', async () => {
        const el = await fixture(
            html`<hmi-navbar toggle-label="Menu" .links=${LINKS}></hmi-navbar>`,
        );
        expect(toggle(el).getAttribute('aria-label')).toBe('Menu');
    });
});

describe('Navbar (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: NavbarNavDetail[] = [];
        await act(async () => {
            root.render(
                createElement(Navbar, {
                    brand: 'Ninoverse',
                    links: LINKS,
                    current: 'reports',
                    onNav: (e) => seen.push(e.detail),
                }),
            );
        });
        const el = host.querySelector('hmi-navbar') as HmiNavbar;
        await el.updateComplete;
        expect(el.brand).toBe('Ninoverse');
        expect(all(el, 'link')).toHaveLength(3);
        expect(all(el, 'link')[1]?.getAttribute('aria-current')).toBe('page');
        click(all(el, 'link')[0] as HTMLElement);
        expect(seen).toEqual([{ value: 'overview', href: '#overview' }]);
        await act(async () => root.unmount());
    });
});
