import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { paletteColor } from '../shared/chart.js';
import { toggleEmpty } from '../shared/dom.js';
import { styles } from './donut-chart.styles.js';

/** One segment of a donut chart. */
export interface DonutChartSegment {
    /** The segment name. */
    label: string;
    /** The segment's magnitude: its share of the total sets the arc size. */
    value: number;
    /** The segment colour: any CSS colour, including a token such as `var(--primary)`. Defaults to the next colour of the default palette. */
    color?: string;
}

// The point on a circle at an angle in degrees, 0 at 12 o'clock, clockwise.
const polar = (c: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [c + r * Math.cos(rad), c + r * Math.sin(rad)] as const;
};

// The widest sweep an arc is drawn with: a full 360° arc starts and ends on the
// same point, and an SVG arc between identical points draws nothing.
const MAX_SWEEP = 359.99;

/**
 * Donut (ring) chart: each segment is an arc sized by its share of the total,
 * with a hole in the middle for a summary. A pure SVG, with no dependencies.
 * With no `segments`, or a total of zero, nothing is rendered.
 *
 * Segments with no `color` take the default palette, the primary, tertiary,
 * secondary, success, warning and error tokens in turn, so a legend beside the
 * chart has to list the same colours. The slotted `center-label` fills the hole,
 * typically a total, and is real text: unlike v5, it is read by assistive
 * technology. The size is `size` in px, the width and the height both.
 *
 * @tag hmi-donut-chart
 * @slot center-label - The content of the hole.
 * @csspart base - The wrapper around the chart and its centre.
 * @csspart segment - One arc.
 * @csspart center - The box over the hole, present with a `center-label`.
 *
 * @example
 * const donut = document.querySelector('hmi-donut-chart');
 * donut.segments = [{ label: 'Direct', value: 45 }, { label: 'Search', value: 30 }];
 */
@customElement('hmi-donut-chart')
export class HmiDonutChart extends LitElement {
    static override styles = [baseStyles, styles];

    /** The segments around the ring. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor segments: DonutChartSegment[] = [];

    /** The width and height in px. @default 220 */
    @property({ type: Number }) accessor size = 220;

    /** The ring's thickness, as a fraction of the radius (0 to 1). @default 0.32 */
    @property({ type: Number }) accessor thickness = 0.32;

    /** The gap between segments, in degrees. @default 2 */
    @property({ type: Number }) accessor gap = 2;

    /** The accessible name of the chart. @default 'Donut chart' */
    @property() accessor label = 'Donut chart';

    override render() {
        const { size, thickness, gap } = this;
        const total = this.segments.reduce(
            (sum, s) => sum + Math.max(0, s.value),
            0,
        );
        if (this.segments.length === 0 || total <= 0) return nothing;
        const c = size / 2;
        const r = c - 2;
        const innerR = r * (1 - thickness);
        let cursor = 0;
        const arcs = this.segments.map((s, i) => {
            const sweep = (Math.max(0, s.value) / total) * 360;
            const start = cursor + gap / 2;
            const end = Math.min(cursor + sweep - gap / 2, start + MAX_SWEEP);
            cursor += sweep;
            const large = end - start > 180 ? 1 : 0;
            const [ox1, oy1] = polar(c, r, start);
            const [ox2, oy2] = polar(c, r, end);
            const [ix2, iy2] = polar(c, innerR, end);
            const [ix1, iy1] = polar(c, innerR, start);
            const d = [
                `M${ox1},${oy1}`,
                `A${r},${r} 0 ${large} 1 ${ox2},${oy2}`,
                `L${ix2},${iy2}`,
                `A${innerR},${innerR} 0 ${large} 0 ${ix1},${iy1}`,
                'Z',
            ].join(' ');
            return { d, color: s.color ?? paletteColor(i) };
        });
        return html`<div
            part="base"
            class="base"
            style=${styleMap({ width: `${size}px`, height: `${size}px` })}
        >
            <svg
                class="chart"
                width=${size}
                height=${size}
                viewBox="0 0 ${size} ${size}"
                role="img"
                aria-label=${this.label}
            >
                ${arcs.map(
                    (a) =>
                        svg`<path
                            part="segment"
                            class="segment"
                            d=${a.d}
                            style=${styleMap({ fill: a.color })}
                        />`,
                )}
            </svg>
            <div
                part="center"
                class="center"
                hidden
                style=${styleMap({
                    left: `${c - innerR}px`,
                    top: `${c - innerR}px`,
                    width: `${innerR * 2}px`,
                    height: `${innerR * 2}px`,
                })}
            >
                <slot
                    name="center-label"
                    @slotchange=${(e: Event) => toggleEmpty(e, false)}
                ></slot>
            </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-donut-chart': HmiDonutChart;
    }
}
