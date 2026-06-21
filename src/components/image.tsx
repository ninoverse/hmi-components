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

type ImageOwnProps = {
    /** Image source URL. */
    src: string;
    /** Alternative text (required for accessibility). */
    alt: string;
    /** Aspect ratio to reserve while loading (e.g. `16 / 9`). */
    ratio?: number;
    /** `object-fit` for the image. @default 'cover' */
    fit?: ImageFit;
    /** Corner radius preset. @default 'medium' */
    radius?: ImageRadius;
    /** Explicit width; number = px. */
    width?: number | string;
    /** Explicit height; number = px. */
    height?: number | string;
    /** Content shown if the image fails to load. Defaults to a broken-image icon. */
    fallback?: ReactNode;
};

export type ImageProps = ImageOwnProps &
    Omit<ImgHTMLAttributes<HTMLImageElement>, keyof ImageOwnProps>;

/**
 * Image with loading/error states, aspect-ratio reservation, `object-fit` and
 * radius presets, and a fallback when the source fails. Lazy-loads by default.
 *
 * @example
 * <Image src="/cover.jpg" alt="Cover" ratio={16 / 9} radius="large" />
 */
export function Image({
    src,
    alt,
    ratio,
    fit = 'cover',
    radius = 'medium',
    width,
    height,
    fallback,
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
    // never fire — resolve the status from the element itself on mount.
    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete) {
            setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
        }
    }, []);

    const tokens: string[] = ['image', `image--radius-${radius}`];
    if (className) tokens.push(className);

    const style: CSSProperties = {
        width,
        height,
        ...(ratio ? { aspectRatio: ratio } : {}),
    };

    return (
        <div className={tokens.join(' ')} style={style} data-status={status}>
            {status !== 'error' && (
                <img
                    ref={imgRef}
                    className="image__img"
                    src={src}
                    alt={alt}
                    loading={loading}
                    style={{ objectFit: fit }}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('error')}
                    {...rest}
                />
            )}
            {status === 'loading' && (
                <span className="image__loader" aria-hidden="true" />
            )}
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
