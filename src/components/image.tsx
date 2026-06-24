import {
    type CSSProperties,
    type ImgHTMLAttributes,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import './styled/image.styled.css';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ImageRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

/** Props handed to a custom image renderer. See {@link ImageProps.renderImage}. */
export type ImageSlotProps = {
    src: string;
    alt: string;
    className: string;
    onLoad: () => void;
    onError: () => void;
};

type ImageOwnProps = {
    /** Image source URL. */
    src: string;
    /** Alternative text (required for accessibility). */
    alt: string;
    /** Aspect ratio to reserve while loading (e.g. `16 / 9`). */
    ratio?: number;
    /** `object-fit` for the image. Native renderer only. @default 'cover' */
    fit?: ImageFit;
    /** `object-position` for the image (e.g. `'top'`). Native renderer only. */
    position?: string;
    /** Corner radius preset. @default 'medium' */
    radius?: ImageRadius;
    /**
     * Loading placeholder shown behind the image. `'shimmer'` animates;
     * `'none'` disables it; any other string is applied as the wrapper
     * `background` (e.g. a dominant color or a `url(...)` LQIP).
     * @default 'shimmer'
     */
    placeholder?: 'shimmer' | 'none' | (string & {});
    /** Explicit width; number = px. */
    width?: number | string;
    /** Explicit height; number = px. */
    height?: number | string;
    /** Content shown if the image fails to load. Defaults to a broken-image icon. */
    fallback?: ReactNode;
    /**
     * Render the inner image yourself — e.g. to delegate to `next/image`. The
     * wrapper still provides aspect-ratio reservation, radius and the
     * placeholder. Spread every prop onto your element so the placeholder
     * clears on load.
     * @example
     * renderImage={(p) => <NextImage {...p} fill sizes="100vw" priority />}
     */
    renderImage?: (props: ImageSlotProps) => ReactNode;
};

export type ImageProps = ImageOwnProps &
    Omit<ImgHTMLAttributes<HTMLImageElement>, keyof ImageOwnProps>;

/**
 * Image with loading/error states, aspect-ratio reservation, `object-fit`/
 * `object-position` and radius presets, a placeholder while loading, and a
 * fallback when the source fails. Lazy-loads by default. Pass `renderImage` to
 * supply an optimized image (e.g. `next/image`) inside the same styled shell.
 *
 * @example
 * <Image src="/cover.jpg" alt="Cover" ratio={16 / 9} radius="large" />
 */
export function Image({
    src,
    alt,
    ratio,
    fit = 'cover',
    position,
    radius = 'medium',
    placeholder = 'shimmer',
    width,
    height,
    fallback,
    renderImage,
    className,
    loading = 'lazy',
    ...rest
}: ImageProps) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
        'loading',
    );
    const imgRef = useRef<HTMLImageElement>(null);

    // If the image is already complete by the time the handlers are attached
    // (cache hit, or SSR markup loaded before hydration), the load/error events
    // never fire — resolve the status from the element itself on mount. Only the
    // native renderer exposes a ref; a custom renderImage drives status through
    // the onLoad/onError it is handed.
    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete) {
            setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
        }
    }, []);

    const customPlaceholder =
        placeholder !== 'shimmer' && placeholder !== 'none';

    const tokens: string[] = ['image', `image--radius-${radius}`];
    if (className) tokens.push(className);

    const style: CSSProperties = {
        width,
        height,
        ...(ratio ? { aspectRatio: ratio } : {}),
        ...(customPlaceholder ? { background: placeholder } : {}),
    };

    const slotProps: ImageSlotProps = {
        src,
        alt,
        className: 'image__img',
        onLoad: () => setStatus('loaded'),
        onError: () => setStatus('error'),
    };

    return (
        <div className={tokens.join(' ')} style={style} data-status={status}>
            {status === 'loading' && placeholder === 'shimmer' && (
                <span className="image__loader" aria-hidden="true" />
            )}
            {status !== 'error' &&
                (renderImage ? (
                    renderImage(slotProps)
                ) : (
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className="image__img"
                        loading={loading}
                        decoding="async"
                        onLoad={slotProps.onLoad}
                        onError={slotProps.onError}
                        style={{ objectFit: fit, objectPosition: position }}
                        {...rest}
                    />
                ))}
            {status === 'error' && (
                <span className="image__fallback">
                    {fallback ?? <BrokenIcon />}
                </span>
            )}
        </div>
    );
}

const BrokenIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Image unavailable</title>
        <path d="M3 5h18v14H3z" />
        <path d="M3 15l5-5 4 4 3-3 6 6" />
        <circle cx="8.5" cy="9" r="1.5" />
    </svg>
);
