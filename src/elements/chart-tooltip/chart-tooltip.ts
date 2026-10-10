import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { toggleEmpty } from '../shared/dom.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { styles } from './chart-tooltip.styles.js';

/** One row of the tooltip. */
export interface ChartTooltipItem {
    /** The row label, such as the series name: plain text, or the fallback of the `label-<index>` slot. */
    label: string;
    /** The value at the hovered point: plain text, or the fallback of the `value-<index>` slot. */
    value: string;
    /** The series colour: any CSS colour, including a token such as `var(--primary)`. Without it, no swatch is drawn. */
    color?: string;
}

/**
 * Presentational tooltip card for charts: a heading and one row per series, each
 * with a colour swatch, a label and a right-aligned value. A panel-like element.
 *
 * It only renders the content. Positioning it on hover is the consumer's job: it
 * ignores the pointer, so it never gets in the way of what it points at.
 *
 * A `heading`, a row's `label` and a row's `value` are text. For richer content,
 * slot an element named `heading`, `label-<index>` or `value-<index>` (the row's
 * position, from 0), which replaces that text.
 *
 * @tag hmi-chart-tooltip
 * @slot heading - Rich heading, replacing the `heading` text.
 * @slot label-<index> - Rich label for the row at that position.
 * @slot value-<index> - Rich value for the row at that position.
 * @csspart base - The card.
 * @csspart panel - The card, under its panel-group name.
 * @csspart heading - The heading.
 * @csspart list - The list of rows.
 * @csspart row - One row.
 * @csspart swatch - A row's colour swatch.
 * @csspart label - A row's label.
 * @csspart value - A row's value.
 *
 * @example
 * const tip = document.querySelector('hmi-chart-tooltip');
 * tip.heading = 'Jan 2026';
 * tip.items = [{ label: 'Revenue', value: '$48.2k', color: 'var(--primary)' }];
 */
@customElement('hmi-chart-tooltip')
export class HmiChartTooltip extends LitElement {
    static override styles = [baseStyles, styles];

    /** The heading, such as the hovered category: plain text, or the fallback of the `heading` slot. */
    @property() accessor heading: string | undefined;

    /** The rows, one per series at the hovered point. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor items: ChartTooltipItem[] = [];

    override render() {
        return html`<div part="base panel" class="panel" role="tooltip">
            ${renderLiquidFilter()}
            <div part="heading" class="heading" ?hidden=${!this.heading}
                ><slot
                    name="heading"
                    @slotchange=${(e: Event) => toggleEmpty(e, !!this.heading)}
                    >${this.heading}</slot
                ></div
            >
            <ul part="list" class="list">
                ${this.items.map(
                    (item, index) => html`<li part="row" class="row">
                        ${
                            item.color != null
                                ? html`<span
                                      part="swatch"
                                      class="swatch"
                                      style=${styleMap({ color: item.color })}
                                  ></span>`
                                : nothing
                        }
                        <span part="label" class="label"
                            ><slot name=${`label-${index}`}>${item.label}</slot></span
                        >
                        <span part="value" class="value"
                            ><slot name=${`value-${index}`}>${item.value}</slot></span
                        >
                    </li>`,
                )}
            </ul>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-chart-tooltip': HmiChartTooltip;
    }
}
