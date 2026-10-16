import { html, isServer, LitElement, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { activeElementDeep, supportsPopover } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { styles } from './context-menu.styles.js';

/** When the menu moves focus to its first item as it opens. */
export type ContextMenuFocusOnOpen = 'keyboard' | 'always' | 'never';

export interface ContextMenuOpenChangeDetail {
    /** Whether the context menu is open now. */
    open: boolean;
}

// The gap the menu keeps from the edges of the screen, in base units.
const MARGIN = 1;

/**
 * Context menu: a card of menu items that opens at the pointer when the trigger
 * is right-clicked, kept inside the screen. The card is a `popover="manual"`
 * element in the top layer, so no overflowing ancestor clips it. The element closes
 * it itself on an outside press, on Escape, on scroll and resize (it does not
 * follow the trigger) and when an item is activated; a click on its padding or a
 * label leaves it open. It is not `popover="auto"`: macOS and Linux fire
 * `contextmenu` when the button goes down, and the light dismiss of an auto popover
 * would close the card as that same press is released.
 *
 * The trigger is the `trigger` slot, and the card's content is the `menu` slot:
 * an `hmi-menu` of `hmi-menu-item`, `hmi-menu-label` and `hmi-menu-separator`.
 * The native context menu is prevented on the trigger.
 *
 * The element owns `open`. A right-click, an outside press, Escape, a scroll and an
 * activated item change it and fire `hmi-open-change` with the new state; setting
 * `open` yourself opens or closes it and fires nothing. Opened from code it sits at
 * the trigger's top-left corner. A right-click on the trigger while it is open moves
 * it to the new point; a press anywhere else outside the card closes it.
 *
 * `focus-on-open` decides when the first enabled item takes focus as the menu
 * opens, so the arrow keys work at once: `keyboard` (the default) when the
 * `contextmenu` event is not a right-button press, such as the Menu key and
 * Shift+F10; `always`; or `never`, as the React menu did, when Tab from the trigger
 * still reaches the card. As the menu closes, focus goes back to where it was if
 * it was in the menu or lost; the browser does not do that for slotted content.
 *
 * Where the browser has no Popover API, the same card is a fixed-position element
 * that the element shows and hides.
 *
 * @tag hmi-context-menu
 * @slot trigger - The element that opens the menu when right-clicked: anything inside it counts.
 * @slot menu - The card's content: an `hmi-menu`.
 * @fires {CustomEvent<ContextMenuOpenChangeDetail>} hmi-open-change - The user opened or closed the menu: a right-click, an outside press, Escape, a scroll or an activated item. Not cancelable, and not fired when `open` is set from code.
 * @csspart trigger - The wrapper around the trigger slot.
 * @csspart base - The floating card.
 * @csspart panel - The floating card, under its panel-group name.
 *
 * @example
 * <hmi-context-menu>
 *   <div slot="trigger">Right-click anywhere in this area</div>
 *   <hmi-menu slot="menu" label="Edit">
 *     <hmi-menu-item shortcut="⌘C">Copy</hmi-menu-item>
 *     <hmi-menu-item danger>Delete</hmi-menu-item>
 *   </hmi-menu>
 * </hmi-context-menu>
 */
@customElement('hmi-context-menu')
export class HmiContextMenu extends LitElement {
    static override styles = [baseStyles, styles];

    /** Whether the context menu is open. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** When the first enabled item takes focus as the menu opens: for a `contextmenu` that is not a right-button press, always, or never. @default 'keyboard' */
    @property({ attribute: 'focus-on-open' })
    accessor focusOnOpen: ContextMenuFocusOnOpen = 'keyboard';

    @query('.panel') private accessor panel!: HTMLElement;
    @query('.trigger') private accessor trigger!: HTMLElement;
    @query('slot[name="trigger"]')
    private accessor triggerSlot!: HTMLSlotElement;

    // Where the right-click was, until the menu closes.
    #point: { x: number; y: number } | undefined;
    // Whether the `contextmenu` that opened it was not a right-button press.
    #keyboard = false;
    // The listeners that close the menu on an outside press, Escape, scroll and
    // resize; they live while it is open.
    #listeners: AbortController | undefined;
    // What had focus as the menu opened, to give it back as the menu closes.
    #restoreFocusTo: HTMLElement | null = null;

    override connectedCallback(): void {
        super.connectedCallback();
        // A card taken out of the document leaves the top layer: show it again
        // when it comes back still open.
        if (!isServer && this.hasUpdated && this.open) this.#sync();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#listeners?.abort();
        this.#listeners = undefined;
    }

    protected override updated(changed: PropertyValues<this>): void {
        if (isServer) return;
        if (changed.has('open')) this.#sync();
    }

    // Brings the card in step with `open`.
    #sync(): void {
        const panel = this.panel;
        if (!panel) return;
        const native = supportsPopover();
        if (this.open) {
            this.#restoreFocusTo = activeElementDeep(
                document,
            ) as HTMLElement | null;
            if (native && !panel.matches(':popover-open')) panel.showPopover();
            this.#listen();
            this.#place();
            this.#focusFirstItem();
        } else {
            if (native && panel.matches(':popover-open')) panel.hidePopover();
            this.#listeners?.abort();
            this.#listeners = undefined;
            this.#point = undefined;
            this.#keyboard = false;
            this.#restoreFocus();
        }
    }

    // The browser gives focus back to what had it only when it was inside the
    // card in the node tree, and the menu is slotted: do it here, unless the user
    // has moved focus somewhere else on purpose.
    #restoreFocus(): void {
        const target = this.#restoreFocusTo;
        this.#restoreFocusTo = null;
        const root = this.getRootNode() as Document | ShadowRoot;
        const active = root.activeElement;
        if (
            target?.isConnected &&
            (!active || active === document.body || this.contains(active))
        ) {
            target.focus({ preventScroll: true });
        }
    }

    #listen(): void {
        this.#listeners?.abort();
        this.#listeners = new AbortController();
        const { signal } = this.#listeners;
        const close = () => this.#setOpen(false);
        window.addEventListener('scroll', close, {
            capture: true,
            passive: true,
            signal,
        });
        window.addEventListener('resize', close, { signal });
        document.addEventListener(
            'pointerdown',
            (event) => {
                const path = event.composedPath();
                if (path.includes(this.panel)) return;
                // A right-click on the trigger moves the menu: its `contextmenu`
                // follows this press.
                if (event.button === 2 && path.includes(this.trigger)) return;
                close();
            },
            { capture: true, signal },
        );
        document.addEventListener(
            'keydown',
            (event) => {
                if (event.key === 'Escape') close();
            },
            { signal },
        );
    }

    // The card sits at the point, clamped inside the screen with a margin. It is
    // measured by its layout size: its entry animation scales it.
    #place(): void {
        const panel = this.panel;
        const point = this.#point ?? this.#triggerCorner();
        const base =
            Number.parseFloat(
                getComputedStyle(panel).getPropertyValue('--_base'),
            ) || 8;
        const margin = base * MARGIN;
        const { clientWidth, clientHeight } = document.documentElement;
        const x = Math.max(
            margin,
            Math.min(point.x, clientWidth - panel.offsetWidth - margin),
        );
        const y = Math.max(
            margin,
            Math.min(point.y, clientHeight - panel.offsetHeight - margin),
        );
        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;
    }

    #triggerCorner(): { x: number; y: number } {
        const box = this.triggerSlot
            ?.assignedElements()[0]
            ?.getBoundingClientRect();
        return { x: box?.left ?? 0, y: box?.top ?? 0 };
    }

    #focusFirstItem(): void {
        const wanted =
            this.focusOnOpen === 'always' ||
            (this.focusOnOpen === 'keyboard' && this.#keyboard);
        if (!wanted) return;
        const menu = this.querySelector('[slot="menu"]');
        const item = menu?.matches('hmi-menu-item:not([disabled])')
            ? menu
            : menu?.querySelector('hmi-menu-item:not([disabled])');
        (item as HTMLElement | null | undefined)?.focus({
            preventScroll: true,
        });
    }

    // A change the user made: it is told to the consumer. Nothing is told for a
    // change the consumer made through `open`.
    #setOpen(open: boolean): void {
        if (this.open === open) return;
        this.open = open;
        emit<ContextMenuOpenChangeDetail>(this, 'hmi-open-change', { open });
    }

    #onContextMenu(event: MouseEvent): void {
        event.preventDefault();
        this.#point = { x: event.clientX, y: event.clientY };
        this.#keyboard = event.button !== 2;
        if (this.open) {
            this.#place();
            this.#focusFirstItem();
        } else {
            this.#setOpen(true);
        }
    }

    // An activated button closes the menu, after the handlers on the item and
    // above it have run; a click on the padding or a label does not.
    #onClick(event: MouseEvent): void {
        for (const node of event.composedPath()) {
            if (node === this.panel) return;
            if (node instanceof HTMLButtonElement) {
                this.#setOpen(false);
                return;
            }
        }
    }

    override render() {
        return html`<span
                part="trigger"
                class="trigger"
                @contextmenu=${this.#onContextMenu}
                ><slot name="trigger"></slot
            ></span>
            <div
                part="base panel"
                class="panel"
                popover="manual"
                @click=${this.#onClick}
            >
                ${renderLiquidFilter()}
                <slot name="menu"></slot>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-context-menu': HmiContextMenu;
    }
}
