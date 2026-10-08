import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../badge/badge.js';
import type { BadgeVariant } from '../badge/badge.js';
import { baseStyles } from '../shared/base.styles.js';
import { toggleEmpty } from '../shared/dom.js';
import { handleNavClick } from '../shared/nav.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { styles } from './navbar.styles.js';

/** One link of the navbar. */
export interface NavbarLink {
    /** Identity: matched against `current`, reported in `hmi-nav` and naming the link's slots. */
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

/** Detail of `hmi-nav`. */
export interface NavbarNavDetail {
    /** The link's `value`. */
    value: string;
    /** The link's `href`, or undefined without one. For a router that navigates itself. */
    href: string | undefined;
}

const menuIcon = html`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M2 4h12M2 8h12M2 12h12" />
</svg>`;

const closeIcon = html`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" />
</svg>`;

/**
 * Responsive top navigation bar: a brand, links with an active state, and a
 * trailing slot. Below 40em the links and the trailing content collapse behind
 * a menu button.
 *
 * `brand` is text, drawn with a monogram of its first letter; for anything else,
 * slot an element into `brand`. A link's `label` is text; for richer content,
 * slot an element named `label-<value>`. A badge is `badge` text, or content
 * slotted as `badge-<value>` inside the pill, or an element slotted as
 * `end-<value>` in its place. A link can be replaced whole by an element slotted
 * as `item-<value>`: a router's own link, a button or a menu. A slotted `<a>`
 * is styled like the other links, and `aria-current="page"` on it is its active
 * state.
 *
 * It is controlled: the element never changes `current`. A click on a link
 * fires the cancelable `hmi-nav`, which carries the `href` for a router; cancel
 * it to keep the browser from following the link. A link without `href` never
 * navigates, and a modified click (ctrl, cmd, shift, alt or a non-primary
 * button) fires nothing, so the browser can open it in a new tab.
 *
 * @tag hmi-navbar
 * @slot brand - The brand, replacing the monogram and `brand` text.
 * @slot right - Trailing content, such as a button or an account menu.
 * @slot item-<value> - A whole link, replacing the built-in one.
 * @slot label-<value> - Rich label for the link with that value.
 * @slot badge-<value> - Rich content inside the badge of the link with that value.
 * @slot end-<value> - Replaces the badge of the link with that value.
 * @csspart base - The `<nav>`.
 * @csspart panel - The `<nav>`, under its panel-group name.
 * @csspart brand - The brand block.
 * @csspart brand-mark - The monogram drawn for a text `brand`.
 * @csspart links - The row of links.
 * @csspart link - A link. The current one has `data-active`.
 * @csspart badge - A link's `<hmi-badge>`.
 * @csspart cta - The trailing content.
 * @csspart toggle - The menu button, shown below 40em.
 * @fires hmi-nav - A link was activated. Cancelable. `detail` is `{ value, href }`.
 *
 * @example
 * const bar = document.querySelector('hmi-navbar');
 * bar.brand = 'Ninoverse';
 * bar.links = [{ value: 'home', label: 'Home', href: '/' }];
 * bar.current = 'home';
 */
@customElement('hmi-navbar')
export class HmiNavbar extends LitElement {
    static override styles = [baseStyles, styles];

    /** The brand text, drawn with a monogram. For anything else, slot an element into `brand`. */
    @property() accessor brand = '';

    /** The links. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor links: NavbarLink[] =
        [];

    /** The `value` of the current link, marked `aria-current="page"`. The element never changes it. */
    @property() accessor current: string | undefined;

    /** The name of the navigation landmark. @default 'Main' */
    @property() accessor label = 'Main';

    /** The name of the menu button. @default 'Toggle navigation menu' */
    @property({ attribute: 'toggle-label' }) accessor toggleLabel =
        'Toggle navigation menu';

    @state() private accessor menuOpen = false;
    @state() private accessor hasBrandSlot = false;
    @state() private accessor hasRightSlot = false;

    #onLinkClick(event: MouseEvent, link: NavbarLink) {
        handleNavClick<NavbarNavDetail>(this, event, {
            value: link.value,
            href: link.href,
        });
        this.menuOpen = false;
    }

    #renderLink(link: NavbarLink) {
        const active = this.current === link.value;
        return html`<slot name=${`item-${link.value}`}>
            <a
                part="link"
                class="link"
                href=${link.href ?? '#'}
                data-active=${active}
                aria-current=${active ? 'page' : nothing}
                @click=${(e: MouseEvent) => this.#onLinkClick(e, link)}
            >
                <slot name=${`label-${link.value}`}>${link.label}</slot>
                <slot name=${`end-${link.value}`}>
                    <hmi-badge
                        part="badge"
                        variant=${link.badgeVariant ?? 'default'}
                        ?hidden=${!link.badge}
                        ><slot
                            name=${`badge-${link.value}`}
                            @slotchange=${(e: Event) => toggleEmpty(e, !!link.badge)}
                            >${link.badge}</slot
                        ></hmi-badge
                    >
                </slot>
            </a>
        </slot>`;
    }

    override render() {
        const collapsible = this.links.length > 0 || this.hasRightSlot;
        return html`<nav
            part="base panel"
            class="panel"
            aria-label=${this.label}
            data-menu-open=${this.menuOpen}
        >
            ${renderLiquidFilter()}
            <span part="brand" class="brand" ?hidden=${!this.brand && !this.hasBrandSlot}>
                <slot
                    name="brand"
                    @slotchange=${(e: Event) => {
                        this.hasBrandSlot =
                            (e.target as HTMLSlotElement).assignedElements()
                                .length > 0;
                    }}
                >
                    ${
                        this.brand
                            ? html`<span part="brand-mark" class="brand-mark" aria-hidden="true"
                                      >${this.brand.charAt(0).toLowerCase() || 'n'}</span
                                  ><span>${this.brand}</span>`
                            : nothing
                    }
                </slot>
            </span>
            ${
                collapsible
                    ? html`<button
                          type="button"
                          part="toggle"
                          class="toggle"
                          aria-label=${this.toggleLabel}
                          aria-expanded=${this.menuOpen}
                          aria-controls="menu"
                          @click=${() => {
                              this.menuOpen = !this.menuOpen;
                          }}
                      >
                          ${this.menuOpen ? closeIcon : menuIcon}
                      </button>`
                    : nothing
            }
            <div class="collapse" id="menu" data-open=${this.menuOpen}>
                ${
                    this.links.length > 0
                        ? html`<div part="links" class="links">
                              ${this.links.map((link) => this.#renderLink(link))}
                          </div>`
                        : nothing
                }
                <div part="cta" class="cta" ?hidden=${!this.hasRightSlot}>
                    <slot
                        name="right"
                        @slotchange=${(e: Event) => {
                            this.hasRightSlot =
                                (e.target as HTMLSlotElement).assignedElements()
                                    .length > 0;
                        }}
                    ></slot>
                </div>
            </div>
        </nav>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-navbar': HmiNavbar;
    }
}
