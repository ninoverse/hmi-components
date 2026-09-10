import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './avatar.styles.js';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

export type AvatarStatus = 'online' | 'away' | 'offline';

/* Six warm/cool background+text pairs picked to harmonize with the theme. Each
   name hashes deterministically to one pair so the same person always gets the
   same colour across reloads — and the same one the React Avatar gave them. */
const PALETTE: ReadonlyArray<readonly [string, string]> = [
    ['#FCD9C8', '#8C3A20'],
    ['#E0EAD8', '#3F5A2E'],
    ['#D8E0F0', '#2E446B'],
    ['#F2DCE9', '#7A2F58'],
    ['#F5E6B8', '#6F4E13'],
    ['#DEEFEC', '#1F5B58'],
];

function colorFor(name: string): readonly [string, string] {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
        h = (h * 31 + name.charCodeAt(i)) >>> 0;
    }
    return PALETTE[h % PALETTE.length] ?? (['#FCD9C8', '#8C3A20'] as const);
}

function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

/**
 * User avatar showing an image, or colour-hashed initials derived from `name`
 * when no `src` is given, with an optional presence dot.
 *
 * The host carries the circle's box — size, radius and position — so that
 * `hmi-avatar-stack` can put a rim on it through `::slotted(hmi-avatar)`.
 *
 * @tag hmi-avatar
 * @csspart base - The circle; paints the image or the hashed tint.
 * @csspart image - The `<img>`, present only when `src` is set.
 * @csspart status - The presence dot, present only when `status` is set.
 *
 * @example
 * <hmi-avatar name="Ada Lovelace" status="online"></hmi-avatar>
 */
@customElement('hmi-avatar')
export class HmiAvatar extends LitElement {
    static override styles = [baseStyles, styles];

    /** Person's name — used for the alt text, initials and deterministic colour. */
    @property() accessor name = '';

    /** Image URL. When omitted, colour-hashed initials are shown instead. */
    @property() accessor src = '';

    /** Diameter preset. @default 'medium' */
    @property({ reflect: true }) accessor size: AvatarSize = 'medium';

    /** Optional presence indicator dot. */
    @property({ reflect: true }) accessor status: AvatarStatus | undefined =
        undefined;

    override render() {
        const [background, color] = colorFor(this.name);
        return html`
            <span
                part="base"
                class="base"
                role=${this.src ? nothing : 'img'}
                aria-label=${this.src ? nothing : this.name}
                style=${styleMap(this.src ? {} : { background, color })}
            >
                ${
                    this.src
                        ? html`<img part="image" src=${this.src} alt=${this.name} />`
                        : initials(this.name)
                }
            </span>
            ${
                this.status
                    ? html`<span part="status" class="status" aria-hidden="true"></span>`
                    : nothing
            }
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-avatar': HmiAvatar;
    }
}
