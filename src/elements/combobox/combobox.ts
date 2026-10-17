import {
    html,
    isServer,
    nothing,
    type PropertyValues,
    type TemplateResult,
} from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { baseStyles } from '../shared/base.styles.js';
import { supportsPopover, toggleEmpty } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { PositionController } from '../shared/positioning.js';
import { styles } from './combobox.styles.js';

/** One option of a combobox. */
export interface ComboboxOption {
    /** The value the combobox takes, and submits, when this option is chosen. */
    value: string;
    /** The text shown in the field once chosen and in the list, and matched while filtering. Plain text, or the fallback of the `label-<value>` slot in the list. */
    label: string;
    /** A secondary line under the label: plain text, or the fallback of the `description-<value>` slot. */
    description?: string;
    /** This option cannot be chosen. @default false */
    disabled?: boolean;
}

/** A predicate that says whether an option matches what was typed. */
export type ComboboxFilterFn = (
    option: ComboboxOption,
    query: string,
) => boolean;

/** How the typed text filters the options. */
export type ComboboxFilter =
    | 'includes'
    | 'startsWith'
    | 'none'
    | ComboboxFilterFn;

/** Detail of `hmi-change`: the value the combobox now holds, `''` when it was cleared. */
export interface ComboboxChangeDetail {
    value: string;
}

/** Detail of `hmi-input`: the text now in the field. */
export interface ComboboxInputDetail {
    value: string;
}

/** Detail of `hmi-open-change`. */
export interface ComboboxOpenChangeDetail {
    /** Whether the list is open now. */
    open: boolean;
}

const clearIcon = html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M4 4l8 8M12 4l-8 8" />
</svg>`;

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

const keepFocus = (event: Event) => event.preventDefault();

/**
 * Editable single-select: a text field that filters a list of options as you type,
 * and a list under it that opens on focus, typing and the arrow keys. The list is
 * a `popover="manual"` panel in the top layer, so no overflowing ancestor clips it,
 * placed under the field and as wide as it. Focus stays in the field: the field is
 * the `combobox`, and the highlighted option is its `aria-activedescendant`. For a
 * short list without typing, use `hmi-select`.
 *
 * A native form control: it submits `name=value` for the chosen option (nothing
 * while none is chosen), `form.reset()` restores `default-value`, and `required`
 * makes an empty choice invalid, with `required-message` as the text. A non-empty
 * `error` makes it invalid with that message. Typing text that is not chosen does
 * not set the value.
 *
 * The element owns `value`: choosing a different option, or clearing the field,
 * sets it and fires `hmi-change` with `{ value }`, `''` for none; to veto a change,
 * set `value` back from a listener. The text in the field follows the value: it is
 * the chosen option's label, and it is put back there when the list closes without
 * a choice (Escape, an outside press or leaving the field), so the field never
 * shows text the value does not match. It also follows a `value` set from code, and
 * `options` that arrive after it.
 *
 * `hmi-input` fires with `{ value }` for every keystroke and for the clear button,
 * and `query` is the text, so a consumer can search a server and set `options` in
 * response (with `filter="none"`, so the element does not filter again). A choice
 * or a close that puts the label back into the field changes `query` without
 * firing `hmi-input`.
 *
 * The element owns `open`, which follows the user: focus, typing and the arrow keys
 * open the list; a choice, Escape, an outside press and leaving the field close it;
 * each fires `hmi-open-change`. Setting `open` from code opens or closes it and
 * fires nothing. ArrowDown and ArrowUp move the highlight over the options that are
 * not disabled, stopping at the first and last, Home and End jump to them while the
 * list is open, and Enter chooses the highlighted option.
 *
 * `filter` is `includes` (the default: the label contains the text, ignoring case),
 * `startsWith`, `none`, or, set as a property, a function of the option and the text.
 * While the field still shows the chosen option's label, every option is listed, as
 * a list that shrank to the one chosen would feel broken.
 *
 * An option's `label` and `description` are text. For richer content, slot an element
 * named `label-<value>` or `description-<value>`; the field shows the label text.
 * The field is named by `label`, else by the host's `aria-label`, else "Combobox".
 *
 * @tag hmi-combobox
 * @slot empty - Rich content shown when no option matches. Defaults to `empty-message`.
 * @slot label-<value> - Rich label for the option with that value, in the list.
 * @slot description-<value> - Rich description for the option with that value, in the list.
 * @fires {CustomEvent<ComboboxChangeDetail>} hmi-change - The user chose a different option, or cleared the field.
 * @fires {CustomEvent<ComboboxInputDetail>} hmi-input - The text in the field changed by typing or by the clear button.
 * @fires {CustomEvent<ComboboxOpenChangeDetail>} hmi-open-change - The user opened or closed the list. Not cancelable, and not fired when `open` is set from code.
 * @csspart base - The bordered field.
 * @csspart input - The native text input.
 * @csspart clear - The clear button.
 * @csspart chevron - The arrow in the field.
 * @csspart panel - The floating list.
 * @csspart option - One option's row.
 * @csspart option-label - An option's label.
 * @csspart description - An option's description.
 * @csspart empty - The message shown when nothing matches.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * const combobox = document.querySelector('hmi-combobox');
 * combobox.options = [{ value: 'paris', label: 'Paris', description: 'France' }];
 * combobox.addEventListener('hmi-change', (e) => console.log(e.detail.value));
 */
@customElement('hmi-combobox')
export class HmiCombobox extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The options, in order. Set it as a property. @default [] */
    @property({ type: Array, attribute: false })
    accessor options: readonly ComboboxOption[] = [];

    /** The chosen option's value, or `''` for none. The attribute is the initial value. @default '' */
    @property() accessor value = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    /** The text in the field. It follows `value`: the chosen option's label, unless the user has typed something else. Setting it filters the list. @default '' */
    @property() accessor query = '';

    /** Field placeholder. @default 'Search…' */
    @property() accessor placeholder = 'Search…';

    /** How the text filters the options: `includes`, `startsWith`, `none` or, as a property, a function of the option and the text. @default 'includes' */
    @property() accessor filter: ComboboxFilter = 'includes';

    /** Text shown when no option matches, or the `empty` slot. @default 'No matches' */
    @property({ attribute: 'empty-message' }) accessor emptyMessage =
        'No matches';

    /** Accessible name of the clear button. @default 'Clear' */
    @property({ attribute: 'clear-label' }) accessor clearLabel = 'Clear';

    /** Whether the list is open. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** Text of the error a `required` combobox reports while nothing is chosen. @default 'Please select an option.' */
    @property({ attribute: 'required-message' }) accessor requiredMessage =
        'Please select an option.';

    // The highlighted position in the listed options, or -1 for "not chosen yet":
    // the chosen option then, else the first one that is not disabled.
    @state() private accessor highlight = -1;

    @query('.base') private accessor field!: HTMLElement;
    @query('.input') private accessor input!: HTMLInputElement;
    @query('.panel') private accessor panel!: HTMLElement;

    readonly #position = new PositionController(this, {
        anchor: () => this.field,
        panel: () => this.panel,
        offset: 6,
        matchWidth: true,
    });

    #initialValue = '';
    // The label last put in the field by the value: a field that still shows it is
    // not being edited, so `options` arriving later may change it.
    #synced = '';
    // The document listeners that close the list on an outside press and Escape;
    // they live while it is open.
    #listeners: AbortController | undefined;

    override connectedCallback(): void {
        super.connectedCallback();
        // A panel taken out of the document leaves the top layer: show it again
        // when it comes back still open.
        if (!isServer && this.hasUpdated && this.open) this.#sync();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#listeners?.abort();
        this.#listeners = undefined;
    }

    protected get formValue(): string | null {
        return this.value || null;
    }

    /* The input validates the text, not the choice: `syncForm` reports validity itself. */
    protected get control(): null {
        return null;
    }

    protected resetFormValue(): void {
        this.value = this.defaultValue ?? this.#initialValue;
        this.#resync();
    }

    protected override restoreFormValue(
        state: string | File | FormData | null,
    ) {
        if (typeof state === 'string') this.value = state;
    }

    /** Reports the chosen value, and a missing choice or an error anchored on the input. */
    protected override syncForm(): void {
        this.internals.setFormValue(this.formValue);
        const anchor = this.input ?? undefined;
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

    /** A fieldset that disables the combobox closes the list too. */
    override formDisabledCallback(disabled: boolean): void {
        super.formDisabledCallback(disabled);
        if (disabled) this.open = false;
    }

    // The label of the chosen option: what the field shows when it is not edited.
    #labelOf(value: string): string {
        if (!value) return '';
        return (
            this.options.find((option) => option.value === value)?.label ?? ''
        );
    }

    // Puts the chosen option's label back into the field.
    #resync(): void {
        const label = this.#labelOf(this.value);
        this.query = label;
        this.#synced = label;
    }

    // The options the text leaves in the list.
    #listed(): readonly ComboboxOption[] {
        const text = this.query;
        const filter = this.filter;
        if (!text || filter === 'none') return this.options;
        // While the field shows the chosen label verbatim it is not a search.
        if (this.value && text === this.#labelOf(this.value)) {
            return this.options;
        }
        if (typeof filter === 'function') {
            return this.options.filter((option) => filter(option, text));
        }
        const needle = text.toLowerCase();
        const label = (option: ComboboxOption) => option.label.toLowerCase();
        return filter === 'startsWith'
            ? this.options.filter((option) => label(option).startsWith(needle))
            : this.options.filter((option) => label(option).includes(needle));
    }

    #firstEnabled(listed: readonly ComboboxOption[]): number {
        return listed.findIndex((option) => !option.disabled);
    }

    // The highlighted position: the one the user moved to, else the chosen option's,
    // else the first that is not disabled.
    #active(listed: readonly ComboboxOption[]): number {
        const moved = listed[this.highlight];
        if (moved && !moved.disabled) return this.highlight;
        const chosen = this.value
            ? listed.findIndex(
                  (option) => option.value === this.value && !option.disabled,
              )
            : -1;
        return chosen >= 0 ? chosen : this.#firstEnabled(listed);
    }

    override willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            if (this.defaultValue !== undefined && this.value === '') {
                this.value = this.defaultValue;
            }
            this.#initialValue = this.value;
            const label = this.#labelOf(this.value);
            if (this.query === '') this.query = label;
            this.#synced = label;
        } else if (changed.has('value')) {
            this.#resync();
        } else if (changed.has('options') && this.query === this.#synced) {
            this.#resync();
        }
        // A disabled combobox is closed, and cannot be opened from code. Only
        // `disabled` itself is read here: `isDisabled` still says disabled for one
        // update after it is set to false.
        if (this.disabled && this.open) this.open = false;
        super.willUpdate(changed);
    }

    override updated(changed: PropertyValues): void {
        super.updated(changed);
        if (isServer) return;
        if (changed.has('open')) this.#sync();
        if (this.open && (changed.has('open') || changed.has('highlight'))) {
            this.renderRoot
                .querySelector(`#option-${this.#active(this.#listed())}`)
                ?.scrollIntoView({ block: 'nearest' });
        }
    }

    // Brings the panel in step with `open`.
    #sync(): void {
        const panel = this.panel;
        if (!panel) return;
        const native = supportsPopover();
        if (this.open) {
            if (native && !panel.matches(':popover-open')) panel.showPopover();
            this.#position.start();
            this.#listen();
        } else {
            if (native && panel.matches(':popover-open')) panel.hidePopover();
            this.#position.stop();
            this.#listeners?.abort();
            this.#listeners = undefined;
        }
    }

    // An outside press and Escape close the list, from wherever focus is.
    #listen(): void {
        this.#listeners?.abort();
        this.#listeners = new AbortController();
        const { signal } = this.#listeners;
        document.addEventListener(
            'pointerdown',
            (event) => {
                if (!event.composedPath().includes(this)) this.#dismiss();
            },
            { capture: true, signal },
        );
        document.addEventListener(
            'keydown',
            (event) => {
                if (event.key !== 'Escape') return;
                event.preventDefault();
                this.#dismiss();
            },
            { signal },
        );
    }

    // A change the user made: it is told to the consumer. Nothing is told for a
    // change the consumer made through `open`.
    #setOpen(open: boolean): void {
        if (this.open === open) return;
        this.open = open;
        if (!open) this.highlight = -1;
        emit<ComboboxOpenChangeDetail>(this, 'hmi-open-change', { open });
    }

    // The list closes without a choice: the field goes back to the chosen label.
    #dismiss(): void {
        this.#setOpen(false);
        this.#resync();
    }

    #commit(option: ComboboxOption): void {
        if (option.disabled) return;
        if (option.value !== this.value) {
            this.value = option.value;
            emit<ComboboxChangeDetail>(this, 'hmi-change', {
                value: this.value,
            });
        }
        this.#resync();
        this.#setOpen(false);
    }

    #clear(): void {
        if (this.value !== '') {
            this.value = '';
            emit<ComboboxChangeDetail>(this, 'hmi-change', { value: '' });
        }
        this.query = '';
        this.#synced = '';
        this.highlight = -1;
        emit<ComboboxInputDetail>(this, 'hmi-input', { value: '' });
        this.input?.focus();
    }

    #onInput(event: Event): void {
        const text = (event.target as HTMLInputElement).value;
        this.query = text;
        emit<ComboboxInputDetail>(this, 'hmi-input', { value: text });
        if (text === '' && this.value !== '') {
            this.value = '';
            emit<ComboboxChangeDetail>(this, 'hmi-change', { value: '' });
        }
        this.highlight = this.#firstEnabled(this.#listed());
        this.#setOpen(true);
    }

    // Leaving the field closes the list and puts the label back. A press on the
    // list or the clear button never gets here: it does not take focus.
    #onBlur(): void {
        this.#dismiss();
    }

    #onKeydown(event: KeyboardEvent): void {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const listed = this.#listed();
        const enabled = listed.flatMap((option, index) =>
            option.disabled ? [] : [index],
        );
        const move = (target: number | undefined) => {
            event.preventDefault();
            if (target !== undefined) this.highlight = target;
        };
        const at = enabled.indexOf(this.#active(listed));
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (!this.open) {
                event.preventDefault();
                this.#setOpen(true);
            } else if (event.key === 'ArrowDown') {
                move(enabled[Math.min(at + 1, enabled.length - 1)]);
            } else {
                move(enabled[Math.max(at - 1, 0)]);
            }
        } else if (event.key === 'Home' && this.open) {
            move(enabled[0]);
        } else if (event.key === 'End' && this.open) {
            move(enabled[enabled.length - 1]);
        } else if (event.key === 'Enter' && this.open) {
            const option = listed[this.#active(listed)];
            if (option) {
                event.preventDefault();
                this.#commit(option);
            }
        }
    }

    #renderOption(
        option: ComboboxOption,
        index: number,
        active: number,
    ): TemplateResult {
        return html`<div
            id=${`option-${index}`}
            part="option"
            class="option"
            role="option"
            aria-selected=${this.value === option.value ? 'true' : 'false'}
            aria-disabled=${ifDefined(option.disabled ? 'true' : undefined)}
            data-highlighted=${index === active ? 'true' : 'false'}
            ?data-disabled=${option.disabled}
            @mouseenter=${() => {
                if (!option.disabled) this.highlight = index;
            }}
            @mousedown=${(event: MouseEvent) => {
                event.preventDefault();
                this.#commit(option);
            }}
        >
            <div part="option-label" class="option-label"
                ><slot name=${`label-${option.value}`}>${option.label}</slot></div
            >
            <div
                part="description"
                class="description"
                ?hidden=${option.description == null}
                ><slot
                    name=${`description-${option.value}`}
                    @slotchange=${(e: Event) =>
                        toggleEmpty(e, option.description != null)}
                    >${option.description}</slot
                ></div
            >
        </div>`;
    }

    override render() {
        const listed = this.#listed();
        const active = this.#active(listed);
        const showing = this.open && !this.isDisabled;
        const name = this.label
            ? undefined
            : (this.getAttribute('aria-label') ?? 'Combobox');
        const classes = ['base'];
        if (this.error) classes.push('invalid');
        if (this.isDisabled) classes.push('disabled');
        return html`
            ${this.renderLabel()}
            <div part="base" class=${classes.join(' ')}>
                <input
                    id="control"
                    part="input"
                    class="input"
                    type="text"
                    role="combobox"
                    autocomplete="off"
                    aria-label=${ifDefined(name)}
                    aria-expanded=${showing ? 'true' : 'false'}
                    aria-autocomplete="list"
                    aria-controls="listbox"
                    aria-activedescendant=${ifDefined(
                        showing && active >= 0 ? `option-${active}` : undefined,
                    )}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(this.describedBy)}
                    aria-required=${ifDefined(this.required ? 'true' : undefined)}
                    .value=${live(this.query)}
                    placeholder=${this.placeholder}
                    ?disabled=${this.isDisabled}
                    @input=${this.#onInput}
                    @focus=${() => this.#setOpen(true)}
                    @blur=${this.#onBlur}
                    @keydown=${this.#onKeydown}
                />
                ${
                    this.query && !this.isDisabled
                        ? html`<button
                              part="clear"
                              class="clear"
                              type="button"
                              aria-label=${this.clearLabel}
                              @mousedown=${keepFocus}
                              @click=${this.#clear}
                          >
                              ${clearIcon}
                          </button>`
                        : nothing
                }
                <span part="chevron" class="chevron">${chevron}</span>
            </div>
            <div
                id="listbox"
                part="panel"
                class="panel"
                popover="manual"
                role="listbox"
                aria-label=${ifDefined(name ?? this.label)}
                @mousedown=${keepFocus}
            >
                ${renderLiquidFilter()}
                ${
                    listed.length === 0
                        ? html`<div part="empty" class="empty"
                              ><slot name="empty">${this.emptyMessage}</slot></div
                          >`
                        : listed.map((option, index) =>
                              this.#renderOption(option, index, active),
                          )
                }
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-combobox': HmiCombobox;
    }
}
