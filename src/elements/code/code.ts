import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './code.styles.js';

/**
 * Monospace code display, inline by default or as a block when `block` is set.
 *
 * @tag hmi-code
 * @slot - Code content.
 * @csspart base - The inline `<code>`, or the `<pre>` when `block` is set.
 * @csspart content - The inner `<code>`; block mode only.
 */
@customElement('hmi-code')
export class HmiCode extends LitElement {
    static override styles = [baseStyles, styles];

    /** Render as a block (`<pre><code>`) instead of inline `<code>`. @default false */
    @property({ type: Boolean, reflect: true }) accessor block = false;

    override render() {
        /* The block branch stays on one line: `white-space: pre` keeps every
           character between the tags, so any indentation written here would
           show up in front of the consumer's snippet. */
        return this.block
            ? html`<pre part="base" class="base"><code part="content" class="content"><slot></slot></code></pre>`
            : html`<code part="base" class="base"><slot></slot></code>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-code': HmiCode;
    }
}
