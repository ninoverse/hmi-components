import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './visually-hidden.styles.js';

/**
 * Hides its content visually while keeping it available to assistive
 * technology (the standard `sr-only` clip technique). Use it for labels,
 * headings and live-region text that sighted users don't need.
 *
 * The host is the hidden box. There is no `as` property: wrap the host in the
 * element you need, such as `<h2><hmi-visually-hidden>Title</hmi-visually-hidden></h2>`,
 * so the heading or label keeps its semantics.
 *
 * @tag hmi-visually-hidden
 * @slot - The content that stays available to assistive technology.
 *
 * @example
 * <button><svg aria-hidden="true">…</svg><hmi-visually-hidden>Search</hmi-visually-hidden></button>
 */
@customElement('hmi-visually-hidden')
export class HmiVisuallyHidden extends LitElement {
    static override styles = [baseStyles, styles];

    override render() {
        return html`<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-visually-hidden': HmiVisuallyHidden;
    }
}
