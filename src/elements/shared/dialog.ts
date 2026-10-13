import {
    html,
    isServer,
    LitElement,
    nothing,
    type PropertyValues,
    type TemplateResult,
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { type DialogAction, renderDialogActions } from './dialog-actions.js';
import { activeElementDeep } from './dom.js';
import { emit } from './events.js';
import { renderLiquidFilter } from './panel.js';
import { lockScroll } from './scroll-lock.js';

export type { DialogAction } from './dialog-actions.js';

/** Why a dialog asks to be closed. */
export type DialogCloseReason = 'escape' | 'backdrop';

export interface DialogCloseDetail {
    /** What the user did: pressed Escape, or pressed outside the dialog. */
    reason: DialogCloseReason;
}

export interface DialogActionDetail {
    /** The `value` of the `DialogAction` that was activated. */
    value: string;
}

/**
 * What the dialog group (modal, drawer) shares: a native `<dialog>` opened with
 * `showModal()`, a title, a description, a body and footer actions, kept in step
 * with `open`. The page behind is inert and stops scrolling while it is open,
 * and focus goes back to what had it when it closes.
 *
 * The dialog is controlled, as the v5 components were: it never closes itself.
 * Escape and a press on the backdrop fire the cancelable `hmi-close` with the
 * `reason`; set `open` to `false` from the listener to close it. Footer actions
 * given as an `actions` array fire `hmi-action` with the action's `value`, and
 * do not close it either.
 *
 * A subclass is the element: it brings its `@customElement` tag, its styles, its
 * own properties and, when its body is wrapped, `renderBody()`.
 */
export class HmiDialog extends LitElement {
    /** Whether the dialog is open. Set it from the `hmi-close` listener to close it. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

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

    #requestClose(reason: DialogCloseReason): void {
        emit<DialogCloseDetail>(
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

    /** What sits between the description and the footer. The default is the body slot. */
    protected renderBody(): TemplateResult {
        return html`<slot></slot>`;
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
            ${this.renderBody()}
            <div part="actions" class="actions" ?hidden=${!hasActions}>
                <slot
                    name="actions"
                    @slotchange=${(e: Event) =>
                        this.#onSlotChange(e, (v) => {
                            this.actionsSlotted = v;
                        })}
                    >${renderDialogActions(this.actions, (value) =>
                        emit<DialogActionDetail>(this, 'hmi-action', { value }),
                    )}</slot
                >
            </div>
        </dialog>`;
    }
}
