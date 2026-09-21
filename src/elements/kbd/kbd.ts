import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './kbd.styles.js';

export type KbdSize = 'small' | 'medium';

/**
 * Renders a keyboard key cap.
 *
 * @tag hmi-kbd
 * @slot - Key label (e.g. `⌘`, `Ctrl`).
 * @csspart base - The key cap.
 */
@customElement('hmi-kbd')
export class HmiKbd extends LitElement {
    static override styles = [baseStyles, styles];

    /** Key cap size. @default 'medium' */
    @property({ reflect: true }) accessor size: KbdSize = 'medium';

    override render() {
        return html`<kbd part="base" class="base"><slot></slot></kbd>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-kbd': HmiKbd;
    }
}
