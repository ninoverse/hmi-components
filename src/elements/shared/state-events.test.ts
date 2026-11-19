import { html, render, type TemplateResult } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import '../index.js';

/* Every element whose own interaction changes its state follows one rule
   (R2 in .claude/lit-migration.md): the user's action changes the property,
   then fires a cancelable event that bubbles out of the shadow root.
   `preventDefault()` puts the old state back, unless the listener set the
   property itself, and a change made from code fires nothing. Each row is
   one such event, so a new element, or a change to one of these, that breaks
   the rule fails here. */

type Host = HTMLElement & { updateComplete: Promise<boolean> };

const part = (el: Element, name: string, index = 0) =>
    el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`)[
        index
    ] as HTMLElement;

const key = (target: Element, k: string, init: KeyboardEventInit = {}) =>
    target.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: k,
            bubbles: true,
            cancelable: true,
            composed: true,
            ...init,
        }),
    );

interface Row {
    name: string;
    event: string;
    template: TemplateResult;
    /** The user's action. */
    act: (el: Host) => void;
    /** The state the event is about, as a comparable value. */
    read: (el: Host) => unknown;
    detail: object;
    /** A third state a listener sets while it cancels, which then stays. */
    other?: { set: (el: Host) => void; state: unknown };
    /** The same change, made from code. */
    program: (el: Host) => void;
}

const tabs = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
];
const steps = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
];
const sections = [
    { title: 'A', body: 'a' },
    { title: 'B', body: 'b' },
    { title: 'C', body: 'c' },
];
const rows = [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c' }];
const nodes = [
    { value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
];
const ids = (items: { id: string }[]) => items.map((i) => i.id).join('');

const cases: readonly Row[] = [
    {
        name: 'hmi-chip',
        event: 'hmi-select',
        template: html`<hmi-chip selectable>Filter</hmi-chip>`,
        act: (el) => part(el, 'control').click(),
        read: (el) => (el as Host & { selected: boolean }).selected,
        detail: { selected: true },
        program: (el) => {
            (el as Host & { selected: boolean }).selected = true;
        },
    },
    {
        name: 'hmi-tabs',
        event: 'hmi-change',
        template: html`<hmi-tabs value="a" .options=${tabs}></hmi-tabs>`,
        act: (el) => part(el, 'tab', 1).click(),
        read: (el) => (el as Host & { value: string }).value,
        detail: { value: 'b' },
        other: {
            set: (el) => {
                (el as Host & { value: string }).value = 'c';
            },
            state: 'c',
        },
        program: (el) => {
            (el as Host & { value: string }).value = 'b';
        },
    },
    {
        name: 'hmi-pagination',
        event: 'hmi-change',
        template: html`<hmi-pagination page="1" total="5"></hmi-pagination>`,
        act: (el) => part(el, 'next').click(),
        read: (el) => (el as Host & { page: number }).page,
        detail: { value: 2 },
        other: {
            set: (el) => {
                (el as Host & { page: number }).page = 4;
            },
            state: 4,
        },
        program: (el) => {
            (el as Host & { page: number }).page = 2;
        },
    },
    {
        name: 'hmi-stepper',
        event: 'hmi-change',
        template: html`<hmi-stepper current="c" .steps=${steps}></hmi-stepper>`,
        act: (el) => part(el, 'button', 1).click(),
        read: (el) => (el as Host & { current: string }).current,
        detail: { value: 'b' },
        other: {
            set: (el) => {
                (el as Host & { current: string }).current = 'a';
            },
            state: 'a',
        },
        program: (el) => {
            (el as Host & { current: string }).current = 'b';
        },
    },
    {
        name: 'hmi-accordion',
        event: 'hmi-open-change',
        template: html`<hmi-accordion .items=${sections}></hmi-accordion>`,
        act: (el) => part(el, 'trigger', 1).click(),
        read: (el) => (el as Host & { open: number[] }).open.join(),
        detail: { open: [1] },
        other: {
            set: (el) => {
                (el as Host & { open: number[] }).open = [2];
            },
            state: '2',
        },
        program: (el) => {
            (el as Host & { open: number[] }).open = [1];
        },
    },
    {
        name: 'hmi-carousel',
        event: 'hmi-index-change',
        template: html`<hmi-carousel
            ><div>One</div><div>Two</div><div>Three</div></hmi-carousel
        >`,
        act: (el) => part(el, 'next').click(),
        read: (el) => (el as Host & { index: number }).index,
        detail: { index: 1 },
        other: {
            set: (el) => {
                (el as Host & { index: number }).index = 2;
            },
            state: 2,
        },
        program: (el) => {
            (el as Host & { index: number }).index = 1;
        },
    },
    {
        name: 'hmi-list',
        event: 'hmi-reorder',
        template: html`<hmi-list reorderable .items=${rows}></hmi-list>`,
        act: (el) => key(part(el, 'handle'), 'ArrowDown', { altKey: true }),
        read: (el) => ids((el as Host & { items: { id: string }[] }).items),
        detail: { items: [rows[1], rows[0], rows[2]] },
        other: {
            set: (el) => {
                (el as Host & { items: unknown[] }).items = [
                    rows[2],
                    rows[1],
                    rows[0],
                ];
            },
            state: 'cba',
        },
        program: (el) => {
            (el as Host & { items: unknown[] }).items = [
                rows[1],
                rows[0],
                rows[2],
            ];
        },
    },
    {
        name: 'hmi-table',
        event: 'hmi-sort',
        template: html`<hmi-table
            .columns=${[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'n', label: 'N', sortable: true },
            ]}
            .rows=${[{ name: 'b', n: 1 }, { name: 'a', n: 2 }]}
        ></hmi-table>`,
        act: (el) => part(el, 'sort').click(),
        read: (el) => {
            const t = el as Host & { sortKey: string | null; sortDir: string };
            return `${t.sortKey} ${t.sortDir}`;
        },
        detail: { key: 'name', dir: 'asc' },
        other: {
            set: (el) => {
                const t = el as Host & { sortKey: string; sortDir: string };
                t.sortKey = 'n';
                t.sortDir = 'desc';
            },
            state: 'n desc',
        },
        program: (el) => {
            (el as Host & { sortKey: string }).sortKey = 'name';
        },
    },
    {
        name: 'hmi-tree',
        event: 'hmi-select',
        template: html`<hmi-tree .nodes=${nodes}></hmi-tree>`,
        act: (el) =>
            (
                el.shadowRoot?.querySelector(
                    '[part~="item"][data-value="b"] [part~="row"]',
                ) as HTMLElement
            ).click(),
        read: (el) => (el as Host & { selected?: string }).selected,
        detail: { value: 'b' },
        other: {
            set: (el) => {
                (el as Host & { selected?: string }).selected = 'c';
            },
            state: 'c',
        },
        program: (el) => {
            (el as Host & { selected?: string }).selected = 'b';
        },
    },
    {
        name: 'hmi-tree',
        event: 'hmi-expanded-change',
        template: html`<hmi-tree .nodes=${nodes}></hmi-tree>`,
        act: (el) =>
            (
                el.shadowRoot?.querySelector(
                    '[part~="item"][data-value="a"] [part~="row"]',
                ) as HTMLElement
            ).click(),
        read: (el) =>
            (el as Host & { expanded?: string[] }).expanded?.join() ?? '',
        detail: { expanded: ['a'] },
        other: {
            set: (el) => {
                (el as Host & { expanded?: string[] }).expanded = ['c'];
            },
            state: 'c',
        },
        program: (el) => {
            (el as Host & { expanded?: string[] }).expanded = ['a'];
        },
    },
];

async function fixture(template: TemplateResult): Promise<Host> {
    const host = document.createElement('div');
    host.style.width = '400px';
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as Host;
    await el.updateComplete;
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('state events', () => {
    for (const row of cases) {
        describe(`${row.name} ${row.event}`, () => {
            it('changes first, then fires a cancelable, composed event', async () => {
                const el = await fixture(row.template);
                let event: CustomEvent | undefined;
                let during: unknown;
                const listen = (e: Event) => {
                    event = e as CustomEvent;
                    during = row.read(el);
                };
                document.addEventListener(row.event, listen);
                const before = row.read(el);
                row.act(el);
                await el.updateComplete;
                document.removeEventListener(row.event, listen);
                expect(event?.detail).toEqual(row.detail);
                expect(event?.bubbles).toBe(true);
                expect(event?.composed).toBe(true);
                expect(event?.cancelable).toBe(true);
                expect(during).not.toEqual(before);
                expect(row.read(el)).toEqual(during);
            });

            it('puts the old state back when cancelled', async () => {
                const el = await fixture(row.template);
                const before = row.read(el);
                el.addEventListener(row.event, (e) => e.preventDefault());
                row.act(el);
                await el.updateComplete;
                expect(row.read(el)).toEqual(before);
            });

            if (row.other) {
                const other = row.other;
                it('keeps a state the cancelling listener set', async () => {
                    const el = await fixture(row.template);
                    el.addEventListener(row.event, (e) => {
                        e.preventDefault();
                        other.set(el);
                    });
                    row.act(el);
                    await el.updateComplete;
                    expect(row.read(el)).toEqual(other.state);
                });
            }

            it('fires nothing for a change from code', async () => {
                const el = await fixture(row.template);
                let fired = 0;
                el.addEventListener(row.event, () => {
                    fired += 1;
                });
                row.program(el);
                await el.updateComplete;
                expect(fired).toBe(0);
            });
        });
    }
});
