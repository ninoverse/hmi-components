import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './blockquote.styles.js';

/**
 * Block quotation with a primary accent rule on the leading edge and an
 * optional attribution below. The quote is the default slot.
 *
 * There is no `cite` property: the attribution is the `cite` slot only, so the
 * native `cite` URL attribute is not used. Give the slotted element
 * `<footer slot="cite">` when the attribution should be a footer.
 *
 * @tag hmi-blockquote
 * @slot - The quotation body.
 * @slot cite - Attribution shown below the quote.
 * @csspart base - The inner `<blockquote>`.
 * @csspart body - The paragraph around the quotation.
 *
 * @example
 * <hmi-blockquote>That brain of mine is something more than mortal.<span slot="cite">Ada Lovelace</span></hmi-blockquote>
 */
@customElement('hmi-blockquote')
export class HmiBlockquote extends LitElement {
    static override styles = [baseStyles, styles];

    override render() {
        return html`
            <blockquote part="base" class="base">
                <p part="body" class="body"><slot></slot></p>
                <slot name="cite"></slot>
            </blockquote>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-blockquote': HmiBlockquote;
    }
}
