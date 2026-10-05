import { html, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './number-input.styles.js';

/** Detail of `hmi-input` and `hmi-change`: the number, or `null` when empty. */
export interface NumberInputValueDetail {
    value: number | null;
}

/** The number in a text field, or `null` when it is empty or not a number. */
function toNumber(raw: string | null | undefined): number | null {
    if (raw === null || raw === undefined || raw.trim() === '') return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
}

/* An empty or non-numeric attribute is `null` (or unset), not 0 as Lit's own
   Number converter would make it. */
const nullableNumber = { fromAttribute: toNumber };
const optionalNumber = {
    fromAttribute: (raw: string | null) => toNumber(raw) ?? undefined,
};

const decimals = (n: number): number => String(n).split('.')[1]?.length ?? 0;

/**
 * Numeric field with stepper buttons and min/max clamping. An empty field is
 * `null`. A native form control: `name` plus `value` reach `FormData` (nothing
 * when empty), `form.reset()` restores the initial value, and `required`,
 * `min`, `max` and `step` use the browser's own validation, with a non-empty
 * `error` marking it invalid with that message.
 *
 * `hmi-input` fires on every edit and `hmi-change` when the value is committed
 * (blur, Enter, or a stepper click), both with `{ value }` where `value` is a
 * number or `null`. Commit clamps the value to `min` and `max`, so `hmi-change`
 * fires once, with the clamped value. A stepper click fires `hmi-input` then
 * `hmi-change`, and rounds to the decimals of `step`. The element owns its
 * value: to veto a change, set `value` back from a listener. The `value`
 * attribute is the initial value, and `defaultValue` (when set) is what a reset
 * restores.
 *
 * `aria-*` on the host does not name the inner input, so name it with `label`.
 *
 * @tag hmi-number-input
 * @fires {CustomEvent<NumberInputValueDetail>} hmi-input - The value changed (every edit).
 * @fires {CustomEvent<NumberInputValueDetail>} hmi-change - The value was committed, clamped to `min` and `max`.
 * @csspart base - The bordered field box.
 * @csspart control - The native number input.
 * @csspart increase - The increase button.
 * @csspart decrease - The decrease button.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-number-input name="qty" label="Quantity" min="1" max="99" value="1"></hmi-number-input>
 */
@customElement('hmi-number-input')
export class HmiNumberInput extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'numeric';

    /** The current value, or `null` when empty. The attribute is the initial value. @default null */
    @property({ converter: nullableNumber }) accessor value: number | null =
        null;

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value', converter: optionalNumber })
    accessor defaultValue: number | undefined;

    /** Smallest value: commit clamps to it and the decrease button stops there. */
    @property({ converter: optionalNumber }) accessor min: number | undefined;

    /** Largest value: commit clamps to it and the increase button stops there. */
    @property({ converter: optionalNumber }) accessor max: number | undefined;

    /** How much a stepper click or an arrow key changes the value. @default 1 */
    @property({ type: Number }) accessor step = 1;

    /** Hint shown while the field is empty. */
    @property() accessor placeholder: string | undefined;

    /** The value can be selected and copied but not edited or stepped. @default false */
    @property({ type: Boolean, reflect: true }) accessor readonly = false;

    /** Accessible name of the increase button. @default 'Increase' */
    @property({ attribute: 'increase-label' }) accessor increaseLabel =
        'Increase';

    /** Accessible name of the decrease button. @default 'Decrease' */
    @property({ attribute: 'decrease-label' }) accessor decreaseLabel =
        'Decrease';

    @query('input') private accessor field!: HTMLInputElement | null;

    #initialValue: number | null = null;

    protected get formValue(): number | null {
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
        if (typeof state === 'string') this.value = toNumber(state);
    }

    override willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            if (this.defaultValue !== undefined && this.value === null) {
                this.value = this.defaultValue;
            }
            this.#initialValue = this.value;
        }
        super.willUpdate(changed);
    }

    /* The text field is written only when its number differs from ours, so
       typing "1.0" or "1e2" is not rewritten under the user's hands. */
    override updated(changed: PropertyValues<this>): void {
        const input = this.field;
        if (input && toNumber(input.value) !== this.value) {
            input.value = this.value === null ? '' : String(this.value);
        }
        super.updated(changed);
    }

    #clamp(n: number): number {
        let result = n;
        if (this.min !== undefined) result = Math.max(this.min, result);
        if (this.max !== undefined) result = Math.min(this.max, result);
        return result;
    }

    #emit(type: 'hmi-input' | 'hmi-change'): void {
        emit<NumberInputValueDetail>(this, type, { value: this.value });
    }

    #onInput(event: Event): void {
        this.value = toNumber((event.target as HTMLInputElement).value);
        this.#emit('hmi-input');
    }

    /** Clamps, and reports the commit: always for a native change, else only if clamping changed the value. */
    #commit(always: boolean): void {
        const clamped = this.value === null ? null : this.#clamp(this.value);
        const changed = clamped !== this.value;
        if (changed) this.value = clamped;
        if (always || changed) this.#emit('hmi-change');
    }

    #bump(delta: number): void {
        const base = this.value ?? this.min ?? 0;
        const places = Math.max(decimals(base), decimals(delta));
        this.value = this.#clamp(Number((base + delta).toFixed(places)));
        this.#emit('hmi-input');
        this.#emit('hmi-change');
    }

    override render() {
        const { value, min, max } = this;
        const stepsDisabled = this.isDisabled || this.readonly;
        const atMin = value !== null && min !== undefined && value <= min;
        const atMax = value !== null && max !== undefined && value >= max;
        return html`
            ${this.renderLabel()}
            <div
                part="base"
                class=${this.error ? 'base invalid' : this.isDisabled ? 'base disabled' : 'base'}
            >
                <input
                    id="control"
                    part="control"
                    class="control"
                    type="number"
                    min=${ifDefined(min)}
                    max=${ifDefined(max)}
                    step=${this.step}
                    placeholder=${ifDefined(this.placeholder)}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    ?disabled=${this.isDisabled}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(this.describedBy)}
                    @input=${this.#onInput}
                    @change=${() => this.#commit(true)}
                    @blur=${() => this.#commit(false)}
                />
                <span class="steppers">
                    <button
                        part="increase"
                        class="step up"
                        type="button"
                        tabindex="-1"
                        aria-label=${this.increaseLabel}
                        ?disabled=${stepsDisabled || atMax}
                        @click=${() => this.#bump(this.step)}
                    >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M2.5 7.5L6 4L9.5 7.5" />
                        </svg>
                    </button>
                    <button
                        part="decrease"
                        class="step"
                        type="button"
                        tabindex="-1"
                        aria-label=${this.decreaseLabel}
                        ?disabled=${stepsDisabled || atMin}
                        @click=${() => this.#bump(-this.step)}
                    >
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M2.5 4.5L6 8L9.5 4.5" />
                        </svg>
                    </button>
                </span>
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-number-input': HmiNumberInput;
    }
}
