import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './heading.styles.js';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type HeadingTone = 'default' | 'muted' | 'primary' | 'inherit';

const sizeForLevel: Record<HeadingLevel, HeadingSize> = {
    1: 'xlarge',
    2: 'large',
    3: 'medium',
    4: 'small',
    5: 'small',
    6: 'xsmall',
};

/**
 * Display-level title in the display font. The semantic `level` (an inner
 * `<h1>`–`<h6>`) is decoupled from the visual `size`: each level picks a
 * default size, and `size` overrides it independently. Tones reuse the
 * standard text roles.
 *
 * The heading element is inside the shadow root, so it is in the
 * accessibility tree and the page outline, but a `querySelectorAll('h2')` on
 * the document does not find it. A `level` outside 1–6 falls back to 2.
 *
 * @tag hmi-heading
 * @slot - The heading text.
 * @csspart base - The inner `<h1>`–`<h6>` element.
 *
 * @example
 * <hmi-heading level="1">Dashboard</hmi-heading>
 * @example
 * <hmi-heading level="3" size="large" tone="muted">Quieter, but big</hmi-heading>
 */
@customElement('hmi-heading')
export class HmiHeading extends LitElement {
    static override styles = [baseStyles, styles];

    /** Semantic level, the tag of the inner heading. @default 2 */
    @property({ type: Number, reflect: true }) accessor level: HeadingLevel = 2;

    /** Visual size. Defaults to the size that goes with `level`. */
    @property({ reflect: true }) accessor size: HeadingSize | undefined;

    /** Colour role. @default 'default' */
    @property({ reflect: true }) accessor tone: HeadingTone = 'default';

    /** Keeps the heading on one line and ends it with an ellipsis. @default false */
    @property({ type: Boolean, reflect: true }) accessor truncate = false;

    override render() {
        const level: HeadingLevel = [1, 2, 3, 4, 5, 6].includes(this.level)
            ? this.level
            : 2;
        const cls = `base size-${this.size || sizeForLevel[level]}`;
        const text = html`<slot></slot>`;
        switch (level) {
            case 1:
                return html`<h1 part="base" class=${cls}>${text}</h1>`;
            case 3:
                return html`<h3 part="base" class=${cls}>${text}</h3>`;
            case 4:
                return html`<h4 part="base" class=${cls}>${text}</h4>`;
            case 5:
                return html`<h5 part="base" class=${cls}>${text}</h5>`;
            case 6:
                return html`<h6 part="base" class=${cls}>${text}</h6>`;
            default:
                return html`<h2 part="base" class=${cls}>${text}</h2>`;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-heading': HmiHeading;
    }
}
