import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../badge/badge.js';
import type { BadgeVariant } from '../badge/badge.js';
import { baseStyles } from '../shared/base.styles.js';
import { toggleEmpty } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { styles } from './tree.styles.js';

/** One node of the tree. */
export interface TreeNode {
    /** Identity: used for selection and expansion, and naming the node's slots. */
    value: string;
    /** The node text: plain text, or the fallback of the `label-<value>` slot. */
    label: string;
    /** Text of a trailing badge: plain text, or the fallback of the `badge-<value>` slot. */
    badge?: string;
    /** The badge's variant. @default 'default' */
    badgeVariant?: BadgeVariant;
    /** Child nodes. A node with children can be expanded. */
    children?: TreeNode[];
    /** Make the node unselectable and skipped by the keyboard. @default false */
    disabled?: boolean;
}

/** Detail of `hmi-select`. */
export interface TreeSelectDetail {
    /** The `value` of the node that was activated. */
    value: string;
}

/** Detail of `hmi-expanded-change`. */
export interface TreeExpandedChangeDetail {
    /** The `value`s of every expanded node. */
    expanded: string[];
}

interface FlatNode {
    value: string;
    parent: string | null;
    hasChildren: boolean;
    disabled: boolean;
}

/** The visible nodes in order: a node's children follow it only when it is expanded. */
function flatten(
    nodes: readonly TreeNode[],
    expanded: ReadonlySet<string>,
    parent: string | null = null,
    out: FlatNode[] = [],
): FlatNode[] {
    for (const node of nodes) {
        const hasChildren = !!node.children?.length;
        out.push({
            value: node.value,
            parent,
            hasChildren,
            disabled: !!node.disabled,
        });
        if (hasChildren && expanded.has(node.value)) {
            flatten(node.children ?? [], expanded, node.value, out);
        }
    }
    return out;
}

const chevron = html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M4 6l4 4 4-4" />
</svg>`;

/**
 * Accessible tree view (the WAI-ARIA tree pattern): expand and collapse, single
 * selection and keyboard navigation. Only expanded levels are rendered.
 *
 * A node's `label` is text. For richer content, slot an element named
 * `label-<value>`; an icon is an element slotted as `icon-<value>`. A badge is
 * `badge` text, or content slotted as `badge-<value>` inside the pill, or an
 * element slotted as `end-<value>` in its place.
 *
 * It is one tab stop. Arrow Down and Up move through the visible nodes, Home and
 * End jump to the first and last, Arrow Right opens a closed node or moves to its
 * first child, Arrow Left closes an open node or moves to its parent, and Enter
 * or Space activates. Activating a node selects it, and toggles it when it has
 * children. Disabled nodes are skipped.
 *
 * The element owns `expanded` and `selected`: a click or a key updates them, then
 * fires `hmi-expanded-change` or `hmi-select`. Set a property back from the
 * handler to veto the change.
 *
 * @tag hmi-tree
 * @slot label-<value> - Rich label for the node with that value.
 * @slot icon-<value> - Icon for the node with that value.
 * @slot badge-<value> - Rich content inside the badge of the node with that value.
 * @slot end-<value> - Replaces the badge of the node with that value.
 * @csspart base - The `role="tree"` root.
 * @csspart item - One node: the `role="treeitem"`, holding its row and its children.
 * @csspart row - A node's own row. `data-selected` marks the selected one.
 * @csspart chevron - The expand arrow of a node with children.
 * @csspart icon - A node's icon.
 * @csspart label - A node's label.
 * @csspart badge - A node's `<hmi-badge>`.
 * @csspart group - The `role="group"` holding an expanded node's children.
 * @fires hmi-select - A node was activated. `detail` is `{ value }`.
 * @fires hmi-expanded-change - A node was expanded or collapsed. `detail` is `{ expanded }`.
 *
 * @example
 * const tree = document.querySelector('hmi-tree');
 * tree.nodes = [{ value: 'src', label: 'src', children: [{ value: 'main', label: 'main.ts' }] }];
 * tree.expanded = ['src'];
 */
@customElement('hmi-tree')
export class HmiTree extends LitElement {
    static override styles = [baseStyles, styles];

    /** The root nodes. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor nodes: TreeNode[] =
        [];

    /** The `value`s of the expanded nodes. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor expanded: string[] =
        [];

    /** The `value` of the selected node. */
    @property() accessor selected: string | undefined;

    /** The name of the tree. @default 'Tree' */
    @property() accessor label = 'Tree';

    /** The node that holds the tab stop. */
    @state() private accessor active: string | undefined;

    #items(): HTMLElement[] {
        return Array.from(
            this.renderRoot.querySelectorAll<HTMLElement>('[role="treeitem"]'),
        );
    }

    /** The tree item an event came from: the innermost one on its path. */
    #itemOf(event: Event): HTMLElement | undefined {
        return event
            .composedPath()
            .find(
                (n): n is HTMLElement =>
                    n instanceof HTMLElement &&
                    n.getAttribute('role') === 'treeitem',
            );
    }

    #toggle(value: string): void {
        const next = new Set(this.expanded);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        this.expanded = Array.from(next);
        emit<TreeExpandedChangeDetail>(this, 'hmi-expanded-change', {
            expanded: this.expanded,
        });
    }

    #select(value: string): void {
        this.selected = value;
        emit<TreeSelectDetail>(this, 'hmi-select', { value });
    }

    #focus(value: string | undefined): void {
        if (value === undefined) return;
        this.#items()
            .find((el) => el.dataset.value === value)
            ?.focus();
    }

    /** The next enabled node from `from` in direction `dir`, in visible order. */
    #step(flat: FlatNode[], from: number, dir: 1 | -1): string | undefined {
        for (let i = from + dir; i >= 0 && i < flat.length; i += dir) {
            const candidate = flat[i];
            if (candidate && !candidate.disabled) return candidate.value;
        }
        return undefined;
    }

    #onClick(event: MouseEvent): void {
        const value = this.#itemOf(event)?.dataset.value;
        if (value === undefined) return;
        const node = flatten(this.nodes, new Set(this.expanded)).find(
            (f) => f.value === value,
        );
        if (!node || node.disabled) return;
        this.active = value;
        if (node.hasChildren) this.#toggle(value);
        this.#select(value);
    }

    #onFocusIn(event: FocusEvent): void {
        const item = this.#itemOf(event);
        // Only the item itself holds the tab stop, not content slotted in it.
        if (item && event.composedPath()[0] === item) {
            this.active = item.dataset.value;
        }
    }

    #onKeydown(event: KeyboardEvent): void {
        const item = this.#itemOf(event);
        // Keys typed in content slotted into a node are not the tree's.
        if (!item || event.composedPath()[0] !== item) return;
        const value = item.dataset.value as string;
        const expanded = new Set(this.expanded);
        const flat = flatten(this.nodes, expanded);
        const index = flat.findIndex((f) => f.value === value);
        const current = flat[index];
        if (!current) return;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.#focus(this.#step(flat, index, 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.#focus(this.#step(flat, index, -1));
                break;
            case 'Home':
                event.preventDefault();
                this.#focus(flat.find((f) => !f.disabled)?.value);
                break;
            case 'End':
                event.preventDefault();
                this.#focus(this.#step(flat, flat.length, -1));
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (current.hasChildren) {
                    if (!expanded.has(value)) this.#toggle(value);
                    else this.#focus(flat[index + 1]?.value);
                }
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (current.hasChildren && expanded.has(value)) {
                    this.#toggle(value);
                } else if (current.parent !== null) {
                    this.#focus(current.parent);
                }
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (current.disabled) break;
                if (current.hasChildren) this.#toggle(value);
                this.#select(value);
                break;
            default:
                break;
        }
    }

    #renderLevel(
        nodes: readonly TreeNode[],
        depth: number,
        expanded: ReadonlySet<string>,
        tabbable: string | undefined,
    ): TemplateResult[] {
        return nodes.map((node) => {
            const hasChildren = !!node.children?.length;
            const isExpanded = hasChildren && expanded.has(node.value);
            const isSelected = this.selected === node.value;
            return html`<div
                part="item"
                class="item"
                role="treeitem"
                data-value=${node.value}
                aria-level=${depth + 1}
                aria-selected=${isSelected}
                aria-expanded=${hasChildren ? String(isExpanded) : nothing}
                aria-disabled=${node.disabled ? 'true' : nothing}
                tabindex=${tabbable === node.value ? 0 : -1}
            >
                <div
                    part="row"
                    class="row"
                    data-selected=${isSelected}
                    style=${styleMap({ '--_depth': String(depth) })}
                >
                    <span
                        part="chevron"
                        class="chevron"
                        aria-hidden="true"
                        data-expanded=${isExpanded}
                        data-leaf=${!hasChildren}
                        >${hasChildren ? chevron : nothing}</span
                    >
                    <span part="icon" class="icon" aria-hidden="true" hidden
                        ><slot
                            name=${`icon-${node.value}`}
                            @slotchange=${(e: Event) => toggleEmpty(e, false)}
                        ></slot
                    ></span>
                    <span part="label" class="label"
                        ><slot name=${`label-${node.value}`}>${node.label}</slot></span
                    >
                    <slot name=${`end-${node.value}`}>
                        <hmi-badge
                            part="badge"
                            variant=${node.badgeVariant ?? 'default'}
                            ?hidden=${!node.badge}
                            ><slot
                                name=${`badge-${node.value}`}
                                @slotchange=${(e: Event) => toggleEmpty(e, !!node.badge)}
                                >${node.badge}</slot
                            ></hmi-badge
                        >
                    </slot>
                </div>
                ${
                    isExpanded
                        ? html`<div part="group" class="group" role="group">
                              ${this.#renderLevel(node.children ?? [], depth + 1, expanded, tabbable)}
                          </div>`
                        : nothing
                }
            </div>`;
        });
    }

    override render() {
        const expanded = new Set(this.expanded);
        const flat = flatten(this.nodes, expanded);
        // One tab stop: the node that last had focus, else the first enabled one.
        const tabbable = flat.some((f) => f.value === this.active)
            ? this.active
            : flat.find((f) => !f.disabled)?.value;
        return html`<div
            part="base"
            class="tree"
            role="tree"
            aria-label=${this.label}
            @click=${this.#onClick}
            @keydown=${this.#onKeydown}
            @focusin=${this.#onFocusIn}
        >
            ${this.#renderLevel(this.nodes, 0, expanded, tabbable)}
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-tree': HmiTree;
    }
}
