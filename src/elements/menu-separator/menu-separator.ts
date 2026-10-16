import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './menu-separator.styles.js';

/**
 * Menu separator: a horizontal divider between groups of menu items. It spans the
 * full width of the menu's surface, past the padding around the items.
 *
 * @tag hmi-menu-separator
 * @csspart base - The line.
 *
 * @example
 * <hmi-menu-separator></hmi-menu-separator>
 */
@customElement('hmi-menu-separator')
export class HmiMenuSeparator extends LitElement {
    static override styles = [baseStyles, styles];

    override render() {
        return html`<div part="base" class="base" role="separator"></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-menu-separator': HmiMenuSeparator;
    }
}
