import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    HmiHoverPanel,
    type HoverPanelOpenChangeDetail,
} from '../shared/hover-panel.js';
import { hoverPanelStyles } from '../shared/hover-panel.styles.js';
import type { PlacementSide } from '../shared/positioning.js';
import { styles } from './tooltip.styles.js';

export type TooltipSide = PlacementSide;

export type TooltipOpenChangeDetail = HoverPanelOpenChangeDetail;

/**
 * Tooltip: a small bubble that names or describes its trigger, shown when the
 * pointer rests on the trigger or focus reaches it, and hidden when they leave
 * or on Escape. The bubble is a `popover="hint"` element in the top layer, so no
 * overflowing ancestor clips it, and it follows the trigger as the page scrolls
 * or resizes. It does not take the pointer, so the pointer cannot move onto it.
 *
 * The trigger is the `trigger` slot, and the text is `label`, or the `label` slot
 * for rich content. A trigger cannot point at a bubble inside a shadow root, so
 * when `label` is set the element gives the trigger an `aria-description` with
 * the same text, unless it has its own; the bubble is `role="tooltip"`. A `label`
 * slot gets no description of its own: point the trigger's `aria-describedby` at
 * your slotted node.
 *
 * The element owns `open`: it follows the pointer and focus. Setting `open`
 * yourself shows or hides the bubble at once and fires nothing.
 *
 * @tag hmi-tooltip
 * @slot trigger - The element the tooltip describes: the first element slotted is the anchor.
 * @slot label - The bubble's content. Defaults to `label`.
 * @fires {CustomEvent<TooltipOpenChangeDetail>} hmi-open-change - The bubble opened or closed because the pointer, focus, Escape or the browser said so. Not cancelable, and not fired when `open` is set from code.
 * @csspart trigger - The wrapper around the trigger slot.
 * @csspart base - The bubble.
 *
 * @example
 * <hmi-tooltip label="Copy">
 *   <hmi-button slot="trigger" variant="secondary">Copy</hmi-button>
 * </hmi-tooltip>
 */
@customElement('hmi-tooltip')
export class HmiTooltip extends HmiHoverPanel {
    static override styles = [baseStyles, hoverPanelStyles, styles];

    /** The side of the trigger the bubble sits on. @default 'top' */
    @property({ reflect: true }) accessor side: TooltipSide = 'top';

    /** The bubble's text: the default of the `label` slot, and the trigger's `aria-description`. */
    @property() accessor label = '';

    /** How long the pointer or focus must stay on the trigger before the bubble shows, in ms. @default 200 */
    @property({ type: Number }) accessor delay = 200;

    // The description this element put on a trigger, so that it is only ever
    // removed or changed there, and a trigger's own is left alone.
    #described: { trigger: Element; text: string } | undefined;

    protected override placementSide(): PlacementSide {
        return this.side;
    }

    protected override openDelayMs(): number {
        return this.delay;
    }

    protected override gap(): number {
        return 8;
    }

    protected override panelRole(): string {
        return 'tooltip';
    }

    protected override syncTrigger(trigger: Element | null): void {
        const own = this.#described;
        if (own && (own.trigger !== trigger || !this.label)) {
            if (own.trigger.getAttribute('aria-description') === own.text) {
                own.trigger.removeAttribute('aria-description');
            }
            this.#described = undefined;
        }
        if (!trigger || !this.label) return;
        if (this.#described) {
            trigger.setAttribute('aria-description', this.label);
            this.#described.text = this.label;
        } else if (!trigger.hasAttribute('aria-description')) {
            trigger.setAttribute('aria-description', this.label);
            this.#described = { trigger, text: this.label };
        }
    }

    protected override renderPanelContent() {
        return html`<slot name="label">${this.label}</slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-tooltip': HmiTooltip;
    }
}
