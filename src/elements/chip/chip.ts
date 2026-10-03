import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './chip.styles.js';

/** Detail of `hmi-select`: the state the chip is about to take. */
export interface ChipSelectDetail {
    selected: boolean;
}

/** Detail of `hmi-close`: empty, the event carries no data. */
export type ChipCloseDetail = Record<string, never>;

/**
 * Compact pill for a tag or filter. It is static by default. `selectable`
 * turns the label into a toggle button, and `closable` adds a trailing remove
 * button, so the two controls are never nested.
 *
 * Both actions are cancelable events. A click on the toggle fires
 * `hmi-select` with the state the chip would take, and unless a listener calls
 * `preventDefault()` the chip then sets `selected` itself. A click on the
 * remove button fires `hmi-close`, and unless it is cancelled the chip sets
 * `hidden` on itself; remove the attribute to show it again.
 *
 * @tag hmi-chip
 * @slot - The label.
 * @slot icon - Optional leading icon, such as an `svg`.
 * @fires {CustomEvent<ChipSelectDetail>} hmi-select - The toggle was clicked. Cancelable: without `preventDefault()` the chip flips `selected`.
 * @fires {CustomEvent<ChipCloseDetail>} hmi-close - The remove button was clicked. Cancelable: without `preventDefault()` the chip hides itself.
 * @csspart base - The pill.
 * @csspart control - The toggle surface: a button when `selectable`, a span otherwise.
 * @csspart icon - The icon slot.
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

    /** Adds a trailing remove button that fires `hmi-close`. @default false */
    @property({ type: Boolean, reflect: true }) accessor closable = false;

    /** Accessible label of the remove button. @default 'Remove' */
    @property({ attribute: 'close-label' }) accessor closeLabel = 'Remove';

    #select(): void {
        const selected = !this.selected;
        if (
            emit<ChipSelectDetail>(
                this,
                'hmi-select',
                { selected },
                { cancelable: true },
            )
        ) {
            this.selected = selected;
        }
    }

    #close(): void {
        if (
            emit<ChipCloseDetail>(this, 'hmi-close', {}, { cancelable: true })
        ) {
            this.hidden = true;
        }
    }

    override render() {
        const content = html`
            <slot name="icon" part="icon"></slot>
            <span part="label" class="label"><slot></slot></span>
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
                              aria-label=${this.closeLabel}
                              @click=${this.#close}
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
