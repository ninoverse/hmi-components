import { html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './image.styles.js';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ImageRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

/** Detail of `hmi-load`: the source of the image that loaded. */
export interface ImageLoadDetail {
    src: string;
}

/** Detail of `hmi-error`: the source of the image that failed. */
export interface ImageErrorDetail {
    src: string;
}

/** A length: a number, or a bare numeric string, is pixels; anything else is a CSS length. */
const toLength = (value: number | string | undefined): string | undefined => {
    if (value === undefined || value === '') return undefined;
    return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)
        ? `${value}px`
        : value;
};

/**
 * Image with loading and error states, aspect-ratio reservation, `object-fit`
 * and `object-position`, radius presets, a placeholder while it loads, and a
 * fallback when the source fails. It lazy-loads by default.
 *
 * `hmi-load` and `hmi-error` fire with `{ src }` when the image loads or fails.
 * A new `src` starts loading again.
 *
 * To render the image yourself, for example with an image-optimization library,
 * put your own `<img>`, `<picture>` or similar in the default slot. The shell
 * still reserves the space, rounds the corners and shows the placeholder, and it
 * hears the element's `load` and `error` events to clear the placeholder or show
 * the fallback. `fit` and `position` reach a slotted `<img>` as defaults: its own
 * inline styles win. With Next.js, slot `<NextImage fill … />`, or pass the
 * props of `getImageProps()` (`src`, `srcset`, `sizes`) to this element.
 *
 * @tag hmi-image
 * @slot - Your own image element, instead of the built-in `<img>`.
 * @slot fallback - Content shown if the image fails to load; a broken-image icon by default.
 * @fires {CustomEvent<ImageLoadDetail>} hmi-load - The image loaded.
 * @fires {CustomEvent<ImageErrorDetail>} hmi-error - The image failed to load.
 * @csspart base - The shell: the sized, rounded box.
 * @csspart media - The image area.
 * @csspart loader - The shimmer shown while loading.
 * @csspart fallback - The fallback shown on error.
 *
 * @example
 * <hmi-image src="/cover.jpg" alt="Cover" ratio="1.78" radius="large"></hmi-image>
 */
@customElement('hmi-image')
export class HmiImage extends LitElement {
    static override styles = [baseStyles, styles];

    /** Image source URL. */
    @property() accessor src = '';

    /** Alternative text, required for accessibility. */
    @property() accessor alt = '';

    /** Aspect ratio to reserve while loading, such as `1.78` (16 / 9). */
    @property({ type: Number }) accessor ratio: number | undefined;

    /** How the image fills its box: the `object-fit` of the built-in `<img>`. @default 'cover' */
    @property() accessor fit: ImageFit = 'cover';

    /** The `object-position` of the image, such as `top`. */
    @property() accessor position: string | undefined;

    /** Corner radius preset. @default 'medium' */
    @property({ reflect: true }) accessor radius: ImageRadius = 'medium';

    /**
     * What shows behind the image while it loads: `'shimmer'` animates, `'none'`
     * shows nothing, and any other value is the shell's CSS `background`, such
     * as a colour or a `url(...)`. @default 'shimmer'
     */
    @property() accessor placeholder = 'shimmer';

    /** Width: a number or numeric string is pixels; any CSS length is accepted. */
    @property() accessor width: number | string | undefined;

    /** Height: a number or numeric string is pixels; any CSS length is accepted. */
    @property() accessor height: number | string | undefined;

    /** Native loading hint of the built-in `<img>`. @default 'lazy' */
    @property() accessor loading: 'lazy' | 'eager' = 'lazy';

    /** `srcset` of the built-in `<img>`. */
    @property() accessor srcset: string | undefined;

    /** `sizes` of the built-in `<img>`. */
    @property() accessor sizes: string | undefined;

    /** `crossorigin` of the built-in `<img>`. */
    @property() accessor crossorigin:
        | 'anonymous'
        | 'use-credentials'
        | undefined;

    /** `referrerpolicy` of the built-in `<img>`. */
    @property() accessor referrerpolicy: string | undefined;

    @state() private accessor status: 'loading' | 'loaded' | 'error' =
        'loading';

    @query('.media') private accessor media!: HTMLElement | null;

    override willUpdate(changed: PropertyValues<this>): void {
        // A new source starts over: a failed or loaded image says nothing of it.
        if (this.hasUpdated && (changed.has('src') || changed.has('srcset'))) {
            this.status = 'loading';
        }
        super.willUpdate(changed);
    }

    #hasSlotted(): boolean {
        const slot = this.media?.querySelector('slot');
        // Without `flatten`, so that the built-in image is not counted as assigned.
        return (slot?.assignedElements().length ?? 0) > 0;
    }

    /** The image element in the media area: the built-in one, or the slotted one. */
    #image(): HTMLImageElement | null {
        const slot = this.media?.querySelector('slot');
        const assigned = slot?.assignedElements({ flatten: true }) ?? [];
        for (const element of assigned) {
            const img =
                element instanceof HTMLImageElement
                    ? element
                    : element.querySelector('img');
            if (img) return img;
        }
        return this.media?.querySelector('img') ?? null;
    }

    /* An image that finished before this element was ready (a cache hit, server
       markup loaded before hydration) fires no event we can hear. */
    #resolve(): void {
        if (this.status !== 'loading') return;
        const img = this.#image();
        if (!img?.complete || !(img.currentSrc || img.getAttribute('src'))) {
            return;
        }
        this.#settle(img.naturalWidth > 0 ? 'loaded' : 'error', img);
    }

    #settle(status: 'loaded' | 'error', img: HTMLImageElement | null): void {
        // The completed-image check and the image's own event can both report.
        if (this.status === status) return;
        this.status = status;
        const detail = { src: img?.currentSrc || this.src };
        if (status === 'loaded')
            emit<ImageLoadDetail>(this, 'hmi-load', detail);
        else emit<ImageErrorDetail>(this, 'hmi-error', detail);
    }

    /* `load` and `error` do not bubble: a capture listener on the media area hears
       them from the built-in image and from a slotted one alike. */
    #onMedia = {
        capture: true,
        handleEvent: (event: Event) => {
            if (!(event.target instanceof HTMLImageElement)) return;
            // The built-in image stays in the tree, unrendered, behind a slotted one.
            if (
                this.#hasSlotted() &&
                event.target.parentElement instanceof HTMLSlotElement
            ) {
                return;
            }
            this.#settle(
                event.type === 'load' ? 'loaded' : 'error',
                event.target,
            );
        },
    };

    protected override updated(): void {
        this.#resolve();
    }

    override render() {
        const custom =
            this.placeholder !== 'shimmer' && this.placeholder !== 'none';
        const style = {
            width: toLength(this.width),
            height: toLength(this.height),
            'aspect-ratio': this.ratio ? String(this.ratio) : undefined,
            background: custom ? this.placeholder : undefined,
            '--_fit': this.fit,
            '--_position': this.position,
        };
        return html`<div
            part="base"
            class=${`base radius-${this.radius}`}
            data-status=${this.status}
            style=${styleMap(style)}
        >
            ${
                this.status === 'loading' && this.placeholder === 'shimmer'
                    ? html`<span part="loader" class="loader" aria-hidden="true"></span>`
                    : nothing
            }
            <div
                part="media"
                class="media"
                ?hidden=${this.status === 'error'}
                @load=${this.#onMedia}
                @error=${this.#onMedia}
            >
                <slot @slotchange=${() => this.#resolve()}>
                    <img
                        class="img"
                        src=${ifDefined(this.src || undefined)}
                        alt=${this.alt}
                        srcset=${ifDefined(this.srcset)}
                        sizes=${ifDefined(this.sizes)}
                        crossorigin=${ifDefined(this.crossorigin)}
                        referrerpolicy=${ifDefined(this.referrerpolicy)}
                        loading=${this.loading}
                        decoding="async"
                    />
                </slot>
            </div>
            ${
                this.status === 'error'
                    ? html`<span part="fallback" class="fallback"
                          ><slot name="fallback"
                              ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                  <path d="M3 5h18v14H3z" />
                                  <path d="M3 15l5-5 4 4 3-3 6 6" />
                                  <circle cx="8.5" cy="9" r="1.5" />
                              </svg></slot
                          ></span
                      >`
                    : nothing
            }
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-image': HmiImage;
    }
}
