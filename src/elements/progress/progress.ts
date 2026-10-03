import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './progress.styles.js';

/**
 * Linear progress bar for a known or indeterminate task. For a scalar
 * measurement within a range, use `hmi-meter`.
 *
 * With `indeterminate` the bar loops across the track, `value` is ignored and
 * `aria-valuenow` is omitted. The track border comes from the
 * `--progress-track-border` token, which the Field Journal structure theme sets.
 *
 * @tag hmi-progress
 * @csspart base - The track; carries `role="progressbar"`.
 *
 * @example
 * <hmi-progress value="64" label="Uploading"></hmi-progress>
 */
@customElement('hmi-progress')
export class HmiProgress extends LitElement {
    static override styles = [baseStyles, styles];

    /** Completion percentage, clamped to 0–100. @default 0 */
    @property({ type: Number }) accessor value = 0;

    /** Loops an animation for an unknown duration and ignores `value`. @default false */
    @property({ type: Boolean, reflect: true }) accessor indeterminate = false;

    /** Accessible label of the progress bar. */
    @property() accessor label: string | undefined;

    override render() {
        const clamped = Math.max(0, Math.min(100, this.value));
        return html`
            <div
                part="base"
                class="base"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${this.indeterminate ? nothing : clamped}
                aria-label=${this.label ?? nothing}
            >
                <div
                    class="bar"
                    style=${styleMap({
                        width: this.indeterminate ? undefined : `${clamped}%`,
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
