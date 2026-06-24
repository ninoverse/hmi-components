import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import './styled/aspectRatio.styled.css';

export type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
    /** Width-to-height ratio, e.g. `16 / 9` or `'4 / 3'`. @default 1 */
    ratio?: number | string;
    /** Content constrained to the ratio. */
    children?: ReactNode;
};

/**
 * Constrains its child to a fixed width-to-height ratio via CSS `aspect-ratio`.
 *
 * @example
 * <AspectRatio ratio={16 / 9}><img src="…" alt="" /></AspectRatio>
 */
export function AspectRatio({
    ratio = 1,
    className,
    style,
    children,
    ...rest
}: AspectRatioProps) {
    const tokens: string[] = ['aspect-ratio'];
    if (className) tokens.push(className);

    const mergedStyle: CSSProperties = { aspectRatio: ratio, ...style };

    return (
        <div className={tokens.join(' ')} style={mergedStyle} {...rest}>
            {children}
        </div>
    );
}
