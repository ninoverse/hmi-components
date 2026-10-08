import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './breadcrumbs.js';
import type {
    BreadcrumbItem,
    BreadcrumbsNavDetail,
    HmiBreadcrumbs,
} from './breadcrumbs.js';
import { Breadcrumbs } from './breadcrumbs.react.js';

const ITEMS: BreadcrumbItem[] = [
    { label: 'Home', href: '#home' },
    { label: 'Library', value: 'lib' },
    { label: 'Settings' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-breadcrumbs') as HmiBreadcrumbs;
    await el.updateComplete;
    return el;
}

const all = (el: HmiBreadcrumbs, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

function onNav(el: HmiBreadcrumbs, cancel = false) {
    const seen: BreadcrumbsNavDetail[] = [];
    el.addEventListener('hmi-nav', (e) => {
        seen.push((e as CustomEvent<BreadcrumbsNavDetail>).detail);
        if (cancel) e.preventDefault();
    });
    return seen;
}

/** Click a link and report whether the browser would have followed it. */
function click(link: HTMLElement) {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        composed: true,
    });
    link.dispatchEvent(event);
    return !event.defaultPrevented;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-breadcrumbs', () => {
    it('registers', () => {
        expect(customElements.get('hmi-breadcrumbs')).toBeDefined();
    });

    it('renders a named nav with an ordered list of crumbs', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        const nav = el.shadowRoot?.querySelector('nav');
        expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
        expect(el.shadowRoot?.querySelector('ol')).not.toBeNull();
        expect(all(el, 'item')).toHaveLength(3);
    });

    it('names the landmark from label', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs
                label="Chemin"
                .items=${ITEMS}
            ></hmi-breadcrumbs>`,
        );
        expect(
            el.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'),
        ).toBe('Chemin');
    });

    it('links every crumb but the last, which is the current page', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        const links = all(el, 'link');
        expect(links.map((l) => l.textContent?.trim())).toEqual([
            'Home',
            'Library',
        ]);
        expect(links[0]?.getAttribute('href')).toBe('#home');
        expect(links[1]?.getAttribute('href')).toBe('#');
        const current = all(el, 'current');
        expect(current).toHaveLength(1);
        expect(current[0]?.getAttribute('aria-current')).toBe('page');
        expect(current[0]?.textContent?.trim()).toBe('Settings');
    });

    it('ignores the href of the last item', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs
                .items=${[{ label: 'A', href: '#a' }, { label: 'B', href: '#b' }]}
            ></hmi-breadcrumbs>`,
        );
        expect(all(el, 'link')).toHaveLength(1);
        expect(all(el, 'current')[0]?.hasAttribute('href')).toBe(false);
    });

    it('draws a separator between crumbs only, hidden from assistive tech', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs separator="›" .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        const seps = all(el, 'separator');
        expect(seps).toHaveLength(2);
        expect(seps[0]?.textContent?.trim()).toBe('›');
        expect(seps[0]?.getAttribute('aria-hidden')).toBe('true');
    });

    it('defaults the separator to a slash', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        expect(all(el, 'separator')[0]?.textContent?.trim()).toBe('/');
    });

    it('takes items as a property only: an items attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs items='[{"label":"A"}]'></hmi-breadcrumbs>`,
        );
        expect(all(el, 'item')).toHaveLength(0);
    });

    it('copies a slotted separator into every gap', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}>
                <b slot="separator" id="mine">&gt;</b>
            </hmi-breadcrumbs>`,
        );
        await new Promise((r) => setTimeout(r));
        await el.updateComplete;
        const seps = all(el, 'separator');
        expect(seps).toHaveLength(2);
        for (const sep of seps) {
            const copy = sep.querySelector('b');
            expect(copy?.textContent).toBe('>');
            expect(copy?.hasAttribute('slot')).toBe(false);
        }
        expect(seps[0]?.querySelector('b')).not.toBe(
            seps[1]?.querySelector('b'),
        );
        // The consumer's own element is left untouched.
        expect(el.querySelector('#mine')?.getAttribute('slot')).toBe(
            'separator',
        );
    });

    it('slots rich labels by position, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}>
                <span slot="label-0">🏠 Start</span>
            </hmi-breadcrumbs>`,
        );
        const slot = (n: number) =>
            el.shadowRoot?.querySelector<HTMLSlotElement>(
                `slot[name="label-${n}"]`,
            ) as HTMLSlotElement;
        expect(slot(0).assignedElements()[0]?.textContent).toBe('🏠 Start');
        expect(slot(1).assignedElements()).toHaveLength(0);
        expect(slot(1).textContent?.trim()).toBe('Library');
    });
});

describe('hmi-breadcrumbs navigation', () => {
    it('fires hmi-nav with the value and the position', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        const seen = onNav(el);
        const [home, library] = all(el, 'link') as HTMLElement[];
        click(home as HTMLElement);
        click(library as HTMLElement);
        expect(seen).toEqual([
            { value: 'Home', index: 0 },
            { value: 'lib', index: 1 },
        ]);
    });

    it('lets the browser follow an href', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        expect(click(all(el, 'link')[0] as HTMLElement)).toBe(true);
    });

    it('does not navigate when hmi-nav is cancelled', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        onNav(el, true);
        expect(click(all(el, 'link')[0] as HTMLElement)).toBe(false);
    });

    it('never navigates a crumb without an href', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        const seen = onNav(el);
        expect(click(all(el, 'link')[1] as HTMLElement)).toBe(false);
        expect(seen).toHaveLength(1);
    });

    it('does not fire for the current page', async () => {
        const el = await fixture(
            html`<hmi-breadcrumbs .items=${ITEMS}></hmi-breadcrumbs>`,
        );
        const seen = onNav(el);
        click(all(el, 'current')[0] as HTMLElement);
        expect(seen).toHaveLength(0);
    });
});

describe('Breadcrumbs (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: BreadcrumbsNavDetail[] = [];
        await act(async () => {
            root.render(
                createElement(Breadcrumbs, {
                    items: ITEMS,
                    separator: '›',
                    onNav: (e) => seen.push(e.detail),
                }),
            );
        });
        const el = host.querySelector('hmi-breadcrumbs') as HmiBreadcrumbs;
        await el.updateComplete;
        expect(all(el, 'item')).toHaveLength(3);
        expect(all(el, 'separator')[0]?.textContent?.trim()).toBe('›');
        click(all(el, 'link')[1] as HTMLElement);
        expect(seen).toEqual([{ value: 'lib', index: 1 }]);
        await act(async () => root.unmount());
    });
});
