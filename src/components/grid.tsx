import type {
    CSSProperties,
    ElementType,
    HTMLAttributes,
    ReactNode,
} from 'react';
import './styled/grid.styled.css';

export type GridGap = 'none' | 'small' | 'medium' | 'large';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
    /** Element/component to render as. @default 'div' */
    as?: ElementType;
    /** Column count (equal columns) or a raw `grid-template-columns` value. @default 2 */
    columns?: number | string;
    /** Gap preset between cells. @default 'none' */
    gap?: GridGap;
    /** Grid children. */
    children?: ReactNode;
};

/**
 * CSS Grid layout primitive. `columns` accepts a number (equal columns) or a
 * raw `grid-template-columns` string.
 *
 * @example
 * <Grid columns={3} gap="medium">…</Grid>
 */
export function Grid({
    as: Component = 'div',
    columns = 2,
    gap = 'none',
    className,
    style,
    children,
    ...rest
}: GridProps) {
    const tokens: string[] = ['grid'];
    if (gap !== 'none') tokens.push(`grid--gap-${gap}`);
    if (className) tokens.push(className);

    const gridTemplateColumns =
        typeof columns === 'number'
            ? `repeat(${columns}, minmax(0, 1fr))`
            : columns;
    const mergedStyle: CSSProperties = { gridTemplateColumns, ...style };

    return (
        <Component className={tokens.join(' ')} style={mergedStyle} {...rest}>
            {children}
        </Component>
    );
}
