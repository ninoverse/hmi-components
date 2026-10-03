import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './stat.styles.js';

export type StatTrend = 'up' | 'down' | 'neutral';

const trendPaths: Record<StatTrend, string> = {
    up: 'M3 11l5-5 5 5',
    down: 'M3 5l5 5 5-5',
    neutral: 'M3 8h10',
};

/**
 * Compact metric (KPI) block: a label with an optional icon, a large value,
 * and an optional footer with a coloured trend delta and help text.
 *
 * Every piece of text is a slot. `trend` sets the delta's colour and arrow,
 * and the delta shows only while both `trend` and the `delta` slot are set. The
 * footer is drawn only when it has something to show. `divider` draws a dashed
 * rule above it, with the spacing the rule needs.
 *
 * @tag hmi-stat
 * @slot label - Metric name.
 * @slot value - Primary metric value.
 * @slot icon - Icon beside the label, such as an `svg`.
 * @slot delta - Change amount next to the trend arrow; needs `trend`.
 * @slot help-text - Secondary helper text in the footer.
 * @csspart base - The surface.
 * @csspart label - The label wrapper.
 * @csspart icon - The icon slot.
 * @csspart footer - The footer row holding the delta and the help text.
 *
 * @example
 * <hmi-stat trend="up"><span slot="label">Revenue</span><span slot="value">$12.4k</span><span slot="delta">8%</span></hmi-stat>
 */
@customElement('hmi-stat')
export class HmiStat extends LitElement {
    static override styles = [baseStyles, styles];

    /** Direction of change; sets the delta colour and arrow. */
    @property({ reflect: true }) accessor trend: StatTrend | undefined;

    /** Draws a dashed rule above the footer. @default false */
    @property({ type: Boolean, reflect: true }) accessor divider = false;

    @state() private accessor hasDelta = false;
    @state() private accessor hasHelp = false;

    #onSlotChange(event: Event): void {
        const slot = event.target as HTMLSlotElement;
        const has = slot.assignedNodes({ flatten: true }).length > 0;
        if (slot.name === 'delta') this.hasDelta = has;
        else this.hasHelp = has;
    }

    override render() {
        const showDelta = this.hasDelta && this.trend !== undefined;
        return html`
            <div part="base" class="base">
                <div class="header">
                    <span part="label" class="label"
                        ><slot name="label"></slot
                    ></span>
                    <slot name="icon" part="icon"></slot>
                </div>
                <div class="value"><slot name="value"></slot></div>
                <div
                    part="footer"
                    class="footer"
                    ?hidden=${!(showDelta || this.hasHelp)}
                >
                    <span class="delta" ?hidden=${!showDelta}>
                        ${
                            this.trend
                                ? svg`<svg
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      aria-hidden="true"
                                  >
                                      <path d=${trendPaths[this.trend]} />
                                  </svg>`
                                : nothing
                        }<slot name="delta" @slotchange=${this.#onSlotChange}></slot>
                    </span>
                    <span class="help"
                        ><slot
                            name="help-text"
                            @slotchange=${this.#onSlotChange}
                        ></slot
                    ></span>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-stat': HmiStat;
    }
}
