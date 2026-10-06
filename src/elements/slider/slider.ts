import { html, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { applyTemplate } from '../shared/format.js';
import { styles } from './slider.styles.js';

/** Detail of `hmi-input` and `hmi-change`: the slider's current value. */
export interface SliderValueDetail {
    value: number;
}

/* An empty or non-numeric attribute is unset, not 0 as Lit's own Number
   converter would make it. */
const optionalNumber = {
    fromAttribute: (raw: string | null) => {
        if (raw === null || raw.trim() === '') return undefined;
        const n = Number(raw);
        return Number.isNaN(n) ? undefined : n;
    },
};

/**
 * Range slider over a native `range` input, with an optional value display and
 * formatting. A native form control: `name` plus `value` reach `FormData`,
 * `form.reset()` restores the initial value, and a non-empty `error` marks it
 * invalid with that message. The browser keeps the thumb within `min` and
 * `max` and on `step`.
 *
 * `hmi-input` fires with `{ value }` while the thumb moves and `hmi-change`
 * when it is released (or a key press settles). The element owns its value: to
 * veto a change, set `value` back from a listener. `value` is `min` until set.
 * `formatValue` is a `{value}` template string such as `"{value}%"`, or, set as
 * a property, a function `(value) => string`; it formats the displayed value and
 * the `aria-valuetext` assistive technology reads.
 *
 * The slider is named by `label`, else by the host's `aria-label`.
 *
 * @tag hmi-slider
 * @fires {CustomEvent<SliderValueDetail>} hmi-input - The value changed (while moving).
 * @fires {CustomEvent<SliderValueDetail>} hmi-change - The value was committed (released).
 * @csspart base - The row of the track and the value.
 * @csspart control - The native range input.
 * @csspart value - The displayed value.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-slider name="volume" label="Volume" value="40" show-value format-value="{value}%"></hmi-slider>
 */
@customElement('hmi-slider')
export class HmiSlider extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'numeric';

    /** The current value. The attribute is the initial value. @default `min` */
    @property({ converter: optionalNumber }) accessor value: number | undefined;

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value', converter: optionalNumber })
    accessor defaultValue: number | undefined;

    /** Smallest value. @default 0 */
    @property({ type: Number }) accessor min = 0;

    /** Largest value. @default 100 */
    @property({ type: Number }) accessor max = 100;

    /** Step between values. @default 1 */
    @property({ type: Number }) accessor step = 1;

    /** Show the current value beside the track. @default false */
    @property({ type: Boolean, attribute: 'show-value' }) accessor showValue =
        false;

    /**
     * Formats the displayed value: a `{value}` template string, or a function
     * `(value) => string` set as a property.
     */
    @property({ attribute: 'format-value' }) accessor formatValue:
        | string
        | ((value: number) => string)
        | undefined;

    @query('input') private accessor input!: HTMLInputElement | null;

    #initialValue = 0;

    get #current(): number {
        return this.value ?? this.defaultValue ?? this.min;
    }

    protected get formValue(): number {
        return this.#current;
    }

    protected get control(): HTMLInputElement | null {
        return this.input;
    }

    protected resetFormValue(): void {
        this.value = this.defaultValue ?? this.#initialValue;
    }

    protected override restoreFormValue(
        state: string | File | FormData | null,
    ) {
        if (typeof state === 'string' && state.trim() !== '') {
            this.value = Number(state);
        }
    }

    override willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            if (this.value === undefined) this.value = this.#current;
            this.#initialValue = this.value as number;
        }
        super.willUpdate(changed);
    }

    #formatted(value: number): string | undefined {
        if (typeof this.formatValue === 'function') {
            return this.formatValue(value);
        }
        return this.formatValue
            ? applyTemplate(this.formatValue, { value })
            : undefined;
    }

    #onInput(event: Event): void {
        this.value = Number((event.target as HTMLInputElement).value);
        emit<SliderValueDetail>(this, 'hmi-input', { value: this.value });
    }

    #onChange(): void {
        emit<SliderValueDetail>(this, 'hmi-change', { value: this.#current });
    }

    override render() {
        const current = this.#current;
        const span = this.max - this.min;
        const pct = span === 0 ? 0 : ((current - this.min) / span) * 100;
        const formatted = this.#formatted(current);
        const classes = ['base'];
        if (this.error) classes.push('invalid');
        if (this.isDisabled) classes.push('disabled');
        return html`
            ${this.renderLabel()}
            <div
                part="base"
                class=${classes.join(' ')}
                style=${styleMap({ '--slider-pct': `${Math.min(100, Math.max(0, pct))}%` })}
            >
                <input
                    id="control"
                    part="control"
                    class="control"
                    type="range"
                    min=${this.min}
                    max=${this.max}
                    step=${this.step}
                    .value=${live(String(current))}
                    ?disabled=${this.isDisabled}
                    aria-label=${ifDefined(
                        this.label
                            ? undefined
                            : (this.getAttribute('aria-label') ?? undefined),
                    )}
                    aria-valuetext=${ifDefined(formatted)}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(this.describedBy)}
                    @input=${this.#onInput}
                    @change=${this.#onChange}
                />
                ${
                    this.showValue
                        ? html`<span part="value" class="value" aria-hidden="true">${formatted ?? current}</span>`
                        : ''
                }
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-slider': HmiSlider;
    }
}
