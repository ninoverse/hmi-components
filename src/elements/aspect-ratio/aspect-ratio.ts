import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './aspect-ratio.styles.js';

/* A digit-only attribute, such as `2` or `1.5`, is a number; anything else,
   such as `16/9`, stays a string. */
const ratioConverter = {
    fromAttribute: (value: string | null): number | string | null =>
        value !== null && /^\d+(\.\d+)?$/.test(value) ? Number(value) : value,
};

/* A positive number, or two around a slash. */
const RATIO = /^\s*(\d*\.?\d+)\s*(?:\/\s*(\d*\.?\d+)\s*)?$/;

/* The ratio as CSS draws it, or the default 1 for anything CSS would drop or
   draw as no ratio at all: empty, missing, zero, `3:2`. Parsed here rather
   than left to the CSSOM, which ignores an invalid value and so keeps the last
   valid one, and on the server writes it as it is. */
function cssRatio(value: unknown): string {
    const match = RATIO.exec(String(value));
    if (!match) return '1';
    const width = Number(match[1]);
    const height = match[2] === undefined ? 1 : Number(match[2]);
    if (!(width > 0 && height > 0)) return '1';
    return match[2] === undefined ? String(width) : `${width}/${height}`;
}

/**
 * Locks its content to a width-to-height ratio and clips the first child to
 * fill the frame, so images and embeds keep their proportions at any width.
 *
 * `ratio` is a positive number (`1.5`) or a CSS ratio string (`16/9`).
 * Anything else, such as `3:2`, an empty value or `0`, draws as the default
 * square. The ratio reaches the inner `base` element as an inline style,
 * written on the server too, so the frame has its height before any script
 * runs; nothing is written into the host's own `style`.
 *
 * The host is as wide as its container, as v5's frame was, unless its `style`
 * or a class sets a width. A `border-radius` or `border` on the host rounds
 * and clips the content, and a `height` on the host wins over the ratio.
 *
 * Put one child in the frame: only the first is sized, and the rest are
 * clipped from view but still read by screen readers and reached by Tab. Only
 * that child is sized, not what it holds: an image inside a link or a
 * `<picture>` needs its own `width: 100%; height: 100%; object-fit: cover`.
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

    /** Width over height: a positive number or a CSS ratio such as `16/9`. @default 1 */
    @property({ converter: ratioConverter }) accessor ratio: number | string =
        1;

    override render() {
        return html`<div
            part="base"
            class="base"
            style=${styleMap({ aspectRatio: cssRatio(this.ratio) })}
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
