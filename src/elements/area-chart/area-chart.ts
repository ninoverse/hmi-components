import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    type CategorySeries,
    cartesianGridStyles,
    categoryScale,
    chartStyles,
    renderCartesianGrid,
    renderXAxisLabels,
    renderYAxisLabels,
} from '../shared/chart.js';
import { styles } from './area-chart.styles.js';

/** One series of an area chart. */
export type AreaChartSeries = CategorySeries;

/**
 * Multi-series area chart: each series is a line with a tinted fill down to the
 * baseline, over a shared horizontal grid, with y-axis value ticks and x-axis
 * category labels. A pure SVG, with no dependencies. With no `series`, or only
 * empty ones, nothing is rendered.
 *
 * The value range is 0 to the largest value, unless `min` and `max` say
 * otherwise, and the fill reaches down to zero, or to the bottom of the range if
 * that is above zero. The fill is at low opacity, so overlapping series stay
 * legible. Series colours are any CSS colour, including tokens such as
 * `var(--primary)`; every series defaults to the primary colour, so set one per
 * series. The size is the `width` and `height` in px: to fit a container, pass
 * the size from `hmi-responsive-container`.
 *
 * @tag hmi-area-chart
 * @csspart base - The `<svg>`.
 * @csspart grid-line - A horizontal grid line.
 * @csspart axis-label - A y-axis or x-axis label.
 * @csspart area - A series' tinted fill.
 * @csspart line - A series' line.
 *
 * @example
 * const chart = document.querySelector('hmi-area-chart');
 * chart.labels = ['Jan', 'Feb', 'Mar'];
 * chart.series = [{ name: 'Pro', data: [20, 28, 26], color: 'var(--primary)' }];
 */
@customElement('hmi-area-chart')
export class HmiAreaChart extends LitElement {
    static override styles = [
        baseStyles,
        cartesianGridStyles,
        chartStyles,
        styles,
    ];

    /** The series to plot. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor series: AreaChartSeries[] = [];

    /** The x-axis category labels. A property only: there is no attribute. Their number should match the data's. @default [] */
    @property({ type: Array, attribute: false }) accessor labels: string[] = [];

    /** SVG width in px. @default 520 */
    @property({ type: Number }) accessor width = 520;

    /** SVG height in px. @default 260 */
    @property({ type: Number }) accessor height = 260;

    /** The lower end of the value range. Defaults to 0, or the smallest value if lower. */
    @property({ type: Number }) accessor min: number | undefined;

    /** The upper end of the value range. Defaults to the largest value. */
    @property({ type: Number }) accessor max: number | undefined;

    /** The number of horizontal grid lines, and y-axis ticks, less one. @default 4 */
    @property({ type: Number, attribute: 'y-ticks' }) accessor yTicks = 4;

    /** The accessible name of the chart. @default 'Area chart' */
    @property() accessor label = 'Area chart';

    override render() {
        const { width, height, yTicks } = this;
        const scale = categoryScale({
            series: this.series,
            width,
            height,
            min: this.min,
            max: this.max,
            yTicks,
        });
        if (!scale) return nothing;
        const { count, plotW, plotH, left, top, lo, yAt } = scale;
        const xAt = (i: number) =>
            count === 1 ? left + plotW / 2 : left + (plotW * i) / (count - 1);
        const baseY = yAt(Math.max(lo, 0));
        return html`<svg
            part="base"
            class="chart"
            width=${width}
            height=${height}
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label=${this.label}
        >
            <g transform=${`translate(${left}, ${top})`}>
                ${renderCartesianGrid({
                    width: plotW,
                    height: plotH,
                    rows: yTicks,
                    cols: 4,
                    padding: 0,
                    horizontal: true,
                    vertical: false,
                })}
            </g>
            ${renderYAxisLabels(scale.yTickValues, yAt, left)}
            ${renderXAxisLabels(
                this.labels.map((text, i) => ({ x: xAt(i), text })),
                height,
            )}
            ${this.series.map((s) => {
                const color = s.color ?? 'var(--primary)';
                const line = s.data
                    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(v)}`)
                    .join(' ');
                const area = `${line} L${xAt(s.data.length - 1)},${baseY} L${xAt(0)},${baseY} Z`;
                return svg`<g>
                    <path part="area" class="area" d=${area} style=${styleMap({ fill: color })} />
                    <path part="line" class="line" d=${line} fill="none" style=${styleMap({ stroke: color })} />
                </g>`;
            })}
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-area-chart': HmiAreaChart;
    }
}
