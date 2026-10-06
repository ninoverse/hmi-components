import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './multi-input.styles.js';

export type MultiInputType = 'numeric' | 'text';

/** Detail of `hmi-input`, `hmi-change` and `hmi-complete`: the cells' joined value. */
export interface MultiInputValueDetail {
    value: string;
}

const NUMERIC_PATTERN = /^[0-9]$/;
const NON_WHITESPACE_PATTERN = /^\S$/;

/**
 * Segmented single-character input for codes, OTPs and PINs, with auto-advance,
 * paste-to-fill, keyboard navigation and optional grouping. A native form
 * control: `name` plus the joined cells reach `FormData`, `form.reset()`
 * restores the initial value, and `required` makes an incomplete code invalid.
 *
 * `hmi-input` fires on every edit, `hmi-change` once when focus leaves the
 * group after a change, and `hmi-complete` whenever every cell is filled, all
 * with `{ value }`. Typing advances to the next cell, Backspace on an empty cell
 * clears and focuses the previous one, the arrow keys, Home and End move
 * between cells, and a paste (or a one-time-code autofill) fills the cells from
 * the focused one, skipping characters the cell type rejects.
 *
 * The group is named by `label`, else by the host's `aria-label`, else
 * "Segmented input"; each cell is named by `segment-label`.
 *
 * @tag hmi-multi-input
 * @fires {CustomEvent<MultiInputValueDetail>} hmi-input - The value changed (every edit).
 * @fires {CustomEvent<MultiInputValueDetail>} hmi-change - Focus left the group after the value changed.
 * @fires {CustomEvent<MultiInputValueDetail>} hmi-complete - Every cell is filled.
 * @csspart base - The group of cells.
 * @csspart cell - A single-character field.
 * @csspart separator - The separator between two groups of cells.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-multi-input name="code" label="Verification code" length="6" autocomplete="one-time-code"></hmi-multi-input>
 */
@customElement('hmi-multi-input')
export class HmiMultiInput extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** Number of single-character cells. @default 6 */
    @property({ type: Number }) accessor length = 6;

    /** Insert a separator every N cells (`3` → `XXX–XXX`). */
    @property({ type: Number, attribute: 'group-size' }) accessor groupSize:
        | number
        | undefined;

    /** Separator shown between groups. @default '–' */
    @property() accessor separator = '–';

    /** The current value: the cells joined. The attribute is the initial value. @default '' */
    @property() accessor value = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | string
        | undefined;

    /** Allowed characters and keyboard: digits, or any non-space character. @default 'numeric' */
    @property({ reflect: true }) accessor type: MultiInputType = 'numeric';

    /**
     * Regular expression one character must match, overriding `type`. The
     * attribute is the expression's source; the property also takes a `RegExp`.
     */
    @property() accessor pattern: string | RegExp | undefined;

    /** Hide the entered characters, as a password field does. @default false */
    @property({ type: Boolean, reflect: true }) accessor mask = false;

    /** The value can be selected and copied but not edited. @default false */
    @property({ type: Boolean, reflect: true }) accessor readonly = false;

    /** Browser autofill hint for the first cell, such as `one-time-code`. @default 'off' */
    @property() accessor autocomplete = 'off';

    /** Accessible name of each cell; `{n}` and `{total}` are replaced. @default 'Segment {n} of {total}' */
    @property({ attribute: 'segment-label' }) accessor segmentLabel =
        'Segment {n} of {total}';

    @query('.base') private accessor group!: HTMLElement | null;

    #initialValue = '';
    #focused = false;
    #valueAtFocus = '';

    /** The cells' characters, one per cell, `''` for an empty cell. */
    get #cells(): string[] {
        const chars = Array.from(this.value);
        const count = Math.max(0, Math.floor(this.length));
        return Array.from({ length: count }, (_, i) => chars[i] ?? '');
    }

    get #inputs(): HTMLInputElement[] {
        return Array.from(
            this.shadowRoot?.querySelectorAll<HTMLInputElement>('.cell') ?? [],
        );
    }

    protected get formValue(): string {
        return this.#cells.join('');
    }

    /** The first cell that fails validation, else the first, so `reportValidity()` focuses the gap. */
    protected get control(): HTMLInputElement | null {
        const inputs = this.#inputs;
        return (
            inputs.find((input) => !input.validity.valid) ?? inputs[0] ?? null
        );
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

    protected override firstUpdated(): void {
        if (this.autofocus) this.#focusCell(0);
    }

    #accepts(ch: string): boolean {
        if (this.pattern instanceof RegExp) return this.pattern.test(ch);
        if (this.pattern) return new RegExp(`^(?:${this.pattern})$`).test(ch);
        return (
            this.type === 'numeric' ? NUMERIC_PATTERN : NON_WHITESPACE_PATTERN
        ).test(ch);
    }

    #focusCell(index: number): void {
        const cell = this.#inputs[index];
        if (cell) {
            cell.focus();
            cell.select();
        }
    }

    /** Stores the edited cells, then reports the edit and, if every cell is full, the completion. */
    #setCells(cells: string[]): void {
        this.value = cells.join('');
        emit<MultiInputValueDetail>(this, 'hmi-input', { value: this.value });
        if (cells.length > 0 && cells.every((c) => c !== '')) {
            emit<MultiInputValueDetail>(this, 'hmi-complete', {
                value: this.value,
            });
        }
    }

    /** Fills the cells from `index` with the accepted characters of `text`, then focuses on. */
    #fill(index: number, text: string): void {
        const accepted = Array.from(text).filter((ch) => this.#accepts(ch));
        if (accepted.length === 0) return;
        const cells = this.#cells;
        let pos = index;
        for (const ch of accepted) {
            if (pos >= cells.length) break;
            cells[pos] = ch;
            pos++;
        }
        this.#setCells(cells);
        this.#focusCell(Math.min(pos, cells.length - 1));
    }

    #onCellInput(index: number, event: Event): void {
        const input = event.target as HTMLInputElement;
        const raw = input.value;
        const cells = this.#cells;
        if (raw === '') {
            cells[index] = '';
            this.#setCells(cells);
            return;
        }
        const chars = Array.from(raw);
        if (chars.length > 1) {
            // A one-time-code autofill sets the whole code on one cell.
            this.#fill(index, raw);
            this.requestUpdate();
            return;
        }
        const ch = chars[0] as string;
        if (!this.#accepts(ch)) {
            // Put back what the cell held: `live()` compares with the DOM.
            this.requestUpdate();
            return;
        }
        cells[index] = ch;
        this.#setCells(cells);
        if (index < cells.length - 1) this.#focusCell(index + 1);
    }

    #onCellKeydown(index: number, event: KeyboardEvent): void {
        const cells = this.#cells;
        const last = cells.length - 1;
        if (event.key === 'Backspace') {
            if (this.readonly || cells[index] || index === 0) return;
            event.preventDefault();
            cells[index - 1] = '';
            this.#setCells(cells);
            this.#focusCell(index - 1);
        } else if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault();
            this.#focusCell(index - 1);
        } else if (event.key === 'ArrowRight' && index < last) {
            event.preventDefault();
            this.#focusCell(index + 1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            this.#focusCell(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            this.#focusCell(last);
        }
    }

    #onCellPaste(index: number, event: ClipboardEvent): void {
        event.preventDefault();
        if (this.readonly) return;
        this.#fill(index, event.clipboardData?.getData('text') ?? '');
    }

    #onFocusin(): void {
        if (this.#focused) return;
        this.#focused = true;
        this.#valueAtFocus = this.value;
    }

    #onFocusout(event: FocusEvent): void {
        if (this.group?.contains(event.relatedTarget as Node | null)) return;
        this.#focused = false;
        if (this.value !== this.#valueAtFocus) {
            emit<MultiInputValueDetail>(this, 'hmi-change', {
                value: this.value,
            });
        }
    }

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

    #segmentName(index: number, total: number): string {
        return this.segmentLabel
            .replace('{n}', String(index + 1))
            .replace('{total}', String(total));
    }

    override render() {
        const cells = this.#cells;
        const groupSize = this.groupSize ?? 0;
        const groupName = this.label
            ? undefined
            : (this.getAttribute('aria-label') ?? 'Segmented input');
        return html`
            ${this.renderLabel()}
            <div
                part="base"
                class="base"
                role="group"
                aria-labelledby=${ifDefined(this.label ? 'label' : undefined)}
                aria-label=${ifDefined(groupName)}
                aria-describedby=${ifDefined(this.describedBy)}
            >
                ${cells.map(
                    (cell, i) => html`${
                        groupSize > 0 && i > 0 && i % groupSize === 0
                            ? html`<span part="separator" class="separator" aria-hidden="true">${this.separator}</span>`
                            : nothing
                    }<input
                            part="cell"
                            class=${this.error ? 'cell invalid' : 'cell'}
                            type=${this.mask ? 'password' : 'text'}
                            inputmode=${this.type === 'numeric' ? 'numeric' : 'text'}
                            autocomplete=${i === 0 ? this.autocomplete : 'off'}
                            maxlength="1"
                            aria-label=${this.#segmentName(i, cells.length)}
                            aria-invalid=${ifDefined(this.invalid)}
                            .value=${live(cell)}
                            ?required=${this.required}
                            ?disabled=${this.isDisabled}
                            ?readonly=${this.readonly}
                            @input=${(e: Event) => this.#onCellInput(i, e)}
                            @keydown=${(e: KeyboardEvent) => this.#onCellKeydown(i, e)}
                            @paste=${(e: ClipboardEvent) => this.#onCellPaste(i, e)}
                            @focus=${(e: FocusEvent) => (e.target as HTMLInputElement).select()}
                        />`,
                )}
            </div>
            ${this.renderMessage()}
        `;
    }

    constructor() {
        super();
        this.addEventListener('focusin', () => this.#onFocusin());
        this.addEventListener('focusout', (e) => this.#onFocusout(e));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-multi-input': HmiMultiInput;
    }
}
