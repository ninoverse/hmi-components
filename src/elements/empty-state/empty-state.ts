import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './empty-state.styles.js';

export type EmptyStateLevel = 2 | 3 | 4 | 5 | 6;

/**
 * Placeholder shown when a list, table or search has no content: an optional
 * icon, a title, a description and actions, centred on a soft surface.
 *
 * Every part of the content is a slot. The icon is decorative: the element
 * draws it into a circle and hides it from screen readers, as the title says
 * what it shows. The title sits in a heading, an `<h3>` unless `level` says
 * otherwise, which is left out while the `title` slot is empty. Several
 * actions each take `slot="action"` and sit in a centred row that wraps.
 *
 * Don't set a `title` attribute: it is the native tooltip, so
 * `title="No results"`, or React's `<EmptyState title="No results">` as v5
 * took it, shows a tooltip over the whole box and leaves the heading out. Put
 * the title in the `title` slot.
 *
 * @tag hmi-empty-state
 * @slot icon - Decorative illustration, such as an `svg`, drawn inside a circle and hidden from screen readers.
 * @slot title - Primary heading, inside an `<h2>` to `<h6>` as `level` has it.
 * @slot description - Supporting text under the title.
 * @slot action - Call to action, such as a button. Several sit in one row.
 * @csspart base - The empty-state container.
 * @csspart title - The heading element around the `title` slot.
 * @csspart actions - The row around the `action` slot.
 *
 * @example
 * <hmi-empty-state><span slot="title">No results</span><span slot="description">Try another search.</span><hmi-button slot="action">Reset</hmi-button></hmi-empty-state>
 */
@customElement('hmi-empty-state')
export class HmiEmptyState extends LitElement {
    static override styles = [baseStyles, styles];

    /** The title's heading level, 2 to 6; any other value is 3. @default 3 */
    @property({ type: Number, reflect: true }) accessor level: EmptyStateLevel =
        3;

    /* Until the slots are read, both are shown, so a server render keeps the
       title and the actions it has. */
    @state() private accessor hasTitle = true;
    @state() private accessor hasActions = true;

    override firstUpdated() {
        this.#read();
    }

    #read() {
        const count = (name: string) =>
            this.renderRoot
                .querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
                ?.assignedElements().length ?? 0;
        this.hasTitle = count('title') > 0;
        this.hasActions = count('action') > 0;
    }

    #heading() {
        const level = [2, 3, 4, 5, 6].includes(this.level) ? this.level : 3;
        const slot = html`<slot name="title" @slotchange=${this.#read}></slot>`;
        const hidden = !this.hasTitle;
        switch (level) {
            case 2:
                return html`<h2 part="title" class="title" ?hidden=${hidden}>${slot}</h2>`;
            case 4:
                return html`<h4 part="title" class="title" ?hidden=${hidden}>${slot}</h4>`;
            case 5:
                return html`<h5 part="title" class="title" ?hidden=${hidden}>${slot}</h5>`;
            case 6:
                return html`<h6 part="title" class="title" ?hidden=${hidden}>${slot}</h6>`;
            default:
                return html`<h3 part="title" class="title" ?hidden=${hidden}>${slot}</h3>`;
        }
    }

    override render() {
        return html`
            <div part="base" class="base">
                <span class="icon" aria-hidden="true"><slot name="icon"></slot></span>
                ${this.#heading()}
                <slot name="description"></slot>
                <div part="actions" class="actions" ?hidden=${!this.hasActions}>
                    <slot name="action" @slotchange=${this.#read}></slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-empty-state': HmiEmptyState;
    }
}
