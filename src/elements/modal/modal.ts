import { html, isServer, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    type DialogAction,
    renderDialogActions,
} from '../shared/dialog-actions.js';
import { activeElementDeep } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { lockScroll } from '../shared/scroll-lock.js';
import { styles } from './modal.styles.js';

export type { DialogAction } from '../shared/dialog-actions.js';

export type ModalSize = 'medium' | 'large';

/** Why a modal asks to be closed. */
export type ModalCloseReason = 'escape' | 'backdrop';

export interface ModalCloseDetail {
    /** What the user did: pressed Escape, or pressed outside the dialog. */
    reason: ModalCloseReason;
}

export interface ModalActionDetail {
    /** The `value` of the `DialogAction` that was activated. */
    value: string;
}

/**
 * Modal dialog: a panel over a scrim, with a title, a description, a body and
 * footer actions. It is a native `<dialog>` opened with `showModal()`, so the
 * page behind it is inert and focus is trapped inside; the page also stops
 * scrolling while it is open.
 *
 * The dialog is controlled, as the v5 component was: it never closes itself.
 * Escape and a press on the backdrop fire the cancelable `hmi-close` with the
 * `reason`; set `open` to `false` from the listener to close it. Footer actions
 * given as an `actions` array, or as slotted content, fire `hmi-action` with the
 * action's `value` and do not close it either.
 *
 * `heading` and `description` are plain-text defaults of the `title` and
 * `description` slots. There is no `title` property: `title` is the native
 * tooltip attribute on every element. The dialog is named by its title; with no
 * title, set `label`.
 *
 * @tag hmi-modal
 * @slot - The body.
 * @slot title - The heading, in an `<h2>`. Defaults to `heading`.
 * @slot description - Supporting text under the title. Defaults to `description`.
 * @slot actions - The footer buttons. Defaults to the `actions` array.
 * @fires {CustomEvent<ModalCloseDetail>} hmi-close - Escape or a press on the backdrop. Cancelable, but the dialog does not close itself either way: set `open` to `false`.
 * @fires {CustomEvent<ModalActionDetail>} hmi-action - A button rendered from the `actions` array was activated.
 * @csspart base - The `<dialog>`.
 * @csspart panel - The `<dialog>`, under its panel-group name.
 * @csspart title - The `<h2>` around the title.
 * @csspart description - The paragraph around the description.
 * @csspart actions - The footer around the actions.
 * @csspart action - A button rendered from the `actions` array.
 *
 * @example
 * <hmi-modal open heading="Edit profile" description="Changes apply at once.">
 *   <hmi-button slot="actions" variant="primary">Save</hmi-button>
 * </hmi-modal>
 */
@customElement('hmi-modal')
export class HmiModal extends LitElement {
    static override styles = [baseStyles, styles];

    /** Whether the dialog is open. Set it from the `hmi-close` listener to close it. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** The width preset. @default 'medium' */
    @property({ reflect: true }) accessor size: ModalSize = 'medium';

    /** The title, as plain text: the default of the `title` slot. */
    @property() accessor heading = '';

    /** Supporting text under the title: the default of the `description` slot. */
    @property() accessor description = '';

    /** The footer actions, rendered as buttons: the default of the `actions` slot. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor actions: DialogAction[] = [];

    /** The accessible name of the dialog when it has no title. */
    @property() accessor label = '';

    @query('dialog') private accessor dialog!: HTMLDialogElement;

    // Whether a slot holds content of the consumer's: an element, or text that
    // is not blank. A slot another element forwards into this one counts through
    // what it holds.
    @state() private accessor titleSlotted = false;
    @state() private accessor descriptionSlotted = false;
    @state() private accessor actionsSlotted = false;

    #restoreFocusTo: HTMLElement | null = null;
    #unlockScroll: (() => void) | undefined;

    override connectedCallback(): void {
        super.connectedCallback();
        // A dialog taken out of the document leaves the top layer: show it again
        // when it comes back still open.
        if (!isServer && this.hasUpdated) this.#sync();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#unlockScroll?.();
        this.#unlockScroll = undefined;
    }

    protected override updated(changed: PropertyValues<this>): void {
        if (changed.has('open') && !isServer) this.#sync();
    }

    // Brings the `<dialog>` in step with `open`.
    #sync(): void {
        const dialog = this.dialog;
        if (!dialog) return;
        if (this.open && !dialog.matches(':modal')) {
            // A dialog taken out of the document keeps its `open` attribute but
            // leaves the top layer: close it before showing it again.
            if (dialog.open) dialog.close();
            this.#restoreFocusTo ??= activeElementDeep(
                document,
            ) as HTMLElement | null;
            dialog.showModal();
            this.#unlockScroll ??= lockScroll();
        } else if (!this.open) {
            if (dialog.open) dialog.close();
            this.#release();
        }
    }

    // Lets the page scroll again and gives focus back to what had it.
    #release(): void {
        this.#unlockScroll?.();
        this.#unlockScroll = undefined;
        const target = this.#restoreFocusTo;
        this.#restoreFocusTo = null;
        if (target?.isConnected) target.focus?.();
    }

    #requestClose(reason: ModalCloseReason): void {
        emit<ModalCloseDetail>(
            this,
            'hmi-close',
            { reason },
            { cancelable: true },
        );
    }

    // Escape. The dialog stays open until `open` is set to false.
    #onCancel(event: Event): void {
        event.preventDefault();
        this.#requestClose('escape');
    }

    // The browser closed the dialog by itself (a second Escape with no other
    // interaction in between cannot be cancelled): the dialog is controlled, so
    // open it again while `open` still says it should be.
    #onClose(): void {
        if (!this.open || this.dialog.open) return;
        this.dialog.showModal();
        this.#requestClose('escape');
    }

    // A press outside the dialog's box lands on the `<dialog>` itself, through
    // the backdrop. The panel's own padding is inside the box.
    #onPointerDown(event: MouseEvent): void {
        if (event.target !== this.dialog) return;
        const box = this.dialog.getBoundingClientRect();
        const outside =
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom;
        if (outside) this.#requestClose('backdrop');
    }

    #onSlotChange(event: Event, set: (hasContent: boolean) => void): void {
        const slot = event.currentTarget as HTMLSlotElement;
        set(
            slot
                .assignedNodes({ flatten: true })
                .some(
                    (node) =>
                        node.nodeType === Node.ELEMENT_NODE ||
                        (node.nodeType === Node.TEXT_NODE &&
                            (node.textContent ?? '').trim() !== ''),
                ),
        );
    }

    override render() {
        const hasTitle = this.titleSlotted || this.heading !== '';
        const hasDescription =
            this.descriptionSlotted || this.description !== '';
        const hasActions = this.actionsSlotted || this.actions.length > 0;
        return html`<dialog
            part="base panel"
            class="panel"
            aria-labelledby=${hasTitle ? 'title' : nothing}
            aria-describedby=${hasDescription ? 'description' : nothing}
            aria-label=${!hasTitle && this.label ? this.label : nothing}
            @cancel=${this.#onCancel}
            @close=${this.#onClose}
            @mousedown=${this.#onPointerDown}
        >
            ${renderLiquidFilter()}
            <h2 part="title" class="title" id="title" ?hidden=${!hasTitle}>
                <slot
                    name="title"
                    @slotchange=${(e: Event) =>
                        this.#onSlotChange(e, (v) => {
                            this.titleSlotted = v;
                        })}
                    ></slot
                >${this.titleSlotted ? nothing : this.heading}
            </h2>
            <p
                part="description"
                class="description"
                id="description"
                ?hidden=${!hasDescription}
            >
                <slot
                    name="description"
                    @slotchange=${(e: Event) =>
                        this.#onSlotChange(e, (v) => {
                            this.descriptionSlotted = v;
                        })}
                    ></slot
                >${this.descriptionSlotted ? nothing : this.description}
            </p>
            <slot></slot>
            <div part="actions" class="actions" ?hidden=${!hasActions}>
                <slot
                    name="actions"
                    @slotchange=${(e: Event) =>
                        this.#onSlotChange(e, (v) => {
                            this.actionsSlotted = v;
                        })}
                    >${renderDialogActions(this.actions, (value) =>
                        emit<ModalActionDetail>(this, 'hmi-action', { value }),
                    )}</slot
                >
            </div>
        </dialog>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-modal': HmiModal;
    }
}
