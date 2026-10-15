import {
    html,
    isServer,
    LitElement,
    type PropertyValues,
    type TemplateResult,
} from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { supportsPopover } from './dom.js';
import { emit } from './events.js';
import {
    type PlacementAlign,
    type PlacementSide,
    PositionController,
} from './positioning.js';

export interface HoverPanelOpenChangeDetail {
    /** Whether the panel is open now. */
    open: boolean;
}

/**
 * What the hover panels (tooltip, hover-card) share: a floating panel that opens
 * when the pointer enters or focus reaches its trigger, after a delay, and closes
 * when they leave. The panel is a `popover="hint"` element in the top layer, and
 * `PositionController` keeps it against the trigger while it is open. Where the
 * browser has no `hint` the value reads as `manual`, and where it has no Popover
 * API the panel is a fixed-position element the element shows and hides.
 *
 * The element owns `open`. The pointer, focus, Escape and the browser (another
 * hint opening, an outside press) change it and fire `hmi-open-change` with the
 * new state; setting `open` yourself opens or closes it at once and fires nothing.
 *
 * A subclass is the element: it brings its `@customElement` tag, its styles, its
 * own properties, the delays and the placement through the protected methods, and
 * what the panel holds in `renderPanelContent()`.
 */
export class HmiHoverPanel extends LitElement {
    /** Whether the panel is open. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    @query('.panel') protected accessor panel!: HTMLElement;
    @query('slot[name="trigger"]')
    private accessor triggerSlot!: HTMLSlotElement;

    readonly #position = new PositionController(this, {
        anchor: () => this.anchor,
        panel: () => this.panel,
        side: () => this.placementSide(),
        align: () => this.alignment(),
        offset: () => this.gap(),
    });

    // The pending open or close.
    #timer: ReturnType<typeof setTimeout> | undefined;
    // The document listener that closes the panel on Escape, while it is open.
    #escape: AbortController | undefined;

    /** The element the panel is placed against: the first element in the `trigger` slot. */
    protected get anchor(): Element | null {
        return this.triggerSlot?.assignedElements()[0] ?? null;
    }

    /** How long the pointer or focus must stay on the trigger before the panel opens, in ms. */
    protected openDelayMs(): number {
        return 0;
    }

    /** How long after the pointer or focus leaves before the panel closes, in ms. */
    protected closeDelayMs(): number {
        return 0;
    }

    /** The side of the trigger the panel sits on. */
    protected placementSide(): PlacementSide {
        return 'bottom';
    }

    /** How the panel lines up with the trigger along its side. */
    protected alignment(): PlacementAlign {
        return 'center';
    }

    /** The gap between the trigger and the panel, in px. */
    protected gap(): number {
        return 6;
    }

    /** The panel's `part`. */
    protected panelPart(): string {
        return 'base';
    }

    /** The panel's `role`, if it has one. */
    protected panelRole(): string | undefined {
        return undefined;
    }

    /** What the panel holds. */
    protected renderPanelContent(): TemplateResult {
        return html`<slot></slot>`;
    }

    /** Called with the trigger as it is now, when the trigger or the element's properties change. */
    protected syncTrigger(_trigger: Element | null): void {}

    override connectedCallback(): void {
        super.connectedCallback();
        // A panel taken out of the document leaves the top layer: show it again
        // when it comes back still open.
        if (!isServer && this.hasUpdated && this.open) this.#sync();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#cancel();
        this.#escape?.abort();
        this.#escape = undefined;
    }

    protected override updated(changed: PropertyValues<this>): void {
        if (isServer) return;
        this.syncTrigger(this.anchor);
        if (changed.has('open')) this.#sync();
        else if (this.open) this.#position.update();
    }

    // Brings the panel in step with `open`.
    #sync(): void {
        const panel = this.panel;
        if (!panel) return;
        const native = supportsPopover();
        if (this.open) {
            if (native && !panel.matches(':popover-open')) panel.showPopover();
            this.#listenForEscape();
            this.#position.start();
        } else {
            if (native && panel.matches(':popover-open')) panel.hidePopover();
            this.#escape?.abort();
            this.#escape = undefined;
            this.#position.stop();
        }
    }

    #listenForEscape(): void {
        this.#escape?.abort();
        this.#escape = new AbortController();
        document.addEventListener(
            'keydown',
            (event) => {
                if (event.key !== 'Escape') return;
                this.#cancel();
                this.#setOpen(false);
            },
            { signal: this.#escape.signal },
        );
    }

    #cancel(): void {
        if (this.#timer === undefined) return;
        clearTimeout(this.#timer);
        this.#timer = undefined;
    }

    // Opens or closes after the delay, and lets a later enter or leave take the
    // pending one back.
    #schedule(open: boolean): void {
        this.#cancel();
        if (this.open === open) return;
        const delay = open ? this.openDelayMs() : this.closeDelayMs();
        if (delay > 0) {
            this.#timer = setTimeout(() => {
                this.#timer = undefined;
                this.#setOpen(open);
            }, delay);
        } else {
            this.#setOpen(open);
        }
    }

    // A change the pointer, focus, Escape or the browser made: it is told to the
    // consumer. Nothing is told for a change the consumer made through `open`.
    #setOpen(open: boolean): void {
        if (this.open === open) return;
        this.open = open;
        emit<HoverPanelOpenChangeDetail>(this, 'hmi-open-change', { open });
    }

    // The browser closed the panel by itself: Escape, an outside press, or another
    // hint opening. When the element closed it, `open` is already false.
    #onToggle(event: ToggleEvent): void {
        if (event.newState !== 'closed') return;
        this.#cancel();
        this.#setOpen(false);
    }

    #onEnter(): void {
        this.#schedule(true);
    }

    #onLeave(): void {
        this.#schedule(false);
    }

    // Focus moving between the trigger and the panel's content stays inside.
    #onFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget;
        if (
            next instanceof Node &&
            (this.contains(next) || this.shadowRoot?.contains(next))
        ) {
            return;
        }
        this.#schedule(false);
    }

    #onTriggerChange(): void {
        if (isServer) return;
        this.syncTrigger(this.anchor);
        if (this.open) this.#position.update();
    }

    override render() {
        return html`<span
                part="trigger"
                class="trigger"
                @mouseenter=${this.#onEnter}
                @mouseleave=${this.#onLeave}
                @focusin=${this.#onEnter}
                @focusout=${this.#onFocusOut}
                ><slot
                    name="trigger"
                    @slotchange=${this.#onTriggerChange}
                ></slot
            ></span>
            <div
                part=${this.panelPart()}
                class="panel"
                popover="hint"
                role=${ifDefined(this.panelRole())}
                @toggle=${this.#onToggle}
                @mouseenter=${this.#onEnter}
                @mouseleave=${this.#onLeave}
                @focusin=${this.#onEnter}
                @focusout=${this.#onFocusOut}
            >
                ${this.renderPanelContent()}
            </div>`;
    }
}
