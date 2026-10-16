import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './menu-label.styles.js';

/**
 * Menu label: a non-interactive group heading inside a menu, in small capitals.
 *
 * @tag hmi-menu-label
 * @slot - The heading.
 * @csspart base - The wrapper around the heading.
 *
 * @example
 * <hmi-menu-label>Workspace</hmi-menu-label>
 */
@customElement('hmi-menu-label')
export class HmiMenuLabel extends LitElement {
    static override styles = [baseStyles, styles];

    override render() {
        return html`<div part="base" class="base"><slot></slot></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-menu-label': HmiMenuLabel;
    }
}
