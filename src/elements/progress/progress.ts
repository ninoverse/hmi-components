import { html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './progress.styles.js';

/**
 * Linear progress bar for a known or indeterminate task. For a scalar
 * measurement within a range, use `hmi-meter`.
 *
 * `value` counts from 0 to `max`, 100 by default, so `value="64"` is 64% and
 * `value="3" max="7"` is three of seven. A value that isn't a number is read as
 * 0, then kept between 0 and `max`; a `max` that isn't a number above 0 is read
 * as 100. With `indeterminate` the bar loops across the track, `value` is
 * ignored and `aria-valuenow` is omitted.
 *
 * The `label` slot is shown above the track and names it; `show-value` shows
 * the percentage beside it. A bar with no visible label takes its name from
 * `label`, else from the host's `aria-label`: `aria-labelledby` on the host and
 * `<label for>` don't reach the bar inside. `value-text` replaces the
 * percentage, shown and read out: `value-text="3 of 7 files"`.
 *
 * The host is a block with no width of its own: in a flex row, give it one, or
 * it shrinks to nothing. The track's thickness is set through `::part(base)`.
 *
 * In the default light scheme the bar is 2.4:1 against the track and the empty
 * track barely shows against the page; a theme that needs 3:1 deepens the bar
 * through `--progress-indicator` and gives the track an edge through
 * `--progress-track-border` (`docs/theming.md` has values).
 *
 * @tag hmi-progress
 * @slot label - Text shown above the bar; also its accessible name.
 * @csspart base - The track; carries `role="progressbar"` and the `aria-value*` attributes.
 * @csspart indicator - The bar, as wide as the value.
 * @csspart label - The label wrapper.
 * @csspart value - The percentage or `value-text`, shown with `show-value`.
 * @cssprop --progress-track-border - The track's edge. `none` by default; the journal structure sets an `--outline` line.
 * @cssprop --progress-indicator - The bar's colour. Falls back to `--primary`.
 *
 * @example
 * <hmi-progress value="64" label="Uploading"></hmi-progress>
 */
@customElement('hmi-progress')
export class HmiProgress extends LitElement {
    static override styles = [baseStyles, styles];

    /** Amount done, from 0 to `max`; one that isn't a number is read as 0. @default 0 */
    @property({ type: Number }) accessor value = 0;

    /** The amount that means done; one that isn't a number above 0 is read as 100. @default 100 */
    @property({ type: Number }) accessor max = 100;

    /** Loops an animation for an unknown duration and ignores `value`. @default false */
    @property({ type: Boolean, reflect: true }) accessor indeterminate = false;

    /** The bar's name for screen readers when it has no slotted label. */
    @property() accessor label: string | undefined;

    /** Shows the percentage, or `value-text`, beside the label. @default false */
    @property({ type: Boolean, reflect: true, attribute: 'show-value' })
    accessor showValue = false;

    /** Text shown and read out in place of the percentage, such as `3 of 7 files`. @default '' */
    @property({ attribute: 'value-text' }) accessor valueText = '';

    /** The host's `aria-label`, the bar's name when `label` is unset; read so a change renders again. */
    @property({ attribute: 'aria-label' })
    private accessor hostLabel: string | null = null;

    /* Whether the label slot holds anything; undefined until it is read. */
    @state() private accessor hasLabel: boolean | undefined;

    override firstUpdated(changed: PropertyValues) {
        super.firstUpdated(changed);
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
        const finite = (n: number) => (Number.isFinite(n) ? n : undefined);
        const max = (finite(this.max) ?? 0) > 0 ? this.max : 100;
        /* Twelve significant digits drop the float noise of arithmetic, so
           0.1 + 0.2 reads as 0.3. */
        const clamped = Number(
            Math.max(0, Math.min(max, finite(this.value) ?? 0)).toPrecision(12),
        );
        const percent = (clamped / max) * 100;
        const name = this.label || this.hostLabel || '';
        /* Until the slot is read, as on a server, a bar named by `label` or
           `aria-label` is taken to have no visible label, and any other to
           have one, so the label shows from the first paint. */
        const hasLabel = this.hasLabel ?? !name;
        const text = this.valueText || `${Math.floor(percent)}%`;
        const showText =
            this.showValue && (!this.indeterminate || this.valueText);
        return html`
            <div class="header" ?hidden=${!(hasLabel || showText)}>
                <span part="label" class="label" id="label"
                    ><slot name="label" @slotchange=${this.#read}></slot
                ></span>
                ${showText ? html`<span part="value" class="value">${text}</span>` : nothing}
            </div>
            <div
                part="base"
                class="base"
                role="progressbar"
                aria-labelledby=${hasLabel ? 'label' : nothing}
                aria-label=${name || nothing}
                aria-valuemin="0"
                aria-valuemax=${max}
                aria-valuenow=${this.indeterminate ? nothing : clamped}
                aria-valuetext=${this.valueText || nothing}
            >
                <div
                    part="indicator"
                    class="bar"
                    style=${styleMap({
                        width: this.indeterminate ? undefined : `${percent}%`,
                    })}
                ></div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-progress': HmiProgress;
    }
}
