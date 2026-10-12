import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { chartStyles, extent, paletteColor } from '../shared/chart.js';
import { styles } from './radar-chart.styles.js';

/** One series of a radar chart. */
export interface RadarChartSeries {
    /** The series name. */
    name: string;
    /** One value per axis: its length should match the axes'. */
    data: readonly number[];
    /** The series colour: any CSS colour, including a token such as `var(--primary)`. Defaults to the next colour of the default palette. */
    color?: string;
}

// Space left around the polygon for the axis labels, in px.
const PAD = 36;

// The point on spoke `i` of `n` at distance `r` from the centre, `c`: the first
// spoke points up, and they follow clockwise.
const polar = (c: number, r: number, i: number, n: number) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [c + r * Math.cos(angle), c + r * Math.sin(angle)] as const;
};

/**
 * Radar (spider) chart: each series is a closed polygon over a polar grid of
 * concentric rings and radial spokes, one spoke per axis. A pure SVG, with no
 * dependencies. With fewer than three `axes`, or no values, nothing is rendered.
 *
 * The value range is 0, or the smallest value if lower, to the largest value,
 * unless `min` and `max` say otherwise. Series with no `color` take the default
 * palette, the primary, tertiary, secondary, success, warning and error tokens
 * in turn, so a legend beside the chart has to list the same colours. The size
 * is `size` in px, the width and the height both.
 *
 * @tag hmi-radar-chart
 * @csspart base - The `<svg>`.
 * @csspart ring - One concentric grid ring.
 * @csspart spoke - One radial spoke.
 * @csspart axis-label - One axis label.
 * @csspart area - One series polygon.
 *
 * @example
 * const radar = document.querySelector('hmi-radar-chart');
 * radar.axes = ['Speed', 'Power', 'Range'];
 * radar.series = [{ name: 'Alpha', data: [80, 65, 70] }];
 */
@customElement('hmi-radar-chart')
export class HmiRadarChart extends LitElement {
    static override styles = [baseStyles, chartStyles, styles];

    /** The axis labels, one per spoke. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor axes: string[] = [];

    /** The series to plot. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor series: RadarChartSeries[] = [];

    /** The width and height in px. @default 300 */
    @property({ type: Number }) accessor size = 300;

    /** The value at the centre. Defaults to 0, or the smallest value if lower. */
    @property({ type: Number }) accessor min: number | undefined;

    /** The value at the outer ring. Defaults to the largest value. */
    @property({ type: Number }) accessor max: number | undefined;

    /** The number of concentric grid rings. @default 4 */
    @property({ type: Number }) accessor rings = 4;

    /** The accessible name of the chart. @default 'Radar chart' */
    @property() accessor label = 'Radar chart';

    override render() {
        const { size, axes } = this;
        const n = axes.length;
        const values = this.series.flatMap((s) => s.data);
        if (n < 3 || values.length === 0) return nothing;
        const c = size / 2;
        const radius = c - PAD;
        const [dataLo, dataHi] = extent(values);
        const lo = this.min ?? Math.min(0, dataLo);
        const hi = this.max ?? dataHi;
        const span = hi - lo || 1;
        const ringPoints = (r: number) =>
            Array.from({ length: n }, (_, i) =>
                polar(c, r, i, n).join(','),
            ).join(' ');
        return html`<svg
            part="base"
            class="chart"
            width=${size}
            height=${size}
            viewBox="0 0 ${size} ${size}"
            role="img"
            aria-label=${this.label}
        >
            ${Array.from(
                { length: this.rings },
                (_, i) =>
                    svg`<polygon part="ring" class="ring" points=${ringPoints((radius * (i + 1)) / this.rings)} />`,
            )}
            ${axes.map((text, i) => {
                const [x, y] = polar(c, radius, i, n);
                const [lx, ly] = polar(c, radius + 16, i, n);
                return svg`<line part="spoke" class="spoke" x1=${c} y1=${c} x2=${x} y2=${y} />
                    <text
                        part="axis-label"
                        class="axis-label"
                        x=${lx}
                        y=${ly}
                        text-anchor="middle"
                        dominant-baseline="middle"
                    >${text}</text>`;
            })}
            ${this.series.map((s, si) => {
                const color = s.color ?? paletteColor(si);
                const points = s.data
                    .map((v, i) =>
                        polar(c, ((v - lo) / span) * radius, i, n).join(','),
                    )
                    .join(' ');
                return svg`<polygon
                    part="area"
                    class="area"
                    points=${points}
                    style=${styleMap({ fill: color, stroke: color })}
                />`;
            })}
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-radar-chart': HmiRadarChart;
    }
}
