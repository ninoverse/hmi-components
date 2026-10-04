import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './grid.styles.js';

export type GridGap = 'none' | 'small' | 'medium' | 'large';

/* A digit-only attribute is a track count, anything else a template. */
const columnsConverter = {
    fromAttribute: (value: string | null): number | string | null =>
        value !== null && /^\d+$/.test(value) ? Number(value) : value,
};

/**
 * CSS grid layout primitive. A number of `columns` gives equal
 * `minmax(0, 1fr)` tracks, and a string is used as the
 * `grid-template-columns` value as-is. The gap scale matches `hmi-box` padding
 * and `hmi-flex`.
 *
 * The grid lives in an inner `base` element that carries the template through
 * the CSSOM, so an arbitrary string cannot escape into the stylesheet and the
 * host's own `style` stays yours. The slotted children are the grid items.
 * There is no `as` property: put `role` on the host or wrap it.
 *
 * @tag hmi-grid
 * @slot - The grid items.
 * @csspart base - The grid container.
 *
 * @example
 * <hmi-grid columns="3" gap="medium">…</hmi-grid>
 * @example
 * <hmi-grid columns="1fr 2fr">…</hmi-grid>
 */
@customElement('hmi-grid')
export class HmiGrid extends LitElement {
    static override styles = [baseStyles, styles];

    /** Equal tracks when a number (or digits), else a `grid-template-columns` value. @default 2 */
    @property({ converter: columnsConverter }) accessor columns:
        | number
        | string = 2;

    /** Space between rows and columns. @default 'none' */
    @property({ reflect: true }) accessor gap: GridGap = 'none';

    override render() {
        const template =
            typeof this.columns === 'number'
                ? `repeat(${this.columns}, minmax(0, 1fr))`
                : this.columns;
        return html`<div
            part="base"
            class="base"
            style=${styleMap({ gridTemplateColumns: template })}
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
