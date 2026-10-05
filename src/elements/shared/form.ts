import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

/** How a control's value maps to the value it submits with a form. */
export type FormKind = 'text' | 'numeric' | 'checkable';

/**
 * The value a control reports to its form, as a string or `null` for "submit
 * nothing". Ported from the r2wc layer in `src/web-components.ts`: a checkable
 * control submits its `value` attribute (or `'on'`) while checked, an object
 * submits as JSON, and everything else as its string form.
 */
export function coerceFormValue(
    kind: FormKind,
    value: unknown,
    host: HTMLElement,
): string | null {
    if (kind === 'checkable') {
        return value ? (host.getAttribute('value') ?? 'on') : null;
    }
    if (value === null || value === undefined) return null;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

/** A native control whose constraint validation the element mirrors. */
export interface ValidatableControl extends HTMLElement {
    readonly validity: ValidityState;
    readonly validationMessage: string;
}

/**
 * Keeps a form-associated element's validity in step with its inner control.
 * The browser's own rules and messages (`required`, `type="email"`, `pattern`,
 * `minlength`…) come from the native `control`, anchored there so
 * `reportValidity()` focuses it. A non-empty `error` overrides that with a
 * custom error carrying the consumer's text.
 */
export function syncValidity(
    internals: ElementInternals,
    control: ValidatableControl | null,
    error: string,
): void {
    if (error) {
        internals.setValidity(
            { customError: true },
            error,
            control ?? undefined,
        );
    } else if (control) {
        internals.setValidity(
            control.validity,
            control.validationMessage,
            control,
        );
    } else {
        internals.setValidity({});
    }
}

/**
 * Base class of the form elements: `name`, `disabled`, `required`, and the
 * `label`, `hint` and `error` text the element renders itself. It owns the
 * `ElementInternals`, the form callbacks (reset, disabled, restore), the
 * validity API of a native control, and the label and message markup.
 *
 * A subclass supplies the value (`formValue`, `formKind`), the native control
 * that validates it (`control`) and how a reset restores it (`resetFormValue`),
 * and renders `renderLabel()` and `renderMessage()` around its control. The
 * control needs `id="control"`; `describedBy` and `invalid` belong on it.
 */
export abstract class HmiFormField extends LitElement {
    static formAssociated = true;
    static override shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    };

    /** Name under which the value is submitted with the form. */
    @property() accessor name = '';

    /** Disables the control. @default false */
    @property({ type: Boolean, reflect: true }) accessor disabled = false;

    /** The control must have a value for the form to be valid. @default false */
    @property({ type: Boolean, reflect: true }) accessor required = false;

    /** Text shown above the control. */
    @property() accessor label = '';

    /** Helper text shown below the control; hidden while `error` is set. */
    @property() accessor hint = '';

    /** Error message shown below the control. Setting it makes the control invalid. */
    @property() accessor error = '';

    protected readonly internals = this.attachInternals();
    #fieldsetDisabled = false;

    /** How `formValue` is turned into the submitted string. */
    protected abstract readonly formKind: FormKind;

    /** The value to submit. */
    protected abstract get formValue(): unknown;

    /** The native control whose validity is mirrored, once rendered. */
    protected abstract get control(): ValidatableControl | null;

    /** Puts the value back to its initial state (`form.reset()`). */
    protected abstract resetFormValue(): void;

    /** Restores a value the browser saved (history, autofill). Optional. */
    protected restoreFormValue(_state: string | File | FormData | null): void {}

    /* Kept apart from `disabled`: re-enabling the fieldset must not clear a
       `disabled` the author set. */
    formDisabledCallback(disabled: boolean): void {
        this.#fieldsetDisabled = disabled;
        this.requestUpdate();
    }

    formResetCallback(): void {
        this.resetFormValue();
    }

    formStateRestoreCallback(state: string | File | FormData | null): void {
        this.restoreFormValue(state);
    }

    /** Whether the control is disabled, by `disabled` or an ancestor fieldset. */
    protected get isDisabled(): boolean {
        return this.disabled || this.#fieldsetDisabled;
    }

    /** The `id` of the hint or error element to point `aria-describedby` at. */
    protected get describedBy(): string | undefined {
        if (this.error) return 'error';
        return this.hint ? 'hint' : undefined;
    }

    /** `aria-invalid` for the control. */
    protected get invalid(): 'true' | undefined {
        return this.error ? 'true' : undefined;
    }

    get form(): HTMLFormElement | null {
        return this.internals.form;
    }

    get validity(): ValidityState {
        return this.internals.validity;
    }

    get validationMessage(): string {
        return this.internals.validationMessage;
    }

    get willValidate(): boolean {
        return this.internals.willValidate;
    }

    get labels(): NodeList {
        return this.internals.labels;
    }

    checkValidity(): boolean {
        return this.internals.checkValidity();
    }

    reportValidity(): boolean {
        return this.internals.reportValidity();
    }

    /** Reports the current value and validity to the form. */
    protected syncForm(): void {
        this.internals.setFormValue(
            coerceFormValue(this.formKind, this.formValue, this),
        );
        syncValidity(this.internals, this.control, this.error);
    }

    override updated(changed: Map<PropertyKey, unknown>): void {
        super.updated(changed);
        this.syncForm();
    }

    /** The `<label>` tied to the control, with a required marker. */
    protected renderLabel(): TemplateResult | typeof nothing {
        return this.label
            ? html`<label part="label" class="label" for="control"
                  >${this.label}${
                      this.required
                          ? html`<span class="required" aria-hidden="true">*</span>`
                          : nothing
}</label
              >`
            : nothing;
    }

    /** The error (as an alert) or, without one, the hint. */
    protected renderMessage(): TemplateResult | typeof nothing {
        if (this.error) {
            return html`<div id="error" part="error" class="message error" role="alert">
                ${this.error}
            </div>`;
        }
        return this.hint
            ? html`<div id="hint" part="hint" class="message hint">${this.hint}</div>`
            : nothing;
    }
}
