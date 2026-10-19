import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './list.js';
import type { HmiList, ListItem, ListReorderDetail } from './list.js';
import { List } from './list.react.js';

const ITEMS: ListItem[] = [
    { id: 'a', title: 'Inbox', subtitle: '12 unread', right: 'Live' },
    { id: 'b', title: 'Drafts', avatar: 'Ada Lovelace' },
    { id: 'c', title: 'Archive' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-list') as HmiList;
    await el.updateComplete;
    return el;
}

const all = (el: HmiList, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

const ids = (items: ListItem[]) => items.map((i) => i.id);

function onReorder(el: HmiList) {
    const seen: ListReorderDetail[] = [];
    el.addEventListener('hmi-reorder', (e) =>
        seen.push((e as CustomEvent<ListReorderDetail>).detail),
    );
    return seen;
}

function drag(
    target: Element,
    type: string,
    dataTransfer = new DataTransfer(),
) {
    target.dispatchEvent(
        new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer }),
    );
    return dataTransfer;
}

const key = (target: Element, k: string, altKey = true) =>
    target.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: k,
            altKey,
            bubbles: true,
            cancelable: true,
        }),
    );

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-list', () => {
    it('registers', () => {
        expect(customElements.get('hmi-list')).toBeDefined();
    });

    it('renders a list with a row per item', async () => {
        const el = await fixture(html`<hmi-list .items=${ITEMS}></hmi-list>`);
        expect(el.shadowRoot?.querySelector('ul')?.getAttribute('role')).toBe(
            'list',
        );
        expect(all(el, 'item')).toHaveLength(3);
        expect(all(el, 'title').map((t) => t.textContent?.trim())).toEqual([
            'Inbox',
            'Drafts',
            'Archive',
        ]);
    });

    it('shows subtitle and right only for items that have them', async () => {
        const el = await fixture(html`<hmi-list .items=${ITEMS}></hmi-list>`);
        const rows = all(el, 'item');
        const visible = (row: Element, part: string) =>
            row.querySelector<HTMLElement>(`[part~="${part}"]`)?.hidden ===
            false;
        expect(visible(rows[0] as Element, 'subtitle')).toBe(true);
        expect(visible(rows[0] as Element, 'right')).toBe(true);
        expect(visible(rows[1] as Element, 'subtitle')).toBe(false);
        expect(visible(rows[2] as Element, 'right')).toBe(false);
    });

    it('renders an avatar for an item with a name', async () => {
        const el = await fixture(html`<hmi-list .items=${ITEMS}></hmi-list>`);
        const avatars = all(el, 'avatar');
        expect(avatars).toHaveLength(1);
        expect(avatars[0]?.getAttribute('name')).toBe('Ada Lovelace');
    });

    it('takes items as a property only: an items attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-list items='[{"id":1,"title":"A"}]'></hmi-list>`,
        );
        expect(all(el, 'item')).toHaveLength(0);
    });

    it('slots rich content by id, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-list .items=${ITEMS}>
                <b slot="title-a">Rich</b>
                <i slot="subtitle-c">Added</i>
                <u slot="right-c">Tail</u>
            </hmi-list>`,
        );
        const slotOf = (name: string) =>
            el.shadowRoot?.querySelector<HTMLSlotElement>(
                `slot[name="${name}"]`,
            ) as HTMLSlotElement;
        expect(slotOf('title-a').assignedElements()[0]?.textContent).toBe(
            'Rich',
        );
        expect(slotOf('title-b').assignedElements()).toHaveLength(0);
        // Slotted content shows even when the item has no text for the field.
        await new Promise((r) => setTimeout(r));
        expect(slotOf('subtitle-c').parentElement?.hidden).toBe(false);
        expect(slotOf('right-c').parentElement?.hidden).toBe(false);
    });

    it('lets an item-<id> slot replace the whole row', async () => {
        const el = await fixture(
            html`<hmi-list .items=${ITEMS}>
                <div slot="item-b">Custom row</div>
            </hmi-list>`,
        );
        const rows = all(el, 'item');
        const slot = rows[1]?.querySelector<HTMLSlotElement>(
            'slot[name="item-b"]',
        );
        expect(slot?.assignedElements()[0]?.textContent).toBe('Custom row');
    });

    it('draws no handle and no draggable rows unless reorderable', async () => {
        const el = await fixture(html`<hmi-list .items=${ITEMS}></hmi-list>`);
        expect(all(el, 'handle')).toHaveLength(0);
        expect(all(el, 'item')[0]?.getAttribute('draggable')).toBeNull();
    });

    it('uses the divider token between rows', async () => {
        const el = await fixture(
            html`<hmi-list
                style="--list-divider-style: dashed; --outline-variant: gray"
                .items=${ITEMS}
            ></hmi-list>`,
        );
        const [first, , last] = all(el, 'item');
        expect(getComputedStyle(first as Element).borderBottomStyle).toBe(
            'dashed',
        );
        expect(getComputedStyle(last as Element).borderBottomStyle).toBe(
            'none',
        );
    });
});

describe('hmi-list reordering', () => {
    it('shows a handle and draggable rows when reorderable', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        expect(all(el, 'handle')).toHaveLength(3);
        expect(all(el, 'item')[0]?.getAttribute('draggable')).toBe('true');
    });

    it('fires hmi-reorder with the new order when a row is dropped', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        const seen = onReorder(el);
        const rows = all(el, 'item');
        const data = drag(rows[0] as Element, 'dragstart');
        await el.updateComplete;
        expect((rows[0] as HTMLElement).dataset.dragging).toBe('true');
        drag(rows[2] as Element, 'dragover', data);
        await el.updateComplete;
        expect((rows[2] as HTMLElement).dataset.dragOver).toBe('true');
        drag(rows[2] as Element, 'drop', data);
        await el.updateComplete;
        expect(seen).toHaveLength(1);
        expect(ids(seen[0]?.items ?? [])).toEqual(['b', 'c', 'a']);
        expect((rows[0] as HTMLElement).dataset.dragging).toBe('false');
    });

    it('owns the order: a drop sets items to a new array, then fires a cancelable hmi-reorder that leaves the shadow root', async () => {
        const items = [...ITEMS];
        const el = await fixture(
            html`<hmi-list reorderable .items=${items}></hmi-list>`,
        );
        let event: CustomEvent<ListReorderDetail> | undefined;
        let itemsDuring: ListItem[] | undefined;
        document.addEventListener(
            'hmi-reorder',
            (e) => {
                event = e as CustomEvent<ListReorderDetail>;
                itemsDuring = el.items;
            },
            { once: true },
        );
        const rows = all(el, 'item');
        const data = drag(rows[0] as Element, 'dragstart');
        drag(rows[2] as Element, 'drop', data);
        expect(ids(event?.detail.items ?? [])).toEqual(['b', 'c', 'a']);
        expect(event?.bubbles).toBe(true);
        expect(event?.composed).toBe(true);
        expect(event?.cancelable).toBe(true);
        expect(itemsDuring).toBe(event?.detail.items);
        await el.updateComplete;
        expect(ids(el.items)).toEqual(['b', 'c', 'a']);
        expect(ids(items)).toEqual(['a', 'b', 'c']);
    });

    it('keeps the old order when a listener cancels, or the one a listener sets', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        const cancel = (e: Event) => e.preventDefault();
        el.addEventListener('hmi-reorder', cancel);
        let rows = all(el, 'item');
        let data = drag(rows[0] as Element, 'dragstart');
        drag(rows[2] as Element, 'drop', data);
        await el.updateComplete;
        expect(el.items).toBe(ITEMS);
        el.removeEventListener('hmi-reorder', cancel);
        el.addEventListener('hmi-reorder', () => {
            el.items = ITEMS;
        });
        rows = all(el, 'item');
        data = drag(rows[1] as Element, 'dragstart');
        drag(rows[0] as Element, 'drop', data);
        await el.updateComplete;
        expect(el.items).toBe(ITEMS);
    });

    it('ignores a drop on the row it started from', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        const seen = onReorder(el);
        const rows = all(el, 'item');
        const data = drag(rows[1] as Element, 'dragstart');
        drag(rows[1] as Element, 'drop', data);
        expect(seen).toHaveLength(0);
    });

    it('clears the drag state when the drag ends', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        const rows = all(el, 'item');
        drag(rows[0] as Element, 'dragstart');
        await el.updateComplete;
        drag(rows[0] as Element, 'dragend');
        await el.updateComplete;
        expect((rows[0] as HTMLElement).dataset.dragging).toBe('false');
    });

    it('does not fire when it is not reorderable', async () => {
        const el = await fixture(html`<hmi-list .items=${ITEMS}></hmi-list>`);
        const seen = onReorder(el);
        const rows = all(el, 'item');
        const data = drag(rows[0] as Element, 'dragstart');
        drag(rows[2] as Element, 'drop', data);
        expect(seen).toHaveLength(0);
    });

    it('moves a row down with Alt+ArrowDown on its handle', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        const seen = onReorder(el);
        key(all(el, 'handle')[0] as Element, 'ArrowDown');
        expect(ids(seen[0]?.items ?? [])).toEqual(['b', 'a', 'c']);
    });

    it('moves a row up with Alt+ArrowUp on its handle', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        const seen = onReorder(el);
        key(all(el, 'handle')[2] as Element, 'ArrowUp');
        expect(ids(seen[0]?.items ?? [])).toEqual(['a', 'c', 'b']);
    });

    it('ignores arrow keys without Alt and moves past either end', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        const seen = onReorder(el);
        const handles = all(el, 'handle');
        key(handles[0] as Element, 'ArrowDown', false);
        key(handles[0] as Element, 'ArrowUp');
        key(handles[2] as Element, 'ArrowDown');
        expect(seen).toHaveLength(0);
    });

    it('keeps focus on the moved row and announces the move', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        (all(el, 'handle')[0] as HTMLElement).focus();
        key(all(el, 'handle')[0] as Element, 'ArrowDown');
        await el.updateComplete;
        await el.updateComplete;
        expect(ids(el.items)).toEqual(['b', 'a', 'c']);
        expect(el.shadowRoot?.activeElement).toBe(all(el, 'handle')[1]);
        expect(all(el, 'status')[0]?.textContent?.trim()).toBe(
            'Inbox moved to position 2 of 3',
        );
    });

    it('announces nothing and keeps the row when a listener cancels a keyboard move', async () => {
        const el = await fixture(
            html`<hmi-list reorderable .items=${ITEMS}></hmi-list>`,
        );
        el.addEventListener('hmi-reorder', (e) => e.preventDefault());
        (all(el, 'handle')[0] as HTMLElement).focus();
        key(all(el, 'handle')[0] as Element, 'ArrowDown');
        await el.updateComplete;
        expect(ids(el.items)).toEqual(['a', 'b', 'c']);
        expect(el.shadowRoot?.activeElement).toBe(all(el, 'handle')[0]);
        expect(all(el, 'status')[0]?.textContent?.trim()).toBe('');
    });
});

describe('List (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: ListReorderDetail[] = [];
        await act(async () => {
            root.render(
                createElement(List, {
                    items: ITEMS,
                    reorderable: true,
                    onReorder: (e) => seen.push(e.detail),
                }),
            );
        });
        const el = host.querySelector('hmi-list') as HmiList;
        await el.updateComplete;
        expect(all(el, 'item')).toHaveLength(3);
        expect(el.hasAttribute('reorderable')).toBe(true);
        (all(el, 'handle')[0] as Element).dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                altKey: true,
                bubbles: true,
                cancelable: true,
            }),
        );
        expect(ids(seen[0]?.items ?? [])).toEqual(['b', 'a', 'c']);
        await act(async () => root.unmount());
    });
});
