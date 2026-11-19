import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './chip.styles.js';

/** Detail of `hmi-select`: the state the chip has taken. */
export interface ChipSelectDetail {
    selected: boolean;
}

/** Detail of `hmi-dismiss`: empty, the event carries no data. */
export type ChipDismissDetail = Record<string, never>;

/**
 * Compact pill for a tag or filter. It is static by default. `selectable`
 * turns the label into a toggle button, and `closable` adds a trailing remove
 * button, so the two controls are never nested. A selected chip shows a check
 * mark, in place of its icon, so the state never rests on colour alone.
 * `selected` without `selectable` is only that look: screen readers get no
 * state, so a chip the user toggles is `selectable`.
 *
 * Both actions are cancelable events. A click on the toggle flips `selected`,
 * then fires `hmi-select` with the new state; a listener that calls
 * `preventDefault()` puts the old one back, unless it set `selected` itself.
 * A click on the remove button fires `hmi-dismiss`, as banner's and toast's do,, and unless it is cancelled
 * the chip sets `hidden` on itself; remove the attribute to show it again.
 * Focus was on the remove button, so it falls back to the page: a listener
 * should move it on, such as to the next chip.
 *
 * The remove button is named `close-label` followed by the chip's label, such
 * as "Remove Beta".
 *
 * @tag hmi-chip
 * @slot - The label.
 * @slot icon - Optional leading icon, such as an `svg`.
 * @fires {CustomEvent<ChipSelectDetail>} hmi-select - The toggle was clicked, and `selected` flipped. Cancelable: `preventDefault()` puts it back.
 * @fires {CustomEvent<ChipDismissDetail>} hmi-dismiss - The remove button was clicked. Cancelable: without `preventDefault()` the chip hides itself.
 * @csspart base - The pill.
 * @csspart control - The toggle surface: a button when `selectable`, a span otherwise.
 * @csspart icon - The icon slot.
 * @csspart check - The check mark a selected chip shows in place of its icon.
 * @csspart label - The label wrapper.
 * @csspart close - The remove button.
 *
 * @example
 * <hmi-chip selectable closable selected>Filter</hmi-chip>
 */
@customElement('hmi-chip')
export class HmiChip extends LitElement {
    static override styles = [baseStyles, styles];

    /** Selected (pressed) state. @default false */
    @property({ type: Boolean, reflect: true }) accessor selected = false;

    /** Makes the label a toggle button that fires `hmi-select`. @default false */
    @property({ type: Boolean, reflect: true }) accessor selectable = false;

    /** Adds a trailing remove button that fires `hmi-dismiss`. @default false */
    @property({ type: Boolean, reflect: true }) accessor closable = false;

    /** The remove button's name, read before the chip's label: "Remove Beta". @default 'Remove' */
    @property({ attribute: 'close-label' }) accessor closeLabel = 'Remove';

    #select(): void {
        const previous = this.selected;
        const selected = !previous;
        this.selected = selected;
        const proceed = emit<ChipSelectDetail>(
            this,
            'hmi-select',
            { selected },
            { cancelable: true },
        );
        if (!proceed && this.selected === selected) this.selected = previous;
    }

    #dismiss(): void {
        if (
            emit<ChipDismissDetail>(
                this,
                'hmi-dismiss',
                {},
                { cancelable: true },
            )
        ) {
            this.hidden = true;
        }
    }

    override render() {
        const content = html`
            ${
                this.selected
                    ? html`<svg
                          part="check"
                          class="check"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                      >
                          <path d="M3 8.5l3.5 3.5L13 4.5" />
                      </svg>`
                    : nothing
            }
            <slot name="icon" part="icon"></slot>
            <span part="label" class="label" id="label"><slot></slot></span>
        `;
        return html`
            <div part="base" class="base">
                ${
                    this.selectable
                        ? html`<button
                              part="control"
                              class="control"
                              type="button"
                              aria-pressed=${this.selected ? 'true' : 'false'}
                              @click=${this.#select}
                          >
                              ${content}
                          </button>`
                        : html`<span part="control" class="control"
                              >${content}</span
                          >`
                }
                ${
                    this.closable
                        ? html`<button
                              part="close"
                              class="close"
                              type="button"
                              aria-labelledby="close-label label"
                              @click=${this.#dismiss}
                          >
                              <span id="close-label" hidden
                                  >${this.closeLabel}</span
                              >
                              <svg
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  aria-hidden="true"
                              >
                                  <path d="M4 4l8 8M12 4l-8 8" />
                              </svg>
                          </button>`
                        : nothing
                }
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-chip': HmiChip;
    }
}
