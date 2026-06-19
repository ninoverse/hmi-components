import type { CSSProperties, HTMLAttributes } from 'react';
import './styled/skeleton.styled.css';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export type SkeletonProps = HTMLAttributes<HTMLSpanElement> & {
    /** Shape preset. @default 'text' */
    variant?: SkeletonVariant;
    /** Explicit width; number = px. */
    width?: string | number;
    /** Explicit height; number = px. */
    height?: string | number;
    /** Corner radius override; number = px. */
    radius?: string | number;
};

const toCssSize = (v: string | number) =>
    typeof v === 'number' ? `${v}px` : v;

/**
 * Animated loading placeholder. `aria-hidden` by default so it isn't announced.
 *
 * @example
 * <Skeleton variant="circle" width={40} height={40} />
 */
export function Skeleton({
    variant = 'text',
    width,
    height,
    radius,
    className,
    style,
    'aria-hidden': ariaHidden = true,
    ...rest
}: SkeletonProps) {
    const tokens: string[] = ['skeleton', `skeleton--${variant}`];
    if (className) tokens.push(className);

    const cssStyle: CSSProperties = { ...style };
    if (width !== undefined) cssStyle.width = toCssSize(width);
    if (height !== undefined) cssStyle.height = toCssSize(height);
    if (radius !== undefined) cssStyle.borderRadius = toCssSize(radius);

    return (
        <span
            aria-hidden={ariaHidden}
            className={tokens.join(' ')}
            style={cssStyle}
            {...rest}
        />
    );
}
