import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './grid.styles.js';

export type GridGap = 'none' | 'small' | 'medium' | 'large';

/** A track count, or a `grid-template-columns` value. */
export type GridColumns = number | string;

/* A digit-only attribute is a track count, anything else a template. */
const columnsConverter = {
    fromAttribute: (value: string | null): number | string | null =>
        value !== null && /^\d+$/.test(value) ? Number(value) : value,
};

/**
 * CSS grid layout primitive. A number of `columns` gives equal
 * `minmax(0, 1fr)` tracks, and a string is used as the
 * `grid-template-columns` value as-is; without `columns` there are two tracks,
 * and a template CSS rejects lays out as one column. The gap scale matches
 * `hmi-box` padding and `hmi-flex`.
 *
 * The grid lives in an inner `base` element that carries the template through
 * the CSSOM, so the server writes it and an arbitrary string cannot escape
 * into the stylesheet. The host's `style` and `class` still lay out the grid:
 * the base takes the host's `gap`, which beats the `gap` preset, its
 * `align-items`, `justify-items`, `align-content`, `justify-content`,
 * `grid-auto-rows`, `grid-auto-columns`, `grid-auto-flow`,
 * `grid-template-rows` and `grid-template-areas`, and fills a height given to
 * the host. The columns come from `columns` alone: a
 * `grid-template-columns` on the host is ignored. `::part(base)` reaches the
 * grid too. For an inline grid, set `display: inline-block` on the host. The
 * slotted children are the grid items. There is no `as` property: put `role`
 * on the host or wrap it.
 *
 * @tag hmi-grid
 * @slot - The grid items.
 * @csspart base - The grid container.
 *
 * @example
 * <hmi-grid columns="3" gap="medium">…</hmi-grid>
 * @example
 * <hmi-grid columns="1fr 2fr">…</hmi-grid>
 * @example
 * <hmi-grid columns="2" style="align-items: center; grid-auto-rows: 64px">…</hmi-grid>
 */
@customElement('hmi-grid')
export class HmiGrid extends LitElement {
    static override styles = [baseStyles, styles];

    /** Equal tracks when a number (or digits), else a `grid-template-columns` value. @default 2 */
    @property({ converter: columnsConverter }) accessor columns: GridColumns =
        2;

    /** Space between rows and columns. @default 'none' */
    @property({ reflect: true }) accessor gap: GridGap = 'none';

    override render() {
        /* A removed or empty attribute is the default. The template goes
           through a custom property, which takes any value: one CSS rejects
           then lays out as one column, as the server draws it, where
           grid-template-columns itself would keep the last valid one. */
        const columns = this.columns ?? '';
        const template =
            typeof columns === 'number'
                ? `repeat(${columns}, minmax(0, 1fr))`
                : columns || 'repeat(2, minmax(0, 1fr))';
        return html`<div
            part="base"
            class="base"
            style=${styleMap({ '--_columns': template })}
        >
            <slot></slot>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-grid': HmiGrid;
    }
}
