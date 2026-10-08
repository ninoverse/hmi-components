import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { handleNavClick } from '../shared/nav.js';
import { styles } from './breadcrumbs.styles.js';

/** One crumb of a trail. */
export interface BreadcrumbItem {
    /** The crumb text: plain text, or the fallback of the `label-<index>` slot. */
    label: string;
    /** Link target. Ignored on the last (current) item. Without it, the crumb only fires `hmi-nav`. */
    href?: string;
    /** Reported in `hmi-nav`. @default the label */
    value?: string;
}

/** Detail of `hmi-nav`. */
export interface BreadcrumbsNavDetail {
    /** The crumb's `value`, or its label. */
    value: string;
    /** The crumb's position, from 0. */
    index: number;
    /** The crumb's `href`, or undefined without one. For a router that navigates itself. */
    href: string | undefined;
}

/**
 * Navigation breadcrumb trail. The last item is the current page, marked
 * `aria-current="page"`; every other item is a link.
 *
 * A crumb's `label` is text. For richer content, such as an icon beside the
 * text, slot an element named `label-<index>` (the item's position, from 0),
 * which replaces that text. The separator is a string, or one element in the
 * `separator` slot, which is copied into every gap.
 *
 * Clicking a link fires the cancelable `hmi-nav`. Cancel it to keep the
 * browser from following `href`, as a router does. A link without `href` never
 * navigates, and a modified click (ctrl, cmd, shift, alt or a non-primary
 * button) fires nothing, so the browser can open it in a new tab.
 *
 * @tag hmi-breadcrumbs
 * @slot label-<index> - Rich label for the crumb at that position.
 * @slot separator - One element, copied between the crumbs. Copies carry no event listeners or `id`s.
 * @csspart base - The `<nav>`.
 * @csspart list - The list of crumbs.
 * @csspart item - One crumb with its separator.
 * @csspart link - A crumb that links.
 * @csspart current - The last crumb.
 * @csspart separator - A separator.
 * @fires hmi-nav - A link was activated. Cancelable. `detail` is `{ value, index, href }`.
 *
 * @example
 * const crumbs = document.querySelector('hmi-breadcrumbs');
 * crumbs.items = [{ label: 'Home', href: '/' }, { label: 'Settings' }];
 */
@customElement('hmi-breadcrumbs')
export class HmiBreadcrumbs extends LitElement {
    static override styles = [baseStyles, styles];

    /** The trail. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor items: BreadcrumbItem[] = [];

    /** Text between crumbs, unless a `separator` slot has an element. @default '/' */
    @property() accessor separator = '/';

    /** The name of the navigation landmark. @default 'Breadcrumb' */
    @property() accessor label = 'Breadcrumb';

    @state() private accessor separatorSource: Element | null = null;

    #copies: { source: Element | null; nodes: Element[] } = {
        source: null,
        nodes: [],
    };

    #onSeparatorSlot(event: Event) {
        this.separatorSource =
            (event.target as HTMLSlotElement).assignedElements({
                flatten: true,
            })[0] ?? null;
    }

    /** The separator after crumb `index`: a copy of the slotted element, else the text. */
    #separator(index: number) {
        const source = this.separatorSource;
        if (!source) return this.separator;
        const needed = Math.max(0, this.items.length - 1);
        if (
            this.#copies.source !== source ||
            this.#copies.nodes.length !== needed
        ) {
            this.#copies = {
                source,
                nodes: Array.from({ length: needed }, () => {
                    const copy = source.cloneNode(true) as Element;
                    copy.removeAttribute('slot');
                    return copy;
                }),
            };
        }
        return this.#copies.nodes[index];
    }

    #onClick(event: MouseEvent, item: BreadcrumbItem, index: number) {
        handleNavClick<BreadcrumbsNavDetail>(this, event, {
            value: item.value ?? item.label,
            index,
            href: item.href,
        });
    }

    override render() {
        const last = this.items.length - 1;
        return html`<nav part="base" class="base" aria-label=${this.label}>
            <ol part="list" class="list">
                ${this.items.map(
                    (item, index) => html`<li part="item" class="item">
                        ${
                            index === last
                                ? html`<span
                                      part="current"
                                      class="current"
                                      aria-current="page"
                                      ><slot name=${`label-${index}`}>${item.label}</slot></span
                                  >`
                                : html`<a
                                      part="link"
                                      class="link"
                                      href=${item.href ?? '#'}
                                      @click=${(e: MouseEvent) => this.#onClick(e, item, index)}
                                      ><slot name=${`label-${index}`}>${item.label}</slot></a
                                  >`
                        }
                        ${
                            index < last
                                ? html`<span
                                      part="separator"
                                      class="separator"
                                      aria-hidden="true"
                                      >${this.#separator(index)}</span
                                  >`
                                : nothing
                        }
                    </li>`,
                )}
            </ol>
            <slot
                name="separator"
                class="separator-source"
                @slotchange=${this.#onSeparatorSlot}
            ></slot>
        </nav>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-breadcrumbs': HmiBreadcrumbs;
    }
}
