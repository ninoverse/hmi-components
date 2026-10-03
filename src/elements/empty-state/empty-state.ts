import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './empty-state.styles.js';

/**
 * Placeholder shown when a list, table or search has no content: an optional
 * icon, a title, a description and an action, centred on a soft surface.
 *
 * Every part of the content is a slot. The icon is drawn into a circle by the
 * element, so it is purely decorative: give the slotted icon `aria-hidden="true"`.
 * The title sits in an `<h3>`. Wrap several actions in one element, since the
 * `action` slot lays out a single child.
 *
 * @tag hmi-empty-state
 * @slot icon - Decorative illustration, such as an `svg`, drawn inside a circle.
 * @slot title - Primary heading, inside an `<h3>`.
 * @slot description - Supporting text under the title.
 * @slot action - Call to action, such as a button.
 * @csspart base - The empty-state container.
 * @csspart title - The heading element around the `title` slot.
 *
 * @example
 * <hmi-empty-state><span slot="title">No results</span><span slot="description">Try another search.</span><hmi-button slot="action">Reset</hmi-button></hmi-empty-state>
 */
@customElement('hmi-empty-state')
export class HmiEmptyState extends LitElement {
    static override styles = [baseStyles, styles];

    override render() {
        return html`
            <div part="base" class="base">
                <slot name="icon"></slot>
                <h3 part="title" class="title"><slot name="title"></slot></h3>
                <slot name="description"></slot>
                <slot name="action"></slot>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-empty-state': HmiEmptyState;
    }
}
