import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { styles } from './card.styles.js';

export type CardVariant = 'default' | 'flat' | 'ink' | 'accent';

/**
 * Elevated surface container for grouping related content.
 *
 * The three slots flow in normal block order inside the card's padding; an
 * unused `header` or `footer` takes up no space and carries no rule or spacing
 * of its own. Each is a box, so `::part(header)` and `::part(footer)` take a
 * margin, a padding or a rule.
 *
 * On the `ink` and `accent` surfaces the card sets `--on-panel`,
 * `--on-panel-variant` and `--on-panel-link`, so `hmi-text`, `hmi-heading` and
 * `hmi-link` inside it take the card's text colours.
 *
 * The `ink` card also sets `--on-panel-track`, `--on-panel-fill`,
 * `--on-panel-success`, `--on-panel-warning` and `--on-panel-error`, so the
 * bars of `hmi-progress`, `hmi-meter` and `hmi-slider` inside it draw an empty
 * track that reads as empty and fills that show on the inverse surface, and
 * `hmi-skeleton` takes its surface from the track. Other cards leave them unset.
 * A panel-like element inside an ink card, such as `hmi-stat`, paints the
 * solid surface under every material, since glass can't lift text off ink.
 *
 * `active` is visual only: the card raises and outlines itself, and takes a
 * ring in forced colours, but tells assistive technology nothing. The control
 * that selects the card says so, with `aria-current` or `aria-selected`.
 *
 * @tag hmi-card
 * @slot - Card body.
 * @slot header - Content pinned above the body.
 * @slot footer - Content pinned below the body.
 * @csspart base - The card surface.
 * @csspart panel - The card surface, under its panel-group name.
 * @csspart header - The header slot.
 * @csspart footer - The footer slot.
 * @cssprop --card-flat-border - A flat card's edge: a mix of `--outline` and `--outline-variant` from the theme constants, the material's stroke under glass and liquid, else `--panel-border`.
 *
 * @example
 * <hmi-card variant="accent">…</hmi-card>
 * @example
 * <hmi-card active>…</hmi-card>
 */
@customElement('hmi-card')
export class HmiCard extends LitElement {
    static override styles = [baseStyles, styles];

    /** Surface treatment of the card. @default 'default' */
    @property({ reflect: true }) accessor variant: CardVariant = 'default';

    /** Lifts and outlines the card to mark it active/selected; visual only. @default false */
    @property({ type: Boolean, reflect: true }) accessor active = false;

    override render() {
        return html`
            <div part="base panel" class="panel">
                ${renderLiquidFilter()}
                <slot name="header" part="header"></slot>
                <slot></slot>
                <slot name="footer" part="footer"></slot>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-card': HmiCard;
    }
}
