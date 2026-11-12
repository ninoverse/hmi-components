import { html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../avatar/avatar.js';
import type { AvatarSize, AvatarStatus } from '../avatar/avatar.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './avatar-stack.styles.js';

/** One person in the stack: a name, or a name with an image and a presence. */
export type AvatarStackEntry =
    | string
    | {
          readonly name: string;
          readonly src?: string;
          readonly status?: AvatarStatus;
      };

const DEFAULT_MAX = 4;

const nameOf = (entry: AvatarStackEntry) =>
    typeof entry === 'string' ? entry : entry.name;

/** `{count}` in a label, replaced by the number it counts. */
const fill = (template: string, count: number) =>
    template.replaceAll('{count}', String(count));

/**
 * Overlapping row of avatars, collapsing any beyond `max` into a trailing
 * `+N` chip.
 *
 * The avatars are `<hmi-avatar>` elements rendered into this element's own
 * shadow root, not slotted children: `size` has to reach every one of them and
 * `max` has to hide the rest, and neither is possible on consumer-owned nodes
 * without mutating light DOM.
 *
 * The row is a group named after its head count, as in "5 people", and the
 * chip is named after the people it hides, as in "2 more: Linus Torvalds,
 * Barbara Liskov", which it also shows on hover.
 *
 * @tag hmi-avatar-stack
 * @csspart base - The row.
 * @csspart avatar - Each rendered `<hmi-avatar>`.
 * @csspart overflow - The `+N` chip, present only when `names` exceeds `max`.
 *   Round for one digit, a pill for more.
 * @cssprop --avatar-stack-rim - The ring that separates each avatar from the
 *   one behind it. Set it to the colour of what the stack sits on. Defaults to
 *   `--surface`.
 *
 * @example
 * const stack = document.querySelector('hmi-avatar-stack');
 * stack.names = ['Ada Lovelace', { name: 'Alan Turing', status: 'online' }];
 */
@customElement('hmi-avatar-stack')
export class HmiAvatarStack extends LitElement {
    static override styles = [baseStyles, styles];

    /** People to render as overlapping avatars, in display order: each a name, or `{ name, src, status }`. @default [] */
    @property({ type: Array, attribute: false })
    accessor names: readonly AvatarStackEntry[] = [];

    /** Maximum avatars shown before collapsing the rest into a `+N` chip: a whole number, 0 or more. @default 4 */
    @property({ type: Number }) accessor max = DEFAULT_MAX;

    /** Diameter preset applied to every avatar. @default 'medium' */
    @property({ reflect: true }) accessor size: AvatarSize = 'medium';

    /** The group's name, with `{count}` for the number of people. @default '{count} people' */
    @property() accessor label = '{count} people';

    /** The chip's name, with `{count}` for the number hidden; the hidden names follow it. @default '{count} more' */
    @property({ attribute: 'overflow-label' }) accessor overflowLabel =
        '{count} more';

    /* A `max` that isn't a whole number of 0 or more is read as the nearest
       one that is, or as the default when it isn't a number, with a warning
       saying what was given. */
    #shown = DEFAULT_MAX;

    protected override willUpdate(changed: PropertyValues<this>) {
        if (!changed.has('max')) return;
        const max = this.max;
        this.#shown = Number.isFinite(max)
            ? Math.max(0, Math.floor(max))
            : DEFAULT_MAX;
        if (this.#shown !== max) {
            console.warn(
                `hmi-avatar-stack: max must be a whole number of 0 or more; ${String(max)} is read as ${this.#shown}.`,
            );
        }
    }

    override render() {
        const shown = this.names.slice(0, this.#shown);
        const hidden = this.names.slice(shown.length);
        const more = hidden.length
            ? `${fill(this.overflowLabel, hidden.length)}: ${hidden.map(nameOf).join(', ')}`
            : '';
        return html`
            <span
                part="base"
                class="base"
                role=${this.names.length ? 'group' : nothing}
                aria-label=${
                    this.names.length
                        ? fill(this.label, this.names.length)
                        : nothing
                }
            >
                ${shown.map((entry) => {
                    const person =
                        typeof entry === 'string' ? { name: entry } : entry;
                    return html`<hmi-avatar
                        part="avatar"
                        name=${person.name}
                        src=${person.src ?? nothing}
                        status=${person.status ?? nothing}
                        size=${this.size}
                    ></hmi-avatar>`;
                })}
                ${
                    hidden.length
                        ? html`<span
                              part="overflow"
                              class="overflow"
                              role="img"
                              aria-label=${more}
                              title=${more}
                              "><span class="count">+${hidden.length}</span></span
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
