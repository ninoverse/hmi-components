import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { applyTemplate } from '../shared/format.js';
import { styles } from './value-scale-selector.styles.js';

export type ValueScaleSelectorSize = 'small' | 'medium' | 'large';

/** Detail of `hmi-change`: the value the selector now holds. */
export interface ValueScaleSelectorValueDetail {
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

const defaultIcon = html`<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5l2.94 6.5 7.06.6-5.34 4.76 1.63 6.94L12 17.6 5.71 21.3 7.34 14.36 2 9.6l7.06-.6L12 2.5z" />
</svg>`;

/**
 * Icon-based rating or scale selector, such as a star rating, exposed as an
 * accessible slider with optional half steps. A native form control: it submits
 * `name=value` (0 means unrated), `form.reset()` restores `default-value`, and
 * `required` makes 0 invalid, with `required-message` as the text. A non-empty
 * `error` makes it invalid with that message.
 *
 * The arrow keys step by 1 (0.5 with `allow-half`), Home goes to 0 and End to
 * `max`. Hovering a position previews it. `hmi-change` fires with `{ value }`
 * when the user picks a different value. The element owns its value: to veto a
 * change, set `value` back from a listener.
 *
 * The icon is one element in the `icon` slot, such as an inline `<svg>` that uses
 * `currentColor`; the element hides it and copies it into every position, so the
 * copies carry no event listeners or `id`s. Without one, the icon is a star.
 * `valueText` is a `{value}` and `{max}` template string, or, set as a property,
 * a function `(value, max) => string`; it builds the `aria-valuetext`
 * assistive technology reads. The selector is named by `label`, else by the
 * host's `aria-label`, else "Value selector".
 *
 * @tag hmi-value-scale-selector
 * @slot icon - One icon element, repeated for every position.
 * @fires {CustomEvent<ValueScaleSelectorValueDetail>} hmi-change - The user picked a different value.
 * @csspart base - The slider.
 * @csspart icon - One icon position.
 * @csspart fill - The row of icons clipped to the value.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-value-scale-selector name="rating" label="Rating" max="5" allow-half></hmi-value-scale-selector>
 */
@customElement('hmi-value-scale-selector')
export class HmiValueScaleSelector extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'numeric';

    /** The current value, from 0 to `max`. The attribute is the initial value. @default 0 */
    @property({ type: Number }) accessor value = 0;

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value', converter: optionalNumber })
    accessor defaultValue: number | undefined;

    /** Number of icons, and the largest value. @default 5 */
    @property({ type: Number }) accessor max = 5;

    /** Allow half steps, such as 3.5. @default false */
    @property({ type: Boolean, attribute: 'allow-half' }) accessor allowHalf =
        false;

    /** Display only: no interaction. @default false */
    @property({ type: Boolean, reflect: true }) accessor readonly = false;

    /** Icon size. @default 'medium' */
    @property({ reflect: true }) accessor size: ValueScaleSelectorSize =
        'medium';

    /**
     * Builds the `aria-valuetext`: a template with `{value}` and `{max}`, or a
     * function `(value, max) => string` set as a property. @default '{value} out of {max}'
     */
    @property({ attribute: 'value-text' }) accessor valueText:
        | string
        | ((value: number, max: number) => string)
        | undefined;

    /** Text of the error a `required` selector reports while the value is 0. @default 'Please select an option.' */
    @property({ attribute: 'required-message' }) accessor requiredMessage =
        'Please select an option.';

    @state() private accessor hover: number | null = null;
    @state() private accessor iconSource: Element | null = null;

    #initialValue = 0;
    #copies: { source: Element | null; nodes: Element[] } = {
        source: null,
        nodes: [],
    };

    protected get formValue(): number {
        return this.value;
    }

    /* The slider is not a native control: `syncForm` reports validity itself. */
    protected get control(): null {
        return null;
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

    /** Reports the value, and a missing value or an error anchored on the slider. */
    protected override syncForm(): void {
        this.internals.setFormValue(String(this.value));
        const anchor =
            this.shadowRoot?.querySelector<HTMLElement>('.base') ?? undefined;
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
            if (this.defaultValue !== undefined && this.value === 0) {
                this.value = this.defaultValue;
            }
            this.#initialValue = this.value;
        }
        super.willUpdate(changed);
    }

    get #interactive(): boolean {
        return !this.readonly && !this.isDisabled;
    }

    #commit(next: number): void {
        if (next === this.value) return;
        this.value = next;
        emit<ValueScaleSelectorValueDetail>(this, 'hmi-change', {
            value: this.value,
        });
    }

    #onKeydown(event: KeyboardEvent): void {
        if (!this.#interactive) return;
        const step = this.allowHalf ? 0.5 : 1;
        let next: number;
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            next = Math.min(this.max, this.value + step);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            next = Math.max(0, this.value - step);
        } else if (event.key === 'Home') {
            next = 0;
        } else if (event.key === 'End') {
            next = this.max;
        } else {
            return;
        }
        event.preventDefault();
        this.#commit(next);
    }

    #onIconSlot(event: Event): void {
        this.iconSource =
            (event.target as HTMLSlotElement).assignedElements({
                flatten: true,
            })[0] ?? null;
    }

    /** One icon for position `index` of the 2 rows: a copy of the slotted element, else the star. */
    #icon(index: number): TemplateResult | Element {
        const source = this.iconSource;
        if (!source) return defaultIcon;
        const needed = Math.max(0, this.max) * 2;
        if (
            this.#copies.source !== source ||
            this.#copies.nodes.length !== needed
        ) {
            this.#copies = {
                source,
                nodes: Array.from({ length: needed }, () => {
                    const copy = source.cloneNode(true) as Element;
                    copy.removeAttribute('slot');
                    copy.setAttribute('aria-hidden', 'true');
                    return copy;
                }),
            };
        }
        return this.#copies.nodes[index] as Element;
    }

    #valueText(): string {
        if (typeof this.valueText === 'function') {
            return this.valueText(this.value, this.max);
        }
        return applyTemplate(this.valueText ?? '{value} out of {max}', {
            value: this.value,
            max: this.max,
        });
    }

    /** The label names the slider. */
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

    #renderRow(offset: number, positions: number[]): TemplateResult[] {
        return positions.map(
            (p) =>
                html`<span part="icon" class="item">${this.#icon(offset + p - 1)}</span>`,
        );
    }

    #renderOverlay(positions: number[]): TemplateResult {
        return html`<div class="overlay">
            ${positions.map((p) =>
                this.allowHalf
                    ? html`<span class="cell">
                          <button type="button" class="target" aria-label=${p - 0.5} tabindex="-1"
                              @click=${() => this.#commit(p - 0.5)}
                              @mouseenter=${() => (this.hover = p - 0.5)}></button>
                          <button type="button" class="target" aria-label=${p} tabindex="-1"
                              @click=${() => this.#commit(p)}
                              @mouseenter=${() => (this.hover = p)}></button>
                      </span>`
                    : html`<span class="cell">
                          <button type="button" class="target" aria-label=${p} tabindex="-1"
                              @click=${() => this.#commit(p)}
                              @mouseenter=${() => (this.hover = p)}></button>
                      </span>`,
            )}
        </div>`;
    }

    override render() {
        const max = Math.max(0, this.max);
        const positions = Array.from({ length: max }, (_, i) => i + 1);
        const display = this.hover ?? this.value;
        // Whole icons and the fraction of the next one: a share of the row's
        // width would cut the wrong part of an icon, as the gaps are not shared.
        const shown = Math.max(0, Math.min(max, display));
        const whole = Math.floor(shown);
        const part = shown - whole;
        const interactive = this.#interactive;
        const classes = ['base', `size-${this.size}`];
        if (this.isDisabled) classes.push('disabled');
        if (this.readonly) classes.push('readonly');
        return html`
            ${this.renderLabel()}
            <slot name="icon" class="icon-source" @slotchange=${this.#onIconSlot}></slot>
            <div
                part="base"
                class=${classes.join(' ')}
                role="slider"
                aria-labelledby=${ifDefined(this.label ? 'label' : undefined)}
                aria-label=${ifDefined(
                    this.label
                        ? undefined
                        : (this.getAttribute('aria-label') ?? 'Value selector'),
                )}
                aria-valuemin="0"
                aria-valuemax=${max}
                aria-valuenow=${this.value}
                aria-valuetext=${this.#valueText()}
                aria-disabled=${ifDefined(this.isDisabled ? 'true' : undefined)}
                aria-readonly=${ifDefined(this.readonly ? 'true' : undefined)}
                aria-invalid=${ifDefined(this.invalid)}
                aria-describedby=${ifDefined(this.describedBy)}
                tabindex=${interactive ? 0 : -1}
                @keydown=${this.#onKeydown}
                @mouseleave=${() => (this.hover = null)}
            >
                <div class="row" aria-hidden="true">${this.#renderRow(0, positions)}</div>
                <div
                    part="fill"
                    class="row fill"
                    aria-hidden="true"
                    style=${styleMap({ '--_whole': String(whole), '--_part': String(part) })}
                >${this.#renderRow(max, positions)}</div>
                ${interactive ? this.#renderOverlay(positions) : nothing}
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-value-scale-selector': HmiValueScaleSelector;
    }
}
