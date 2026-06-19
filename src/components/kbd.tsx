import type { HTMLAttributes, ReactNode } from 'react';
import './styled/kbd.styled.css';

export type KbdSize = 'small' | 'medium';

export type KbdProps = HTMLAttributes<HTMLElement> & {
    /** Key cap size. @default 'medium' */
    size?: KbdSize;
    /** Key label (e.g. `⌘`, `Ctrl`). */
    children: ReactNode;
};

/**
 * Renders a keyboard key cap (`<kbd>`).
 *
 * @example
 * <Kbd>⌘</Kbd> <Kbd>K</Kbd>
 */
export function Kbd({
    size = 'medium',
    children,
    className,
    ...rest
}: KbdProps) {
    const tokens: string[] = ['kbd'];
    if (size !== 'medium') tokens.push(`kbd--${size}`);
    if (className) tokens.push(className);
    return (
        <kbd className={tokens.join(' ')} {...rest}>
            {children}
        </kbd>
    );
}
