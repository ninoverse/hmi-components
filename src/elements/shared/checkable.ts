import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { emit } from './events.js';
import { type FormKind, HmiFormField } from './form.js';

/** Detail of `hmi-change` on a checkable control: its new state. */
export interface CheckedDetail {
    checked: boolean;
}

/**
 * Base class of the checkable controls (checkbox, switch, radio): a native
 * `<input type="checkbox">` clipped out of sight inside a `<label>`, so a click
 * anywhere toggles it and the control keeps the browser's keyboard, focus and
 * accessibility behaviour. A subclass renders the indicator.
 *
 * A checked control submits `name=value` (`value` defaults to `'on'`), an
 * unchecked one submits nothing. `form.reset()` restores `default-checked` (or
 * the state at first render). `required` makes the unchecked state invalid.
 * `hmi-change` fires on every toggle with `{ checked }`. The element owns its
 * state: to veto a toggle, set `checked` back from a listener.
 *
 * The inline text is `label`, or the default slot for richer content; `hint`
 * and `error` render below.
 *
 * @slot - Rich label content, instead of the `label` text.
 * @fires {CustomEvent<CheckedDetail>} hmi-change - The state was toggled.
 */
export abstract class HmiCheckable extends HmiFormField {
    /* The submitted value is a string, or null while unchecked. */
    protected readonly formKind: FormKind = 'text';

    /** Whether the control is on. The attribute is the initial state. @default false */
    @property({ type: Boolean, reflect: true }) accessor checked = false;

    /** Initial state, and what `form.reset()` restores. Defaults to the state at first render. */
    @property({ type: Boolean, attribute: 'default-checked' })
    accessor defaultChecked: boolean | undefined;

    /** The string submitted with the form while checked. @default 'on' */
    @property() accessor value = 'on';

    @state() private accessor hasSlottedLabel = false;

    @query('input') private accessor input!: HTMLInputElement | null;

    #initialChecked = false;

    protected get formValue(): string | null {
        return this.checked ? this.value : null;
    }

    protected get control(): HTMLInputElement | null {
        return this.input;
    }

    protected resetFormValue(): void {
        this.checked = this.defaultChecked ?? this.#initialChecked;
    }

    protected override restoreFormValue(
        state: string | File | FormData | null,
    ) {
        if (typeof state === 'string') this.checked = true;
        else if (state === null) this.checked = false;
    }

    override willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            if (this.defaultChecked !== undefined && !this.checked) {
                this.checked = this.defaultChecked;
            }
            this.#initialChecked = this.checked;
        }
        super.willUpdate(changed);
    }

    /** The indicator drawn after the input: a box, a track. It must not take pointer events of its own. */
    protected abstract renderIndicator(): TemplateResult;

    #onChange(event: Event): void {
        this.checked = (event.target as HTMLInputElement).checked;
        emit<CheckedDetail>(this, 'hmi-change', { checked: this.checked });
    }

    #onSlotChange(event: Event): void {
        this.hasSlottedLabel = (event.target as HTMLSlotElement)
            .assignedNodes({ flatten: true })
            .some(
                (node) =>
                    node.nodeType === Node.ELEMENT_NODE ||
                    (node.textContent ?? '').trim() !== '',
            );
    }

    /** The label sits inline beside the indicator, not above the control. */
    protected override renderLabel(): typeof nothing {
        return nothing;
    }

    override render() {
        return html`
            <label part="base" class=${this.isDisabled ? 'base disabled' : 'base'}>
                <input
                    id="control"
                    class="input"
                    type="checkbox"
                    .checked=${live(this.checked)}
                    ?required=${this.required}
                    ?disabled=${this.isDisabled}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(this.describedBy)}
                    @change=${this.#onChange}
                />
                ${this.renderIndicator()}
                <span part="label" class="label" ?hidden=${!this.label && !this.hasSlottedLabel}
                    ><slot @slotchange=${this.#onSlotChange}>${this.label}</slot></span
                >
            </label>
            ${this.renderMessage()}
        `;
    }
}
