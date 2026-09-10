import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../avatar/avatar.js';
import type { AvatarSize } from '../avatar/avatar.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './avatar-stack.styles.js';

/**
 * Overlapping row of avatars, collapsing any beyond `max` into a trailing
 * `+N` chip.
 *
 * The avatars are `<hmi-avatar>` elements rendered into this element's own
 * shadow root, not slotted children: `size` has to reach every one of them and
 * `max` has to hide the rest, and neither is possible on consumer-owned nodes
 * without mutating light DOM.
 *
 * @tag hmi-avatar-stack
 * @csspart base - The row.
 * @csspart avatar - Each rendered `<hmi-avatar>`.
 * @csspart overflow - The `+N` chip, present only when `names` exceeds `max`.
 *
 * @example
 * const stack = document.querySelector('hmi-avatar-stack');
 * stack.names = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper'];
 */
@customElement('hmi-avatar-stack')
export class HmiAvatarStack extends LitElement {
    static override styles = [baseStyles, styles];

    /** Names to render as overlapping avatars, in display order. */
    @property({ type: Array, attribute: false })
    accessor names: readonly string[] = [];

    /** Maximum avatars shown before collapsing the rest into a `+N` chip. @default 4 */
    @property({ type: Number }) accessor max = 4;

    /** Diameter preset applied to every avatar. @default 'medium' */
    @property({ reflect: true }) accessor size: AvatarSize = 'medium';

    override render() {
        const shown = this.names.slice(0, this.max);
        const extra = this.names.length - shown.length;
        return html`
            <span part="base" class="base">
                ${shown.map(
                    (name) =>
                        html`<hmi-avatar
                            part="avatar"
                            name=${name}
                            size=${this.size}
                        ></hmi-avatar>`,
                )}
                ${
                    extra > 0
                        ? html`<span
                              part="overflow"
                              class="overflow"
                              role="img"
                              aria-label=${`${extra} more`}
                              >+${extra}</span
                          >`
                        : nothing
                }
            </span>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-avatar-stack': HmiAvatarStack;
    }
}
