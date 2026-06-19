import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './styled/visuallyHidden.styled.css';

export type VisuallyHiddenProps = HTMLAttributes<HTMLElement> & {
    /** Element/component to render as. @default 'span' */
    as?: ElementType;
    /** Content exposed to assistive tech but hidden visually. */
    children?: ReactNode;
};

/**
 * Hides content visually while keeping it available to screen readers (e.g. a
 * label for an icon-only control).
 *
 * @example
 * <VisuallyHidden>Close menu</VisuallyHidden>
 */
export function VisuallyHidden({
    as: Component = 'span',
    className,
    children,
    ...rest
}: VisuallyHiddenProps) {
    const tokens: string[] = ['visually-hidden'];
    if (className) tokens.push(className);

    return (
        <Component className={tokens.join(' ')} {...rest}>
            {children}
        </Component>
    );
}
