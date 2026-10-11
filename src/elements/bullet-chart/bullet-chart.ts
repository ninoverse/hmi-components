import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { chartStyles } from '../shared/chart.js';
import { styles } from './bullet-chart.styles.js';

// Range band shades, light to dark, applied behind the measure bar.
const BAND_SHADES = [
    'var(--surface-container-high)',
    'var(--surface-container-highest)',
    'var(--outline-variant)',
];

/**
 * Bullet chart (bullet graph): a compact horizontal KPI gauge. Qualitative
 * range bands sit behind a measure bar, with a target tick for comparison. A
 * pure SVG, with no dependencies.
 *
 * `ranges` are the ascending thresholds between the bands: `[40, 75]` makes
 * three bands, from `min` to 40, 40 to 75 and 75 to `max`, shaded from light to
 * dark; a threshold outside `min` to `max` is ignored. `max` defaults to the
 * largest of `value`, `target`, `ranges` and 1. The measure bar and the target
 * tick stop at the ends of the scale. `caption` is visible text to the left of
 * the track; `label` is the accessible name, and falls back to `caption`. The
 * size is the `width` and `height` in px.
 *
 * @tag hmi-bullet-chart
 * @csspart base - The `<svg>`.
 * @csspart caption - The text left of the track, present with `caption`.
 * @csspart band - One qualitative range band.
 * @csspart measure - The bar for `value`.
 * @csspart target - The tick for `target`, present with `target`.
 *
 * @example
 * const bullet = document.querySelector('hmi-bullet-chart');
 * bullet.ranges = [50, 75];
 */
@customElement('hmi-bullet-chart')
export class HmiBulletChart extends LitElement {
    static override styles = [baseStyles, chartStyles, styles];

    /** The measured value, drawn as the bar. @default 0 */
    @property({ type: Number }) accessor value = 0;

    /** The target or comparison value, drawn as a tick. Absent without it. */
    @property({ type: Number }) accessor target: number | undefined;

    /** The lower end of the scale. @default 0 */
    @property({ type: Number }) accessor min = 0;

    /** The upper end of the scale. Defaults to the largest of `value`, `target`, `ranges` and 1. */
    @property({ type: Number }) accessor max: number | undefined;

    /** The ascending thresholds between the qualitative bands. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor ranges: number[] = [];

    /** The measure bar's colour: any CSS colour, including a token. @default 'var(--primary)' */
    @property() accessor color = 'var(--primary)';

    /** Visible text to the left of the track, such as the metric's name. */
    @property() accessor caption = '';

    /** The accessible name of the chart. Falls back to `caption`, then 'Bullet chart'. */
    @property() accessor label = '';

    /** SVG width in px. @default 360 */
    @property({ type: Number }) accessor width = 360;

    /** SVG height in px. @default 48 */
    @property({ type: Number }) accessor height = 48;

    override render() {
        const { width, height, min, value, target, caption } = this;
        const ranges = this.ranges;
        const captionW = caption ? 96 : 0;
        const padX = 4;
        const trackLeft = captionW + padX;
        const trackW = width - trackLeft - padX;
        const hi =
            this.max ??
            Math.max(value, target ?? Number.NEGATIVE_INFINITY, ...ranges, 1);
        const span = hi - min || 1;
        const xAt = (v: number) =>
            trackLeft +
            ((Math.max(min, Math.min(v, hi)) - min) / span) * trackW;
        const trackTop = height * 0.18;
        const trackH = height * 0.64;
        const barTop = height * 0.32;
        const barH = height * 0.36;
        // The band boundaries: min, the thresholds inside the scale, then the top.
        const bounds = [min, ...ranges.filter((r) => r > min && r < hi), hi];
        return html`<svg
            part="base"
            class="chart"
            width=${width}
            height=${height}
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label=${this.label || caption || 'Bullet chart'}
        >
            ${
                caption
                    ? svg`<text
                          part="caption"
                          class="caption"
                          x=${captionW}
                          y=${height / 2}
                          text-anchor="end"
                          dominant-baseline="middle"
                      >${caption}</text>`
                    : nothing
            }
            ${bounds.slice(0, -1).map((start, i) => {
                const end = bounds[i + 1] ?? hi;
                return svg`<rect
                    part="band"
                    class="band"
                    x=${xAt(start)}
                    y=${trackTop}
                    width=${Math.max(0, xAt(end) - xAt(start))}
                    height=${trackH}
                    style=${styleMap({ fill: BAND_SHADES[i % BAND_SHADES.length] })}
                />`;
            })}
            <rect
                part="measure"
                class="measure"
                x=${trackLeft}
                y=${barTop}
                width=${Math.max(0, xAt(value) - trackLeft)}
                height=${barH}
                rx="2"
                style=${styleMap({ fill: this.color })}
            />
            ${
                target == null
                    ? nothing
                    : svg`<line
                          part="target"
                          class="target"
                          x1=${xAt(target)}
                          y1=${trackTop - 2}
                          x2=${xAt(target)}
                          y2=${trackTop + trackH + 2}
                      />`
            }
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-bullet-chart': HmiBulletChart;
    }
}
