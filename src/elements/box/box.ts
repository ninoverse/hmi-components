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
 * surface. The `leaf` radius mirrors the asymmetric corners of `hmi-card`, and
 * like every corner here it is logical, so it mirrors in right-to-left text.
 *
 * The host is the box, and the only one: the shadow root holds just a slot,
 * so there are no parts. Put `role`, `class` and `style` on the host. There is
 * no `as` property, so give the host a `role`, or wrap the content in the
 * semantic element you need.
 *
 * A box with a `background` gives what it holds the surface text colours, even
 * inside an ink or accent card; a box without one lets the card's colours
 * through.
 *
 * The radius rounds the box's own background and border, not its content: an
 * image or a coloured strip that reaches the edge keeps square corners. Add
 * `style="overflow: hidden"` to clip the content to the radius, which also
 * clips a child's focus ring and shadow at the edge.
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
