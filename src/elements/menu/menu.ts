import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './menu.styles.js';

type MenuItemElement = HTMLElement & { disabled: boolean };

/**
 * Menu: a vertical list of `hmi-menu-item` rows, with `hmi-menu-label` headings
 * and `hmi-menu-separator` dividers between them. It paints nothing of its own:
 * the surface comes from the `hmi-popover` or `hmi-context-menu` around it, as
 * with the React menu, so it can sit in either. On its own it is a transparent
 * column.
 *
 * The list is a `role="menu"`, named by `label`. ArrowDown and ArrowUp move focus
 * to the next and previous enabled item, wrapping at the ends, and Home and End
 * to the first and last. The items stay in the Tab order, as the React buttons
 * were. Activating an item is the item's own `click`.
 *
 * @tag hmi-menu
 * @slot - The `hmi-menu-item`, `hmi-menu-label` and `hmi-menu-separator` elements.
 * @csspart base - The column that holds them, with `role="menu"`.
 *
 * @example
 * <hmi-menu label="Actions">
 *   <hmi-menu-item shortcut="⌘N">New file</hmi-menu-item>
 *   <hmi-menu-separator></hmi-menu-separator>
 *   <hmi-menu-item danger>Delete</hmi-menu-item>
 * </hmi-menu>
 */
@customElement('hmi-menu')
export class HmiMenu extends LitElement {
    static override styles = [baseStyles, styles];

    /** The accessible name of the menu. */
    @property() accessor label = '';

    // The enabled items, wherever they sit in the menu's light DOM.
    #items(): MenuItemElement[] {
        return Array.from(
            this.querySelectorAll<MenuItemElement>('hmi-menu-item'),
        ).filter((item) => !item.disabled);
    }

    #onKeyDown(event: KeyboardEvent): void {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        const items = this.#items();
        if (items.length === 0) return;
        const current = items.findIndex((item) =>
            event.composedPath().includes(item),
        );
        let next: number;
        if (event.key === 'ArrowDown') {
            next = current < 0 ? 0 : (current + 1) % items.length;
        } else if (event.key === 'ArrowUp') {
            next =
                current < 0
                    ? items.length - 1
                    : (current - 1 + items.length) % items.length;
        } else if (event.key === 'Home') {
            next = 0;
        } else if (event.key === 'End') {
            next = items.length - 1;
        } else {
            return;
        }
        event.preventDefault();
        items[next]?.focus();
    }

    override render() {
        return html`<div
            part="base"
            class="base"
            role="menu"
            aria-label=${ifDefined(this.label || undefined)}
            @keydown=${this.#onKeyDown}
        >
            <slot></slot>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-menu': HmiMenu;
    }
}
