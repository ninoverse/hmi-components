import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './sparkline.styles.js';

/**
 * Compact, axis-less trend line for inline contexts: a table cell, a card. Pure
 * SVG path math, the same approach the larger Cartesian charts take.
 *
 * `color` is any CSS colour, including a token such as `var(--primary)`. It sets
 * the `color` of the SVG, and the line, the area and the dot all use
 * `currentColor`, because an SVG presentation attribute cannot resolve a CSS
 * custom property. With no `data`, nothing is rendered. The chart is an image
 * with no accessible name of its own: set `label` to give it one.
 *
 * @tag hmi-sparkline
 * @csspart base - The `<svg>`.
 * @csspart line - The trend line.
 * @csspart area - The tint under the line, present with `area`.
 * @csspart dot - The dot at the last point, present with `show-dot`.
 *
 * @example
 * const spark = document.querySelector('hmi-sparkline');
 * spark.data = [4, 8, 5, 10, 7, 12, 9, 14];
 */
@customElement('hmi-sparkline')
export class HmiSparkline extends LitElement {
    static override styles = [baseStyles, styles];

    /** The values to plot, in order. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor data: number[] = [];

    /** SVG width in px. @default 120 */
    @property({ type: Number }) accessor width = 120;

    /** SVG height in px. @default 32 */
    @property({ type: Number }) accessor height = 32;

    /** Line and area colour: any CSS colour. @default 'var(--primary)' */
    @property() accessor color = 'var(--primary)';

    /** Line stroke width in px. @default 2 */
    @property({ type: Number, attribute: 'stroke-width' })
    accessor strokeWidth = 2;

    /** Fill the area under the line. @default false */
    @property({ type: Boolean }) accessor area = false;

    /** Show a dot at the last point. @default false */
    @property({ type: Boolean, attribute: 'show-dot' }) accessor showDot =
        false;

    /** The lower bound of the value range. Defaults to the data's minimum. */
    @property({ type: Number }) accessor min: number | undefined;

    /** The upper bound of the value range. Defaults to the data's maximum. */
    @property({ type: Number }) accessor max: number | undefined;

    /** The accessible name of the chart. */
    @property() accessor label: string | undefined;

    override render() {
        const { data, width, height, strokeWidth } = this;
        if (data.length === 0) return nothing;
        const pad = strokeWidth + (this.showDot ? 2 : 0);
        let lo = this.min;
        let hi = this.max;
        if (lo === undefined || hi === undefined) {
            let dataLo = Number.POSITIVE_INFINITY;
            let dataHi = Number.NEGATIVE_INFINITY;
            for (const value of data) {
                if (value < dataLo) dataLo = value;
                if (value > dataHi) dataHi = value;
            }
            lo ??= dataLo;
            hi ??= dataHi;
        }
        const span = hi - lo || 1;
        const innerW = width - pad * 2;
        const innerH = height - pad * 2;
        const points = data.map((value, i) => {
            const x =
                data.length === 1
                    ? pad + innerW / 2
                    : pad + (innerW * i) / (data.length - 1);
            const y = pad + innerH - ((value - lo) / span) * innerH;
            return [x, y] as const;
        });
        const line = points
            .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
            .join(' ');
        const first = points[0] as readonly [number, number];
        const last = points[points.length - 1] as readonly [number, number];
        const areaPath = `${line} L${last[0]},${height - pad} L${first[0]},${height - pad} Z`;
        return html`<svg
            part="base"
            class="base"
            width=${width}
            height=${height}
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label=${this.label ?? nothing}
            style=${styleMap({ color: this.color })}
        >
            ${
                this.area
                    ? svg`<path part="area" class="area" d=${areaPath} fill="currentColor" />`
                    : nothing
            }
            <path
                part="line"
                class="line"
                d=${line}
                fill="none"
                stroke="currentColor"
                stroke-width=${strokeWidth}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            ${
                this.showDot
                    ? svg`<circle part="dot" class="dot" cx=${last[0]} cy=${last[1]} r=${strokeWidth + 1} fill="currentColor" />`
                    : nothing
            }
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-sparkline': HmiSparkline;
    }
}
