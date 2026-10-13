import { html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    type DialogActionDetail,
    type DialogCloseDetail,
    type DialogCloseReason,
    HmiDialog,
} from '../shared/dialog.js';
import { toCssLength } from '../shared/dom.js';
import { styles } from './drawer.styles.js';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

/** Why a drawer asks to be closed. */
export type DrawerCloseReason = DialogCloseReason;

export type DrawerCloseDetail = DialogCloseDetail;

export type DrawerActionDetail = DialogActionDetail;

/**
 * Drawer: a panel that slides in from an edge of the screen, over a scrim, with
 * a title, a description, a body and footer actions. It is a native `<dialog>`
 * opened with `showModal()`, so the page behind it is inert and focus is trapped
 * inside; the page also stops scrolling while it is open.
 *
 * The drawer is controlled, as the v5 component was: it never closes itself.
 * Escape and a press on the scrim fire the cancelable `hmi-close` with the
 * `reason`; set `open` to `false` from the listener to close it. Footer actions
 * given as an `actions` array, or as slotted content, fire `hmi-action` with the
 * action's `value` and do not close it either.
 *
 * `side` is the edge it comes from. `size` is its width for `left` and `right`
 * and its height for `top` and `bottom`: a number of px, or any CSS length. The
 * default is 40 base units wide, or 36 high, and never more than 90% of the
 * screen. `heading` and `description` are plain-text defaults of the `title` and
 * `description` slots. There is no `title` property: `title` is the native
 * tooltip attribute on every element. The drawer is named by its title; with no
 * title, set `label`.
 *
 * @tag hmi-drawer
 * @slot - The body, in a scrolling area between the description and the footer.
 * @slot title - The heading, in an `<h2>`. Defaults to `heading`.
 * @slot description - Supporting text under the title. Defaults to `description`.
 * @slot actions - The footer buttons. Defaults to the `actions` array.
 * @fires {CustomEvent<DrawerCloseDetail>} hmi-close - Escape or a press on the scrim. Cancelable, but the drawer does not close itself either way: set `open` to `false`.
 * @fires {CustomEvent<DrawerActionDetail>} hmi-action - A button rendered from the `actions` array was activated.
 * @csspart base - The `<dialog>`.
 * @csspart panel - The `<dialog>`, under its panel-group name.
 * @csspart title - The `<h2>` around the title.
 * @csspart description - The paragraph around the description.
 * @csspart body - The area around the default slot.
 * @csspart actions - The footer around the actions.
 * @csspart action - A button rendered from the `actions` array.
 *
 * @example
 * <hmi-drawer open side="right" heading="Filters" description="Tune the result set.">
 *   <hmi-button slot="actions" variant="primary">Apply</hmi-button>
 * </hmi-drawer>
 */
@customElement('hmi-drawer')
export class HmiDrawer extends HmiDialog {
    static override styles = [baseStyles, styles];

    /** The edge the panel slides in from. @default 'right' */
    @property({ reflect: true }) accessor side: DrawerSide = 'right';

    /** The panel's width for `left` and `right`, its height for `top` and `bottom`: a number of px, or any CSS length. Defaults to 40 base units wide, 36 high; never more than 90% of the screen. */
    @property() accessor size: string | number | undefined;

    protected override updated(changed: PropertyValues<this>): void {
        super.updated(changed);
        if (!changed.has('size')) return;
        if (this.size === undefined || this.size === '') {
            this.style.removeProperty('--_size');
        } else {
            this.style.setProperty('--_size', toCssLength(this.size));
        }
    }

    protected override renderBody() {
        return html`<div part="body" class="body"><slot></slot></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-drawer': HmiDrawer;
    }
}
