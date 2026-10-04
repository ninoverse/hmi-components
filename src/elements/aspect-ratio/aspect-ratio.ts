import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './aspect-ratio.styles.js';

/* A digit-only attribute is a number (`1.5` stays a string for the CSSOM, which
   reads it the same), anything else such as `16/9` is passed through. */
const ratioConverter = {
    fromAttribute: (value: string | null): number | string | null =>
        value !== null && /^\d+(\.\d+)?$/.test(value) ? Number(value) : value,
};

/**
 * Locks its content to a width-to-height ratio and clips the first child to
 * fill the frame, so images and embeds keep their proportions at any width.
 *
 * `ratio` is a number (`1.5`) or a CSS ratio string (`16/9`). It reaches the
 * inner `base` element through the CSSOM, so an invalid value is ignored and
 * nothing is written into the host's own `style`.
 *
 * @tag hmi-aspect-ratio
 * @slot - The content; its first child is stretched to fill the frame with `object-fit: cover`.
 * @csspart base - The frame that holds the ratio and clips its content.
 *
 * @example
 * <hmi-aspect-ratio ratio="16/9"><img src="…" alt="…" /></hmi-aspect-ratio>
 */
@customElement('hmi-aspect-ratio')
export class HmiAspectRatio extends LitElement {
    static override styles = [baseStyles, styles];

    /** Width over height: a number or a CSS ratio such as `16/9`. @default 1 */
    @property({ converter: ratioConverter }) accessor ratio: number | string =
        1;

    override render() {
        return html`<div
            part="base"
            class="base"
            style=${styleMap({ aspectRatio: String(this.ratio) })}
        >
            <slot></slot>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-aspect-ratio': HmiAspectRatio;
    }
}
