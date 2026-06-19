import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import './styled/scrollArea.styled.css';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
    /** Scroll axis to enable. @default 'vertical' */
    orientation?: ScrollAreaOrientation;
    /** Cap the height so content scrolls past it; number = px. */
    maxHeight?: number | string;
    /** Scrollable content. */
    children?: ReactNode;
};

/**
 * Scrollable container with themed custom scrollbars on the chosen axis.
 *
 * @example
 * <ScrollArea maxHeight={240}>…</ScrollArea>
 */
export function ScrollArea({
    orientation = 'vertical',
    maxHeight,
    className,
    style,
    children,
    ...rest
}: ScrollAreaProps) {
    const tokens: string[] = ['scroll-area', `scroll-area--${orientation}`];
    if (className) tokens.push(className);

    const mergedStyle: CSSProperties = {
        ...(maxHeight !== undefined ? { maxHeight } : null),
        ...style,
    };

    return (
        <div className={tokens.join(' ')} style={mergedStyle} {...rest}>
            {children}
        </div>
    );
}
