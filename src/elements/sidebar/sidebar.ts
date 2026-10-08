import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../badge/badge.js';
import type { BadgeVariant } from '../badge/badge.js';
import { baseStyles } from '../shared/base.styles.js';
import { toggleEmpty } from '../shared/dom.js';
import { handleNavClick } from '../shared/nav.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { styles } from './sidebar.styles.js';

/** One link of the sidebar. */
export interface SidebarItem {
    /** Identity: matched against `current`, reported in `hmi-nav` and naming the item's slots. */
    value: string;
    /** The link text: plain text, or the fallback of the `label-<value>` slot. */
    label: string;
    /** Link target. Without it, the link only fires `hmi-nav`. */
    href?: string;
    /** Text of a trailing badge: plain text, or the fallback of the `badge-<value>` slot. */
    badge?: string;
    /** The badge's variant. @default 'default' */
    badgeVariant?: BadgeVariant;
}

/** A titled run of links. */
export interface SidebarGroup {
    /** The heading: plain text, or the fallback of the `group-<index>` slot. */
    label?: string;
    /** The links of the group. */
    items: SidebarItem[];
}

/** Detail of `hmi-nav`. */
export interface SidebarNavDetail {
    /** The link's `value`. */
    value: string;
    /** The link's `href`, or undefined without one. For a router that navigates itself. */
    href: string | undefined;
}

/**
 * Vertical side navigation, in groups: each has an optional uppercase heading
 * and a stack of links with an optional icon, a label and a badge. The current
 * link takes the primary tonal pair.
 *
 * A group's `label` and a link's `label` are text. For richer content, slot an
 * element named `group-<index>` (the group's position, from 0) or
 * `label-<value>`. An icon is an element slotted as `icon-<value>`. A badge is
 * `badge` text, or content slotted as `badge-<value>` inside the pill, or an
 * element slotted as `end-<value>` in its place. A link can be replaced whole by
 * an element slotted as `item-<value>`: a router's own link, a button. A
 * slotted `<a>` is styled like the other links, and `aria-current="page"` on it
 * is its active state.
 *
 * It is controlled: the element never changes `current`. A click on a link
 * fires the cancelable `hmi-nav`, which carries the `href` for a router; cancel
 * it to keep the browser from following the link. A link without `href` never
 * navigates, and a modified click (ctrl, cmd, shift, alt or a non-primary
 * button) fires nothing, so the browser can open it in a new tab.
 *
 * @tag hmi-sidebar
 * @slot group-<index> - Rich heading for the group at that position.
 * @slot item-<value> - A whole link, replacing the built-in one.
 * @slot label-<value> - Rich label for the link with that value.
 * @slot icon-<value> - Icon for the link with that value.
 * @slot badge-<value> - Rich content inside the badge of the link with that value.
 * @slot end-<value> - Replaces the badge of the link with that value.
 * @csspart base - The `<aside>`.
 * @csspart panel - The `<aside>`, under its panel-group name.
 * @csspart group - One group.
 * @csspart group-label - A group's heading.
 * @csspart link - A link. The current one has `data-active`.
 * @csspart icon - A link's icon.
 * @csspart text - A link's label.
 * @csspart badge - A link's `<hmi-badge>`.
 * @fires hmi-nav - A link was activated. Cancelable. `detail` is `{ value, href }`.
 *
 * @example
 * const side = document.querySelector('hmi-sidebar');
 * side.groups = [{ label: 'Mail', items: [{ value: 'inbox', label: 'Inbox', badge: '12' }] }];
 * side.current = 'inbox';
 */
@customElement('hmi-sidebar')
export class HmiSidebar extends LitElement {
    static override styles = [baseStyles, styles];

    /** The groups of links. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor groups: SidebarGroup[] = [];

    /** The `value` of the current link, marked `aria-current="page"`. The element never changes it. */
    @property() accessor current: string | undefined;

    /** The name of the landmark. @default 'Sidebar' */
    @property() accessor label = 'Sidebar';

    #onLinkClick(event: MouseEvent, item: SidebarItem) {
        handleNavClick<SidebarNavDetail>(this, event, {
            value: item.value,
            href: item.href,
        });
    }

    #renderItem(item: SidebarItem) {
        const active = this.current === item.value;
        return html`<slot name=${`item-${item.value}`}>
            <a
                part="link"
                class="link"
                href=${item.href ?? '#'}
                data-active=${active}
                aria-current=${active ? 'page' : nothing}
                @click=${(e: MouseEvent) => this.#onLinkClick(e, item)}
            >
                <span part="icon" class="icon" aria-hidden="true" hidden
                    ><slot
                        name=${`icon-${item.value}`}
                        @slotchange=${(e: Event) => toggleEmpty(e, false)}
                    ></slot
                ></span>
                <span part="text" class="text"
                    ><slot name=${`label-${item.value}`}>${item.label}</slot></span
                >
                <slot name=${`end-${item.value}`}>
                    <hmi-badge
                        part="badge"
                        variant=${item.badgeVariant ?? 'default'}
                        ?hidden=${!item.badge}
                        ><slot
                            name=${`badge-${item.value}`}
                            @slotchange=${(e: Event) => toggleEmpty(e, !!item.badge)}
                            >${item.badge}</slot
                        ></hmi-badge
                    >
                </slot>
            </a>
        </slot>`;
    }

    override render() {
        return html`<aside part="base panel" class="panel" aria-label=${this.label}>
            ${renderLiquidFilter()}
            ${this.groups.map(
                (group, index) => html`<div part="group" class="group">
                    ${
                        group.label
                            ? html`<div part="group-label" class="group-label"
                                  ><slot name=${`group-${index}`}>${group.label}</slot></div
                              >`
                            : nothing
                    }
                    ${group.items.map((item) => this.#renderItem(item))}
                </div>`,
            )}
        </aside>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-sidebar': HmiSidebar;
    }
}
