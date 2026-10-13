import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    type DialogActionDetail,
    type DialogCloseDetail,
    type DialogCloseReason,
    HmiDialog,
} from '../shared/dialog.js';
import { styles } from './modal.styles.js';

export type { DialogAction } from '../shared/dialog.js';

export type ModalSize = 'medium' | 'large';

/** Why a modal asks to be closed. */
export type ModalCloseReason = DialogCloseReason;

export type ModalCloseDetail = DialogCloseDetail;

export type ModalActionDetail = DialogActionDetail;

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
export class HmiModal extends HmiDialog {
    static override styles = [baseStyles, styles];

    /** The width preset. @default 'medium' */
    @property({ reflect: true }) accessor size: ModalSize = 'medium';
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-modal': HmiModal;
    }
}
