import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { type StatusVariant, statusIcon } from '../shared/status-icon.js';
import { styles } from './alert.styles.js';

export type AlertVariant = StatusVariant;

/** The tone screen readers hear first, by variant, unless `variant-label` is set. */
const VARIANT_LABELS: Record<AlertVariant, string> = {
    info: 'Info:',
    success: 'Success:',
    warning: 'Warning:',
    danger: 'Error:',
};

/**
 * Inline message with a variant-matched icon, an optional title and an
 * optional trailing action. The body is the default slot.
 *
 * There is no `title` property: `title` is the native tooltip attribute on
 * every element, so the heading is the `title` slot only. The element carries
 * no ARIA role; add `role` to the host when the message must be announced.
 * Screen readers hear the tone before the message, such as "Error:", since the
 * icon and the colour only show it.
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

    /** The tone screen readers hear before the message; empty uses the variant's: "Info:", "Success:", "Warning:" or "Error:". @default '' */
    @property({ attribute: 'variant-label' }) accessor variantLabel = '';

    override render() {
        const tone =
            this.variantLabel ||
            (VARIANT_LABELS[this.variant] ?? VARIANT_LABELS.info);
        return html`
            <div part="base" class="base">
                <span part="icon" class="icon">
                    <slot name="icon">${statusIcon(this.variant)}</slot>
                </span>
                <div class="content">
                    <span class="tone">${tone}</span>
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
