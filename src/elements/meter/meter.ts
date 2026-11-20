import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './meter.styles.js';

export type MeterLevel = 'optimal' | 'suboptimal' | 'poor';

/* The bar's quality is how far the value's band (up to `low`, between, from
   `high` up) sits from the band `optimum` falls in. Not the native <meter>'s
   rule: see the class JSDoc. */
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
 * Scalar measurement bar within a known range, such as disk usage. For task
 * completion use `hmi-progress`.
 *
 * The fill's colour tells the value's quality. `low` and `high` split the
 * range into three bands: up to and including `low`, between them, and from
 * `high` up. The band `optimum` falls in is optimal (`--success`), the band
 * next to it suboptimal (`--warning`) and the band two away poor (`--error`).
 * `low` and `high` default to `min` and `max`, and `optimum` to `max`, so a
 * meter without thresholds is optimal only at `max`, poor at `min` and
 * suboptimal in between: set the thresholds its quality depends on. This is
 * hmi's own rule, not the native `<meter>`'s, whose `optimum` defaults to the
 * middle of the range and whose middle band takes in `low` and `high`.
 *
 * The colour is all that tells the quality. When it matters, say it in words
 * too, with `value-text`: `value-text="92%, nearly full"`. In light schemes
 * the default green and amber fills are under 3:1 against the track; a theme that needs 3:1
 * deepens them through `--meter-optimal`, `--meter-suboptimal` and
 * `--meter-poor`, and gives the track an edge through `--meter-track-border`
 * (`docs/theming.md` has values).
 *
 * The `label` slot is shown above the track and names it. A meter with no
 * visible label takes its name from `label` instead.
 *
 * A value that isn't a number is read as 0, then kept in the range, as the
 * native `<meter>` does; so is a `max` below `min`, read as `min`.
 *
 * @tag hmi-meter
 * @slot label - Text shown above the bar; also its accessible name.
 * @csspart base - The track; carries `role="meter"` and the `aria-value*` attributes.
 * @csspart indicator - The fill, as wide as the value.
 * @csspart label - The label wrapper.
 * @csspart value - The number or `value-text`, shown with `show-value`.
 * @cssprop --meter-track-border - The track's edge. `none` by default; the journal structure sets an `--outline` line.
 * @cssprop --meter-optimal - The optimal fill. Falls back to `--success`.
 * @cssprop --meter-suboptimal - The suboptimal fill. Falls back to `--warning`.
 * @cssprop --meter-poor - The poor fill. Falls back to `--error`.
 *
 * @example
 * <hmi-meter value="0.8" low="0.3" high="0.7" optimum="0.2" show-value><span slot="label">Disk</span></hmi-meter>
 */
@customElement('hmi-meter')
export class HmiMeter extends LitElement {
    static override styles = [baseStyles, styles];

    /** Current measurement, clamped to `[min, max]`; one that isn't a number is read as 0. @default 0 */
    @property({ type: Number }) accessor value = 0;

    /** Lower bound of the scale. @default 0 */
    @property({ type: Number }) accessor min = 0;

    /** Upper bound of the scale; one below `min` is read as `min`. @default 1 */
    @property({ type: Number }) accessor max = 1;

    /** Up to and including this the value is in the low band. Defaults to `min`. */
    @property({ type: Number }) accessor low: number | undefined;

    /** From this up the value is in the high band. Defaults to `max`. */
    @property({ type: Number }) accessor high: number | undefined;

    /** Where the ideal value sits; its band is optimal. Defaults to `max`. */
    @property({ type: Number }) accessor optimum: number | undefined;

    /** Shows the value beside the label. @default false */
    @property({ type: Boolean, reflect: true, attribute: 'show-value' })
    accessor showValue = false;

    /** Text shown and read out in place of the number, such as `85%` or `73 L`. @default '' */
    @property({ attribute: 'value-text' }) accessor valueText = '';

    /** The meter's name for screen readers when it has no slotted label. @default '' */
    @property() accessor label = '';

    /* Until the slot is read, it counts as filled, so a server render shows
       the label and links it. */
    @state() private accessor hasLabel = true;

    override firstUpdated() {
        this.#read();
    }

    #read() {
        const slot =
            this.renderRoot.querySelector<HTMLSlotElement>(
                'slot[name="label"]',
            );
        this.hasLabel =
            (slot?.assignedNodes({ flatten: true }).length ?? 0) > 0;
    }

    override render() {
        const finite = (n: number | undefined) =>
            typeof n === 'number' && Number.isFinite(n) ? n : undefined;
        const min = finite(this.min) ?? 0;
        const max = Math.max(min, finite(this.max) ?? 1);
        const span = max - min;
        /* Twelve significant digits drop the float noise of arithmetic, so
           0.1 + 0.2 shows and reads as 0.3. */
        const clamped = Number(
            Math.max(min, Math.min(max, finite(this.value) ?? 0)).toPrecision(
                12,
            ),
        );
        const percent = span > 0 ? ((clamped - min) / span) * 100 : 0;
        const level = resolveLevel(
            clamped,
            finite(this.low) ?? min,
            finite(this.high) ?? max,
            finite(this.optimum) ?? max,
        );
        const text = this.valueText || String(clamped);
        return html`
            <div class="header" ?hidden=${!(this.hasLabel || this.showValue)}>
                <span part="label" class="label" id="label"
                    ><slot name="label" @slotchange=${this.#read}></slot
                ></span>
                ${this.showValue ? html`<span part="value" class="value">${text}</span>` : nothing}
            </div>
            <div
                part="base"
                class="base"
                role="meter"
                aria-labelledby=${this.hasLabel ? 'label' : nothing}
                aria-label=${this.label || nothing}
                aria-valuemin=${min}
                aria-valuemax=${max}
                aria-valuenow=${clamped}
                aria-valuetext=${this.valueText || nothing}
            >
                <div
                    part="indicator"
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
