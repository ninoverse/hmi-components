import { html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { applyTemplate } from '../shared/format.js';
import { styles } from './carousel.styles.js';

/** Detail of `hmi-index-change`: the index of the slide now shown. */
export interface CarouselIndexChangeDetail {
    index: number;
}

/* An empty or non-numeric attribute is unset, not 0 as Lit's own Number
   converter would make it. */
const optionalNumber = {
    fromAttribute: (raw: string | null) => {
        if (raw === null || raw.trim() === '') return undefined;
        const n = Number(raw);
        return Number.isNaN(n) ? undefined : n;
    },
};

const isEditable = (target: EventTarget | undefined): boolean =>
    target instanceof HTMLElement &&
    (target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/**
 * Sliding content carousel with arrows, dot pagination, looping, autoplay and
 * keyboard (left and right arrow) support. Every element child is a slide.
 *
 * `hmi-index-change` fires with `{ index }` whenever the shown slide changes
 * through the arrows, the dots, the keyboard or autoplay. The element owns
 * `index`: to veto a change, set `index` back from a listener. Autoplay pauses
 * while the pointer is over the carousel or focus is inside it.
 *
 * It gives each slide `role="group"`, `aria-roledescription="slide"` and a
 * position label, and makes the slides that are not shown `inert`, so their
 * content cannot take focus. The carousel is named by `label`.
 *
 * @tag hmi-carousel
 * @slot - The slides: each element child is one.
 * @fires {CustomEvent<CarouselIndexChangeDetail>} hmi-index-change - The shown slide changed.
 * @csspart base - The carousel region.
 * @csspart viewport - The clipped window onto the slides.
 * @csspart track - The row of slides that slides sideways.
 * @csspart arrow - A previous or next button.
 * @csspart prev - The previous button.
 * @csspart next - The next button.
 * @csspart dots - The row of dots.
 * @csspart dot - One dot.
 *
 * @example
 * <hmi-carousel label="Highlights" auto-play="4000"><img src="a.jpg" alt=""><img src="b.jpg" alt=""></hmi-carousel>
 */
@customElement('hmi-carousel')
export class HmiCarousel extends LitElement {
    static override styles = [baseStyles, styles];

    /** Index of the shown slide. @default 0 */
    @property({ type: Number }) accessor index = 0;

    /** Index shown at first render, when `index` is not set. */
    @property({ attribute: 'default-index', converter: optionalNumber })
    accessor defaultIndex: number | undefined;

    /** Stop at the first and last slide instead of wrapping around. @default false */
    @property({ type: Boolean, attribute: 'no-loop' }) accessor noLoop = false;

    /** Auto-advance interval in milliseconds; off when unset. */
    @property({ attribute: 'auto-play', converter: optionalNumber })
    accessor autoPlay: number | undefined;

    /** Hide the previous and next arrows. @default false */
    @property({ type: Boolean, attribute: 'hide-arrows' }) accessor hideArrows =
        false;

    /** Hide the dot pagination. @default false */
    @property({ type: Boolean, attribute: 'hide-dots' }) accessor hideDots =
        false;

    /** Accessible name of the carousel region. @default 'Carousel' */
    @property() accessor label = 'Carousel';

    /** Accessible name of the previous button. @default 'Previous slide' */
    @property({ attribute: 'prev-label' }) accessor prevLabel =
        'Previous slide';

    /** Accessible name of the next button. @default 'Next slide' */
    @property({ attribute: 'next-label' }) accessor nextLabel = 'Next slide';

    /** Accessible name of each dot; `{n}` is the slide number. @default 'Go to slide {n}' */
    @property({ attribute: 'dot-label' }) accessor dotLabel = 'Go to slide {n}';

    @state() private accessor slides: Element[] = [];
    @query('slot') private accessor slot_!: HTMLSlotElement | null;

    #paused = false;
    #timer: number | undefined;

    get #count(): number {
        return this.slides.length;
    }

    get #current(): number {
        return Math.max(0, Math.min(this.index, this.#count - 1));
    }

    override willUpdate(changed: PropertyValues<this>): void {
        if (
            !this.hasUpdated &&
            this.index === 0 &&
            this.defaultIndex !== undefined
        ) {
            this.index = this.defaultIndex;
        }
        super.willUpdate(changed);
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.#syncTimer();
    }

    override disconnectedCallback(): void {
        window.clearInterval(this.#timer);
        this.#timer = undefined;
        super.disconnectedCallback();
    }

    #goTo(next: number): void {
        const count = this.#count;
        if (count === 0) return;
        const target = this.noLoop
            ? Math.max(0, Math.min(next, count - 1))
            : (next + count) % count;
        if (target === this.#current) return;
        this.index = target;
        emit<CarouselIndexChangeDetail>(this, 'hmi-index-change', {
            index: target,
        });
    }

    #syncTimer(): void {
        window.clearInterval(this.#timer);
        this.#timer = undefined;
        if (
            !this.autoPlay ||
            this.#paused ||
            this.#count <= 1 ||
            !this.isConnected
        ) {
            return;
        }
        this.#timer = window.setInterval(
            () => this.#goTo(this.#current + 1),
            this.autoPlay,
        );
    }

    #pause(paused: boolean): void {
        this.#paused = paused;
        this.#syncTimer();
    }

    #onSlot(): void {
        this.slides = this.slot_?.assignedElements({ flatten: true }) ?? [];
    }

    #onKeydown(event: KeyboardEvent): void {
        if (isEditable(event.composedPath()[0])) return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.#goTo(this.#current - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.#goTo(this.#current + 1);
        }
    }

    protected override updated(): void {
        const count = this.#count;
        const current = this.#current;
        this.slides.forEach((slide, i) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${i + 1} of ${count}`);
            slide.toggleAttribute('inert', i !== current);
        });
        this.#syncTimer();
    }

    #arrow(direction: 'prev' | 'next') {
        const atStart = this.noLoop && this.#current === 0;
        const atEnd = this.noLoop && this.#current === this.#count - 1;
        const prev = direction === 'prev';
        return html`<button
            part=${`arrow ${direction}`}
            class=${`arrow ${direction}`}
            type="button"
            ?disabled=${prev ? atStart : atEnd}
            aria-label=${prev ? this.prevLabel : this.nextLabel}
            @click=${() => this.#goTo(this.#current + (prev ? -1 : 1))}
        >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d=${prev ? 'M10 4l-4 4 4 4' : 'M6 4l4 4-4 4'} />
            </svg>
        </button>`;
    }

    override render() {
        const count = this.#count;
        const current = this.#current;
        return html`<section
            part="base"
            class="base"
            aria-roledescription="carousel"
            aria-label=${this.label}
            @keydown=${this.#onKeydown}
            @mouseenter=${() => this.#pause(true)}
            @mouseleave=${() => this.#pause(false)}
            @focusin=${() => this.#pause(true)}
            @focusout=${(e: FocusEvent) => {
                if (!this.contains(e.relatedTarget as Node | null)) {
                    this.#pause(false);
                }
            }}
        >
            <div part="viewport" class="viewport">
                <div
                    part="track"
                    class="track"
                    style=${`transform: translateX(-${current * 100}%)`}
                >
                    <slot @slotchange=${this.#onSlot}></slot>
                </div>
                ${
                    !this.hideArrows && count > 1
                        ? html`${this.#arrow('prev')}${this.#arrow('next')}`
                        : nothing
                }
            </div>
            ${
                !this.hideDots && count > 1
                    ? html`<div part="dots" class="dots" role="tablist">
                          ${this.slides.map(
                              (_, i) => html`<button
                                  part="dot"
                                  class="dot"
                                  type="button"
                                  role="tab"
                                  data-active=${i === current ? 'true' : 'false'}
                                  aria-selected=${i === current ? 'true' : 'false'}
                                  aria-label=${applyTemplate(this.dotLabel, { n: i + 1 })}
                                  @click=${() => this.#goTo(i)}
                              ></button>`,
                          )}
                      </div>`
                    : nothing
            }
        </section>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-carousel': HmiCarousel;
    }
}
