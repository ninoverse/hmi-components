import {
    type KeyboardEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useId,
    useState,
} from 'react';
import './styled/carousel.styled.css';

export type CarouselProps = {
    /** Slide content, in order. */
    slides: ReadonlyArray<ReactNode>;
    /** Controlled active slide index. Provide with `onIndexChange`. */
    index?: number;
    /** Initial slide index when uncontrolled. @default 0 */
    defaultIndex?: number;
    /** Fires with the new index whenever the active slide changes. */
    onIndexChange?: (index: number) => void;
    /** Wrap around past the first/last slide. @default true */
    loop?: boolean;
    /** Auto-advance interval in ms; pauses on hover/focus. Disabled when unset. */
    autoPlay?: number;
    /** Show prev/next arrow buttons. @default true */
    showArrows?: boolean;
    /** Show the dot pagination control. @default true */
    showDots?: boolean;
    /** Accessible name for the carousel region. @default 'Carousel' */
    'aria-label'?: string;
};

const ArrowIcon = ({ dir }: { dir: 'prev' | 'next' }) => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>{dir === 'prev' ? 'Previous' : 'Next'}</title>
        <path d={dir === 'prev' ? 'M10 4l-4 4 4 4' : 'M6 4l4 4-4 4'} />
    </svg>
);

/**
 * Sliding content carousel with optional arrows, dot pagination, looping,
 * autoplay and keyboard (←/→) support. Works controlled or uncontrolled.
 *
 * @example
 * <Carousel slides={[<Slide1 />, <Slide2 />]} autoPlay={4000} />
 */
export function Carousel({
    slides,
    index,
    defaultIndex = 0,
    onIndexChange,
    loop = true,
    autoPlay,
    showArrows = true,
    showDots = true,
    'aria-label': ariaLabel = 'Carousel',
}: CarouselProps) {
    const id = useId();
    const count = slides.length;
    const isControlled = index !== undefined;
    const [internal, setInternal] = useState(defaultIndex);
    const current = Math.min(isControlled ? index : internal, count - 1);
    const [paused, setPaused] = useState(false);

    const goTo = useCallback(
        (next: number) => {
            const clamped = loop
                ? (next + count) % count
                : Math.max(0, Math.min(next, count - 1));
            if (!isControlled) setInternal(clamped);
            onIndexChange?.(clamped);
        },
        [count, loop, isControlled, onIndexChange],
    );

    const atStart = !loop && current === 0;
    const atEnd = !loop && current === count - 1;

    useEffect(() => {
        if (!autoPlay || paused || count <= 1) return;
        const t = window.setInterval(() => goTo(current + 1), autoPlay);
        return () => window.clearInterval(t);
    }, [autoPlay, paused, count, current, goTo]);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(current - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(current + 1);
        }
    };

    if (count === 0) return null;

    return (
        <section
            className="carousel"
            aria-roledescription="carousel"
            aria-label={ariaLabel}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <div className="carousel__viewport">
                <div
                    className="carousel__track"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((slide, i) => (
                        // biome-ignore lint/a11y/useSemanticElements: the ARIA carousel pattern marks each slide with role="group" + aria-roledescription="slide"; no semantic HTML element conveys this.
                        <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: slides are a stable, ordered prop with no intrinsic id
                            key={i}
                            className="carousel__slide"
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${count}`}
                            aria-hidden={i !== current}
                            id={`${id}-slide-${i}`}
                        >
                            {slide}
                        </div>
                    ))}
                </div>

                {showArrows && count > 1 && (
                    <>
                        <button
                            type="button"
                            className="carousel__arrow carousel__arrow--prev"
                            onClick={() => goTo(current - 1)}
                            disabled={atStart}
                            aria-label="Previous slide"
                        >
                            <ArrowIcon dir="prev" />
                        </button>
                        <button
                            type="button"
                            className="carousel__arrow carousel__arrow--next"
                            onClick={() => goTo(current + 1)}
                            disabled={atEnd}
                            aria-label="Next slide"
                        >
                            <ArrowIcon dir="next" />
                        </button>
                    </>
                )}
            </div>

            {showDots && count > 1 && (
                <div className="carousel__dots" role="tablist">
                    {slides.map((_, i) => (
                        <button
                            // biome-ignore lint/suspicious/noArrayIndexKey: dots map 1:1 to the stable, ordered slides prop
                            key={i}
                            type="button"
                            role="tab"
                            className="carousel__dot"
                            data-active={i === current}
                            aria-selected={i === current}
                            aria-controls={`${id}-slide-${i}`}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
