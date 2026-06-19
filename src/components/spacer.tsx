import type { HTMLAttributes } from 'react';
import './styled/spacer.styled.css';

export type SpacerSize = 'small' | 'medium' | 'large';
export type SpacerAxis = 'vertical' | 'horizontal';

export type SpacerProps = HTMLAttributes<HTMLSpanElement> & {
    /** Spacing amount preset. @default 'medium' */
    size?: SpacerSize;
    /** Axis the space is added along. @default 'vertical' */
    axis?: SpacerAxis;
    /** Grow to fill available space (e.g. push siblings apart in a flex row). @default false */
    grow?: boolean;
};

/**
 * Blank spacing element. Use a fixed `size`/`axis`, or `grow` to absorb free
 * space in a flex layout.
 *
 * @example
 * <Spacer size="large" />
 * <Flex><A /><Spacer grow /><B /></Flex>
 */
export function Spacer({
    size = 'medium',
    axis = 'vertical',
    grow = false,
    className,
    ...rest
}: SpacerProps) {
    const tokens: string[] = ['spacer'];
    if (grow) tokens.push('spacer--grow');
    else tokens.push(`spacer--${axis === 'vertical' ? 'v' : 'h'}-${size}`);
    if (className) tokens.push(className);

    return <span aria-hidden="true" className={tokens.join(' ')} {...rest} />;
}
