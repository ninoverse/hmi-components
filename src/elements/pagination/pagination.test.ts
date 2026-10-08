import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './pagination.js';
import type { HmiPagination, PaginationChangeDetail } from './pagination.js';
import { Pagination } from './pagination.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-pagination') as HmiPagination;
    await el.updateComplete;
    return el;
}

const all = (el: HmiPagination, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

/** The window as text: page numbers, with … for a gap. */
const window_ = (el: HmiPagination) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(
            '[part~="button"], [part~="ellipsis"]',
        ) ?? [],
    ).map((n) => n.textContent?.trim());

function onChange(el: HmiPagination) {
    const seen: number[] = [];
    el.addEventListener('hmi-change', (e) =>
        seen.push((e as CustomEvent<PaginationChangeDetail>).detail.value),
    );
    return seen;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-pagination', () => {
    it('registers', () => {
        expect(customElements.get('hmi-pagination')).toBeDefined();
    });

    it('renders a named nav', async () => {
        const el = await fixture(
            html`<hmi-pagination total="5"></hmi-pagination>`,
        );
        expect(
            el.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'),
        ).toBe('Pagination');
    });

    it('shows every page up to seven', async () => {
        const el = await fixture(
            html`<hmi-pagination page="3" total="7"></hmi-pagination>`,
        );
        expect(window_(el)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });

    it('windows long ranges around the current page', async () => {
        const at = async (page: number) =>
            window_(
                await fixture(
                    html`<hmi-pagination .page=${page} total="20"></hmi-pagination>`,
                ),
            );
        expect(await at(1)).toEqual(['1', '2', '…', '20']);
        expect(await at(3)).toEqual(['1', '2', '3', '4', '…', '20']);
        expect(await at(8)).toEqual(['1', '…', '7', '8', '9', '…', '20']);
        expect(await at(18)).toEqual(['1', '…', '17', '18', '19', '20']);
        expect(await at(20)).toEqual(['1', '…', '19', '20']);
    });

    it('draws nothing between the arrows for no pages', async () => {
        const el = await fixture(html`<hmi-pagination></hmi-pagination>`);
        expect(window_(el)).toEqual([]);
        expect(
            (all(el, 'prev')[0] as HTMLButtonElement).disabled &&
                (all(el, 'next')[0] as HTMLButtonElement).disabled,
        ).toBe(true);
    });

    it('marks the current page', async () => {
        const el = await fixture(
            html`<hmi-pagination page="2" total="5"></hmi-pagination>`,
        );
        const buttons = all(el, 'button');
        expect(buttons[1]?.getAttribute('aria-current')).toBe('page');
        expect(buttons[1]?.dataset.active).toBe('true');
        expect(buttons[0]?.hasAttribute('aria-current')).toBe(false);
        expect(buttons[0]?.dataset.active).toBe('false');
    });

    it('names the page buttons and the arrows', async () => {
        const el = await fixture(
            html`<hmi-pagination total="3"></hmi-pagination>`,
        );
        expect(
            all(el, 'button').map((b) => b.getAttribute('aria-label')),
        ).toEqual(['Page 1', 'Page 2', 'Page 3']);
        expect(all(el, 'prev')[0]?.getAttribute('aria-label')).toBe(
            'Previous page',
        );
        expect(all(el, 'next')[0]?.getAttribute('aria-label')).toBe(
            'Next page',
        );
    });

    it('takes its names from the label properties', async () => {
        const el = await fixture(
            html`<hmi-pagination
                total="2"
                label="Pages"
                prev-label="Précédent"
                next-label="Suivant"
                page-label="Page n° {page}"
            ></hmi-pagination>`,
        );
        expect(
            el.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'),
        ).toBe('Pages');
        expect(all(el, 'prev')[0]?.getAttribute('aria-label')).toBe(
            'Précédent',
        );
        expect(all(el, 'next')[0]?.getAttribute('aria-label')).toBe('Suivant');
        expect(all(el, 'button')[1]?.getAttribute('aria-label')).toBe(
            'Page n° 2',
        );
    });

    it('disables previous on the first page and next on the last', async () => {
        const first = await fixture(
            html`<hmi-pagination page="1" total="5"></hmi-pagination>`,
        );
        expect((all(first, 'prev')[0] as HTMLButtonElement).disabled).toBe(
            true,
        );
        expect((all(first, 'next')[0] as HTMLButtonElement).disabled).toBe(
            false,
        );
        const last = await fixture(
            html`<hmi-pagination page="5" total="5"></hmi-pagination>`,
        );
        expect((all(last, 'prev')[0] as HTMLButtonElement).disabled).toBe(
            false,
        );
        expect((all(last, 'next')[0] as HTMLButtonElement).disabled).toBe(true);
    });
});

describe('hmi-pagination changes', () => {
    it('fires hmi-change for a page, previous and next', async () => {
        const el = await fixture(
            html`<hmi-pagination page="3" total="5"></hmi-pagination>`,
        );
        const seen = onChange(el);
        (all(el, 'button')[4] as HTMLElement).click();
        (all(el, 'prev')[0] as HTMLElement).click();
        (all(el, 'next')[0] as HTMLElement).click();
        expect(seen).toEqual([5, 2, 4]);
    });

    it('is controlled: it keeps the page until the consumer sets it', async () => {
        const el = await fixture(
            html`<hmi-pagination page="1" total="5"></hmi-pagination>`,
        );
        (all(el, 'button')[2] as HTMLElement).click();
        await el.updateComplete;
        expect(el.page).toBe(1);
        el.page = 3;
        await el.updateComplete;
        expect(all(el, 'button')[2]?.getAttribute('aria-current')).toBe('page');
    });

    it('does not fire from a disabled arrow', async () => {
        const el = await fixture(
            html`<hmi-pagination page="1" total="5"></hmi-pagination>`,
        );
        const seen = onChange(el);
        (all(el, 'prev')[0] as HTMLElement).click();
        expect(seen).toEqual([]);
    });
});

describe('Pagination (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: number[] = [];
        await act(async () => {
            root.render(
                createElement(Pagination, {
                    page: 2,
                    total: 5,
                    onChange: (e) => seen.push(e.detail.value),
                }),
            );
        });
        const el = host.querySelector('hmi-pagination') as HmiPagination;
        await el.updateComplete;
        expect(el.page).toBe(2);
        expect(el.total).toBe(5);
        (all(el, 'next')[0] as HTMLElement).click();
        expect(seen).toEqual([3]);
        await act(async () => root.unmount());
    });
});
