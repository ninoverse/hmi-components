import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './tree.js';
import type {
    HmiTree,
    TreeExpandedChangeDetail,
    TreeNode,
    TreeSelectDetail,
} from './tree.js';
import { Tree } from './tree.react.js';

const NODES: TreeNode[] = [
    {
        value: 'src',
        label: 'src',
        children: [
            {
                value: 'main',
                label: 'main.ts',
                badge: 'M',
                badgeVariant: 'warning',
            },
            { value: 'old', label: 'old.ts', disabled: true },
            {
                value: 'lib',
                label: 'lib',
                children: [{ value: 'deep', label: 'deep.ts' }],
            },
        ],
    },
    {
        value: 'docs',
        label: 'docs',
        children: [{ value: 'guide', label: 'guide.md' }],
    },
    { value: 'readme', label: 'README.md' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-tree') as HmiTree;
    await el.updateComplete;
    return el;
}

const settle = () => new Promise((r) => setTimeout(r));

const all = (el: HmiTree, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

const item = (el: HmiTree, value: string) =>
    all(el, 'item').find((i) => i.dataset.value === value) as HTMLElement;

const row = (el: HmiTree, value: string) =>
    item(el, value).querySelector('[part~="row"]') as HTMLElement;

const slotOf = (el: HmiTree, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(
        `slot[name="${name}"]`,
    ) as HTMLSlotElement;

const values = (el: HmiTree) => all(el, 'item').map((i) => i.dataset.value);

function events(el: HmiTree) {
    const selects: string[] = [];
    const expands: string[][] = [];
    el.addEventListener('hmi-select', (e) =>
        selects.push((e as CustomEvent<TreeSelectDetail>).detail.value),
    );
    el.addEventListener('hmi-expanded-change', (e) =>
        expands.push(
            (e as CustomEvent<TreeExpandedChangeDetail>).detail.expanded,
        ),
    );
    return { selects, expands };
}

const key = (target: Element, k: string) =>
    target.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: k,
            bubbles: true,
            cancelable: true,
            composed: true,
        }),
    );

const text = (n: Element | undefined) =>
    n?.textContent?.replace(/\s+/g, ' ').trim();

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-tree', () => {
    it('registers', () => {
        expect(customElements.get('hmi-tree')).toBeDefined();
    });

    it('renders a named tree and only the levels that are expanded', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        expect(all(el, 'base')[0]?.getAttribute('role')).toBe('tree');
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Tree');
        expect(values(el)).toEqual(['src', 'docs', 'readme']);
        el.expanded = ['src', 'lib'];
        await el.updateComplete;
        expect(values(el)).toEqual([
            'src',
            'main',
            'old',
            'lib',
            'deep',
            'docs',
            'readme',
        ]);
    });

    it('names the tree from label', async () => {
        const el = await fixture(
            html`<hmi-tree label="Files" .nodes=${NODES}></hmi-tree>`,
        );
        expect(all(el, 'base')[0]?.getAttribute('aria-label')).toBe('Files');
    });

    it('takes nodes and expanded as properties only: attributes are ignored', async () => {
        const el = await fixture(
            html`<hmi-tree
                nodes='[{"value":"a","label":"A"}]'
                expanded='["a"]'
            ></hmi-tree>`,
        );
        expect(all(el, 'item')).toHaveLength(0);
    });

    it('sets the ARIA state of each item', async () => {
        const el = await fixture(
            html`<hmi-tree
                selected="main"
                .expanded=${['src', 'lib']}
                .nodes=${NODES}
            ></hmi-tree>`,
        );
        expect(item(el, 'src').getAttribute('aria-level')).toBe('1');
        expect(item(el, 'deep').getAttribute('aria-level')).toBe('3');
        expect(item(el, 'src').getAttribute('aria-expanded')).toBe('true');
        expect(item(el, 'docs').getAttribute('aria-expanded')).toBe('false');
        expect(item(el, 'readme').hasAttribute('aria-expanded')).toBe(false);
        expect(item(el, 'main').getAttribute('aria-selected')).toBe('true');
        expect(item(el, 'readme').getAttribute('aria-selected')).toBe('false');
        expect(item(el, 'old').getAttribute('aria-disabled')).toBe('true');
        expect(all(el, 'group')[0]?.getAttribute('role')).toBe('group');
    });

    it('indents each level by its depth', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src', 'lib']} .nodes=${NODES}></hmi-tree>`,
        );
        const pad = (v: string) =>
            Number.parseFloat(getComputedStyle(row(el, v)).paddingInlineStart);
        expect(pad('main')).toBeGreaterThan(pad('src'));
        expect(pad('deep')).toBeGreaterThan(pad('main'));
    });

    it('marks the selected row', async () => {
        const el = await fixture(
            html`<hmi-tree selected="readme" .nodes=${NODES}></hmi-tree>`,
        );
        expect(row(el, 'readme').dataset.selected).toBe('true');
        expect(row(el, 'src').dataset.selected).toBe('false');
    });

    it('treats a node with an empty children array as a leaf', async () => {
        const el = await fixture(
            html`<hmi-tree .nodes=${[{ value: 'a', label: 'A', children: [] }]}></hmi-tree>`,
        );
        expect(item(el, 'a').hasAttribute('aria-expanded')).toBe(false);
    });

    it('slots a rich label and an icon by value, with the text as fallback', async () => {
        const el = await fixture(
            html`<hmi-tree .nodes=${NODES}>
                <b slot="label-readme">Read me</b>
                <svg slot="icon-docs" viewBox="0 0 16 16"></svg>
            </hmi-tree>`,
        );
        await settle();
        expect(
            slotOf(el, 'label-readme').assignedElements()[0]?.textContent,
        ).toBe('Read me');
        expect(text(slotOf(el, 'label-docs'))).toBe('docs');
        const icons = all(el, 'icon');
        expect(icons[1]?.hidden).toBe(false);
        expect(icons[0]?.hidden).toBe(true);
    });
});

describe('hmi-tree badges', () => {
    it('draws a badge with its variant, hiding it without text', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src']} .nodes=${NODES}></hmi-tree>`,
        );
        const badges = all(el, 'badge');
        const main = item(el, 'main').querySelector(
            '[part~="badge"]',
        ) as HTMLElement;
        expect(main.getAttribute('variant')).toBe('warning');
        expect(text(main)).toBe('M');
        expect(badges.find((b) => b !== main)?.hidden).toBe(true);
    });

    it('shows a badge for slotted content, inside the pill', async () => {
        const el = await fixture(
            html`<hmi-tree .nodes=${NODES}
                ><b slot="badge-readme">new</b></hmi-tree
            >`,
        );
        await settle();
        const pill = item(el, 'readme').querySelector(
            '[part~="badge"]',
        ) as HTMLElement;
        expect(pill.hidden).toBe(false);
        expect(pill.contains(slotOf(el, 'badge-readme'))).toBe(true);
    });

    it('lets an end slot replace the pill', async () => {
        const el = await fixture(
            html`<hmi-tree .nodes=${NODES}
                ><i slot="end-readme">dot</i></hmi-tree
            >`,
        );
        expect(
            slotOf(el, 'end-readme').assignedElements()[0]?.textContent,
        ).toBe('dot');
    });
});

describe('hmi-tree activation', () => {
    it('toggles a branch and selects it on click, firing both events', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        const { selects, expands } = events(el);
        row(el, 'src').click();
        await el.updateComplete;
        expect(el.expanded).toEqual(['src']);
        expect(el.selected).toBe('src');
        expect(selects).toEqual(['src']);
        expect(expands).toEqual([['src']]);
        row(el, 'src').click();
        await el.updateComplete;
        expect(el.expanded).toEqual([]);
        expect(expands).toEqual([['src'], []]);
    });

    it('only selects a leaf', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        const { selects, expands } = events(el);
        row(el, 'readme').click();
        expect(selects).toEqual(['readme']);
        expect(expands).toEqual([]);
    });

    it('fires hmi-select again for the node that is already selected', async () => {
        const el = await fixture(
            html`<hmi-tree selected="readme" .nodes=${NODES}></hmi-tree>`,
        );
        const { selects } = events(el);
        row(el, 'readme').click();
        expect(selects).toEqual(['readme']);
    });

    it('ignores a disabled node', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src']} .nodes=${NODES}></hmi-tree>`,
        );
        const { selects } = events(el);
        row(el, 'old').click();
        expect(selects).toEqual([]);
        expect(el.selected).toBeUndefined();
    });

    it('owns its state: a handler can veto by setting the property back', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        el.addEventListener('hmi-select', () => {
            el.selected = undefined;
        });
        el.addEventListener('hmi-expanded-change', () => {
            el.expanded = [];
        });
        row(el, 'src').click();
        await el.updateComplete;
        expect(el.selected).toBeUndefined();
        expect(values(el)).toEqual(['src', 'docs', 'readme']);
    });

    it('does not select from a click on content slotted in the row of a disabled node', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src']} .nodes=${NODES}
                ><b slot="label-old">Old</b></hmi-tree
            >`,
        );
        const { selects } = events(el);
        (el.querySelector('b') as HTMLElement).click();
        expect(selects).toEqual([]);
    });

    it('selects a node from a click on its slotted label', async () => {
        const el = await fixture(
            html`<hmi-tree .nodes=${NODES}
                ><b slot="label-readme">Read me</b></hmi-tree
            >`,
        );
        const { selects } = events(el);
        (el.querySelector('b') as HTMLElement).click();
        expect(selects).toEqual(['readme']);
    });
});

describe('hmi-tree keyboard', () => {
    it('is one tab stop: the first enabled node, then the one that had focus', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src']} .nodes=${NODES}></hmi-tree>`,
        );
        const stops = () =>
            all(el, 'item')
                .filter((i) => i.getAttribute('tabindex') === '0')
                .map((i) => i.dataset.value);
        expect(stops()).toEqual(['src']);
        item(el, 'main').focus();
        await el.updateComplete;
        expect(stops()).toEqual(['main']);
    });

    it('starts the tab stop on the first enabled node', async () => {
        const el = await fixture(
            html`<hmi-tree
                .nodes=${[
                    { value: 'a', label: 'A', disabled: true },
                    { value: 'b', label: 'B' },
                ]}
            ></hmi-tree>`,
        );
        expect(item(el, 'a').getAttribute('tabindex')).toBe('-1');
        expect(item(el, 'b').getAttribute('tabindex')).toBe('0');
    });

    it('moves with Arrow Down and Up, skipping disabled nodes', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src']} .nodes=${NODES}></hmi-tree>`,
        );
        item(el, 'src').focus();
        key(item(el, 'src'), 'ArrowDown');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'main'));
        key(item(el, 'main'), 'ArrowDown');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'lib'));
        key(item(el, 'lib'), 'ArrowUp');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'main'));
    });

    it('jumps to the first and last enabled node with Home and End', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        item(el, 'docs').focus();
        key(item(el, 'docs'), 'End');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'readme'));
        key(item(el, 'readme'), 'Home');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'src'));
    });

    it('opens with Arrow Right, then moves into the first child', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        const { expands } = events(el);
        item(el, 'src').focus();
        key(item(el, 'src'), 'ArrowRight');
        await el.updateComplete;
        expect(expands).toEqual([['src']]);
        key(item(el, 'src'), 'ArrowRight');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'main'));
    });

    it('closes with Arrow Left, then moves to the parent', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src', 'lib']} .nodes=${NODES}></hmi-tree>`,
        );
        item(el, 'deep').focus();
        key(item(el, 'deep'), 'ArrowLeft');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'lib'));
        key(item(el, 'lib'), 'ArrowLeft');
        await el.updateComplete;
        expect(el.expanded).toEqual(['src']);
        key(item(el, 'lib'), 'ArrowLeft');
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'src'));
    });

    it('does nothing with Arrow Right or Left on a leaf with no parent', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        const { expands } = events(el);
        item(el, 'readme').focus();
        key(item(el, 'readme'), 'ArrowRight');
        key(item(el, 'readme'), 'ArrowLeft');
        expect(expands).toEqual([]);
        expect(el.shadowRoot?.activeElement).toBe(item(el, 'readme'));
    });

    it('activates with Enter and Space', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        const { selects, expands } = events(el);
        item(el, 'docs').focus();
        key(item(el, 'docs'), 'Enter');
        key(item(el, 'readme'), ' ');
        expect(selects).toEqual(['docs', 'readme']);
        expect(expands).toEqual([['docs']]);
    });

    it('does not activate a disabled node from the keyboard', async () => {
        const el = await fixture(
            html`<hmi-tree .expanded=${['src']} .nodes=${NODES}></hmi-tree>`,
        );
        const { selects } = events(el);
        item(el, 'old').focus();
        key(item(el, 'old'), 'Enter');
        expect(selects).toEqual([]);
    });

    it('leaves a key typed in slotted content alone, and lets the event reach the host', async () => {
        const el = await fixture(
            html`<hmi-tree .nodes=${NODES}
                ><input slot="label-readme" /></hmi-tree
            >`,
        );
        const { selects } = events(el);
        const seen: string[] = [];
        el.addEventListener('keydown', (e) =>
            seen.push((e as KeyboardEvent).key),
        );
        const input = el.querySelector('input') as HTMLElement;
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        input.dispatchEvent(event);
        expect(selects).toEqual([]);
        expect(event.defaultPrevented).toBe(false);
        expect(seen).toEqual(['Enter']);
    });

    it('lets a handled key reach a listener on the host', async () => {
        const el = await fixture(html`<hmi-tree .nodes=${NODES}></hmi-tree>`);
        const seen: string[] = [];
        el.addEventListener('keydown', (e) =>
            seen.push((e as KeyboardEvent).key),
        );
        item(el, 'src').focus();
        key(item(el, 'src'), 'ArrowDown');
        expect(seen).toEqual(['ArrowDown']);
    });
});

describe('Tree (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const selects: string[] = [];
        const expands: string[][] = [];
        await act(async () => {
            root.render(
                createElement(Tree, {
                    nodes: NODES,
                    expanded: ['src'],
                    selected: 'main',
                    label: 'Files',
                    onSelect: (e) => selects.push(e.detail.value),
                    onExpandedChange: (e) => expands.push(e.detail.expanded),
                }),
            );
        });
        const el = host.querySelector('hmi-tree') as HmiTree;
        await el.updateComplete;
        expect(el.selected).toBe('main');
        expect(values(el)).toEqual([
            'src',
            'main',
            'old',
            'lib',
            'docs',
            'readme',
        ]);
        row(el, 'docs').click();
        expect(selects).toEqual(['docs']);
        expect(expands).toEqual([['src', 'docs']]);
        await act(async () => root.unmount());
    });
});
