import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './spinner.styles.js';

export type SpinnerSize = 'small' | 'medium' | 'large';

/**
 * Indeterminate loading spinner with `role="status"`.
 *
 * `label` is announced, never drawn, so it stays a string property forwarded
 * to `aria-label` on the ring rather than becoming a slot.
 *
 * @tag hmi-spinner
 * @csspart base - The ring; carries `role="status"` and the accessible label.
 */
@customElement('hmi-spinner')
export class HmiSpinner extends LitElement {
    static override styles = [baseStyles, styles];

    /** Diameter preset. @default 'medium' */
    @property({ reflect: true }) accessor size: SpinnerSize = 'medium';

    /** Accessible status label. @default 'Loading' */
    @property() accessor label = 'Loading';

    override render() {
        return html`<span
            part="base"
            class="base"
            role="status"
            aria-label=${this.label}
        ></span>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-spinner': HmiSpinner;
    }
}
