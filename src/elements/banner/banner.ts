import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type StatusVariant, statusIcon } from '../shared/status-icon.js';
import { styles } from './banner.styles.js';

export type BannerVariant = StatusVariant;

/** The tone screen readers hear first, by variant, unless `variant-label` is set. */
const VARIANT_LABELS: Record<BannerVariant, string> = {
    info: 'Info:',
    success: 'Success:',
    warning: 'Warning:',
    danger: 'Error:',
};

/** Detail of `hmi-dismiss`: empty, the event carries no data. */
export type BannerDismissDetail = Record<string, never>;

/**
 * Full-width, persistent status banner with a variant-matched icon, an
 * optional title and action, and an optional dismiss button. The body is the
 * default slot.
 *
 * `danger` and `warning` set `role="alert"` on the container, the others
 * `role="status"`, as in v5, whether the banner is there on page load or
 * added later. Screen readers hear the tone before the message, such as
 * "Warning:", since the icon and the colour only show it. There is no `title`
 * property: `title` is the native tooltip attribute on every element, so the
 * heading is the `title` slot only. A variant outside the four is painted,
 * named and announced as `info`.
 *
 * With `dismissible`, the X button fires the cancelable `hmi-dismiss`. Unless a
 * listener calls `preventDefault()`, the banner then sets `hidden` on itself;
 * remove the attribute to show it again. Focus was on the X button, so it falls
 * back to the page: a listener should move it on, such as to the heading of the
 * content the banner sat above.
 *
 * @tag hmi-banner
 * @slot - Message body.
 * @slot icon - Replaces the built-in status icon.
 * @slot title - Bold heading above the body.
 * @slot action - Trailing action, such as a button.
 * @fires {CustomEvent<BannerDismissDetail>} hmi-dismiss - The dismiss button was clicked. Cancelable: without `preventDefault()` the banner hides itself.
 * @csspart base - The banner container.
 * @csspart icon - The icon wrapper.
 * @csspart dismiss - The dismiss button.
 *
 * @example
 * <hmi-banner variant="success" dismissible><span slot="title">Saved</span>All set.</hmi-banner>
 */
@customElement('hmi-banner')
export class HmiBanner extends LitElement {
    static override styles = [baseStyles, styles];

    /** Tone, which also selects the built-in icon and the ARIA role. @default 'info' */
    @property({ reflect: true }) accessor variant: BannerVariant = 'info';

    /** The tone screen readers hear before the message; empty uses the variant's: "Info:", "Success:", "Warning:" or "Error:". @default '' */
    @property({ attribute: 'variant-label' }) accessor variantLabel = '';

    /** Shows the dismiss button. @default false */
    @property({ type: Boolean, reflect: true }) accessor dismissible = false;

    /** Accessible label of the dismiss button. @default 'Dismiss' */
    @property({ attribute: 'dismiss-label' }) accessor dismissLabel = 'Dismiss';

    #dismiss(): void {
        if (
            emit<BannerDismissDetail>(
                this,
                'hmi-dismiss',
                {},
                { cancelable: true },
            )
        ) {
            this.hidden = true;
        }
    }

    override render() {
        const role =
            this.variant === 'danger' || this.variant === 'warning'
                ? 'alert'
                : 'status';
        const tone =
            this.variantLabel ||
            (VARIANT_LABELS[this.variant] ?? VARIANT_LABELS.info);
        return html`
            <div part="base" class="base" role=${role}>
                <span part="icon" class="icon" aria-hidden="true">
                    <slot name="icon">${statusIcon(this.variant)}</slot>
                </span>
                <div class="content">
                    <span class="tone">${tone}</span>
                    <slot name="title"></slot>
                    <slot></slot>
                </div>
                <slot name="action"></slot>
                ${
                    this.dismissible
                        ? html`<button
                              part="dismiss"
                              class="dismiss"
                              type="button"
                              aria-label=${this.dismissLabel}
                              @click=${this.#dismiss}
                          >
                              <svg
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  aria-hidden="true"
                              >
                                  <path d="M4 4l8 8M12 4l-8 8" />
                              </svg>
                          </button>`
                        : nothing
                }
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-banner': HmiBanner;
    }
}
