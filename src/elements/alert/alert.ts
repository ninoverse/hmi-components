import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './alert.styles.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

/* Library-owned status icons, shown while the `icon` slot is empty. */
const ICON_PATHS: Record<AlertVariant, readonly string[]> = {
    info: ['M10 9v5M10 6.5v.01'],
    success: ['M6.5 10l2.5 2.5 4.5-5'],
    warning: ['M10 2.5L18 16.5H2L10 2.5z', 'M10 8v4M10 14.5v.01'],
    danger: ['M10 6v4M10 13.5v.01'],
};

const icon = (variant: AlertVariant) =>
    html`<svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
    >
        ${variant === 'warning' ? nothing : svg`<circle cx="10" cy="10" r="8" />`}
        ${(ICON_PATHS[variant] ?? ICON_PATHS.info).map(
            (d) => svg`<path d=${d} />`,
        )}
    </svg>`;

/**
 * Inline message with a variant-matched icon, an optional title and an
 * optional trailing action. The body is the default slot.
 *
 * There is no `title` property: `title` is the native tooltip attribute on
 * every element, so the heading is the `title` slot only. The element carries
 * no ARIA role; add `role` to the host when the message must be announced.
 *
 * @tag hmi-alert
 * @slot - Message body.
 * @slot icon - Replaces the built-in status icon.
 * @slot title - Bold heading above the body.
 * @slot action - Trailing action, such as a button or dismiss control.
 * @csspart base - The alert container.
 * @csspart icon - The icon wrapper.
 *
 * @example
 * <hmi-alert variant="warning"><span slot="title">Heads up</span>Disk almost full.</hmi-alert>
 */
@customElement('hmi-alert')
export class HmiAlert extends LitElement {
    static override styles = [baseStyles, styles];

    /** Tone, which also selects the built-in status icon. @default 'info' */
    @property({ reflect: true }) accessor variant: AlertVariant = 'info';

    override render() {
        return html`
            <div part="base" class="base">
                <span part="icon" class="icon">
                    <slot name="icon">${icon(this.variant)}</slot>
                </span>
                <div class="content">
                    <slot name="title"></slot>
                    <slot></slot>
                </div>
                <slot name="action"></slot>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-alert': HmiAlert;
    }
}
