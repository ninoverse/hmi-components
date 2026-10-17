import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { baseStyles } from '../shared/base.styles.js';
import { toggleEmpty } from '../shared/dom.js';
import { styles } from './menu-item.styles.js';

/**
 * Menu item: an activatable row of a menu, with a label, an optional leading
 * icon and an optional trailing hint such as a keyboard shortcut. The row is a
 * native `<button>`, so Enter and Space activate it and a disabled item takes no
 * focus or click. Activation is the native `click`, which crosses the shadow
 * root: listen for `click` on the item.
 *
 * Use it inside `hmi-menu`, `hmi-popover` or `hmi-context-menu`. An item inside a
 * context menu closes it; one inside a popover leaves that to the page, which
 * sets the popover's `open` to `false`.
 *
 * `checked` marks the item as the chosen one of a group, as in a select's list:
 * the row becomes a `menuitemradio` with `aria-checked="true"`, which is how
 * assistive technology learns which one is chosen. It paints nothing, so show the
 * mark yourself, in the `shortcut` slot.
 *
 * `shortcut` is a plain-text default of the `shortcut` slot, and an
 * `<svg slot="icon">` is sized to the row's text. `aria-label` and other
 * attributes set on the host do not reach the inner `<button>`; its name is the
 * label.
 *
 * @tag hmi-menu-item
 * @slot - The label.
 * @slot icon - Rendered before the label. An `<svg>` is sized to the text.
 * @slot shortcut - Rendered after the label. Defaults to `shortcut`.
 * @csspart base - The inner `<button>`.
 * @csspart icon - The wrapper around the icon slot. It is hidden while the slot is empty.
 * @csspart label - The wrapper around the label.
 * @csspart shortcut - The wrapper around the shortcut slot. It is hidden while there is no shortcut.
 *
 * @example
 * <hmi-menu-item shortcut="⌘S">Save</hmi-menu-item>
 */
@customElement('hmi-menu-item')
export class HmiMenuItem extends LitElement {
    static override styles = [baseStyles, styles];
    static override shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    };

    /** Styles the item as a destructive action. @default false */
    @property({ type: Boolean, reflect: true }) accessor danger = false;

    /** Disables the item: it takes no focus and no click. @default false */
    @property({ type: Boolean, reflect: true }) accessor disabled = false;

    /** Marks the item as the chosen one: a `menuitemradio` with `aria-checked`. It paints no mark. @default false */
    @property({ type: Boolean, reflect: true }) accessor checked = false;

    /** A trailing hint, such as a keyboard shortcut: the default of the `shortcut` slot. */
    @property() accessor shortcut = '';

    override render() {
        return html`<button
            part="base"
            class="base"
            type="button"
            role=${this.checked ? 'menuitemradio' : 'menuitem'}
            aria-checked=${ifDefined(this.checked ? 'true' : undefined)}
            ?disabled=${this.disabled}
        >
            <span part="icon" class="icon" hidden
                ><slot
                    name="icon"
                    @slotchange=${(e: Event) => toggleEmpty(e, false)}
                ></slot
            ></span>
            <span part="label" class="label"><slot></slot></span>
            <span part="shortcut" class="shortcut" ?hidden=${!this.shortcut}
                ><slot
                    name="shortcut"
                    @slotchange=${(e: Event) => toggleEmpty(e, !!this.shortcut)}
                    >${this.shortcut}</slot
                ></span
            >
        </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-menu-item': HmiMenuItem;
    }
}
