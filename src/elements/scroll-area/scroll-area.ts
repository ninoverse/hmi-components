import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './scroll-area.styles.js';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

/* A digit-only attribute is a pixel count, as a React number was. */
const maxHeightConverter = {
    fromAttribute: (value: string | null): number | string | null =>
        value !== null && /^\d+(\.\d+)?$/.test(value) ? Number(value) : value,
};

/**
 * A constrained, scrollable container with themed scrollbars. `orientation`
 * picks the axis that scrolls (the other is hidden). Limit its size with
 * `maxHeight` or a CSS `max-height` on the host for a vertical area, or with a
 * `width` or `max-width` on the host for a horizontal one.
 *
 * The scroller is an inner `base` element that inherits the host's
 * `max-height`, so both routes work. A `height` on the host does not make it
 * scroll: use `max-height`.
 *
 * @tag hmi-scroll-area
 * @slot - The scrollable content.
 * @csspart base - The scroll container.
 *
 * @example
 * <hmi-scroll-area max-height="160">…</hmi-scroll-area>
 */
@customElement('hmi-scroll-area')
export class HmiScrollArea extends LitElement {
    static override styles = [baseStyles, styles];

    /** Axis that scrolls; the other is hidden. @default 'vertical' */
    @property({ reflect: true }) accessor orientation: ScrollAreaOrientation =
        'vertical';

    /** Height at which a vertical area starts to scroll: a number is pixels, a string is any CSS length. */
    @property({ attribute: 'max-height', converter: maxHeightConverter })
    accessor maxHeight: number | string | undefined;

    override render() {
        const { maxHeight } = this;
        return html`<div
            part="base"
            class="base"
            style=${styleMap({
                maxHeight:
                    typeof maxHeight === 'number'
                        ? `${maxHeight}px`
                        : maxHeight,
            })}
        >
            <slot></slot>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-scroll-area': HmiScrollArea;
    }
}
