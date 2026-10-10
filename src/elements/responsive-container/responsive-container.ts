import { html, isServer, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './responsive-container.styles.js';

/** Detail of `hmi-resize`. */
export interface ResponsiveContainerResizeDetail {
    /** The measured width, in px. */
    width: number;
    /** The height in px: `height`, or `width / aspect`. */
    height: number;
}

/**
 * A full-width block that measures itself and reports its size, the foundation
 * the charts build on, since SVG coordinates need real numbers, not percentages.
 *
 * It measures its own width with a `ResizeObserver`. Its height is `height`, or
 * `width / aspect` when `aspect` is set. It fires `hmi-resize` with the size on
 * the first measurement and whenever it changes, and exposes the same size as
 * the `--container-width` and `--container-height` custom properties, which
 * inherit into what is slotted. It never touches its children: pass the size to
 * a chart's `width` and `height` yourself, from the event.
 *
 * @tag hmi-responsive-container
 * @slot - The content to size.
 * @cssprop --container-width - Output: the measured width, in px. Set once the width is known.
 * @cssprop --container-height - Output: the resolved height, in px.
 * @csspart base - The block that is measured.
 * @fires hmi-resize - The size was measured or changed. `detail` is `{ width, height }`.
 *
 * @example
 * const box = document.querySelector('hmi-responsive-container');
 * const chart = box.querySelector('hmi-line-chart');
 * box.addEventListener('hmi-resize', (e) => { chart.width = e.detail.width; chart.height = e.detail.height; });
 */
@customElement('hmi-responsive-container')
export class HmiResponsiveContainer extends LitElement {
    static override styles = [baseStyles, styles];

    /** Height in px. Ignored when `aspect` is set. @default 300 */
    @property({ type: Number }) accessor height = 300;

    /** Width / height ratio: the height is derived from the measured width. */
    @property({ type: Number }) accessor aspect: number | undefined;

    @query('.base') private accessor base!: HTMLElement | null;

    /** The measured width in px, 0 until it is known. */
    @state() private accessor width = 0;

    #observer: ResizeObserver | undefined;
    #reported = { width: 0, height: 0 };

    override connectedCallback(): void {
        super.connectedCallback();
        if (isServer) return;
        this.#observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) this.width = entry.contentRect.width;
        });
        if (this.base) this.#observer.observe(this.base);
    }

    override disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = undefined;
        super.disconnectedCallback();
    }

    protected override firstUpdated(): void {
        if (this.base) this.#observer?.observe(this.base);
    }

    protected override updated(): void {
        if (this.width <= 0) return;
        const size = { width: this.width, height: this.#resolvedHeight() };
        if (
            size.width === this.#reported.width &&
            size.height === this.#reported.height
        ) {
            return;
        }
        this.#reported = size;
        emit<ResponsiveContainerResizeDetail>(this, 'hmi-resize', size);
    }

    #resolvedHeight(): number {
        return this.aspect && this.width
            ? this.width / this.aspect
            : this.height;
    }

    override render() {
        const height = this.#resolvedHeight();
        return html`<div
            part="base"
            class="base"
            style=${styleMap({
                height: `${height}px`,
                '--container-height': `${height}px`,
                '--container-width':
                    this.width > 0 ? `${this.width}px` : undefined,
            })}
        >
            <slot></slot>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-responsive-container': HmiResponsiveContainer;
    }
}
