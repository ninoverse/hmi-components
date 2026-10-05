import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './form-control.styles.js';

/** Whether a slot has anything assigned to it. */
const hasContent = (slot: HTMLSlotElement): boolean =>
    slot
        .assignedNodes({ flatten: true })
        .some(
            (node) =>
                node.nodeType === Node.ELEMENT_NODE ||
                (node.textContent ?? '').trim() !== '',
        );

/**
 * A vertical stack of a label, a control and a hint or error message, for
 * children that do not render their own, such as a custom control.
 *
 * @deprecated The form elements (`hmi-input`, `hmi-textarea`, …) render their
 * own `label`, `hint` and `error`, tied to the control for assistive
 * technology. Set those on the element instead of wrapping it. The wrapper does
 * not associate its label with the control, and its error is not an alert.
 *
 * `label`, `hint` and `error` are strings, and the slots of the same names
 * replace them with rich content. The error replaces the hint while it is set.
 *
 * @tag hmi-form-control
 * @slot - The control.
 * @slot label - Replaces the `label` string.
 * @slot hint - Replaces the `hint` string.
 * @slot error - Replaces the `error` string.
 * @csspart label - The label.
 * @csspart hint - The hint.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-form-control label="Email" error="Not an email"><my-control></my-control></hmi-form-control>
 */
@customElement('hmi-form-control')
export class HmiFormControl extends LitElement {
    static override styles = [baseStyles, formStyles, styles];

    /** Text above the control. */
    @property() accessor label = '';

    /** Helper text below the control; hidden while an error is set. */
    @property() accessor hint = '';

    /** Error message below the control; takes precedence over the hint. */
    @property() accessor error = '';

    @state() private accessor hasLabel = false;
    @state() private accessor hasHint = false;
    @state() private accessor hasError = false;

    #onSlotChange(event: Event): void {
        const slot = event.target as HTMLSlotElement;
        const has = hasContent(slot);
        if (slot.name === 'label') this.hasLabel = has;
        else if (slot.name === 'hint') this.hasHint = has;
        else this.hasError = has;
    }

    override render() {
        const showError = Boolean(this.error) || this.hasError;
        const showHint = (Boolean(this.hint) || this.hasHint) && !showError;
        return html`
            <span part="label" class="label" ?hidden=${!(this.label || this.hasLabel)}
                ><slot name="label" @slotchange=${this.#onSlotChange}>${this.label}</slot></span
            >
            <slot></slot>
            <span part="hint" class="message hint" ?hidden=${!showHint}
                ><slot name="hint" @slotchange=${this.#onSlotChange}>${this.hint}</slot></span
            >
            <span part="error" class="message error" ?hidden=${!showError}
                ><slot name="error" @slotchange=${this.#onSlotChange}>${this.error}</slot></span
            >
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-form-control': HmiFormControl;
    }
}
