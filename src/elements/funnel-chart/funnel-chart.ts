import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { chartStyles, extent, paletteColor } from '../shared/chart.js';
import { styles } from './funnel-chart.styles.js';

/** One stage of a funnel chart. */
export interface FunnelChartStage {
    /** The stage name, shown in the label column. */
    label: string;
    /** The stage's magnitude: its band's width relative to the largest stage. */
    value: number;
    /** The stage colour: any CSS colour, including a token such as `var(--primary)`. Defaults to the next colour of the default palette. */
    color?: string;
}

/**
 * Funnel chart: centred trapezoid bands stacked from the widest stage down,
 * each narrowing towards the next, so a band's width maps to its value. The
 * stage labels sit in a column on the right, so they stay legible whatever the
 * band's width. A pure SVG, with no dependencies. With no `stages`, nothing is
 * rendered.
 *
 * `show-values` adds each stage's value and its share of the largest stage to
 * its label. Stages with no `color` take the default palette, the primary,
 * tertiary, secondary, success, warning and error tokens in turn. The size is
 * the `width` and `height` in px, the label column included.
 *
 * @tag hmi-funnel-chart
 * @csspart base - The `<svg>`.
 * @csspart band - One stage's trapezoid.
 * @csspart stage-label - One stage's label.
 *
 * @example
 * const funnel = document.querySelector('hmi-funnel-chart');
 * funnel.stages = [{ label: 'Visited', value: 1200 }, { label: 'Signed up', value: 820 }];
 */
@customElement('hmi-funnel-chart')
export class HmiFunnelChart extends LitElement {
    static override styles = [baseStyles, chartStyles, styles];

    /** The stages, from the widest at the top down. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor stages: FunnelChartStage[] = [];

    /** SVG width in px. @default 500 */
    @property({ type: Number }) accessor width = 500;

    /** SVG height in px. @default 280 */
    @property({ type: Number }) accessor height = 280;

    /** The vertical gap between the bands in px. @default 4 */
    @property({ type: Number }) accessor gap = 4;

    /** The width reserved for the label column on the right, in px. @default 180 */
    @property({ type: Number, attribute: 'label-width' }) accessor labelWidth =
        180;

    /** Appends each stage's value and its share of the largest stage to its label. */
    @property({ type: Boolean, attribute: 'show-values' }) accessor showValues =
        false;

    /** The accessible name of the chart. @default 'Funnel chart' */
    @property() accessor label = 'Funnel chart';

    override render() {
        const { width, height, gap, stages } = this;
        const n = stages.length;
        if (n === 0) return nothing;
        const peak = extent(stages.map((s) => s.value))[1] || 1;
        const funnelW = Math.max(0, width - this.labelWidth);
        const cx = funnelW / 2;
        const bandH = (height - gap * (n - 1)) / n;
        const wAt = (v: number) => (v / peak) * funnelW;
        return html`<svg
            part="base"
            class="chart"
            width=${width}
            height=${height}
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label=${this.label}
        >
            ${stages.map((s, i) => {
                const topY = i * (bandH + gap);
                const bottomY = topY + bandH;
                const next = stages[i + 1] ?? s;
                const topW = wAt(s.value);
                const bottomW = wAt(next.value);
                const points = [
                    `${cx - topW / 2},${topY}`,
                    `${cx + topW / 2},${topY}`,
                    `${cx + bottomW / 2},${bottomY}`,
                    `${cx - bottomW / 2},${bottomY}`,
                ].join(' ');
                const share = Math.round((s.value / peak) * 100);
                return svg`<polygon
                        part="band"
                        class="band"
                        points=${points}
                        style=${styleMap({ fill: s.color ?? paletteColor(i) })}
                    />
                    <text
                        part="stage-label"
                        class="stage-label"
                        x=${funnelW + 12}
                        y=${topY + bandH / 2}
                        text-anchor="start"
                        dominant-baseline="middle"
                    >${this.showValues ? `${s.label} · ${s.value} (${share}%)` : s.label}</text>`;
            })}
        </svg>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-funnel-chart': HmiFunnelChart;
    }
}
