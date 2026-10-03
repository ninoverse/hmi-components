import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './meter.styles.js';

export type MeterLevel = 'optimal' | 'suboptimal' | 'poor';

/* Mirrors the native <meter> colouring algorithm: the bar's quality depends on
   which band (below `low`, between, above `high`) the value falls in relative
   to the band `optimum` sits in. */
function resolveLevel(
    value: number,
    low: number,
    high: number,
    optimum: number,
): MeterLevel {
    const band = (v: number): 0 | 1 | 2 => (v <= low ? 0 : v >= high ? 2 : 1);
    const distance = Math.abs(band(value) - band(optimum));
    return distance === 0 ? 'optimal' : distance === 1 ? 'suboptimal' : 'poor';
}

/**
 * Scalar measurement bar within a known range, such as disk usage. The fill
 * colour reflects quality, following the native `<meter>` algorithm through
 * `low`, `high` and `optimum`. For task completion use `hmi-progress`.
 *
 * The label is the `label` slot. It names the track through
 * `aria-labelledby`, so there is no `label` property.
 *
 * @tag hmi-meter
 * @slot label - Text shown above the bar; also its accessible name.
 * @csspart base - The track; carries `role="meter"` and the `aria-value*` attributes.
 * @csspart label - The label wrapper.
 *
 * @example
 * <hmi-meter value="0.8" low="0.3" high="0.7" optimum="0.2" show-value><span slot="label">Disk</span></hmi-meter>
 */
@customElement('hmi-meter')
export class HmiMeter extends LitElement {
    static override styles = [baseStyles, styles];

    /** Current measurement, clamped to `[min, max]`. @default 0 */
    @property({ type: Number }) accessor value = 0;

    /** Lower bound of the scale. @default 0 */
    @property({ type: Number }) accessor min = 0;

    /** Upper bound of the scale. @default 1 */
    @property({ type: Number }) accessor max = 1;

    /** Below this the value is in the "low" band. Defaults to `min`. */
    @property({ type: Number }) accessor low: number | undefined;

    /** Above this the value is in the "high" band. Defaults to `max`. */
    @property({ type: Number }) accessor high: number | undefined;

    /** Where the ideal value sits; drives optimal, suboptimal or poor. Defaults to `max`. */
    @property({ type: Number }) accessor optimum: number | undefined;

    /** Shows the numeric value beside the label. @default false */
    @property({ type: Boolean, reflect: true, attribute: 'show-value' })
    accessor showValue = false;

    #hasLabel = false;

    #onLabelChange(event: Event): void {
        const slot = event.target as HTMLSlotElement;
        const has = slot.assignedNodes({ flatten: true }).length > 0;
        if (has !== this.#hasLabel) {
            this.#hasLabel = has;
            this.requestUpdate();
        }
    }

    override render() {
        const { min, max } = this;
        const span = max - min;
        const clamped = Math.max(min, Math.min(max, this.value));
        const percent = span > 0 ? ((clamped - min) / span) * 100 : 0;
        const level = resolveLevel(
            clamped,
            this.low ?? min,
            this.high ?? max,
            this.optimum ?? max,
        );
        return html`
            <div class="header" ?hidden=${!(this.#hasLabel || this.showValue)}>
                <span part="label" class="label" id="label"
                    ><slot name="label" @slotchange=${this.#onLabelChange}></slot
                ></span>
                ${this.showValue ? html`<span class="value">${clamped}</span>` : nothing}
            </div>
            <div
                part="base"
                class="base"
                role="meter"
                aria-labelledby=${this.#hasLabel ? 'label' : nothing}
                aria-valuemin=${min}
                aria-valuemax=${max}
                aria-valuenow=${clamped}
            >
                <div
                    class="fill ${level}"
                    style=${styleMap({ width: `${percent}%` })}
                ></div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-meter': HmiMeter;
    }
}
