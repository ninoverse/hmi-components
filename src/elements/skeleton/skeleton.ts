import { html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './skeleton.styles.js';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

/** A bare number, as an attribute always gives it: `"240"`, `"1.5"`. */
const BARE_NUMBER = /^\s*(\d+(\.\d+)?|\.\d+)\s*$/;

/** Numbers are pixels, a bare number string too; other strings pass through
    as authored. Ported from skeleton.tsx. */
const toCssSize = (value: string | number) =>
    typeof value === 'number' || BARE_NUMBER.test(value)
        ? `${Number(value)}px`
        : value;

/** An empty string counts as no size. */
const given = (value: string | number | undefined) =>
    value === '' ? undefined : value;

/**
 * Animated loading placeholder. `aria-hidden` by default, as v5's was; it has
 * no content to announce either way. Say that the content is loading on the
 * region it stands in for: `aria-busy="true"` on that region while it loads,
 * and a live region or the page's own status text for the announcement.
 *
 * `width`, `height` and `radius` are written to the host's inline style, so
 * they override the variant defaults exactly as they did in React. A number,
 * or a bare number written as an attribute (`width="240"`), is pixels. A
 * circle given only one of `width` and `height` takes it for both. An empty
 * or cleared size the element never wrote leaves the host's own `style` alone.
 *
 * The text variant is 100% wide: inline in a sentence, give it a width, such
 * as `width="6em"`, or it takes a line of its own.
 *
 * Rendered on the server, the shadow root and the variant's size arrive with
 * the page, but `width`, `height` and `radius` apply only once the script
 * upgrades the element, so the placeholder would change size on hydration.
 * On a server-rendered page, size it with the host's `style` instead
 * (`style="width: 80%"`), which the server writes as it is.
 *
 * The highlight sweeps from the inline start to the inline end, moved by
 * `transform`. It stops under `prefers-reduced-motion: reduce`, leaving the
 * still surface, and forced colours draw the surface's edge in `CanvasText`.
 *
 * @tag hmi-skeleton
 * @csspart base - The shimmering surface, filling the host.
 * @cssprop --skeleton-bg - The surface. No default: falls back to `--surface-container-high`. Inside an ink card, `--on-panel-track` comes first.
 * @cssprop --skeleton-highlight - The sweeping highlight. No default: falls back to `--surface-container-highest`. Inside an ink card, the card's track mixed toward its text comes first.
 */
@customElement('hmi-skeleton')
export class HmiSkeleton extends LitElement {
    static override styles = [baseStyles, styles];

    /** Shape preset. @default 'text' */
    @property({ reflect: true }) accessor variant: SkeletonVariant = 'text';

    /** Explicit width; a number, or a bare number string, is px. @default undefined */
    @property() accessor width: string | number | undefined;

    /** Explicit height; a number, or a bare number string, is px. @default undefined */
    @property() accessor height: string | number | undefined;

    /** Corner radius override; a number, or a bare number string, is px. @default undefined */
    @property() accessor radius: string | number | undefined;

    /** The host style properties this element wrote, so clearing a size
        leaves the consumer's own `style` alone. */
    #written = new Set<string>();

    override connectedCallback(): void {
        super.connectedCallback();
        /* Decorative by default, like the React span. A consumer who sets
           aria-hidden on the host wins. */
        if (!this.hasAttribute('aria-hidden')) {
            this.setAttribute('aria-hidden', 'true');
        }
    }

    override updated(changed: PropertyValues<this>): void {
        if (
            changed.has('width') ||
            changed.has('height') ||
            changed.has('variant')
        ) {
            /* A circle given one side takes it for both, so it stays round. */
            const circle = this.variant === 'circle';
            const width = given(this.width);
            const height = given(this.height);
            this.#size('width', width ?? (circle ? height : undefined));
            this.#size('height', height ?? (circle ? width : undefined));
        }
        if (changed.has('radius')) {
            this.#size('border-radius', given(this.radius));
        }
    }

    #size(property: string, value: string | number | undefined): void {
        if (value === undefined) {
            if (this.#written.delete(property)) {
                this.style.removeProperty(property);
            }
            return;
        }
        this.style.setProperty(property, toCssSize(value));
        this.#written.add(property);
    }

    override render() {
        return html`<span part="base" class="base"></span>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-skeleton': HmiSkeleton;
    }
}
