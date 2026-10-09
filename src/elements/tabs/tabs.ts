import { html, isServer, LitElement, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '../badge/badge.js';
import type { BadgeVariant } from '../badge/badge.js';
import { baseStyles } from '../shared/base.styles.js';
import { toggleEmpty } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { styles } from './tabs.styles.js';

export type TabsVariant = 'pill' | 'underline';

/** One tab. */
export interface TabOption {
    /** Identity: matched against `value`, reported in `hmi-change` and naming the tab's slots. */
    value: string;
    /** The tab text: plain text, or the fallback of the `label-<value>` slot. */
    label: string;
    /** Text of a trailing badge: plain text, or the fallback of the `badge-<value>` slot. */
    badge?: string;
    /** The badge's variant. @default 'primary' on the active tab, else 'default' */
    badgeVariant?: BadgeVariant;
}

/** Detail of `hmi-change`. */
export interface TabsChangeDetail {
    /** The `value` of the tab that was chosen. */
    value: string;
}

/**
 * Tab switcher with an animated active indicator. It is the tab strip only:
 * switching the panels is up to you, keyed on `value`.
 *
 * A tab's `label` is text. For richer content, slot an element named
 * `label-<value>`; an icon is an element slotted as `icon-<value>`. A badge is
 * `badge` text, or content slotted as `badge-<value>` inside the pill, or an
 * element slotted as `end-<value>` in its place. The badge is `primary` on the
 * active tab and `default` on the others, unless `badgeVariant` says otherwise.
 *
 * It is controlled: choosing a tab fires `hmi-change` and the element keeps
 * showing the old one until you set `value`. The tabs are one tab stop; Arrow
 * Left and Right, Home and End move focus and choose. An id cannot point across
 * the shadow boundary, so wire your panels to `value` yourself.
 *
 * @tag hmi-tabs
 * @slot label-<value> - Rich label for the tab with that value.
 * @slot icon-<value> - Icon for the tab with that value.
 * @slot badge-<value> - Rich content inside the badge of the tab with that value.
 * @slot end-<value> - Replaces the badge of the tab with that value.
 * @csspart base - The `role="tablist"` row.
 * @csspart indicator - The sliding marker behind (pill) or under (underline) the active tab.
 * @csspart tab - A tab. The active one has `data-active`.
 * @csspart icon - A tab's icon.
 * @csspart label - A tab's label.
 * @csspart badge - A tab's `<hmi-badge>`.
 * @fires hmi-change - A tab was chosen. `detail` is `{ value }`.
 *
 * @example
 * const tabs = document.querySelector('hmi-tabs');
 * tabs.options = [{ value: 'all', label: 'All' }, { value: 'mine', label: 'Mine', badge: '3' }];
 * tabs.value = 'all';
 * tabs.addEventListener('hmi-change', (e) => { tabs.value = e.detail.value; });
 */
@customElement('hmi-tabs')
export class HmiTabs extends LitElement {
    static override styles = [baseStyles, styles];

    /** The tabs. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor options: TabOption[] =
        [];

    /** The `value` of the active tab. The element never changes it. With none, no tab is active. */
    @property() accessor value: string | undefined;

    /** Visual style. @default 'pill' */
    @property({ reflect: true }) accessor variant: TabsVariant = 'pill';

    /** The name of the tab list. */
    @property() accessor label: string | undefined;

    @query('.tabs') private accessor base!: HTMLElement | null;

    @query('.indicator') private accessor marker!: HTMLElement | null;

    #observer: ResizeObserver | undefined;

    override connectedCallback(): void {
        super.connectedCallback();
        if (isServer) return;
        this.#observer = new ResizeObserver(() => this.#measure());
        if (this.base) this.#observer.observe(this.base);
    }

    override disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = undefined;
        super.disconnectedCallback();
    }

    protected override firstUpdated(): void {
        if (this.base) this.#observer?.observe(this.base);
    }

    protected override updated(): void {
        this.#measure();
    }

    /**
     * Move the indicator under the active tab. It sets the indicator's own style
     * directly: a reactive property would schedule a second render after every
     * update, only to say where a box is.
     */
    #measure(): void {
        const base = this.base;
        const marker = this.marker;
        if (!base || !marker) return;
        const active = base.querySelector<HTMLElement>('[data-active="true"]');
        if (!active) {
            marker.style.opacity = '0';
            return;
        }
        const wr = base.getBoundingClientRect();
        const ar = active.getBoundingClientRect();
        marker.style.transform = `translateX(${ar.left - wr.left}px)`;
        marker.style.width = `${ar.width}px`;
        marker.style.opacity = '1';
    }

    #choose(value: string): void {
        if (value === this.value) return;
        emit<TabsChangeDetail>(this, 'hmi-change', { value });
    }

    #onKeydown(event: KeyboardEvent, index: number): void {
        const count = this.options.length;
        let target: number;
        if (event.key === 'ArrowRight') target = (index + 1) % count;
        else if (event.key === 'ArrowLeft')
            target = (index - 1 + count) % count;
        else if (event.key === 'Home') target = 0;
        else if (event.key === 'End') target = count - 1;
        else return;
        event.preventDefault();
        this.renderRoot
            .querySelectorAll<HTMLElement>('[part~="tab"]')
            [target]?.focus();
        const option = this.options[target];
        if (option) this.#choose(option.value);
    }

    override render() {
        // One tab stop: the active tab, or the first when none is.
        const tabbable = Math.max(
            0,
            this.options.findIndex((o) => o.value === this.value),
        );
        return html`<div
            part="base"
            class="tabs"
            role="tablist"
            aria-label=${this.label ?? nothing}
        >
            <span
                part="indicator"
                class="indicator"
                aria-hidden="true"
            ></span>
            ${this.options.map((option, index) => {
                const active = option.value === this.value;
                const badgeVariant =
                    option.badgeVariant ?? (active ? 'primary' : 'default');
                return html`<button
                    type="button"
                    part="tab"
                    class="tab"
                    role="tab"
                    aria-selected=${active}
                    tabindex=${index === tabbable ? 0 : -1}
                    data-active=${active}
                    @click=${() => this.#choose(option.value)}
                    @keydown=${(e: KeyboardEvent) => this.#onKeydown(e, index)}
                >
                    <span part="icon" class="icon" aria-hidden="true" hidden
                        ><slot
                            name=${`icon-${option.value}`}
                            @slotchange=${(e: Event) => toggleEmpty(e, false)}
                        ></slot
                    ></span>
                    <span part="label" class="label"
                        ><slot name=${`label-${option.value}`}>${option.label}</slot></span
                    >
                    <slot name=${`end-${option.value}`}>
                        <hmi-badge
                            part="badge"
                            variant=${badgeVariant}
                            ?hidden=${!option.badge}
                            ><slot
                                name=${`badge-${option.value}`}
                                @slotchange=${(e: Event) => toggleEmpty(e, !!option.badge)}
                                >${option.badge}</slot
                            ></hmi-badge
                        >
                    </slot>
                </button>`;
            })}
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-tabs': HmiTabs;
    }
}
