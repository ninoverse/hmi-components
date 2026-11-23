import { html, LitElement, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { styles } from './stat.styles.js';

export type StatTrend = 'up' | 'down' | 'neutral';
export type StatTone = 'positive' | 'negative' | 'neutral';

const trendPaths: Record<StatTrend, string> = {
    up: 'M3 11l5-5 5 5',
    down: 'M3 5l5 5 5-5',
    neutral: 'M3 8h10',
};

const trendTones: Record<StatTrend, StatTone> = {
    up: 'positive',
    down: 'negative',
    neutral: 'neutral',
};

const tones: ReadonlySet<string> = new Set(['positive', 'negative', 'neutral']);

const trendWords: Record<StatTrend, string> = {
    up: 'up',
    down: 'down',
    neutral: 'no change',
};

/**
 * Compact metric (KPI) block: a label with an optional icon, a large value,
 * and an optional footer with a coloured trend delta and help text.
 *
 * Every piece of text is a slot. `trend` draws the delta's arrow, and the
 * delta shows only while both `trend` and the `delta` slot are set. An unknown
 * `trend` draws as `neutral`, and an empty one as no trend. `tone` colours the
 * delta, in the text colours badge and alert use: `--on-success-container` for
 * `positive`, `--on-error-container` for `negative`, the muted text colour for
 * `neutral`. In the dark schemes the first two are pale tints. Left unset, it
 * follows `trend`, so a fall that is good news, in errors or cost, sets
 * `trend="down" tone="positive"`.
 *
 * The stat is a `role="group"` named by its label, so a screen reader reads a
 * row of stats one by one. The arrow is hidden from it: the delta is read with
 * a word before it, "up", "down" or "no change", which `trend-label` replaces
 * for another language. An `aria-label` on the host does nothing.
 *
 * The footer is drawn only when it has something to show. `divider` draws a
 * dashed rule above it, with the spacing the rule needs; the journal structure
 * draws the rule without it, through `--stat-divider`. A server renders the
 * footer hidden, since it can't see the slots: it shows once the element
 * hydrates.
 *
 * The stat paints its own surface and border, from the panel tokens, so it
 * turns to glass with the glass and liquid materials. Inside a card it draws
 * its border on the card's surface: set `::part(base)` to drop it. In a grid
 * or flex row that stretches its items, the surface fills the row's height. A
 * value too long for the stat wraps.
 *
 * @tag hmi-stat
 * @slot label - Metric name; also the stat's accessible name.
 * @slot value - Primary metric value.
 * @slot icon - Icon beside the label, such as an `svg` or an `img`, drawn 16px square at the default base.
 * @slot delta - Change amount next to the trend arrow; needs `trend`.
 * @slot help-text - Secondary helper text in the footer.
 * @csspart base - The surface; carries `role="group"`.
 * @csspart panel - The surface, as on the other panel-like elements.
 * @csspart label - The label wrapper.
 * @csspart icon - The icon's box.
 * @csspart footer - The footer row holding the delta and the help text.
 * @cssprop --stat-divider - `1` draws the footer's dashed rule and its spacing without `divider`, `0` does not. `0` by default; the journal structure sets `1`.
 *
 * @example
 * <hmi-stat trend="up"><span slot="label">Revenue</span><span slot="value">$12.4k</span><span slot="delta">8%</span></hmi-stat>
 * @example
 * <hmi-stat trend="down" tone="positive"><span slot="label">Errors</span><span slot="value">12</span><span slot="delta">30%</span></hmi-stat>
 */
@customElement('hmi-stat')
export class HmiStat extends LitElement {
    static override styles = [baseStyles, styles];

    /** Direction of change; draws the delta's arrow and, unless `tone` is set, its colour. An unknown value draws as `neutral`. @default undefined */
    @property({ reflect: true }) accessor trend: StatTrend | undefined;

    /** Whether the change is good news; colours the delta. Unset, or an unknown value, follows `trend`. @default undefined */
    @property({ reflect: true }) accessor tone: StatTone | undefined;

    /** Words read before the delta in place of "up", "down" or "no change", such as "in aumento". @default undefined */
    @property({ attribute: 'trend-label' }) accessor trendLabel:
        | string
        | undefined;

    /** Draws a dashed rule above the footer. @default false */
    @property({ type: Boolean, reflect: true }) accessor divider = false;

    @state() private accessor hasDelta = false;
    @state() private accessor hasHelp = false;
    /* Unknown until the slots are read, as on a server: the icon's box is
       kept, so a slotted icon shows from the first paint. */
    @state() private accessor hasIcon: boolean | undefined;

    /* A hydrated root fires no slotchange for the slots it already fills,
       so the slots are read once the root is ready too. */
    override firstUpdated() {
        this.#read();
    }

    #read() {
        const has = (name: string) =>
            (this.renderRoot
                .querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
                ?.assignedNodes({ flatten: true }).length ?? 0) > 0;
        this.hasDelta = has('delta');
        this.hasHelp = has('help-text');
        this.hasIcon = has('icon');
    }

    /* The trend as drawn: unset or empty is none, and an unknown value is
       `neutral`, as v5 drew it. */
    get #trend(): StatTrend | undefined {
        if (!this.trend) return undefined;
        return Object.hasOwn(trendPaths, this.trend) ? this.trend : 'neutral';
    }

    override render() {
        const trend = this.#trend;
        const showDelta = this.hasDelta && trend !== undefined;
        const tone =
            this.tone && tones.has(this.tone)
                ? this.tone
                : trend && trendTones[trend];
        return html`
            <div
                part="base panel"
                class="base"
                role="group"
                aria-labelledby="label"
            >
                ${renderLiquidFilter()}
                <div class="header">
                    <span part="label" class="label" id="label"
                        ><slot name="label"></slot
                    ></span>
                    <span
                        part="icon"
                        class="icon"
                        ?hidden=${this.hasIcon === false}
                        ><slot name="icon" @slotchange=${this.#read}></slot
                    ></span>
                </div>
                <div class="value"><slot name="value"></slot></div>
                <div
                    part="footer"
                    class="footer"
                    ?hidden=${!(showDelta || this.hasHelp)}
                >
                    <span
                        class="delta"
                        data-tone=${tone ?? nothing}
                        ?hidden=${!showDelta}
                    >
                        ${
                            trend
                                ? html`${svg`<svg
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      aria-hidden="true"
                                  >
                                      <path d=${trendPaths[trend]} />
                                  </svg>`}<span class="trend"
                                      >${this.trendLabel ?? trendWords[trend]} </span
                                  >`
                                : nothing
                        }<slot name="delta" @slotchange=${this.#read}></slot>
                    </span>
                    <span class="help"
                        ><slot name="help-text" @slotchange=${this.#read}></slot
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
