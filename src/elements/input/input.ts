import { html, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './input.styles.js';

export type InputType =
    | 'text'
    | 'email'
    | 'url'
    | 'tel'
    | 'search'
    | 'password';

/** Detail of `hmi-input` and `hmi-change`: the field's current value. */
export interface InputValueDetail {
    value: string;
}

/**
 * Single-line text field with a label, a hint or error message, and optional
 * leading and trailing icons. A native form control: `name` plus `value` reach
 * `FormData`, `form.reset()` restores the initial value, `required`, `pattern`,
 * `minlength` and `type` use the browser's own validation, and a non-empty
 * `error` marks it invalid with that message.
 *
 * `hmi-input` fires on every keystroke and `hmi-change` when the value is
 * committed (blur, or Enter), both with `{ value }`. The element owns its value:
 * to veto a change, set `value` back from a listener. The `value` attribute is
 * the initial value, and `defaultValue` (when set) is what a reset restores.
 *
 * `aria-*` on the host does not name the inner input, so name it with `label`.
 * `type="number"` belongs to `hmi-number-input`.
 *
 * @tag hmi-input
 * @slot left-icon - Icon before the text.
 * @slot right-icon - Icon after the text.
 * @fires {CustomEvent<InputValueDetail>} hmi-input - The value changed (every keystroke).
 * @fires {CustomEvent<InputValueDetail>} hmi-change - The value was committed.
 * @csspart base - The bordered field box.
 * @csspart control - The native input.
 * @csspart label - The label.
 * @csspart icon - An icon slot.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-input name="email" type="email" label="Email" required></hmi-input>
 */
@customElement('hmi-input')
export class HmiInput extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The current value. The attribute is the initial value. @default '' */
    @property() accessor value = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    /** Native input type. @default 'text' */
    @property({ reflect: true }) accessor type: InputType = 'text';

    /** Hint shown while the field is empty. */
    @property() accessor placeholder: string | undefined;

    /** The value can be selected and copied but not edited. @default false */
    @property({ type: Boolean, reflect: true }) accessor readonly = false;

    /** Browser autofill hint, such as `email` or `one-time-code`. */
    @property() accessor autocomplete: string | undefined;

    /** Shortest valid value, in characters. */
    @property({ type: Number }) accessor minlength: number | undefined;

    /** Longest value, in characters. */
    @property({ type: Number }) accessor maxlength: number | undefined;

    /** Regular expression the value must match. */
    @property() accessor pattern: string | undefined;

    /** Virtual keyboard hint, such as `numeric` or `email`. */
    @property() accessor inputmode: string | undefined;

    @query('input') private accessor field!: HTMLInputElement | null;

    #initialValue = '';

    protected get formValue(): string {
        return this.value;
    }

    protected get control(): HTMLInputElement | null {
        return this.field;
    }

    protected resetFormValue(): void {
        this.value = this.defaultValue ?? this.#initialValue;
    }

    protected override restoreFormValue(
        state: string | File | FormData | null,
    ) {
        if (typeof state === 'string') this.value = state;
    }

    override willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            if (this.defaultValue !== undefined && this.value === '') {
                this.value = this.defaultValue;
            }
            this.#initialValue = this.value;
        }
        super.willUpdate(changed);
    }

    #onInput(event: Event): void {
        this.value = (event.target as HTMLInputElement).value;
        emit<InputValueDetail>(this, 'hmi-input', { value: this.value });
    }

    #onChange(): void {
        emit<InputValueDetail>(this, 'hmi-change', { value: this.value });
    }

    override render() {
        return html`
            ${this.renderLabel()}
            <div
                part="base"
                class=${this.error ? 'base invalid' : this.isDisabled ? 'base disabled' : 'base'}
            >
                <slot name="left-icon" part="icon"></slot>
                <input
                    id="control"
                    part="control"
                    class="control"
                    type=${this.type}
                    .value=${live(this.value)}
                    placeholder=${ifDefined(this.placeholder)}
                    autocomplete=${ifDefined(this.autocomplete)}
                    inputmode=${ifDefined(this.inputmode)}
                    pattern=${ifDefined(this.pattern)}
                    minlength=${ifDefined(this.minlength)}
                    maxlength=${ifDefined(this.maxlength)}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    ?disabled=${this.isDisabled}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(this.describedBy)}
                    @input=${this.#onInput}
                    @change=${this.#onChange}
                />
                <slot name="right-icon" part="icon"></slot>
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-input': HmiInput;
    }
}
