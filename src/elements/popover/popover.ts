import { html, isServer, LitElement, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { supportsPopover, toCssLength } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { PositionController } from '../shared/positioning.js';
import { styles } from './popover.styles.js';

export type PopoverAlign = 'start' | 'end';

export interface PopoverOpenChangeDetail {
    /** Whether the popover is open now. */
    open: boolean;
}

/**
 * Popover: a floating panel anchored under a trigger. The panel is a
 * `popover="auto"` element in the top layer, so it is never clipped by an
 * overflowing ancestor, and the browser closes it on an outside click or Escape
 * and when another popover opens.
 *
 * The element owns `open`: it follows the browser. A press on the trigger, an
 * outside click and Escape change it and fire `hmi-open-change` with the new
 * state; setting `open` yourself opens or closes it and fires nothing. The
 * trigger is the `trigger` slot, and it gets `aria-expanded`, and `aria-haspopup`
 * unless it has its own. The panel opens under the trigger, from its left edge
 * (`align="start"`) or ending at its right edge (`end`), as wide as the trigger
 * at least, and follows it as the page scrolls or resizes.
 *
 * Where the browser has no Popover API, the same panel is a fixed-position
 * element that the element shows and hides, and the element closes it on an
 * outside press or Escape itself.
 *
 * @tag hmi-popover
 * @slot - The panel's content.
 * @slot trigger - The element that opens and closes the popover: the first element slotted is the anchor.
 * @fires {CustomEvent<PopoverOpenChangeDetail>} hmi-open-change - The user opened or closed the popover: a press on the trigger, an outside click or Escape. Not cancelable, and not fired when `open` is set from code.
 * @csspart trigger - The wrapper around the trigger slot.
 * @csspart base - The floating panel.
 * @csspart panel - The floating panel, under its panel-group name.
 *
 * @example
 * <hmi-popover align="end" width="320">
 *   <hmi-button slot="trigger" variant="secondary">Open</hmi-button>
 *   Anchored to the trigger's right edge.
 * </hmi-popover>
 */
@customElement('hmi-popover')
export class HmiPopover extends LitElement {
    static override styles = [baseStyles, styles];

    /** Whether the popover is open. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** Which edge of the trigger the panel lines up with: its left edge, or its right edge. @default 'start' */
    @property({ reflect: true }) accessor align: PopoverAlign = 'start';

    /** The panel's minimum width: a number of px, or any CSS length (a plain number in an attribute is px). Defaults to the trigger's width. */
    @property() accessor width: string | number | undefined;

    @query('.panel') private accessor panel!: HTMLElement;
    @query('slot[name="trigger"]')
    private accessor triggerSlot!: HTMLSlotElement;

    readonly #position = new PositionController(this, {
        anchor: () => this.#trigger(),
        panel: () => this.panel,
        align: () => (this.align === 'end' ? 'end' : 'start'),
        offset: 6,
        matchWidth: true,
    });

    // Whether the popover was open when the pointer went down on the trigger: the
    // browser's light dismiss closes it on that very press, so the click that
    // follows must not open it again.
    #openAtPress: boolean | undefined;
    // The document listeners that close the panel where it has no Popover API.
    #fallback: AbortController | undefined;

    override connectedCallback(): void {
        super.connectedCallback();
        // A panel taken out of the document leaves the top layer: show it again
        // when it comes back still open.
        if (!isServer && this.hasUpdated && this.open) this.#sync();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#fallback?.abort();
        this.#fallback = undefined;
    }

    protected override updated(changed: PropertyValues<this>): void {
        if (changed.has('width')) this.#applyWidth();
        if (isServer) return;
        if (changed.has('open')) this.#sync();
        else if (changed.has('align') && this.open) this.#position.update();
    }

    #trigger(): Element | null {
        return this.triggerSlot?.assignedElements()[0] ?? null;
    }

    #applyWidth(): void {
        if (this.width === undefined || this.width === '') {
            this.panel.style.removeProperty('--_min-width');
        } else {
            this.panel.style.setProperty(
                '--_min-width',
                toCssLength(this.width),
            );
        }
    }

    // `aria-expanded` follows `open`; `aria-haspopup` is only a default, so a
    // trigger that says it opens a menu or a dialog keeps saying so.
    #syncAria(): void {
        const trigger = this.#trigger();
        if (!trigger) return;
        trigger.setAttribute('aria-expanded', String(this.open));
        if (!trigger.hasAttribute('aria-haspopup')) {
            trigger.setAttribute('aria-haspopup', 'true');
        }
    }

    // Brings the panel in step with `open`.
    #sync(): void {
        const panel = this.panel;
        if (!panel) return;
        this.#syncAria();
        const native = supportsPopover();
        if (this.open) {
            if (native) {
                if (!panel.matches(':popover-open')) panel.showPopover();
            } else {
                this.#listenForDismissal();
            }
            this.#position.start();
        } else {
            if (native) {
                if (panel.matches(':popover-open')) panel.hidePopover();
            } else {
                this.#fallback?.abort();
                this.#fallback = undefined;
            }
            this.#position.stop();
        }
    }

    // Without the Popover API there is no light dismiss: an outside press or
    // Escape closes the panel.
    #listenForDismissal(): void {
        this.#fallback?.abort();
        this.#fallback = new AbortController();
        const { signal } = this.#fallback;
        document.addEventListener(
            'pointerdown',
            (event) => {
                if (!event.composedPath().includes(this)) this.#setOpen(false);
            },
            { capture: true, signal },
        );
        document.addEventListener(
            'keydown',
            (event) => {
                if (event.key === 'Escape') this.#setOpen(false);
            },
            { signal },
        );
    }

    // A change the user made: it is told to the consumer. Nothing is told for a
    // change the consumer made through `open`.
    #setOpen(open: boolean): void {
        if (this.open === open) return;
        this.open = open;
        emit<PopoverOpenChangeDetail>(this, 'hmi-open-change', { open });
    }

    // The browser closed the panel by itself: an outside click, Escape, or
    // another popover opening. When the element closed it, `open` is already false.
    #onToggle(event: ToggleEvent): void {
        if (event.newState === 'closed') this.#setOpen(false);
    }

    #onPointerDown(): void {
        this.#openAtPress = this.open;
    }

    #onKeyDown(): void {
        this.#openAtPress = undefined;
    }

    #onTriggerClick(): void {
        const wasOpen = this.#openAtPress ?? this.open;
        this.#openAtPress = undefined;
        this.#setOpen(!wasOpen);
    }

    #onTriggerChange(): void {
        if (isServer) return;
        this.#syncAria();
        if (this.open) this.#position.update();
    }

    override render() {
        return html`<span
                part="trigger"
                class="trigger"
                @pointerdown=${this.#onPointerDown}
                @keydown=${this.#onKeyDown}
                @click=${this.#onTriggerClick}
                ><slot
                    name="trigger"
                    @slotchange=${this.#onTriggerChange}
                ></slot
            ></span>
            <div
                part="base panel"
                class="panel"
                popover="auto"
                @toggle=${this.#onToggle}
            >
                ${renderLiquidFilter()}
                <slot></slot>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-popover': HmiPopover;
    }
}
