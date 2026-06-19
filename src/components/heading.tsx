import type { HTMLAttributes, ReactNode } from 'react';
import './styled/heading.styled.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type HeadingTone = 'default' | 'muted' | 'primary' | 'inherit';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
    /** Semantic heading level, rendered as `h1`–`h6`. @default 2 */
    level?: HeadingLevel;
    /** Visual size, decoupled from `level`. Defaults to a size matching `level`. */
    size?: HeadingSize;
    /** Colour tone. @default 'default' */
    tone?: HeadingTone;
    /** Truncate to a single line with an ellipsis. @default false */
    truncate?: boolean;
    /** Heading text. */
    children?: ReactNode;
};

/**
 * Semantic heading (`h1`–`h6`) with visual size, tone and truncation decoupled
 * from the level, so structure and appearance can differ.
 *
 * @example
 * <Heading level={1} size="large">Dashboard</Heading>
 */

/** Default visual size applied for each heading level. */
const SIZE_FOR_LEVEL: Record<HeadingLevel, HeadingSize> = {
    1: 'xlarge',
    2: 'large',
    3: 'medium',
    4: 'small',
    5: 'small',
    6: 'xsmall',
};

export function Heading({
    level = 2,
    size,
    tone = 'default',
    truncate = false,
    className,
    children,
    ...rest
}: HeadingProps) {
    const Component = `h${level}` as const;
    const resolvedSize = size ?? SIZE_FOR_LEVEL[level];

    const tokens: string[] = ['heading', `heading--size-${resolvedSize}`];
    if (tone !== 'default') tokens.push(`heading--tone-${tone}`);
    if (truncate) tokens.push('heading--truncate');
    if (className) tokens.push(className);

    return (
        <Component className={tokens.join(' ')} {...rest}>
            {children}
        </Component>
    );
}
