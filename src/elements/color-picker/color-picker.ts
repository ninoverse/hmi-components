import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../popover/popover.js';
import type {
    HmiPopover,
    PopoverOpenChangeDetail,
} from '../popover/popover.js';
import { baseStyles } from '../shared/base.styles.js';
import { activeElementDeep } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './color-picker.styles.js';

/** Detail of `hmi-input`: the colour the picker holds now, as `#rrggbb`. */
export interface ColorPickerInputDetail {
    value: string;
}

/** Detail of `hmi-change`: the colour the user committed, as `#rrggbb`. */
export interface ColorPickerChangeDetail {
    value: string;
}

/** Detail of `hmi-open-change`. */
export interface ColorPickerOpenChangeDetail {
    /** Whether the panel is open now. */
    open: boolean;
}

const DEFAULT_COLOR = '#e87a5d';

const DEFAULT_SWATCHES: readonly string[] = [
    '#e87a5d',
    '#d49a3f',
    '#5c9a6a',
    '#6b86b3',
    '#c0524c',
    '#7a6f64',
    '#2b2520',
    '#ffffff',
];

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const LONG_HEX_PATTERN = /^#[0-9a-f]{6}$/i;

// A hex colour as `#rrggbb` in lower case, a shorthand expanded: the one form
// the native colour input and a form submit. Anything else is not a colour here.
function normalizeHex(input: unknown): string | null {
    if (typeof input !== 'string') return null;
    const text = input.trim();
    if (!HEX_PATTERN.test(text)) return null;
    const digits = text.slice(1).toLowerCase();
    return `#${digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits}`;
}

/**
 * Colour picker: a trigger that shows the colour as a swatch and its hex text, and
 * a panel in a popover with preset swatches, a hex field and the browser's own
 * colour sampler. It is built from `hmi-popover`, so the panel is in the top layer
 * and the page's overflow cannot clip it.
 *
 * A colour is `#rrggbb`: `value` is read from any 3- or 6-digit hex (`#abc`,
 * `#E87A5D`), and what the user chooses is reported in the one form the native
 * colour input and a form submit, lower case and shorthand expanded. The picker
 * always holds a colour, so `required` has no effect.
 *
 * A native form control: it submits `name=value`, and `form.reset()` restores
 * `default-value`. A non-empty `error` makes it invalid with that message.
 *
 * The element owns `value`. Like a native input it fires two events, both with
 * `{ value }`: `hmi-input` for each change as it happens (a swatch, a valid
 * 6-digit hex typed, each move of the sampler) and `hmi-change` when a colour is
 * committed (a swatch, Enter or leaving the hex field, the sampler's own commit),
 * only when it differs from the last one committed. A 3-digit hex such as `#abc` is
 * taken on Enter or when the field is left, so typing `#e87a5d` never passes
 * through `#e87`. To veto a choice, set `value` back from a listener. The hex
 * field puts back the colour when it is left with text that is not one. It owns
 * `open` too, which follows the user; setting it from code opens or closes the
 * panel and fires nothing.
 *
 * The swatches are a `radiogroup`: one Tab stop, and the arrow keys, Home and End
 * move to a swatch and choose it, as a native radio group does. `swatches` takes hex
 * colours; anything else in it is skipped. From the keyboard, Enter and Space on
 * the trigger open the panel and move focus to the chosen swatch, else the first;
 * a panel a pointer opens leaves focus on the trigger. Escape closes it and gives
 * focus back to the trigger. The picker is named by `label`, else by the host's
 * `aria-label`, else `Choose color`.
 *
 * @tag hmi-color-picker
 * @csspart base - The trigger `<button>`.
 * @csspart preview - The colour box in the trigger.
 * @csspart value - The hex text in the trigger.
 * @csspart panel - The floating panel.
 * @csspart swatches - The group of preset swatches.
 * @csspart swatch - One preset swatch. `aria-checked` marks the chosen one.
 * @csspart inputs - The row of the hex field and the sampler.
 * @csspart hex - The hex text field.
 * @csspart sample - The native colour sampler.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 * @fires {CustomEvent<ColorPickerInputDetail>} hmi-input - The colour changed as the user chose it.
 * @fires {CustomEvent<ColorPickerChangeDetail>} hmi-change - The user committed a colour that differs from the last committed one.
 * @fires {CustomEvent<ColorPickerOpenChangeDetail>} hmi-open-change - The user opened or closed the panel. Not cancelable, and not fired when `open` is set from code.
 *
 * @example
 * <hmi-color-picker name="brand" label="Brand colour" value="#5c9a6a"></hmi-color-picker>
 */
@customElement('hmi-color-picker')
export class HmiColorPicker extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The colour: a 3- or 6-digit hex such as `#e87a5d`. The attribute is the initial value. @default '#e87a5d' */
    @property() accessor value = DEFAULT_COLOR;

    /** Initial value, and what `form.reset()` restores. Applies when `value` is left at its default. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    /** The preset swatches: hex colours, in order. Set it as a property. @default ['#e87a5d', '#d49a3f', '#5c9a6a', '#6b86b3', '#c0524c', '#7a6f64', '#2b2520', '#ffffff'] */
    @property({ type: Array, attribute: false })
    accessor swatches: readonly string[] = DEFAULT_SWATCHES;

    /** Hides the hex field and the sampler, leaving only the swatches. @default false */
    @property({ type: Boolean, reflect: true, attribute: 'hide-input' })
    accessor hideInput = false;

    /** Whether the panel is open. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** Accessible name of the hex field. @default 'Hex color value' */
    @property({ attribute: 'hex-label' }) accessor hexLabel = 'Hex color value';

    /** Accessible name of the colour sampler. @default 'Color sample' */
    @property({ attribute: 'sample-label' }) accessor sampleLabel =
        'Color sample';

    // The text in the hex field: it is what the user typed until it is committed.
    @state() private accessor draft = '';

    @query('.base') private accessor trigger!: HTMLButtonElement;
    @query('hmi-popover') private accessor list!: HmiPopover;

    #initialValue = DEFAULT_COLOR;
    // The value the element last set itself, to tell a change from outside, and the
    // colour last committed, which `hmi-change` is measured against.
    #lastSet: string | undefined;
    #committed: string | null = null;
    // Whether the last press on the trigger was a pointer's: a panel a pointer opens
    // leaves focus on the trigger, and one the keyboard opens takes it.
    #byPointer = false;

    protected get formValue(): string | null {
        return this.#display() || null;
    }

    /* The trigger is not a native control that validates: `syncForm` reports validity itself. */
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

    /** Reports the colour, and an error anchored on the trigger. */
    protected override syncForm(): void {
        this.internals.setFormValue(this.formValue);
        if (this.error) {
            this.internals.setValidity(
                { customError: true },
                this.error,
                this.trigger ?? undefined,
            );
        } else {
            this.internals.setValidity({});
        }
    }

    override willUpdate(changed: PropertyValues): void {
        if (!this.hasUpdated) {
            if (
                this.defaultValue !== undefined &&
                this.value === DEFAULT_COLOR
            ) {
                this.value = this.defaultValue;
            }
            this.#initialValue = this.value;
            this.#committed = normalizeHex(this.value);
            this.draft = this.#display();
        } else if (changed.has('value') && this.value !== this.#lastSet) {
            // A colour set from outside: the hex field follows it, and it is the
            // one `hmi-change` is measured against.
            this.#committed = normalizeHex(this.value);
            this.draft = this.#display();
        }
        // A disabled picker is closed, and cannot be opened from code. Only
        // `disabled` itself is read here: `isDisabled` still says disabled for one
        // update after it is set to false.
        if (this.disabled && this.open) this.open = false;
        if (changed.has('open')) this.draft = this.#display();
        super.willUpdate(changed);
    }

    /** A fieldset that disables the picker closes the panel too. */
    override formDisabledCallback(disabled: boolean): void {
        super.formDisabledCallback(disabled);
        if (disabled) this.open = false;
    }

    // The colour as `#rrggbb`, else what was set: text that is not a hex is shown
    // and submitted as it is.
    #display(): string {
        return normalizeHex(this.value) ?? this.value;
    }

    #swatches(): string[] {
        const colours = new Set<string>();
        for (const swatch of this.swatches) {
            const hex = normalizeHex(swatch);
            if (hex) colours.add(hex);
        }
        return [...colours];
    }

    // A colour the user chose: `hmi-input` when it is new, and `hmi-change` too
    // when it is committed and differs from the last committed one.
    #apply(hex: string, commit: boolean): void {
        const colour = normalizeHex(hex);
        if (!colour) return;
        if (colour !== normalizeHex(this.value)) {
            this.value = colour;
            this.#lastSet = colour;
            emit<ColorPickerInputDetail>(this, 'hmi-input', { value: colour });
            // A listener that set `value` back vetoed the colour: it is not committed.
            if (normalizeHex(this.value) !== colour) return;
        }
        if (commit && colour !== this.#committed) {
            this.#committed = colour;
            emit<ColorPickerChangeDetail>(this, 'hmi-change', {
                value: colour,
            });
        }
    }

    // A change the user made: it is told to the consumer, and focus follows it.
    // Nothing is told for a change the consumer made through `open`.
    #setOpen(open: boolean): void {
        if (this.open === open) return;
        this.open = open;
        emit<ColorPickerOpenChangeDetail>(this, 'hmi-open-change', { open });
        if (!open) this.#restoreFocus();
        else if (!this.#byPointer) void this.#focusPanel();
    }

    // The chosen swatch takes focus, else the first; without swatches, the hex field.
    async #focusPanel(): Promise<void> {
        await this.updateComplete;
        await this.list?.updateComplete;
        const swatches = this.#radios();
        const target =
            swatches.find((swatch) => swatch.tabIndex === 0) ??
            this.renderRoot.querySelector<HTMLElement>('.hex');
        target?.focus();
    }

    #radios(): HTMLElement[] {
        return Array.from(
            this.renderRoot.querySelectorAll<HTMLElement>('.swatch'),
        );
    }

    // The browser gives focus back on close only to what had it when that was
    // inside the popover in the node tree, and the panel is slotted: when focus is
    // still in it, or nowhere, it goes back to the trigger.
    #restoreFocus(): void {
        const inside = this.shadowRoot?.activeElement?.closest('.body');
        if (inside || activeElementDeep(document) === document.body) {
            this.trigger?.focus();
        }
    }

    // The popover's own report of what the user did to it: the picker tells the
    // consumer in its own name.
    #onPopoverOpenChange(event: CustomEvent<PopoverOpenChangeDetail>): void {
        event.stopPropagation();
        this.#setOpen(event.detail.open);
    }

    #onSwatchKeydown(event: KeyboardEvent): void {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        const radios = this.#radios();
        const from = radios.indexOf(event.target as HTMLElement);
        if (from < 0) return;
        let to: number;
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                to = (from + 1) % radios.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                to = (from - 1 + radios.length) % radios.length;
                break;
            case 'Home':
                to = 0;
                break;
            case 'End':
                to = radios.length - 1;
                break;
            default:
                return;
        }
        event.preventDefault();
        const hex = this.#swatches()[to];
        if (hex === undefined) return;
        this.draft = hex;
        this.#apply(hex, true);
        void this.updateComplete.then(() => this.#radios()[to]?.focus());
    }

    // The sampler's own colour, as it moves and when it commits: the hex field shows it.
    #onSample(event: Event, commit: boolean): void {
        const colour = (event.target as HTMLInputElement).value;
        this.draft = normalizeHex(colour) ?? this.draft;
        this.#apply(colour, commit);
    }

    #onHexInput(event: Event): void {
        const text = (event.target as HTMLInputElement).value;
        this.draft = text;
        // Only a full 6-digit hex is taken while typing: a 3-digit one would pass
        // through on the way to the 6.
        if (LONG_HEX_PATTERN.test(text.trim())) this.#apply(text, false);
    }

    // Enter, or leaving the field: the text is committed if it is a colour, and put
    // back if it is not.
    #onHexChange(event: Event): void {
        const text = (event.target as HTMLInputElement).value;
        const colour = normalizeHex(text);
        if (colour) {
            this.draft = colour;
            this.#apply(colour, true);
        } else {
            this.draft = this.#display();
        }
    }

    /** The label names the trigger together with the colour. */
    protected override renderLabel(): TemplateResult | typeof nothing {
        return this.label
            ? html`<label id="label" part="label" class="label" for="control"
                  >${this.label}${
                      this.required
                          ? html`<span class="required" aria-hidden="true">*</span>`
                          : nothing
}</label
              >`
            : nothing;
    }

    #renderSwatch(
        hex: string,
        chosen: string | null,
        tabbable: boolean,
    ): TemplateResult {
        const checked = hex === chosen;
        return html`<button
            part="swatch"
            class="swatch"
            type="button"
            role="radio"
            aria-checked=${checked ? 'true' : 'false'}
            aria-label=${hex}
            tabindex=${tabbable ? 0 : -1}
            style=${styleMap({ background: hex })}
            @click=${() => {
                this.draft = hex;
                this.#apply(hex, true);
            }}
        ></button>`;
    }

    override render() {
        const display = this.#display();
        const chosen = normalizeHex(this.value);
        const swatches = this.#swatches();
        // One swatch is in the Tab order: the chosen one, else the first.
        const stop = chosen && swatches.includes(chosen) ? chosen : swatches[0];
        const showing = this.open && !this.isDisabled;
        const name = this.label
            ? undefined
            : (this.getAttribute('aria-label') ?? 'Choose color');
        const describedBy = [
            this.describedBy,
            // Without a visible label the name is the fixed one, so the colour is
            // read as its description.
            this.label ? undefined : 'value',
        ]
            .filter(Boolean)
            .join(' ');
        return html`
            ${this.renderLabel()}
            <hmi-popover
                exportparts="panel"
                .open=${showing}
                @hmi-open-change=${this.#onPopoverOpenChange}
            >
                <button
                    slot="trigger"
                    id="control"
                    part="base"
                    class=${this.error ? 'base invalid' : 'base'}
                    type="button"
                    aria-haspopup="dialog"
                    aria-label=${ifDefined(name)}
                    aria-labelledby=${ifDefined(
                        this.label ? 'label value' : undefined,
                    )}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(describedBy || undefined)}
                    ?disabled=${this.isDisabled}
                    @pointerdown=${() => {
                        this.#byPointer = true;
                    }}
                    @keydown=${() => {
                        this.#byPointer = false;
                    }}
                >
                    <span
                        part="preview"
                        class="preview"
                        style=${styleMap({ background: display })}
                    ></span>
                    <span id="value" part="value" class="value">${display}</span>
                </button>
                <div class="body" role="dialog" aria-label=${name ?? this.label}>
                    <div
                        part="swatches"
                        class="swatches"
                        role="radiogroup"
                        aria-label=${name ?? this.label}
                        @keydown=${this.#onSwatchKeydown}
                    >
                        ${swatches.map((hex) =>
                            this.#renderSwatch(hex, chosen, hex === stop),
                        )}
                    </div>
                    ${
                        this.hideInput
                            ? nothing
                            : html`<div part="inputs" class="inputs">
                                  <input
                                      part="hex"
                                      class="hex"
                                      type="text"
                                      aria-label=${this.hexLabel}
                                      spellcheck="false"
                                      autocomplete="off"
                                      value=${this.draft}
                                      .value=${live(this.draft)}
                                      @input=${this.#onHexInput}
                                      @change=${this.#onHexChange}
                                  />
                                  <input
                                      part="sample"
                                      class="sample"
                                      type="color"
                                      aria-label=${this.sampleLabel}
                                      value=${chosen ?? '#000000'}
                                      .value=${live(chosen ?? '#000000')}
                                      @input=${(event: Event) =>
                                          this.#onSample(event, false)}
                                      @change=${(event: Event) =>
                                          this.#onSample(event, true)}
                                  />
                              </div>`
                    }
                </div>
            </hmi-popover>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-color-picker': HmiColorPicker;
    }
}
