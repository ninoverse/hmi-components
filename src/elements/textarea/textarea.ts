import { html, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './textarea.styles.js';

/** Detail of `hmi-input` and `hmi-change`: the field's current value. */
export interface TextareaValueDetail {
    value: string;
}

/**
 * Multi-line text field with a label, a hint or error message, and a vertical
 * resize handle. A native form control, like `hmi-input`: `name` plus `value`
 * reach `FormData`, `form.reset()` restores the initial value, `required`,
 * `minlength` and `maxlength` use the browser's own validation, and a non-empty
 * `error` marks it invalid with that message.
 *
 * `hmi-input` fires on every keystroke and `hmi-change` when the value is
 * committed (blur), both with `{ value }`. The element owns its value: to veto a
 * change, set `value` back from a listener. The `value` attribute is the initial
 * value, and `defaultValue` (when set) is what a reset restores.
 *
 * The form receives line breaks as `LF`; a native `<textarea>` submits `CRLF`.
 * `aria-*` on the host does not name the inner textarea, so name it with `label`.
 *
 * @tag hmi-textarea
 * @fires {CustomEvent<TextareaValueDetail>} hmi-input - The value changed (every keystroke).
 * @fires {CustomEvent<TextareaValueDetail>} hmi-change - The value was committed.
 * @csspart base - The native textarea, which is the bordered field box.
 * @csspart control - The native textarea.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-textarea name="bio" label="About you" rows="4" maxlength="240"></hmi-textarea>
 */
@customElement('hmi-textarea')
export class HmiTextarea extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The current value. The attribute is the initial value. @default '' */
    @property() accessor value = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    /** Hint shown while the field is empty. */
    @property() accessor placeholder: string | undefined;

    /** The value can be selected and copied but not edited. @default false */
    @property({ type: Boolean, reflect: true }) accessor readonly = false;

    /** Number of visible text lines. The field is at least 12 base units tall. */
    @property({ type: Number }) accessor rows: number | undefined;

    /** Browser autofill hint. */
    @property() accessor autocomplete: string | undefined;

    /** Shortest valid value, in characters. */
    @property({ type: Number }) accessor minlength: number | undefined;

    /** Longest value, in characters. */
    @property({ type: Number }) accessor maxlength: number | undefined;

    @query('textarea') private accessor field!: HTMLTextAreaElement | null;

    #initialValue = '';

    protected get formValue(): string {
        return this.value;
    }

    protected get control(): HTMLTextAreaElement | null {
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
        this.value = (event.target as HTMLTextAreaElement).value;
        emit<TextareaValueDetail>(this, 'hmi-input', { value: this.value });
    }

    #onChange(): void {
        emit<TextareaValueDetail>(this, 'hmi-change', { value: this.value });
    }

    override render() {
        return html`
            ${this.renderLabel()}
            <textarea
                id="control"
                part="base control"
                class=${this.error ? 'control invalid' : 'control'}
                .value=${live(this.value)}
                placeholder=${ifDefined(this.placeholder)}
                autocomplete=${ifDefined(this.autocomplete)}
                rows=${ifDefined(this.rows)}
                minlength=${ifDefined(this.minlength)}
                maxlength=${ifDefined(this.maxlength)}
                ?readonly=${this.readonly}
                ?required=${this.required}
                ?disabled=${this.isDisabled}
                aria-invalid=${ifDefined(this.invalid)}
                aria-describedby=${ifDefined(this.describedBy)}
                @input=${this.#onInput}
                @change=${this.#onChange}
            ></textarea>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-textarea': HmiTextarea;
    }
}
