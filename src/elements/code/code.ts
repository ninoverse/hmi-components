import { html, isServer, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './code.styles.js';

/**
 * Monospace code display, inline by default or as a block when `block` is set.
 *
 * Code reads left to right, isolated from the text around it, so a
 * right-to-left page doesn't reorder its punctuation; a `dir` on the element
 * gives it another direction. Inline code wraps to its line, and a block
 * scrolls sideways when a line is wider than its box. A block that scrolls is
 * a tab stop, so the arrow keys can scroll it; one that fits is not.
 *
 * A block keeps the snippet's whitespace as written. A native `<pre>` drops a
 * newline right after its opening tag, but `hmi-code` cannot, so start the
 * snippet on the tag's line: `<hmi-code block>const x = 1;` rather than a new
 * line, indented.
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

    /** Whether the block's content is wider than its box. */
    @state() private accessor scrolls = false;

    @query('pre') private accessor pre!: HTMLPreElement | null;

    #observer: ResizeObserver | undefined;

    override connectedCallback() {
        super.connectedCallback();
        if (isServer) return;
        this.#observer = new ResizeObserver(() => this.#measure());
        if (this.hasUpdated) this.#observe();
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.#observer?.disconnect();
        this.#observer = undefined;
    }

    protected override updated(changed: PropertyValues<this>) {
        if (changed.has('block')) this.#observe();
    }

    /* The `<pre>` resizes with its box and the inner `<code>` with its
       content: either can make the block start or stop scrolling. */
    #observe() {
        const observer = this.#observer;
        if (!observer) return;
        observer.disconnect();
        const pre = this.pre;
        if (!pre) {
            this.scrolls = false;
            return;
        }
        observer.observe(pre);
        const content = pre.firstElementChild;
        if (content) observer.observe(content);
    }

    #measure() {
        const pre = this.pre;
        this.scrolls = pre ? pre.scrollWidth > pre.clientWidth : false;
    }

    override render() {
        /* The block branch stays on one line: `white-space: pre` keeps every
           character between the tags, so any indentation written here would
           show up in front of the consumer's snippet. */
        return this.block
            ? html`<pre part="base" class="base" tabindex=${this.scrolls ? '0' : nothing}><code part="content" class="content"><slot></slot></code></pre>`
            : html`<code part="base" class="base"><slot></slot></code>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-code': HmiCode;
    }
}
