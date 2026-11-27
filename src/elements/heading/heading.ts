import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './heading.styles.js';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type HeadingTone = 'default' | 'muted' | 'primary' | 'inherit';

/**
 * Display-level title in the display font. The semantic `level` (an inner
 * `<h1>`–`<h6>`) is decoupled from the visual `size`: each level picks a
 * default size (1 xlarge, 2 large, 3 medium, 4 and 5 small, 6 xsmall), and
 * `size` overrides it independently; a `size` it doesn't know keeps the
 * level's. Tones reuse the standard text roles; `primary` paints the link's
 * text colour, which each surface sets for itself.
 *
 * The host carries the type and the heading inherits it, so the host's
 * `style` and `class` (and a React `style`) set its colour, font, size, line
 * height and spacing as on any element; `::part(base)` reaches the inner
 * heading itself. A long word breaks rather than overflowing, and a heading
 * that wraps is balanced: set `text-wrap: wrap` on the host to wrap greedily.
 * With `truncate`, the heading also shrinks in a flex row or a grid track.
 *
 * The heading element is inside the shadow root, so it is in the
 * accessibility tree and the page outline, but a `querySelectorAll('h2')` on
 * the document, or a page rule such as `h2 + p`, does not find it. A `level`
 * outside 1–6 falls back to 2.
 *
 * @tag hmi-heading
 * @slot - The heading text.
 * @csspart base - The inner `<h1>`–`<h6>` element.
 * @cssprop --on-panel - The text colour inside a panel that sets it, such as an ink card; else `--on-surface`.
 * @cssprop --on-panel-variant - The muted tone inside a panel that sets it; else `--on-surface-variant`.
 * @cssprop --on-panel-link - The primary tone inside a panel that sets it; else `--ref-primary-40`.
 *
 * @example
 * <hmi-heading level="1">Dashboard</hmi-heading>
 * @example
 * <hmi-heading level="3" size="large" tone="muted">Quieter, but big</hmi-heading>
 * @example
 * <hmi-heading level="2" style="color: var(--tertiary); margin-block-end: var(--space-4)">Styled from outside</hmi-heading>
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
        const text = html`<slot></slot>`;
        switch (level) {
            case 1:
                return html`<h1 part="base" class="base">${text}</h1>`;
            case 3:
                return html`<h3 part="base" class="base">${text}</h3>`;
            case 4:
                return html`<h4 part="base" class="base">${text}</h4>`;
            case 5:
                return html`<h5 part="base" class="base">${text}</h5>`;
            case 6:
                return html`<h6 part="base" class="base">${text}</h6>`;
            default:
                return html`<h2 part="base" class="base">${text}</h2>`;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-heading': HmiHeading;
    }
}
