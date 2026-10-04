import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './text.styles.js';

export type TextSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextTone = 'default' | 'muted' | 'primary' | 'error' | 'inherit';
export type TextAlign = 'start' | 'center' | 'end';

/**
 * The body-copy primitive. Defaults to medium size, regular weight and the
 * standard on-surface tone in the UI font; size, weight, tone, alignment and
 * single-line truncation are opt-in.
 *
 * The host is the text: a block by default, or inline with `inline`, with no
 * inner element and so no paragraph semantics. Wrap it in a `<p>`, or set
 * `role="paragraph"` on the host, where the text is a paragraph. There is no
 * `as` property. `truncate` needs a block, so it has no effect with `inline`.
 *
 * @tag hmi-text
 * @slot - The text.
 *
 * @example
 * <hmi-text size="small" tone="muted">Secondary copy</hmi-text>
 */
@customElement('hmi-text')
export class HmiText extends LitElement {
    static override styles = [baseStyles, styles];

    /** Font size. @default 'medium' */
    @property({ reflect: true }) accessor size: TextSize = 'medium';

    /** Font weight. @default 'regular' */
    @property({ reflect: true }) accessor weight: TextWeight = 'regular';

    /** Colour role. @default 'default' */
    @property({ reflect: true }) accessor tone: TextTone = 'default';

    /** Horizontal alignment. Unset by default, so the text inherits it. */
    @property({ reflect: true }) accessor align: TextAlign | undefined;

    /** Keeps the text on one line and ends it with an ellipsis. @default false */
    @property({ type: Boolean, reflect: true }) accessor truncate = false;

    /** Lays the text out inline instead of as a block. @default false */
    @property({ type: Boolean, reflect: true }) accessor inline = false;

    override render() {
        return html`<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-text': HmiText;
    }
}
