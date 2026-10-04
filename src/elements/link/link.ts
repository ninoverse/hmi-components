import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './link.styles.js';

export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkTone = 'primary' | 'muted';

/**
 * Inline anchor in the primary accent with a thick, offset underline that
 * fades when idle and solidifies on hover. The underline can be always on,
 * hover-only or off, and the muted tone reuses the secondary text role.
 *
 * The anchor is an inner `<a part="base">` and the element mirrors `href`,
 * `target`, `rel` and `download` onto it. With `target="_blank"` and no `rel`,
 * `rel` becomes `noopener noreferrer`. Other anchor attributes are not
 * mirrored, and `aria-*` on the host does not name the inner anchor, so an
 * icon-only link takes its accessible name from `label`. Focus is delegated:
 * `el.focus()` focuses the anchor. A click is native, and `click` is composed,
 * so a plain listener sees it.
 *
 * @tag hmi-link
 * @slot - The link content.
 * @csspart base - The inner `<a>`.
 *
 * @example
 * <hmi-link href="/docs" underline="hover">Read the docs</hmi-link>
 */
@customElement('hmi-link')
export class HmiLink extends LitElement {
    static override styles = [baseStyles, styles];

    static override shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    };

    /** When the underline shows. @default 'always' */
    @property({ reflect: true }) accessor underline: LinkUnderline = 'always';

    /** Colour role. @default 'primary' */
    @property({ reflect: true }) accessor tone: LinkTone = 'primary';

    /** Destination, forwarded to the anchor. Without it the anchor is a placeholder, not a link. */
    @property() accessor href: string | undefined;

    /** Where to open the destination, forwarded to the anchor. */
    @property() accessor target: string | undefined;

    /** Relationship, forwarded to the anchor. Defaults to `noopener noreferrer` when `target` is `_blank`. */
    @property() accessor rel: string | undefined;

    /** Downloads the destination instead of navigating; the value is the file name. */
    @property() accessor download: string | undefined;

    /** Accessible name, forwarded to `aria-label` on the inner anchor. */
    @property() accessor label: string | undefined;

    override render() {
        const rel =
            this.target === '_blank'
                ? (this.rel ?? 'noopener noreferrer')
                : this.rel;
        return html`<a
            part="base"
            class="base"
            href=${ifDefined(this.href)}
            target=${ifDefined(this.target)}
            rel=${ifDefined(rel)}
            download=${ifDefined(this.download)}
            aria-label=${ifDefined(this.label)}
            ><slot></slot
        ></a>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-link': HmiLink;
    }
}
