import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './divider.styles.js';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerAlign = 'start' | 'center' | 'end';

/**
 * A thin rule that separates stacked or inline content. Horizontal and vertical
 * orientations are supported. With a label in the default slot, a horizontal
 * divider becomes a row with the text in the middle (or aligned to the start or
 * end) and a rule on each side. A vertical divider is never labelled.
 *
 * The plain divider carries `role="separator"` and `aria-orientation`, as the
 * `<hr>` it replaces did. The labelled divider is not announced as a separator,
 * exactly as in the React version: its rules are `aria-hidden` and the visible
 * label is real text (see `TODO.md`). The label is detected from the slot, so
 * before the element upgrades, including in server-rendered HTML, a divider
 * draws as a plain rule.
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
