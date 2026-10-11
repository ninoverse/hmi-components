import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    AXIS,
    cartesianGridStyles,
    chartStyles,
    extent,
    renderCartesianGrid,
    renderXAxisLabels,
    renderYAxisLabels,
    tickValues,
} from '../shared/chart.js';
import { styles } from './scatter-plot.styles.js';

/** A single `{ x, y }` data point. */
export interface ScatterPlotPoint {
    x: number;
    y: number;
}

/** One series of a scatter plot. */
export interface ScatterPlotSeries {
    /** The series name. */
    name: string;
    /** The points to plot. */
    data: readonly ScatterPlotPoint[];
    /** The series colour: any CSS colour, including a token such as `var(--primary)`. @default 'var(--primary)' */
    color?: string;
}

/**
 * Scatter plot: each series is a set of `{ x, y }` points drawn as markers over
 * a shared grid, with numeric ticks on both axes. A pure SVG, with no
 * dependencies. With no `series`, or only empty ones, nothing is rendered.
 *
 * The x range is the data's extent; the y range runs from 0, or the smallest y
 * if lower, to the largest y. `x-min`, `x-max`, `y-min` and `y-max` override any
 * end. Series colours are any CSS colour, including tokens such as
 * `var(--primary)`; every series defaults to the primary colour, so set one per
 * series. The size is the `width` and `height` in px: to fit a container, pass
 * the size from `hmi-responsive-container`.
 *
 * @tag hmi-scatter-plot
 * @csspart base - The `<svg>`.
 * @csspart grid-line - A horizontal or vertical grid line.
 * @csspart axis-label - A y-axis or x-axis tick label.
 * @csspart point - One marker.
 *
 * @example
 * const plot = document.querySelector('hmi-scatter-plot');
 * plot.series = [{ name: 'Group A', data: [{ x: 12, y: 22 }, { x: 20, y: 35 }] }];
 */
@customElement('hmi-scatter-plot')
export class HmiScatterPlot extends LitElement {
    static override styles = [
        baseStyles,
        cartesianGridStyles,
        chartStyles,
        styles,
    ];

    /** The series to plot. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor series: ScatterPlotSeries[] = [];

    /** SVG width in px. @default 520 */
    @property({ type: Number }) accessor width = 520;

    /** SVG height in px. @default 260 */
    @property({ type: Number }) accessor height = 260;

    /** The lower end of the x range. Defaults to the smallest x. */
    @property({ type: Number, attribute: 'x-min' }) accessor xMin:
        | number
        | undefined;

    /** The upper end of the x range. Defaults to the largest x. */
    @property({ type: Number, attribute: 'x-max' }) accessor xMax:
        | number
        | undefined;

    /** The lower end of the y range. Defaults to 0, or the smallest y if lower. */
    @property({ type: Number, attribute: 'y-min' }) accessor yMin:
        | number
        | undefined;

    /** The upper end of the y range. Defaults to the largest y. */
    @property({ type: Number, attribute: 'y-max' }) accessor yMax:
        | number
        | undefined;

    /** The number of vertical grid lines, and x-axis ticks, less one. @default 5 */
    @property({ type: Number, attribute: 'x-ticks' }) accessor xTicks = 5;

    /** The number of horizontal grid lines, and y-axis ticks, less one. @default 4 */
    @property({ type: Number, attribute: 'y-ticks' }) accessor yTicks = 4;

    /** The marker radius in px. @default 4 */
    @property({ type: Number }) accessor radius = 4;

    /** The accessible name of the plot. @default 'Scatter plot' */
    @property() accessor label = 'Scatter plot';

    override render() {
        const { width, height, xTicks, yTicks } = this;
        const points = this.series.flatMap((s) => s.data);
        if (points.length === 0) return nothing;
        const plotW = width - AXIS.left - AXIS.right;
        const plotH = height - AXIS.top - AXIS.bottom;
        const [xDataLo, xDataHi] = extent(points.map((p) => p.x));
        const [yDataLo, yDataHi] = extent(points.map((p) => p.y));
        const xLo = this.xMin ?? xDataLo;
        const xHi = this.xMax ?? xDataHi;
        const yLo = this.yMin ?? Math.min(0, yDataLo);
        const yHi = this.yMax ?? yDataHi;
        const xSpan = xHi - xLo || 1;
        const ySpan = yHi - yLo || 1;
        const xAt = (x: number) => AXIS.left + ((x - xLo) / xSpan) * plotW;
        const yAt = (y: number) =>
            AXIS.top + plotH - ((y - yLo) / ySpan) * plotH;
        return html`<svg
            part="base"
            class="chart"
            width=${width}
            height=${height}
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label=${this.label}
        >
            <g transform=${`translate(${AXIS.left}, ${AXIS.top})`}>
                ${renderCartesianGrid({
                    width: plotW,
                    height: plotH,
                    rows: yTicks,
                    cols: xTicks,
                    padding: 0,
                    horizontal: true,
                    vertical: true,
                })}
            </g>
            ${renderYAxisLabels(tickValues(yLo, ySpan, yTicks), yAt, AXIS.left)}
            ${renderXAxisLabels(
                tickValues(xLo, xSpan, xTicks).map((v) => ({
                    x: xAt(v),
                    text: Math.round(v),
                })),
                height,
            )}
            ${this.series.flatMap((s) =>
                s.data.map(
                    (p) =>
                        svg`<circle
                            part="point"
                            class="point"
                            cx=${xAt(p.x)}
                            cy=${yAt(p.y)}
                            r=${this.radius}
                            style=${styleMap({ fill: s.color ?? 'var(--primary)' })}
                        />`,
                ),
            )}
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-scatter-plot': HmiScatterPlot;
    }
}
