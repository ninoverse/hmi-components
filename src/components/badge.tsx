import type { HTMLAttributes, ReactNode } from 'react';
import './styled/badge.styled.css';

export type BadgeVariant =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    /** Color/tone of the badge. @default 'default' */
    variant?: BadgeVariant;
    /** Show a small leading status dot. @default false */
    dot?: boolean;
    /** Badge label content. */
    children?: ReactNode;
};

/**
 * Compact status label, optionally with a leading status dot.
 *
 * @example
 * <Badge variant="success" dot>Online</Badge>
 */
export function Badge({
    variant = 'default',
    dot = false,
    className,
    children,
    ...rest
}: BadgeProps) {
    const tokens: string[] = ['badge'];
    if (variant !== 'default') tokens.push(`badge--${variant}`);
    if (className) tokens.push(className);

    return (
        <span className={tokens.join(' ')} {...rest}>
            {dot && <span className="badge__dot" aria-hidden="true" />}
            {children}
        </span>
    );
}
