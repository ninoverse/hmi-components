import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './gauge.styles.js';

// The point on a circle at an angle in degrees, measured from the +x axis,
// counter-clockwise (so y is negated for the screen).
const polar = (c: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [c + r * Math.cos(rad), c - r * Math.sin(rad)] as const;
};

// An arc from `startDeg` down to `endDeg`: clockwise on screen. The dial is a
// half circle, so no arc is ever a large one.
const arcPath = (c: number, r: number, startDeg: number, endDeg: number) => {
    const [x1, y1] = polar(c, r, startDeg);
    const [x2, y2] = polar(c, r, endDeg);
    return `M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}`;
};

// The room under the dial for the caption, in px.
const CAPTION_ROOM = 36;

/**
 * Semicircular gauge: a value arc fills a 180° track from left to right, with
 * a caption under the dial. A pure SVG, with no dependencies.
 *
 * `value` is clamped to `min` and `max`. The caption is the `caption` slot, and
 * with nothing slotted it is the value itself; `hide-value` removes that default,
 * so the gauge is just the dial. The caption is real text, set in the display
 * font under the dial. The size is `size` in px, the width: the height follows
 * from it, and grows by the caption's room when there is one.
 *
 * @tag hmi-gauge
 * @slot caption - The text under the dial. Defaults to the value.
 * @csspart base - The wrapper around the dial and its caption.
 * @csspart track - The unfilled arc.
 * @csspart value - The filled arc, present once the value is above `min`.
 * @csspart caption - The box under the dial, present with a caption.
 *
 * @example
 * <hmi-gauge value="72"><span slot="caption">72%</span></hmi-gauge>
 */
@customElement('hmi-gauge')
export class HmiGauge extends LitElement {
    static override styles = [baseStyles, styles];

    /** The current value, clamped to `min` and `max`. @default 0 */
    @property({ type: Number }) accessor value = 0;

    /** The lower end of the scale. @default 0 */
    @property({ type: Number }) accessor min = 0;

    /** The upper end of the scale. @default 100 */
    @property({ type: Number }) accessor max = 100;

    /** The value arc's colour: any CSS colour, including a token. @default 'var(--primary)' */
    @property() accessor color = 'var(--primary)';

    /** The track's colour: any CSS colour, including a token. @default 'var(--surface-container-highest)' */
    @property({ attribute: 'track-color' }) accessor trackColor =
        'var(--surface-container-highest)';

    /** The arc's thickness, as a fraction of the radius (0 to 1). @default 0.22 */
    @property({ type: Number }) accessor thickness = 0.22;

    /** The width in px; the height follows from it. @default 200 */
    @property({ type: Number }) accessor size = 200;

    /** Removes the value as the default caption: with no slotted caption, the gauge is just the dial. */
    @property({ type: Boolean, attribute: 'hide-value' }) accessor hideValue =
        false;

    /** The accessible name of the gauge. Defaults to `Gauge: {value} of {max}`. */
    @property() accessor label = '';

    @state() private accessor hasCaption = false;

    override render() {
        const { size, min, max, value } = this;
        const frac = Math.max(0, Math.min((value - min) / (max - min || 1), 1));
        const c = size / 2;
        const r = c - 4;
        const stroke = r * this.thickness;
        const innerR = r - stroke / 2;
        // The dial's baseline is at `c`; the arc's thick end, and a margin, go below it.
        const dialH = c + stroke / 2 + 4;
        const showCaption = this.hasCaption || !this.hideValue;
        return html`<div
            part="base"
            class="base"
            style=${styleMap({
                width: `${size}px`,
                height: `${dialH + (showCaption ? CAPTION_ROOM : 0)}px`,
            })}
        >
            <svg
                class="chart"
                width=${size}
                height=${dialH}
                viewBox="0 0 ${size} ${dialH}"
                role="img"
                aria-label=${this.label || `Gauge: ${value} of ${max}`}
            >
                <path
                    part="track"
                    class="track"
                    d=${arcPath(c, innerR, 180, 0)}
                    stroke-width=${stroke}
                    style=${styleMap({ stroke: this.trackColor })}
                />
                ${
                    frac > 0
                        ? svg`<path
                              part="value"
                              class="arc"
                              d=${arcPath(c, innerR, 180, 180 - frac * 180)}
                              stroke-width=${stroke}
                              style=${styleMap({ stroke: this.color })}
                          />`
                        : nothing
                }
            </svg>
            <div
                part="caption"
                class="caption"
                ?hidden=${!showCaption}
                style=${styleMap({ top: `${c}px` })}
            >
                <slot
                    name="caption"
                    @slotchange=${(e: Event) => {
                        this.hasCaption =
                            (e.target as HTMLSlotElement).assignedNodes()
                                .length > 0;
                    }}
                    >${this.hideValue ? nothing : value}</slot
                >
            </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-gauge': HmiGauge;
    }
}
