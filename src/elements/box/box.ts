import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './box.styles.js';

export type BoxBackground =
    | 'none'
    | 'surface'
    | 'surface-variant'
    | 'surface-container'
    | 'surface-container-low'
    | 'surface-container-high';
export type BoxPadding = 'none' | 'small' | 'medium' | 'large';
export type BoxRadius = 'none' | 'small' | 'medium' | 'large' | 'full' | 'leaf';

/**
 * The foundational layout container. By default an unstyled block; background,
 * padding, radius and border are opt-in, so it composes under every other
 * surface. The `leaf` radius mirrors the asymmetric corners of `hmi-card`.
 *
 * The host is the box: put `role`, `class` and `style` on it. There is no `as`
 * property, so wrap the content in the semantic element you need.
 *
 * @tag hmi-box
 * @slot - Box content.
 *
 * @example
 * <hmi-box background="surface-container" padding="medium" radius="leaf" bordered>…</hmi-box>
 */
@customElement('hmi-box')
export class HmiBox extends LitElement {
    static override styles = [baseStyles, styles];

    /** Surface colour; also sets the matching text colour. @default 'none' */
    @property({ reflect: true }) accessor background: BoxBackground = 'none';

    /** Inner spacing preset. @default 'none' */
    @property({ reflect: true }) accessor padding: BoxPadding = 'none';

    /** Corner radius preset. @default 'none' */
    @property({ reflect: true }) accessor radius: BoxRadius = 'none';

    /** Draws a 1-unit outline-variant border. @default false */
    @property({ type: Boolean, reflect: true }) accessor bordered = false;

    override render() {
        return html`<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-box': HmiBox;
    }
}
