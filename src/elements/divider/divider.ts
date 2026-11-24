import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { readSlots } from '../shared/dom.js';
import { styles } from './divider.styles.js';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerAlign = 'start' | 'center' | 'end';

/**
 * A thin rule that separates stacked or inline content. Horizontal and vertical
 * orientations are supported. A horizontal divider fills the width its parent
 * gives it, in a flex row or a centred column too, as the `<hr>` it replaces
 * did; a vertical one stretches to its flex row's height. With a label in the
 * default slot, a horizontal divider becomes a row with the text in the middle
 * (or aligned to the start or end) and a rule on each side. A long label wraps,
 * aligned the same way, and each rule keeps 1.5 base units. A vertical divider
 * is never labelled: its label is not shown.
 *
 * The rules are `--outline`; the label is `--on-surface-variant`, or the
 * card's muted text colour inside a card. In forced colours the rules are
 * `CanvasText`.
 *
 * The plain divider carries `role="separator"` and `aria-orientation`, as the
 * `<hr>` it replaces did. The labelled divider is not a separator: its rules
 * are `aria-hidden` and the label is read as text, as in the React version. A
 * separator's content is presentational, so making it one would leave the
 * label only as the separator's name, which screen readers don't all speak,
 * and would hide a link in it. The label is detected from the slot, and
 * whitespace alone is no label; before the element upgrades, including in
 * server-rendered HTML, a divider draws as a plain rule.
 *
 * @tag hmi-divider
 * @slot - The label, shown on a horizontal divider.
 * @csspart base - The rule, or the row that holds the label and its rules.
 * @csspart label - The label wrapper.
 *
 * @example
 * <hmi-divider></hmi-divider>
 * @example
 * <hmi-divider align="start">OR</hmi-divider>
 */
@customElement('hmi-divider')
export class HmiDivider extends LitElement {
    static override styles = [baseStyles, styles];

    /** Direction of the rule. @default 'horizontal' */
    @property({ reflect: true }) accessor orientation: DividerOrientation =
        'horizontal';

    /** Where the label sits on the rule. @default 'center' */
    @property({ reflect: true }) accessor align: DividerAlign = 'center';

    @state() private accessor hasLabel = false;

    #onSlotChange(event: Event): void {
        const slot = event.target as HTMLSlotElement;
        this.hasLabel = slot
            .assignedNodes({ flatten: true })
            .some(
                (node) =>
                    node.nodeType === Node.ELEMENT_NODE ||
                    (node.textContent ?? '').trim() !== '',
            );
    }

    /* A hydrated root fires no slotchange for the slots the server filled. */
    protected override firstUpdated(): void {
        readSlots(this.renderRoot);
    }

    override render() {
        const labeled = this.hasLabel && this.orientation === 'horizontal';
        return html`
            <div
                part="base"
                class=${labeled ? 'base labeled' : 'base'}
                role=${labeled ? nothing : 'separator'}
                aria-orientation=${labeled ? nothing : this.orientation}
            >
                <span class="line" aria-hidden="true"></span>
                <span part="label" class="label"
                    ><slot @slotchange=${this.#onSlotChange}></slot
                ></span>
                <span class="line" aria-hidden="true"></span>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-divider': HmiDivider;
    }
}
