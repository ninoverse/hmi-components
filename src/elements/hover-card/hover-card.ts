import { html, isServer, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { toCssLength } from '../shared/dom.js';
import {
    HmiHoverPanel,
    type HoverPanelOpenChangeDetail,
} from '../shared/hover-panel.js';
import { hoverPanelStyles } from '../shared/hover-panel.styles.js';
import { renderLiquidFilter } from '../shared/panel.js';
import type { PlacementAlign, PlacementSide } from '../shared/positioning.js';
import { styles } from './hover-card.styles.js';

export type HoverCardSide = PlacementSide;

export type HoverCardAlign = PlacementAlign;

export type HoverCardOpenChangeDetail = HoverPanelOpenChangeDetail;

/**
 * Hover card: a rich card shown when the pointer rests on its trigger or focus
 * reaches it, that stays open while the pointer is over the card or focus is
 * inside it. The card is a `popover="hint"` element in the top layer, so no
 * overflowing ancestor clips it, and it follows the trigger as the page scrolls
 * or resizes. Tab from the trigger moves into the card, so a link inside it can be
 * reached from the keyboard.
 *
 * The trigger is the `trigger` slot. The card opens after `open-delay` ms and
 * closes `close-delay` ms after the pointer or focus leaves, and Escape closes it
 * at once. The element owns `open`: it follows the pointer and focus. Setting
 * `open` yourself shows or hides the card at once and fires nothing.
 *
 * @tag hmi-hover-card
 * @slot - The card's content.
 * @slot trigger - The element that opens the card: the first element slotted is the anchor.
 * @fires {CustomEvent<HoverCardOpenChangeDetail>} hmi-open-change - The card opened or closed because the pointer, focus, Escape or the browser said so. Not cancelable, and not fired when `open` is set from code.
 * @csspart trigger - The wrapper around the trigger slot.
 * @csspart base - The floating card.
 * @csspart panel - The floating card, under its panel-group name.
 *
 * @example
 * <hmi-hover-card side="bottom" align="start">
 *   <a slot="trigger" href="/ada">@ada</a>
 *   Ada Lovelace, mathematician.
 * </hmi-hover-card>
 */
@customElement('hmi-hover-card')
export class HmiHoverCard extends HmiHoverPanel {
    static override styles = [baseStyles, hoverPanelStyles, styles];

    /** The side of the trigger the card sits on. @default 'bottom' */
    @property({ reflect: true }) accessor side: HoverCardSide = 'bottom';

    /** How the card lines up with the trigger along its side. @default 'center' */
    @property({ reflect: true }) accessor align: HoverCardAlign = 'center';

    /** How long the pointer or focus must stay on the trigger before the card opens, in ms. @default 300 */
    @property({ type: Number, attribute: 'open-delay' })
    accessor openDelay = 300;

    /** How long after the pointer or focus leaves before the card closes, in ms. @default 150 */
    @property({ type: Number, attribute: 'close-delay' })
    accessor closeDelay = 150;

    /** The card's width: a number of px, or any CSS length (a plain number in an attribute is px). Defaults to the width of its content. */
    @property() accessor width: string | number | undefined;

    protected override placementSide(): PlacementSide {
        return this.side;
    }

    protected override openDelayMs(): number {
        return this.openDelay;
    }

    protected override closeDelayMs(): number {
        return this.closeDelay;
    }

    protected override alignment(): PlacementAlign {
        return this.align;
    }

    protected override panelPart(): string {
        return 'base panel';
    }

    protected override updated(changed: PropertyValues<this>): void {
        super.updated(changed);
        if (changed.has('width')) this.#applyWidth();
    }

    #applyWidth(): void {
        if (isServer) return;
        if (this.width === undefined || this.width === '') {
            this.panel.style.removeProperty('--_width');
        } else {
            this.panel.style.setProperty('--_width', toCssLength(this.width));
        }
    }

    protected override renderPanelContent() {
        return html`${renderLiquidFilter()}<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-hover-card': HmiHoverCard;
    }
}
