import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../button/button.js';
import '../modal/modal.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './confirm-dialog.styles.js';

export type ConfirmDialogVariant = 'default' | 'danger';

export type ConfirmDialogCancelDetail = Record<string, never>;
export type ConfirmDialogConfirmDetail = Record<string, never>;

// What Enter keeps doing when it is pressed on it: a button activates, a link
// follows, a select opens.
const ACTIVATABLE =
    'a[href], button, select, summary, [role="button"], [role="link"], hmi-button';

/**
 * Confirmation dialog: a modal with a cancel and a confirm button, for a
 * destructive or irreversible action. It is an `<hmi-modal>` inside its own
 * root, so it has the modal's panel, scrim, focus trap and scroll lock, and
 * forwards its `panel`, `title`, `description` and `actions` parts.
 *
 * The dialog is controlled, as the v5 component was: it never closes itself.
 * The cancel button, Escape and a press on the backdrop fire `hmi-cancel`, and
 * the confirm button and Enter fire `hmi-confirm`; set `open` to `false` from
 * either listener to close it, or keep it open while the work runs, with
 * `loading`.
 *
 * Enter confirms from anywhere except a focused button, link or select, which
 * keep their own action: a Tab to Cancel, then Enter, cancels. `confirm-on-button`
 * makes Enter confirm from there too, as in v5. Where focus starts on open is the
 * browser's: Chromium puts it on the dialog, so Enter confirms at once.
 *
 * `heading` and `description` are plain-text defaults of the `title` and
 * `description` slots; `confirm-label` and `cancel-label` are those of the
 * `confirm-label` and `cancel-label` slots. There is no `title` property:
 * `title` is the native tooltip attribute on every element.
 *
 * @tag hmi-confirm-dialog
 * @slot title - The heading. Defaults to `heading`.
 * @slot description - Supporting text under the title. Defaults to `description`.
 * @slot confirm-label - The confirm button's text. Defaults to `confirm-label`.
 * @slot cancel-label - The cancel button's text. Defaults to `cancel-label`.
 * @fires {CustomEvent<ConfirmDialogCancelDetail>} hmi-cancel - The cancel button, Escape or a press on the backdrop. Cancelable, but the dialog does not close itself either way: set `open` to `false`.
 * @fires {CustomEvent<ConfirmDialogConfirmDetail>} hmi-confirm - The confirm button, or Enter.
 * @csspart base - The `<dialog>`, from the modal.
 * @csspart panel - The `<dialog>`, under its panel-group name.
 * @csspart title - The `<h2>` around the title.
 * @csspart description - The paragraph around the description.
 * @csspart actions - The footer around the two buttons.
 * @csspart cancel - The cancel button.
 * @csspart confirm - The confirm button.
 *
 * @example
 * <hmi-confirm-dialog open variant="danger" heading="Delete the project?" confirm-label="Delete"></hmi-confirm-dialog>
 */
@customElement('hmi-confirm-dialog')
export class HmiConfirmDialog extends LitElement {
    static override styles = [baseStyles, styles];

    /** Whether the dialog is open. Set it from the `hmi-cancel` and `hmi-confirm` listeners. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** The title, as plain text: the default of the `title` slot. */
    @property() accessor heading = '';

    /** Supporting text under the title: the default of the `description` slot. */
    @property() accessor description = '';

    /** The confirm button's text: the default of the `confirm-label` slot. @default 'Confirm' */
    @property({ attribute: 'confirm-label' }) accessor confirmLabel = 'Confirm';

    /** The cancel button's text: the default of the `cancel-label` slot. @default 'Cancel' */
    @property({ attribute: 'cancel-label' }) accessor cancelLabel = 'Cancel';

    /** `danger` styles the confirm button as destructive. @default 'default' */
    @property({ reflect: true }) accessor variant: ConfirmDialogVariant =
        'default';

    /** Disables both buttons, and Enter, while an action is in flight. */
    @property({ type: Boolean, reflect: true }) accessor loading = false;

    /** Disables the confirm button, and Enter, for example while validation fails. */
    @property({ type: Boolean, reflect: true, attribute: 'confirm-disabled' })
    accessor confirmDisabled = false;

    /** Enter confirms even when focus is on a button, link or select, as in v5. By default those keep their own action. */
    @property({ type: Boolean, attribute: 'confirm-on-button' })
    accessor confirmOnButton = false;

    #cancel(): void {
        emit<ConfirmDialogCancelDetail>(
            this,
            'hmi-cancel',
            {},
            { cancelable: true },
        );
    }

    #confirm(): void {
        if (this.loading || this.confirmDisabled) return;
        emit<ConfirmDialogConfirmDetail>(this, 'hmi-confirm', {});
    }

    // Escape and a press on the backdrop: the modal's `hmi-close`, which stays
    // inside this element, becomes `hmi-cancel`.
    #onModalClose(event: Event): void {
        event.stopPropagation();
        this.#cancel();
    }

    #onKeydown(event: KeyboardEvent): void {
        if (
            event.key !== 'Enter' ||
            event.shiftKey ||
            event.metaKey ||
            event.ctrlKey ||
            event.altKey
        ) {
            return;
        }
        const keepsEnter = event
            .composedPath()
            .some(
                (node) => node instanceof Element && node.matches(ACTIVATABLE),
            );
        if (keepsEnter && !this.confirmOnButton) return;
        event.preventDefault();
        this.#confirm();
    }

    override render() {
        return html`<hmi-modal
            exportparts="base, panel, title, description, actions"
            ?open=${this.open}
            heading=${this.heading}
            description=${this.description}
            @hmi-close=${this.#onModalClose}
            @keydown=${this.#onKeydown}
        >
            <slot name="title" slot="title"></slot>
            <slot name="description" slot="description"></slot>
            <hmi-button
                slot="actions"
                part="cancel"
                variant="ghost"
                ?disabled=${this.loading}
                @click=${() => {
                    if (!this.loading) this.#cancel();
                }}
            >
                <slot name="cancel-label">${this.cancelLabel}</slot>
            </hmi-button>
            <hmi-button
                slot="actions"
                part="confirm"
                variant=${this.variant === 'danger' ? 'danger' : 'primary'}
                ?disabled=${this.loading || this.confirmDisabled}
                @click=${() => this.#confirm()}
            >
                <slot name="confirm-label">${this.confirmLabel}</slot>
            </hmi-button>
        </hmi-modal>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-confirm-dialog': HmiConfirmDialog;
    }
}
