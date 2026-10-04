import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './flex.styles.js';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify =
    | 'start'
    | 'center'
    | 'end'
    | 'between'
    | 'around'
    | 'evenly';
export type FlexGap = 'none' | 'small' | 'medium' | 'large';

/**
 * Flexbox layout primitive. A plain row with stretch alignment and no gap by
 * default; direction, alignment, justification, gap and wrapping are opt-in.
 * The gap scale matches `hmi-box` padding.
 *
 * The host is the flex container and the slotted children are its items. There
 * is no `as` property: put `role` on the host or wrap it.
 *
 * @tag hmi-flex
 * @slot - The flex items.
 *
 * @example
 * <hmi-flex direction="column" gap="medium" align="start">…</hmi-flex>
 */
@customElement('hmi-flex')
export class HmiFlex extends LitElement {
    static override styles = [baseStyles, styles];

    /** Main axis. @default 'row' */
    @property({ reflect: true }) accessor direction: FlexDirection = 'row';

    /** Cross-axis alignment (`align-items`). @default 'stretch' */
    @property({ reflect: true }) accessor align: FlexAlign = 'stretch';

    /** Main-axis distribution (`justify-content`). @default 'start' */
    @property({ reflect: true }) accessor justify: FlexJustify = 'start';

    /** Space between items. @default 'none' */
    @property({ reflect: true }) accessor gap: FlexGap = 'none';

    /** Lets items wrap onto further lines. @default false */
    @property({ type: Boolean, reflect: true }) accessor wrap = false;

    /** Lays the container out inline (`inline-flex`). @default false */
    @property({ type: Boolean, reflect: true }) accessor inline = false;

    override render() {
        return html`<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-flex': HmiFlex;
    }
}
