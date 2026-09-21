import { html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './skeleton.styles.js';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

/** Numbers are pixels; strings pass through as authored. Ported from skeleton.tsx. */
const toCssSize = (value: string | number) =>
    typeof value === 'number' ? `${value}px` : value;

/**
 * Animated loading placeholder. `aria-hidden` by default so it isn't announced.
 *
 * `width`, `height` and `radius` are written to the host's inline style, so
 * they override the variant defaults exactly as they did in React.
 *
 * @tag hmi-skeleton
 * @csspart base - The shimmering surface, filling the host.
 */
@customElement('hmi-skeleton')
export class HmiSkeleton extends LitElement {
    static override styles = [baseStyles, styles];

    /** Shape preset. @default 'text' */
    @property({ reflect: true }) accessor variant: SkeletonVariant = 'text';

    /** Explicit width; number = px. */
    @property() accessor width: string | number | undefined;

    /** Explicit height; number = px. */
    @property() accessor height: string | number | undefined;

    /** Corner radius override; number = px. */
    @property() accessor radius: string | number | undefined;

    override connectedCallback(): void {
        super.connectedCallback();
        /* Decorative by default, like the React span. A consumer who sets
           aria-hidden on the host wins. */
        if (!this.hasAttribute('aria-hidden')) {
            this.setAttribute('aria-hidden', 'true');
        }
    }

    override updated(changed: PropertyValues<this>): void {
        if (changed.has('width')) this.#size('width', this.width);
        if (changed.has('height')) this.#size('height', this.height);
        if (changed.has('radius')) this.#size('border-radius', this.radius);
    }

    #size(property: string, value: string | number | undefined): void {
        if (value === undefined || value === '') {
            this.style.removeProperty(property);
            return;
        }
        this.style.setProperty(property, toCssSize(value));
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
