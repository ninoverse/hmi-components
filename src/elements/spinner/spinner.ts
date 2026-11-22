import { html, isServer, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './spinner.styles.js';

export type SpinnerSize = 'small' | 'medium' | 'large';

/**
 * Indeterminate loading spinner: a ring with one solid arc, in a
 * `role="status"` live region.
 *
 * `label` is announced, never drawn. It is text inside the status, hidden from
 * view, and joins it one frame after the spinner connects: a live region
 * announces a change to its text, so the empty region exists first and then
 * gains its label, and a later change to `label` is announced too. Name the
 * spinner with `label`: an `aria-label` on the host does nothing, and
 * `aria-hidden="true"` on the host hides it.
 *
 * `label=""` makes the spinner decorative: no status, and hidden from
 * assistive technology. Use it where something else says what is busy, such
 * as a button whose own text reads "Saving", or a region with `aria-busy`.
 *
 * The arc is drawn in `currentColor` and the track in `currentColor` at 18%.
 * The arc is what shows the spin, so a colour set around the spinner needs
 * 3:1 against what it sits on: on the default light page `--primary` is
 * 2.65:1, `--secondary` 4.55:1.
 *
 * The ring is exactly the host's box, and sits on the text's baseline in a
 * line. `size` picks 14, 20 or 32px at the default `--hmi-base`; another size
 * sets `width`, `height` and `border-width` on `::part(base)`.
 *
 * Under `prefers-reduced-motion: reduce` the spin slows from 0.8s to 2.4s a
 * turn rather than stopping, since a still ring reads as a frozen page. In
 * forced colours the arc is drawn in `CanvasText` and the track drops out. It
 * turns clockwise in right-to-left text too, as a clock does.
 *
 * @tag hmi-spinner
 * @csspart base - The ring; carries `role="status"` and the label.
 */
@customElement('hmi-spinner')
export class HmiSpinner extends LitElement {
    static override styles = [baseStyles, styles];

    /** Diameter preset. @default 'medium' */
    @property({ reflect: true }) accessor size: SpinnerSize = 'medium';

    /** Announced status text; empty makes the spinner decorative. @default 'Loading' */
    @property() accessor label = 'Loading';

    /* The label joins the live region a frame after it connects. */
    @state() private accessor announced = false;

    #frame = 0;

    override connectedCallback() {
        super.connectedCallback();
        if (isServer) return;
        this.#frame = requestAnimationFrame(() => {
            this.announced = true;
        });
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        cancelAnimationFrame(this.#frame);
        this.announced = false;
    }

    override render() {
        if (!this.label) {
            return html`<span
                part="base"
                class="base"
                aria-hidden="true"
            ></span>`;
        }
        return html`<span part="base" class="base" role="status"
            ><span class="label">${this.announced ? this.label : ''}</span></span
        >`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-spinner': HmiSpinner;
    }
}
