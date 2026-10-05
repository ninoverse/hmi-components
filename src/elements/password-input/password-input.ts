import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
    HmiInput,
    type InputType,
    type InputValueDetail,
} from '../input/input.js';
import { styles as inputStyles } from '../input/input.styles.js';
import { baseStyles } from '../shared/base.styles.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './password-input.styles.js';

/** Detail of `hmi-input` and `hmi-change`: the field's current value. */
export type PasswordInputValueDetail = InputValueDetail;

/**
 * `hmi-input` preconfigured for passwords, with a built-in show/hide toggle. It
 * extends `HmiInput`, so everything there applies: a native form control, the
 * `label`, `hint` and `error` text, `hmi-input` per keystroke and `hmi-change`
 * on commit, and the `left-icon` slot.
 *
 * The field is always `type="password"` or, while revealed, `type="text"`: the
 * inherited `type` property is ignored. The eye toggle replaces the
 * `right-icon` slot, is a button with `aria-pressed`, and is disabled while the
 * field is. Revealing does not change the value or what the form submits.
 *
 * @tag hmi-password-input
 * @slot left-icon - Icon before the text.
 * @fires {CustomEvent<PasswordInputValueDetail>} hmi-input - The value changed (every keystroke).
 * @fires {CustomEvent<PasswordInputValueDetail>} hmi-change - The value was committed.
 * @csspart base - The bordered field box.
 * @csspart control - The native input.
 * @csspart toggle - The show/hide button.
 * @csspart label - The label.
 * @csspart icon - The icon slot.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-password-input name="password" label="Password" autocomplete="current-password"></hmi-password-input>
 */
@customElement('hmi-password-input')
export class HmiPasswordInput extends HmiInput {
    static override styles = [baseStyles, formStyles, inputStyles, styles];

    /** Accessible name of the toggle while the password is hidden. @default 'Show password' */
    @property({ attribute: 'show-label' }) accessor showLabel = 'Show password';

    /** Accessible name of the toggle while the password is shown. @default 'Hide password' */
    @property({ attribute: 'hide-label' }) accessor hideLabel = 'Hide password';

    @state() private accessor revealed = false;

    protected override get inputType(): InputType {
        return this.revealed ? 'text' : 'password';
    }

    #toggle(): void {
        this.revealed = !this.revealed;
    }

    protected override renderTrailing(): TemplateResult {
        return html`<button
            part="toggle"
            class="toggle"
            type="button"
            aria-label=${this.revealed ? this.hideLabel : this.showLabel}
            aria-pressed=${this.revealed ? 'true' : 'false'}
            ?disabled=${this.isDisabled}
            @click=${this.#toggle}
        >
            ${
                this.revealed
                    ? html`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
                          <path d="M1.5 8s2.5-4.5 6.5-4.5c1.4 0 2.6.5 3.6 1.1M14.5 8s-2.5 4.5-6.5 4.5c-1.4 0-2.6-.5-3.6-1.1" />
                          <path d="M2 2l12 12" />
                      </svg>`
                    : html`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                          <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z" />
                          <circle cx="8" cy="8" r="2" />
                      </svg>`
            }
        </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-password-input': HmiPasswordInput;
    }
}
