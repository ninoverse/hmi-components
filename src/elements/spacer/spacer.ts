import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './spacer.styles.js';

export type SpacerSize = 'small' | 'medium' | 'large';
export type SpacerAxis = 'vertical' | 'horizontal';

/**
 * Inserts empty space between siblings. A fixed `size` applies on the chosen
 * `axis` (height when vertical, width when horizontal); `grow` instead
 * expands to fill the free space of a flex container, pushing its neighbours
 * apart. Purely presentational: the host sets `aria-hidden="true"` unless you
 * set `aria-hidden` yourself.
 *
 * @tag hmi-spacer
 *
 * @example
 * <hmi-spacer size="large"></hmi-spacer>
 * @example
 * <hmi-flex><span>Left</span><hmi-spacer grow></hmi-spacer><span>Right</span></hmi-flex>
 */
@customElement('hmi-spacer')
export class HmiSpacer extends LitElement {
    static override styles = [baseStyles, styles];

    /** Length of the gap: 1, 2 or 3 base units. Ignored with `grow`. @default 'medium' */
    @property({ reflect: true }) accessor size: SpacerSize = 'medium';

    /** Direction the space applies along. Ignored with `grow`. @default 'vertical' */
    @property({ reflect: true }) accessor axis: SpacerAxis = 'vertical';

    /** Fills the free space of a flex container instead of a fixed size. @default false */
    @property({ type: Boolean, reflect: true }) accessor grow = false;

    override connectedCallback(): void {
        super.connectedCallback();
        if (!this.hasAttribute('aria-hidden')) {
            this.setAttribute('aria-hidden', 'true');
        }
    }

    override render() {
        return html``;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-spacer': HmiSpacer;
    }
}
