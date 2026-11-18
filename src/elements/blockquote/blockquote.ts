import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './blockquote.styles.js';

/**
 * Block quotation with a primary accent rule on the leading edge and an
 * optional attribution below. The quote is the default slot, and may hold
 * text or block content such as several `<p>`.
 *
 * The element is a `<figure>`: the quote is its `<blockquote>`, and the `cite`
 * slot sits in its `<figcaption>`, outside the quotation, so assistive
 * technology does not read the attribution as quoted words. Slot a `<span>`
 * there, not a `<footer>`: a footer slotted into the element is a page-level
 * landmark, so each quote would add one.
 *
 * The attribution is the `cite` slot. The URL of the quote's source, the native
 * `cite` attribute of `<blockquote>`, is the `source` property.
 *
 * Scripts without a true italic, such as Arabic, Hebrew and CJK, are set
 * upright, read from the host's `lang`.
 *
 * @tag hmi-blockquote
 * @slot - The quotation body.
 * @slot cite - Attribution shown below the quote.
 * @csspart base - The `<figure>` that paints the quote.
 * @csspart body - The `<blockquote>` around the quotation.
 * @cssprop --blockquote-accent - The accent rule's colour: `--ref-primary-40` from the theme constants, else `--primary`.
 *
 * @example
 * <hmi-blockquote>That brain of mine is something more than mortal.<span slot="cite">Ada Lovelace</span></hmi-blockquote>
 */
@customElement('hmi-blockquote')
export class HmiBlockquote extends LitElement {
    static override styles = [baseStyles, styles];

    /** URL of the quotation's source, rendered as the native `cite` attribute. */
    @property({ reflect: true }) accessor source = '';

    override render() {
        return html`
            <figure part="base" class="base">
                <blockquote
                    part="body"
                    class="body"
                    cite=${this.source || nothing}
                ><slot></slot></blockquote>
                <figcaption class="caption"><slot name="cite"></slot></figcaption>
            </figure>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-blockquote': HmiBlockquote;
    }
}
