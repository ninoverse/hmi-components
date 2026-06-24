import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './styled/box.styled.css';

export type BoxBackground =
    | 'none'
    | 'surface'
    | 'surface-variant'
    | 'surface-container'
    | 'surface-container-low'
    | 'surface-container-high';
export type BoxPadding = 'none' | 'small' | 'medium' | 'large';
export type BoxRadius = 'none' | 'small' | 'medium' | 'large' | 'full' | 'leaf';

export type BoxProps = HTMLAttributes<HTMLDivElement> & {
    /** Element/component to render as. @default 'div' */
    as?: ElementType;
    /** Surface token applied as the background. @default 'none' */
    background?: BoxBackground;
    /** Inner padding preset. @default 'none' */
    padding?: BoxPadding;
    /** Corner radius preset. @default 'none' */
    radius?: BoxRadius;
    /** Add a 1px outline-variant border. @default false */
    bordered?: boolean;
    /** Box content. */
    children?: ReactNode;
};

/**
 * Primitive container that maps surface, padding, radius and border props to
 * theme tokens. Render as any element via `as`.
 *
 * @example
 * <Box as="section" background="surface-variant" padding="medium" radius="medium" bordered>…</Box>
 */
export function Box({
    as: Component = 'div',
    background = 'none',
    padding = 'none',
    radius = 'none',
    bordered = false,
    className,
    children,
    ...rest
}: BoxProps) {
    const tokens: string[] = ['box'];
    if (background !== 'none') tokens.push(`box--bg-${background}`);
    if (padding !== 'none') tokens.push(`box--pad-${padding}`);
    if (radius !== 'none') tokens.push(`box--radius-${radius}`);
    if (bordered) tokens.push('box--bordered');
    if (className) tokens.push(className);

    return (
        <Component className={tokens.join(' ')} {...rest}>
            {children}
        </Component>
    );
}
