import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../menu/menu.js';
import '../menu-item/menu-item.js';
import type { HmiMenuItem } from '../menu-item/menu-item.js';
import '../popover/popover.js';
import type {
    HmiPopover,
    PopoverAlign,
    PopoverOpenChangeDetail,
} from '../popover/popover.js';
import { baseStyles } from '../shared/base.styles.js';
import { activeElementDeep, toggleEmpty } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './select.styles.js';

/** Which edge of the trigger the list lines up with. */
export type SelectAlign = PopoverAlign;

/** One option of a select. */
export interface SelectOption {
    /** The value the select takes, and submits, when this option is chosen. */
    value: string;
    /** The visible label: plain text, or the fallback of the `label-<value>` slot. The trigger shows this text. */
    label: string;
    /** This option cannot be chosen. @default false */
    disabled?: boolean;
}

/** Detail of `hmi-change`: the value the select now holds. */
export interface SelectChangeDetail {
    value: string;
}

/** Detail of `hmi-open-change`. */
export interface SelectOpenChangeDetail {
    /** Whether the list is open now. */
    open: boolean;
}

const chevron = html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M4 6l4 4 4-4" />
</svg>`;

const check = html`<svg
    slot="shortcut"
    part="check"
    class="check"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M3 8.5l3 3 7-7" />
</svg>`;

/**
 * Single-select dropdown: a trigger that shows the chosen option, and a list in
 * a popover that opens under it. It is built from `hmi-popover`, `hmi-menu` and
 * `hmi-menu-item`, so the list is a panel in the top layer that the page's
 * overflow cannot clip. For type-ahead filtering over many options, use
 * `hmi-combobox`.
 *
 * A native form control: it submits `name=value` for the chosen option (nothing
 * while none is chosen), `form.reset()` restores `default-value`, and `required`
 * makes an empty choice invalid, with `required-message` as the text. A non-empty
 * `error` makes it invalid with that message. A `value` that is not one of the
 * options shows the placeholder.
 *
 * The element owns its value: choosing a different option sets `value` and fires
 * `hmi-change` with `{ value }`; to veto a choice, set `value` back from a
 * listener. It owns `open` too, which follows the browser: a press on the trigger,
 * an outside click and Escape change it and fire `hmi-open-change`; setting `open`
 * from code opens or closes the list and fires nothing.
 *
 * From the keyboard, Enter, Space, ArrowDown and ArrowUp open the list and move
 * focus to the chosen option, else the first enabled one. A list a pointer opens
 * leaves focus on the trigger, and ArrowDown or ArrowUp then moves it into the
 * list. The arrow keys, Home and End move between the options, Enter or Space
 * chooses one, and choosing, Escape or Tab closes the list. Choosing and Escape
 * give focus back to the trigger. The options are not in the Tab order.
 *
 * An option's `label` is text. For richer content, slot an element named
 * `label-<value>`, and for an icon one named `icon-<value>`: both show in the
 * list only, and the trigger shows the option's label text. The chosen option is a
 * `menuitemradio` with `aria-checked`, and carries a check mark. The select is
 * named by `label`, else by the trigger's content.
 *
 * @tag hmi-select
 * @slot placeholder - Rich placeholder, shown while nothing is chosen. Defaults to `placeholder`.
 * @slot label-<value> - Rich label for the option with that value, in the list.
 * @slot icon-<value> - Icon for the option with that value, in the list.
 * @fires {CustomEvent<SelectChangeDetail>} hmi-change - The user chose a different option.
 * @fires {CustomEvent<SelectOpenChangeDetail>} hmi-open-change - The user opened or closed the list. Not cancelable, and not fired when `open` is set from code.
 * @csspart base - The trigger `<button>`.
 * @csspart value - The trigger's text: the chosen option's label.
 * @csspart placeholder - The trigger's text while nothing is chosen.
 * @csspart chevron - The arrow in the trigger.
 * @csspart panel - The floating list.
 * @csspart option - One option's row.
 * @csspart icon - An option's icon.
 * @csspart check - The check mark of the chosen option.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * const select = document.querySelector('hmi-select');
 * select.options = [{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }];
 * select.addEventListener('hmi-change', (e) => console.log(e.detail.value));
 */
@customElement('hmi-select')
export class HmiSelect extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The options, in order. Set it as a property. @default [] */
    @property({ type: Array, attribute: false })
    accessor options: readonly SelectOption[] = [];

    /** The chosen option's value, or `''` for none. The attribute is the initial value. @default '' */
    @property() accessor value = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    /** Trigger text while nothing is chosen. @default 'Select…' */
    @property() accessor placeholder = 'Select…';

    /** Which edge of the trigger the list lines up with: its left edge, or its right edge. @default 'start' */
    @property({ reflect: true }) accessor align: SelectAlign = 'start';

    /** Whether the list is open. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** Text of the error a `required` select reports while nothing is chosen. @default 'Please select an option.' */
    @property({ attribute: 'required-message' }) accessor requiredMessage =
        'Please select an option.';

    @query('.base') private accessor trigger!: HTMLButtonElement;
    @query('hmi-popover') private accessor list!: HmiPopover;

    #initialValue = '';
    // Whether the last press on the trigger was a pointer's: a list a pointer opens
    // leaves focus on the trigger, as v5's did, and one the keyboard opens takes it.
    #byPointer = false;

    protected get formValue(): string | null {
        return this.value || null;
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

    /** Reports the chosen value, and a missing choice or an error anchored on the trigger. */
    protected override syncForm(): void {
        this.internals.setFormValue(this.formValue);
        const anchor = this.trigger ?? undefined;
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
        // A select that becomes disabled closes. Only `disabled` itself is read here:
        // `isDisabled` still says disabled for one update after it is set to false.
        if (changed.has('disabled') && this.disabled) this.open = false;
        super.willUpdate(changed);
    }

    /** A fieldset that disables the select closes the list too. */
    override formDisabledCallback(disabled: boolean): void {
        super.formDisabledCallback(disabled);
        if (disabled) this.open = false;
    }

    // A change the user made: it is told to the consumer, and focus follows it.
    // Nothing is told for a change the consumer made through `open`.
    #setOpen(open: boolean): void {
        if (this.open === open) return;
        this.open = open;
        emit<SelectOpenChangeDetail>(this, 'hmi-open-change', { open });
        if (!open) this.#restoreFocus();
        else if (!this.#byPointer) void this.#focusList();
    }

    // The chosen option takes focus, else the first enabled one.
    async #focusList(): Promise<void> {
        await this.updateComplete;
        await this.list?.updateComplete;
        const items = Array.from(
            this.renderRoot.querySelectorAll<HmiMenuItem>('hmi-menu-item'),
        ).filter((item) => !item.disabled);
        (items.find((item) => item.checked) ?? items[0])?.focus();
    }

    // The browser gives focus back on close only to what had it when that was
    // inside the popover in the node tree, and the list is slotted: when focus is
    // still on an option, or nowhere, it goes back to the trigger.
    #restoreFocus(): void {
        const onOption =
            this.shadowRoot?.activeElement?.localName === 'hmi-menu-item';
        if (onOption || activeElementDeep(document) === document.body) {
            this.trigger?.focus();
        }
    }

    #pick(option: SelectOption): void {
        if (option.disabled) return;
        if (option.value !== this.value) {
            this.value = option.value;
            emit<SelectChangeDetail>(this, 'hmi-change', {
                value: this.value,
            });
        }
        this.#setOpen(false);
    }

    // The popover's own report of what the user did to it: the select tells the
    // consumer in its own name.
    #onPopoverOpenChange(event: CustomEvent<PopoverOpenChangeDetail>): void {
        event.stopPropagation();
        this.#setOpen(event.detail.open);
    }

    #onTriggerKeydown(event: KeyboardEvent): void {
        this.#byPointer = false;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            // An open list takes focus too: a pointer that opened it left focus here.
            if (this.open) void this.#focusList();
            else this.#setOpen(true);
        }
    }

    // Tab closes the list and puts focus on the trigger, from where the Tab goes
    // on: the options are not in the Tab order.
    #onListKeydown(event: KeyboardEvent): void {
        if (event.key === 'Tab') this.#setOpen(false);
    }

    /** The label names the trigger together with its content. */
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

    #renderOption(option: SelectOption): TemplateResult {
        const chosen = option.value === this.value;
        return html`<hmi-menu-item
            part="option"
            tabindex="-1"
            ?checked=${chosen}
            ?disabled=${option.disabled}
            @click=${() => this.#pick(option)}
            ><span class="option"
                ><span part="icon" class="icon" hidden
                    ><slot
                        name=${`icon-${option.value}`}
                        @slotchange=${(e: Event) => toggleEmpty(e, false)}
                    ></slot></span
                ><slot name=${`label-${option.value}`}>${option.label}</slot></span
            >${chosen ? check : nothing}</hmi-menu-item
        >`;
    }

    override render() {
        const chosen = this.options.find(
            (option) => option.value === this.value,
        );
        return html`
            ${this.renderLabel()}
            <hmi-popover
                exportparts="panel"
                align=${this.align}
                .open=${this.open && !this.isDisabled}
                @hmi-open-change=${this.#onPopoverOpenChange}
            >
                <button
                    slot="trigger"
                    id="control"
                    part="base"
                    class=${this.error ? 'base invalid' : 'base'}
                    type="button"
                    aria-haspopup="menu"
                    aria-labelledby=${ifDefined(
                        this.label ? 'label value' : undefined,
                    )}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(this.describedBy)}
                    ?disabled=${this.isDisabled}
                    @pointerdown=${() => {
                        this.#byPointer = true;
                    }}
                    @keydown=${this.#onTriggerKeydown}
                >
                    ${
                        chosen
                            ? html`<span id="value" part="value" class="value"
                                  >${chosen.label}</span
                              >`
                            : html`<span
                                  id="value"
                                  part="placeholder"
                                  class="placeholder"
                                  ><slot name="placeholder"
                                      >${this.placeholder}</slot
                                  ></span
                              >`
                    }
                    <span part="chevron" class="chevron">${chevron}</span>
                </button>
                <hmi-menu
                    label=${this.label}
                    @keydown=${this.#onListKeydown}
                >
                    ${this.options.map((option) => this.#renderOption(option))}
                </hmi-menu>
            </hmi-popover>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-select': HmiSelect;
    }
}
