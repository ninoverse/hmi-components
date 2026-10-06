import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './segmented-control.styles.js';

export type SegmentedControlSize = 'small' | 'medium' | 'large';

/** One segment of a segmented control. */
export interface SegmentedControlOption {
    /** The value the control takes, and submits, when this segment is chosen. */
    value: string;
    /** The visible label: plain text, or the fallback of the `label-<value>` slot. */
    label: string;
    /** This segment cannot be chosen. @default false */
    disabled?: boolean;
}

/** Detail of `hmi-change`: the value the control now holds. */
export interface SegmentedControlValueDetail {
    value: string;
}

/**
 * Single-select control that shows its options as adjacent segments. A native
 * form control: it submits `name=value` for the chosen segment (nothing while
 * none is chosen), `form.reset()` restores `default-value`, and `required`
 * makes an empty choice invalid, with `required-message` as the text. A
 * non-empty `error` makes it invalid with that message.
 *
 * It is a `radiogroup` of buttons with a single tab stop (the chosen segment,
 * else the first enabled one). The arrow keys move between the enabled
 * segments, wrapping, and choose the one they land on; Home and End go to the
 * first and last. `hmi-change` fires with `{ value }` when the user chooses a
 * different segment. The element owns its value: to veto a choice, set `value`
 * back from a listener.
 *
 * A segment's `label` is text. For richer content, slot an element named
 * `label-<value>`; slot one named `icon-<value>` for a leading icon. The control
 * is named by `label`, else by the host's `aria-label`, else "Segmented control".
 *
 * @tag hmi-segmented-control
 * @slot label-<value> - Rich label for the segment with that value.
 * @slot icon-<value> - Leading icon for the segment with that value.
 * @fires {CustomEvent<SegmentedControlValueDetail>} hmi-change - The user chose a different segment.
 * @csspart base - The row of segments.
 * @csspart segment - One segment button.
 * @csspart icon - A segment's icon.
 * @csspart segment-label - A segment's label.
 * @csspart label - The group label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-segmented-control name="view" label="View" value="list"></hmi-segmented-control>
 */
@customElement('hmi-segmented-control')
export class HmiSegmentedControl extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The segments. Set it as a property; a JSON attribute is accepted. @default [] */
    @property({ type: Array }) accessor options: SegmentedControlOption[] = [];

    /** The chosen segment's value, or `''` for none. The attribute is the initial value. @default '' */
    @property() accessor value = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    /** Segment size. @default 'medium' */
    @property({ reflect: true }) accessor size: SegmentedControlSize = 'medium';

    /** Stretch the segments to fill the width. @default false */
    @property({ type: Boolean, reflect: true, attribute: 'full-width' })
    accessor fullWidth = false;

    /** Text of the error a `required` control reports while nothing is chosen. @default 'Please select an option.' */
    @property({ attribute: 'required-message' }) accessor requiredMessage =
        'Please select an option.';

    #initialValue = '';

    get #buttons(): HTMLButtonElement[] {
        return Array.from(
            this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.segment') ??
                [],
        );
    }

    protected get formValue(): string | null {
        return this.value || null;
    }

    /* The segments are not native controls: `syncForm` reports validity itself. */
    protected get control(): null {
        return null;
    }

    protected resetFormValue(): void {
        this.value = this.defaultValue ?? this.#initialValue;
    }

    protected override restoreFormValue(
        state: string | File | FormData | null,
    ) {
        if (typeof state === 'string') this.value = state;
    }

    /** Reports the chosen value, and a missing choice or an error anchored on the first enabled segment. */
    protected override syncForm(): void {
        this.internals.setFormValue(this.formValue);
        const anchor = this.#buttons.find((button) => !button.disabled);
        if (this.error) {
            this.internals.setValidity(
                { customError: true },
                this.error,
                anchor,
            );
        } else if (this.required && !this.value && this.requiredMessage) {
            this.internals.setValidity(
                { valueMissing: true },
                this.requiredMessage,
                anchor,
            );
        } else {
            this.internals.setValidity({});
        }
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

    #enabled(): number[] {
        return this.options
            .map((option, index) => ({ option, index }))
            .filter(({ option }) => !option.disabled && !this.isDisabled)
            .map(({ index }) => index);
    }

    #choose(index: number): void {
        const option = this.options[index];
        if (!option || option.value === this.value) return;
        this.value = option.value;
        emit<SegmentedControlValueDetail>(this, 'hmi-change', {
            value: this.value,
        });
    }

    #move(index: number): void {
        this.#buttons[index]?.focus();
        this.#choose(index);
    }

    #onKeydown(event: KeyboardEvent, index: number): void {
        const enabled = this.#enabled();
        const position = enabled.indexOf(index);
        if (position < 0) return;
        let target: number | undefined;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            target = enabled[(position + 1) % enabled.length];
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            target = enabled[(position - 1 + enabled.length) % enabled.length];
        } else if (event.key === 'Home') {
            target = enabled[0];
        } else if (event.key === 'End') {
            target = enabled[enabled.length - 1];
        } else {
            return;
        }
        event.preventDefault();
        if (target !== undefined) this.#move(target);
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
        const enabled = this.#enabled();
        const hasChosen = this.options.some(
            (option) => option.value === this.value,
        );
        const classes = ['base', `size-${this.size}`];
        if (this.fullWidth) classes.push('full-width');
        if (this.isDisabled) classes.push('disabled');
        if (this.error) classes.push('invalid');
        return html`
            ${this.renderLabel()}
            <div
                part="base"
                class=${classes.join(' ')}
                role="radiogroup"
                aria-labelledby=${ifDefined(this.label ? 'label' : undefined)}
                aria-label=${ifDefined(
                    this.label
                        ? undefined
                        : (this.getAttribute('aria-label') ??
                              'Segmented control'),
                )}
                aria-invalid=${ifDefined(this.invalid)}
                aria-describedby=${ifDefined(this.describedBy)}
                aria-required=${ifDefined(this.required ? 'true' : undefined)}
            >
                ${this.options.map((option, index) => {
                    const checked = option.value === this.value;
                    const tabbable =
                        checked || (!hasChosen && index === enabled[0]);
                    return html`<button
                        part="segment"
                        class="segment"
                        type="button"
                        role="radio"
                        aria-checked=${checked ? 'true' : 'false'}
                        data-checked=${checked ? 'true' : 'false'}
                        ?disabled=${this.isDisabled || option.disabled}
                        tabindex=${tabbable ? 0 : -1}
                        @click=${() => this.#choose(index)}
                        @keydown=${(e: KeyboardEvent) => this.#onKeydown(e, index)}
                    >
                        <span part="icon" class="icon" aria-hidden="true" hidden
                            ><slot
                                name=${`icon-${option.value}`}
                                @slotchange=${(e: Event) => {
                                    const slot = e.target as HTMLSlotElement;
                                    (slot.parentElement as HTMLElement).hidden =
                                        slot.assignedNodes().length === 0;
                                }}
                            ></slot
                        ></span>
                        <span part="segment-label" class="segment-label"
                            ><slot name=${`label-${option.value}`}>${option.label}</slot></span
                        >
                    </button>`;
                })}
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-segmented-control': HmiSegmentedControl;
    }
}
