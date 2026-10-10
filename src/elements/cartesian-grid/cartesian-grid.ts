import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { cartesianGridStyles, renderCartesianGrid } from '../shared/chart.js';
import { styles } from './cartesian-grid.styles.js';

/**
 * Evenly spaced grid lines for a chart's plot area, in an SVG of its own. Layer
 * it over or under other content; the charts draw the same grid inside their own
 * SVG, so they do not need it. It draws nothing until `width` and `height` are
 * set.
 *
 * It is decorative: the SVG is hidden from assistive technology.
 *
 * @tag hmi-cartesian-grid
 * @csspart base - The `<svg>`.
 * @csspart grid-line - One grid line.
 *
 * @example
 * <hmi-cartesian-grid width="400" height="200" rows="4" cols="6" padding="16"></hmi-cartesian-grid>
 */
@customElement('hmi-cartesian-grid')
export class HmiCartesianGrid extends LitElement {
    static override styles = [baseStyles, cartesianGridStyles, styles];

    /** Grid area width in px. @default 0 */
    @property({ type: Number }) accessor width = 0;

    /** Grid area height in px. @default 0 */
    @property({ type: Number }) accessor height = 0;

    /** The number of bands between horizontal lines. @default 4 */
    @property({ type: Number }) accessor rows = 4;

    /** The number of bands between vertical lines. @default 4 */
    @property({ type: Number }) accessor cols = 4;

    /** Inset from each edge, in px. @default 0 */
    @property({ type: Number }) accessor padding = 0;

    /** Leave out the horizontal lines. @default false */
    @property({ type: Boolean, attribute: 'hide-horizontal' })
    accessor hideHorizontal = false;

    /** Leave out the vertical lines. @default false */
    @property({ type: Boolean, attribute: 'hide-vertical' })
    accessor hideVertical = false;

    override render() {
        return html`<svg
            part="base"
            class="base"
            width=${this.width}
            height=${this.height}
            viewBox="0 0 ${this.width} ${this.height}"
            aria-hidden="true"
        >
            ${renderCartesianGrid({
                width: this.width,
                height: this.height,
                rows: this.rows,
                cols: this.cols,
                padding: this.padding,
                horizontal: !this.hideHorizontal,
                vertical: !this.hideVertical,
            })}
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-cartesian-grid': HmiCartesianGrid;
    }
}
