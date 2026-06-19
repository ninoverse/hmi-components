import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './styled/flex.styled.css';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify =
    | 'start'
    | 'center'
    | 'end'
    | 'between'
    | 'around'
    | 'evenly';
export type FlexGap = 'none' | 'small' | 'medium' | 'large';

export type FlexProps = HTMLAttributes<HTMLDivElement> & {
    /** Element/component to render as. @default 'div' */
    as?: ElementType;
    /** Main-axis direction (`flex-direction`). @default 'row' */
    direction?: FlexDirection;
    /** Cross-axis alignment (`align-items`). @default 'stretch' */
    align?: FlexAlign;
    /** Main-axis distribution (`justify-content`). @default 'start' */
    justify?: FlexJustify;
    /** Gap preset between children. @default 'none' */
    gap?: FlexGap;
    /** Allow children to wrap onto multiple lines. @default false */
    wrap?: boolean;
    /** Use `inline-flex` instead of `flex`. @default false */
    inline?: boolean;
    /** Flex children. */
    children?: ReactNode;
};

/**
 * Flexbox layout primitive mapping direction/alignment/gap props to tokens.
 *
 * @example
 * <Flex align="center" justify="between" gap="medium">…</Flex>
 */
export function Flex({
    as: Component = 'div',
    direction = 'row',
    align = 'stretch',
    justify = 'start',
    gap = 'none',
    wrap = false,
    inline = false,
    className,
    children,
    ...rest
}: FlexProps) {
    const tokens: string[] = ['flex'];
    if (inline) tokens.push('flex--inline');
    if (direction !== 'row') tokens.push(`flex--${direction}`);
    if (align !== 'stretch') tokens.push(`flex--align-${align}`);
    if (justify !== 'start') tokens.push(`flex--justify-${justify}`);
    if (gap !== 'none') tokens.push(`flex--gap-${gap}`);
    if (wrap) tokens.push('flex--wrap');
    if (className) tokens.push(className);

    return (
        <Component className={tokens.join(' ')} {...rest}>
            {children}
        </Component>
    );
}
