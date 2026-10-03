import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './button.styles.js';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'soft'
    | 'danger'
    | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Interactive button styled with MD3 tokens. `type="submit"` and
 * `type="reset"` act on the host form through `ElementInternals`, and a
 * disabled `<fieldset>` around the button disables it.
 *
 * `aria-label` set on the host does not name the inner `<button>`, so an
 * icon-only button takes its accessible name from `label`.
 *
 * @tag hmi-button
 * @slot - Label.
 * @slot left-icon - Rendered before the label.
 * @slot right-icon - Rendered after the label.
 * @csspart base - The inner `<button>`.
 *
 * @example
 * <hmi-button variant="primary" size="large">Launch</hmi-button>
 */
@customElement('hmi-button')
export class HmiButton extends LitElement {
    static override styles = [baseStyles, styles];
    static formAssociated = true;
    static override shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    };

    /** Visual style. @default 'primary' */
    @property({ reflect: true }) accessor variant: ButtonVariant = 'primary';

    /** Control height. @default 'medium' */
    @property({ reflect: true }) accessor size: ButtonSize = 'medium';

    /** Square, icon-only button. @default false */
    @property({ type: Boolean, reflect: true, attribute: 'as-icon' })
    accessor asIcon = false;

    /** Disables interaction. @default false */
    @property({ type: Boolean, reflect: true }) accessor disabled = false;

    /** Native button type. @default 'button' */
    @property() accessor type: ButtonType = 'button';

    /** Accessible name, forwarded to `aria-label` on the inner button. */
    @property() accessor label: string | undefined;

    readonly #internals = this.attachInternals();
    #fieldsetDisabled = false;

    /* Kept apart from `disabled`: re-enabling the fieldset must not clear a
       `disabled` the author set. */
    formDisabledCallback(disabled: boolean): void {
        this.#fieldsetDisabled = disabled;
        this.requestUpdate();
    }

    #onClick(): void {
        if (this.disabled || this.#fieldsetDisabled) return;
        if (this.type === 'submit') this.#internals.form?.requestSubmit();
        else if (this.type === 'reset') this.#internals.form?.reset();
    }

    override render() {
        return html`
            <button
                part="base"
                type=${this.type}
                aria-label=${ifDefined(this.label)}
                ?disabled=${this.disabled || this.#fieldsetDisabled}
                @click=${this.#onClick}
            >
                <slot name="left-icon"></slot>
                <slot></slot>
                <slot name="right-icon"></slot>
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-button': HmiButton;
    }
}
