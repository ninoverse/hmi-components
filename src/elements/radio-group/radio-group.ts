import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import type { HmiRadio } from '../radio/radio.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import '../radio/radio.js';
import { styles } from './radio-group.styles.js';

/** One choice of a radio group. */
export interface RadioOption {
    /** The value the group takes, and submits, when this option is chosen. */
    value: string;
    /** The visible label: plain text, or the fallback of the `label-<value>` slot. */
    label: string;
    /** This option cannot be chosen. @default false */
    disabled?: boolean;
}

/** Detail of `hmi-change`: the value the group now holds. */
export interface RadioGroupChangeDetail {
    value: string;
}

/**
 * A group of mutually exclusive radios built from an `options` array. A native
 * form control: it submits `name=value` for the chosen option (nothing while
 * none is chosen), `form.reset()` restores `default-value`, and `required`
 * makes an empty choice invalid. A non-empty `error` makes it invalid with that
 * message.
 *
 * `hmi-change` fires with `{ value }` when the user chooses an option. The
 * element owns its value: to veto a choice, set `value` back from a listener.
 * Arrow keys move between the options, and the group has one tab stop.
 *
 * An option's `label` is text. For richer content, slot an element named
 * `label-<value>`, which replaces that text. The group is named by `label`, else
 * by the host's `aria-label`.
 *
 * @tag hmi-radio-group
 * @slot label-<value> - Rich label for the option with that value.
 * @fires {CustomEvent<RadioGroupChangeDetail>} hmi-change - The user chose an option.
 * @csspart base - The group of radios.
 * @csspart radio - One radio.
 * @csspart label - The group label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-radio-group name="plan" label="Plan" value="free"></hmi-radio-group>
 */
@customElement('hmi-radio-group')
export class HmiRadioGroup extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The choices. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor options: RadioOption[] = [];

    /** The chosen option's value, or `''` for none. The attribute is the initial value. @default '' */
    @property() accessor value = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    #initialValue = '';

    get #radios(): HmiRadio[] {
        return Array.from(
            this.shadowRoot?.querySelectorAll<HmiRadio>('hmi-radio') ?? [],
        );
    }

    protected get formValue(): string | null {
        return this.value || null;
    }

    /** The first radio that fails validation, else the first, so `reportValidity()` focuses it. */
    protected get control(): HmiRadio | null {
        const radios = this.#radios;
        return (
            radios.find((radio) => !radio.validity.valid) ?? radios[0] ?? null
        );
    }

    /** Reports the chosen value, and a missing choice with the radio's own message, anchored on that radio. */
    protected override syncForm(): void {
        super.syncForm();
        if (this.error) {
            this.internals.setValidity(
                { customError: true },
                this.error,
                this.#radios[0],
            );
            return;
        }
        const missing = this.#radios.find((radio) => !radio.validity.valid);
        if (missing?.validationMessage) {
            this.internals.setValidity(
                { valueMissing: true },
                missing.validationMessage,
                missing,
            );
        } else {
            this.internals.setValidity({});
        }
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

    override updated(changed: Map<PropertyKey, unknown>): void {
        super.updated(changed);
        // The radios validate after this render: report again once they have.
        const radios = this.#radios;
        void Promise.all(radios.map((radio) => radio.updateComplete)).then(() =>
            this.syncForm(),
        );
    }

    #onChange(event: Event): void {
        // The inner radio's own event must not reach the page: it is composed.
        event.stopPropagation();
        const radio = event.target as HmiRadio;
        if (!radio.checked) return;
        this.value = radio.value;
        emit<RadioGroupChangeDetail>(this, 'hmi-change', {
            value: this.value,
        });
    }

    /** The label names the group. */
    protected override renderLabel(): TemplateResult | typeof nothing {
        return this.label
            ? html`<div id="label" part="label" class="label"
                  >${this.label}${
                      this.required
                          ? html`<span class="required" aria-hidden="true">*</span>`
                          : nothing
}</div
              >`
            : nothing;
    }

    override render() {
        return html`
            ${this.renderLabel()}
            <div
                part="base"
                class="base"
                role="radiogroup"
                aria-labelledby=${ifDefined(this.label ? 'label' : undefined)}
                aria-label=${ifDefined(
                    this.label
                        ? undefined
                        : (this.getAttribute('aria-label') ?? undefined),
                )}
                aria-invalid=${ifDefined(this.invalid)}
                aria-describedby=${ifDefined(this.describedBy)}
                aria-required=${ifDefined(this.required ? 'true' : undefined)}
                @hmi-change=${this.#onChange}
            >
                ${this.options.map(
                    (option) => html`<hmi-radio
                        part="radio"
                        name="option"
                        .value=${option.value}
                        .checked=${live(option.value === this.value)}
                        ?required=${this.required}
                        ?disabled=${this.isDisabled || option.disabled}
                        ><slot name=${`label-${option.value}`}>${option.label}</slot></hmi-radio
                    >`,
                )}
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-radio-group': HmiRadioGroup;
    }
}
