import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './legend.styles.js';

export type LegendAlign = 'start' | 'center' | 'end';

/** One entry of the legend. */
export interface LegendItem {
    /** The series name: plain text, or the fallback of the `label-<index>` slot. */
    label: string;
    /** The series colour: any CSS colour, including a token such as `var(--primary)`. Consumer data, such as a chart's palette entry. */
    color: string;
    /** Draw the swatch as a hollow ring instead of a filled square. @default false */
    inactive?: boolean;
}

/**
 * Chart legend: a row of colour swatches with series names. The swatch colours
 * are consumer data; everything else is themed.
 *
 * A `label` is text. For richer content, slot an element named `label-<index>`
 * (the entry's position, from 0), which replaces that text.
 *
 * @tag hmi-legend
 * @slot label-<index> - Rich label for the entry at that position.
 * @csspart base - The list.
 * @csspart item - One entry.
 * @csspart swatch - An entry's colour swatch. `data-inactive` marks a hollow one.
 * @csspart label - An entry's name.
 *
 * @example
 * const legend = document.querySelector('hmi-legend');
 * legend.items = [{ label: 'Revenue', color: 'var(--primary)' }, { label: 'Forecast', color: 'var(--secondary)', inactive: true }];
 */
@customElement('hmi-legend')
export class HmiLegend extends LitElement {
    static override styles = [baseStyles, styles];

    /** The entries. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor items: LegendItem[] =
        [];

    /** Horizontal alignment of the row. @default 'center' */
    @property({ reflect: true }) accessor align: LegendAlign = 'center';

    override render() {
        return html`<ul part="base" class="base">
            ${this.items.map(
                (item, index) => html`<li part="item" class="item">
                    <span
                        part="swatch"
                        class="swatch"
                        ?data-inactive=${item.inactive}
                        style=${styleMap({ color: item.color })}
                    ></span>
                    <span part="label" class="label"
                        ><slot name=${`label-${index}`}>${item.label}</slot></span
                    >
                </li>`,
            )}
        </ul>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-legend': HmiLegend;
    }
}
