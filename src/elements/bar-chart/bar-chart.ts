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
import { styles } from './bar-chart.styles.js';

/** One series of a bar chart. */
export type BarChartSeries = CategorySeries;

/**
 * Multi-series grouped bar chart: a group of bars per category, over a shared
 * horizontal grid, with y-axis value ticks and x-axis category labels. A pure
 * SVG, with no dependencies. With no `series`, or only empty ones, nothing is
 * rendered.
 *
 * Each category has an equal slot, which its bars share, with a gap around the
 * group and a smaller one between the series' bars. The value range is 0 to the
 * largest value, unless `min` and `max` say otherwise, and a negative value's bar
 * hangs below zero. A missing value is drawn as zero. Series colours are any CSS
 * colour, including tokens such as `var(--primary)`; every series defaults to the
 * primary colour, so set one per series. The size is the `width` and `height` in
 * px: to fit a container, pass the size from `hmi-responsive-container`.
 *
 * @tag hmi-bar-chart
 * @csspart base - The `<svg>`.
 * @csspart grid-line - A horizontal grid line.
 * @csspart axis-label - A y-axis or x-axis label.
 * @csspart bar - One bar.
 *
 * @example
 * const chart = document.querySelector('hmi-bar-chart');
 * chart.labels = ['Q1', 'Q2'];
 * chart.series = [{ name: 'Product A', data: [42, 55], color: 'var(--primary)' }];
 */
@customElement('hmi-bar-chart')
export class HmiBarChart extends LitElement {
    static override styles = [
        baseStyles,
        cartesianGridStyles,
        chartStyles,
        styles,
    ];

    /** The series to plot. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor series: BarChartSeries[] = [];

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

    /** The accessible name of the chart. @default 'Bar chart' */
    @property() accessor label = 'Bar chart';

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
        const zeroY = yAt(Math.max(lo, 0));
        // Each category occupies an equal slot; bars within a group share it,
        // with outer gaps around the group and inner gaps between series bars.
        const slot = plotW / count;
        const groupPad = slot * 0.18;
        const groupW = slot - groupPad * 2;
        const barGap = this.series.length > 1 ? groupW * 0.08 : 0;
        const barW =
            (groupW - barGap * (this.series.length - 1)) / this.series.length;
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
                this.labels.map((text, i) => ({
                    x: left + slot * i + slot / 2,
                    text,
                })),
                height,
            )}
            ${Array.from({ length: count }, (_, i) => {
                const groupX = left + slot * i + groupPad;
                return this.series.map((s, si) => {
                    const y = yAt(s.data[i] ?? 0);
                    return svg`<rect
                        part="bar"
                        class="bar"
                        x=${groupX + si * (barW + barGap)}
                        y=${Math.min(y, zeroY)}
                        width=${Math.max(0, barW)}
                        height=${Math.abs(zeroY - y)}
                        rx="2"
                        style=${styleMap({ fill: s.color ?? 'var(--primary)' })}
                    />`;
                });
            })}
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-bar-chart': HmiBarChart;
    }
}
