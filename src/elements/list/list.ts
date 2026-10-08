import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import '../avatar/avatar.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './list.styles.js';

/** One row of a list. */
export interface ListItem {
    /** Stable identity: keys the row and names its slots (`title-<id>`, …). */
    id: string | number;
    /** Primary line: plain text, or the fallback of the `title-<id>` slot. */
    title?: string;
    /** Secondary line: plain text, or the fallback of the `subtitle-<id>` slot. */
    subtitle?: string;
    /** A name, rendered as a leading `<hmi-avatar>`. */
    avatar?: string;
    /** Trailing content: plain text, or the fallback of the `right-<id>` slot. */
    right?: string;
}

/** Detail of `hmi-reorder`. */
export interface ListReorderDetail {
    /** The items in their new order. The list does not reorder itself: set it back. */
    items: ListItem[];
}

/** Hides the parent of a slot that has no content and no text fallback. */
const toggleEmpty = (event: Event, hasText: boolean) => {
    const slot = event.target as HTMLSlotElement;
    (slot.parentElement as HTMLElement).hidden =
        slot.assignedNodes().length === 0 && !hasText;
};

const move = (items: ListItem[], from: number, to: number): ListItem[] => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(to, 0, moved);
    return next;
};

/**
 * Vertical list of rows in one card: an optional avatar, a title and subtitle,
 * and trailing content. With `reorderable`, rows drag to a new place, and a
 * handle moves them with Alt+ArrowUp and Alt+ArrowDown.
 *
 * A row's `title`, `subtitle` and `right` are text. For richer content, slot an
 * element named `title-<id>`, `subtitle-<id>` or `right-<id>` (the item's `id`),
 * which replaces that text. A slot named `item-<id>` replaces the whole row.
 *
 * The list never reorders itself: it fires `hmi-reorder` with the new order, and
 * the consumer sets `items` back.
 *
 * @tag hmi-list
 * @slot item-<id> - The whole row for the item with that id, replacing the avatar, text and trailing content.
 * @slot title-<id> - Rich title for the item with that id.
 * @slot subtitle-<id> - Rich subtitle for the item with that id.
 * @slot right-<id> - Rich trailing content for the item with that id.
 * @csspart base - The list.
 * @csspart item - One row.
 * @csspart handle - A row's reorder handle, present only when `reorderable`.
 * @csspart avatar - A row's `<hmi-avatar>`.
 * @csspart main - A row's title and subtitle.
 * @csspart title - A row's title.
 * @csspart subtitle - A row's subtitle.
 * @csspart right - A row's trailing content.
 * @csspart status - The live region that announces a keyboard move.
 * @fires hmi-reorder - A row was dropped, or moved with the keyboard, to a new place. `detail.items` is the new order.
 *
 * @example
 * const list = document.querySelector('hmi-list');
 * list.items = [{ id: 1, title: 'Ada', subtitle: 'Engineer' }];
 * list.addEventListener('hmi-reorder', (e) => { list.items = e.detail.items; });
 */
@customElement('hmi-list')
export class HmiList extends LitElement {
    static override styles = [baseStyles, styles];

    /** The rows. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor items: ListItem[] =
        [];

    /** Let rows be reordered by dragging or with the keyboard. @default false */
    @property({ type: Boolean, reflect: true }) accessor reorderable = false;

    @state() private accessor dragIndex: number | null = null;
    @state() private accessor overIndex: number | null = null;
    @state() private accessor announcement = '';

    #focusId: ListItem['id'] | null = null;

    #reorder(from: number, to: number) {
        emit<ListReorderDetail>(this, 'hmi-reorder', {
            items: move(this.items, from, to),
        });
    }

    #onDragStart(event: DragEvent, index: number) {
        if (!event.dataTransfer) return;
        this.dragIndex = index;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(index));
    }

    #onDragOver(event: DragEvent, index: number) {
        event.preventDefault();
        this.overIndex = index;
    }

    #onDrop(event: DragEvent, index: number) {
        event.preventDefault();
        const from = this.dragIndex;
        this.#onDragEnd();
        if (from == null || from === index) return;
        this.#reorder(from, index);
    }

    #onDragEnd() {
        this.dragIndex = null;
        this.overIndex = null;
    }

    #onHandleKeydown(event: KeyboardEvent, index: number) {
        if (!event.altKey) return;
        const to =
            event.key === 'ArrowUp'
                ? index - 1
                : event.key === 'ArrowDown'
                  ? index + 1
                  : -1;
        if (to < 0 || to >= this.items.length) return;
        event.preventDefault();
        const item = this.items[index] as ListItem;
        this.#focusId = item.id;
        this.announcement = `${item.title ?? item.id} moved to position ${to + 1} of ${this.items.length}`;
        this.#reorder(index, to);
    }

    protected override updated(changed: Map<PropertyKey, unknown>) {
        if (!changed.has('items') || this.#focusId === null) return;
        const index = this.items.findIndex((i) => i.id === this.#focusId);
        this.#focusId = null;
        this.shadowRoot
            ?.querySelectorAll<HTMLElement>('.handle')
            [index]?.focus();
    }

    override render() {
        return html`<ul part="base" class="base" role="list">
                ${repeat(
                    this.items,
                    (item) => item.id,
                    (item, index) => this.#renderItem(item, index),
                )}
            </ul>
            <div part="status" class="status" role="status" aria-live="polite">
                ${this.announcement}
            </div>`;
    }

    #renderItem(item: ListItem, index: number) {
        const reorderable = this.reorderable;
        return html`<li
            part="item"
            class="item"
            draggable=${ifDefined(reorderable ? 'true' : undefined)}
            data-dragging=${this.dragIndex === index}
            data-drag-over=${
                this.overIndex === index && this.dragIndex !== index
            }
            @dragstart=${reorderable ? (e: DragEvent) => this.#onDragStart(e, index) : nothing}
            @dragover=${reorderable ? (e: DragEvent) => this.#onDragOver(e, index) : nothing}
            @drop=${reorderable ? (e: DragEvent) => this.#onDrop(e, index) : nothing}
            @dragend=${reorderable ? () => this.#onDragEnd() : nothing}
        >
            ${
                reorderable
                    ? html`<button
                          type="button"
                          part="handle"
                          class="handle"
                          aria-label=${`Reorder ${item.title ?? item.id}`}
                          @keydown=${(e: KeyboardEvent) => this.#onHandleKeydown(e, index)}
                      >
                          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                              <circle cx="6" cy="4" r="1.2" />
                              <circle cx="10" cy="4" r="1.2" />
                              <circle cx="6" cy="8" r="1.2" />
                              <circle cx="10" cy="8" r="1.2" />
                              <circle cx="6" cy="12" r="1.2" />
                              <circle cx="10" cy="12" r="1.2" />
                          </svg>
                      </button>`
                    : nothing
            }
            <slot name=${`item-${item.id}`}>
                ${
                    item.avatar
                        ? html`<hmi-avatar
                              part="avatar"
                              name=${item.avatar}
                              size="medium"
                          ></hmi-avatar>`
                        : nothing
                }
                <div part="main" class="main">
                    <p part="title" class="title" ?hidden=${!item.title}
                        ><slot
                            name=${`title-${item.id}`}
                            @slotchange=${(e: Event) => toggleEmpty(e, !!item.title)}
                            >${item.title}</slot
                        ></p
                    >
                    <p part="subtitle" class="subtitle" ?hidden=${!item.subtitle}
                        ><slot
                            name=${`subtitle-${item.id}`}
                            @slotchange=${(e: Event) => toggleEmpty(e, !!item.subtitle)}
                            >${item.subtitle}</slot
                        ></p
                    >
                </div>
                <div part="right" class="right" ?hidden=${!item.right}
                    ><slot
                        name=${`right-${item.id}`}
                        @slotchange=${(e: Event) => toggleEmpty(e, !!item.right)}
                        >${item.right}</slot
                    ></div
                >
            </slot>
        </li>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-list': HmiList;
    }
}
