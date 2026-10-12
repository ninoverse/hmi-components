import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { chartStyles, extent } from '../shared/chart.js';
import { styles } from './heatmap.styles.js';

// Room for the row labels on the left, and for the column labels below, in px.
const Y_AXIS = 64;
const X_AXIS = 24;

/**
 * Matrix heatmap: a grid of cells whose intensity maps to each value, with
 * optional row and column labels. A pure SVG, with no dependencies. With an
 * empty `data`, nothing is rendered.
 *
 * The intensity is the cell colour's opacity, from faint at the lowest value to
 * solid at the highest; `min` and `max` fix the ends of that scale, which is
 * otherwise the data's extent. `color` is any CSS colour, including a token such
 * as `var(--primary)`. The size follows from `cell-size`, `gap`, the number of
 * rows and columns and whether there are labels, so it has no width or height of
 * its own.
 *
 * @tag hmi-heatmap
 * @csspart base - The `<svg>`.
 * @csspart axis-label - A row or column label.
 * @csspart cell - One cell.
 * @csspart value - One cell's value, present with `show-values`.
 *
 * @example
 * const map = document.querySelector('hmi-heatmap');
 * map.xLabels = ['Mon', 'Tue'];
 * map.data = [[4, 8], [14, 18]];
 */
@customElement('hmi-heatmap')
export class HmiHeatmap extends LitElement {
    static override styles = [baseStyles, chartStyles, styles];

    /** The values, row by row: each inner array is one row. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor data: number[][] = [];

    /** The column labels, one per column. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor xLabels: string[] =
        [];

    /** The row labels, one per row. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor yLabels: string[] =
        [];

    /** The cell colour: any CSS colour, including a token. Its opacity carries the intensity. @default 'var(--primary)' */
    @property() accessor color = 'var(--primary)';

    /** The value at the faintest cell. Defaults to the smallest value. */
    @property({ type: Number }) accessor min: number | undefined;

    /** The value at the solid cell. Defaults to the largest value. */
    @property({ type: Number }) accessor max: number | undefined;

    /** The edge of a cell in px. @default 40 */
    @property({ type: Number, attribute: 'cell-size' }) accessor cellSize = 40;

    /** The gap between cells in px. @default 4 */
    @property({ type: Number }) accessor gap = 4;

    /** Prints each cell's value at its centre. */
    @property({ type: Boolean, attribute: 'show-values' }) accessor showValues =
        false;

    /** The accessible name of the chart. @default 'Heatmap' */
    @property() accessor label = 'Heatmap';

    override render() {
        const { data, cellSize, gap } = this;
        const rows = data.length;
        let cols = 0;
        for (const row of data) cols = Math.max(cols, row.length);
        if (rows === 0 || cols === 0) return nothing;
        const [dataLo, dataHi] = extent(data.flat());
        const lo = this.min ?? dataLo;
        const hi = this.max ?? dataHi;
        const span = hi - lo || 1;
        const step = cellSize + gap;
        const left = this.yLabels.length > 0 ? Y_AXIS : 0;
        const hasXLabels = this.xLabels.length > 0;
        const width = left + cols * step - gap;
        const height = rows * step - gap + (hasXLabels ? X_AXIS : 0);
        return html`<svg
            part="base"
            class="chart"
            width=${width}
            height=${height}
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label=${this.label}
        >
            ${this.yLabels.map(
                (text, r) =>
                    svg`<text
                        part="axis-label"
                        class="axis-label"
                        x=${left - 8}
                        y=${r * step + cellSize / 2}
                        text-anchor="end"
                        dominant-baseline="middle"
                    >${text}</text>`,
            )}
            ${this.xLabels.map(
                (text, c) =>
                    svg`<text
                        part="axis-label"
                        class="axis-label"
                        x=${left + c * step + cellSize / 2}
                        y=${rows * step - gap + 16}
                        text-anchor="middle"
                    >${text}</text>`,
            )}
            ${data.map((row, r) =>
                row.map(
                    (v, c) => svg`<rect
                            part="cell"
                            class="cell"
                            x=${left + c * step}
                            y=${r * step}
                            width=${cellSize}
                            height=${cellSize}
                            rx="4"
                            fill-opacity=${0.12 + 0.88 * ((v - lo) / span)}
                            style=${styleMap({ fill: this.color })}
                        />
                        ${
                            this.showValues
                                ? svg`<text
                                      part="value"
                                      class="value"
                                      x=${left + c * step + cellSize / 2}
                                      y=${r * step + cellSize / 2}
                                      text-anchor="middle"
                                      dominant-baseline="middle"
                                  >${v}</text>`
                                : nothing
                        }`,
                ),
            )}
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-heatmap': HmiHeatmap;
    }
}
