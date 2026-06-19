import type { HTMLAttributes } from 'react';
import './styled/card.styled.css';

export type CardVariant = 'default' | 'flat' | 'ink' | 'accent';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    /** Surface treatment of the card. @default 'default' */
    variant?: CardVariant;
    /** Lifts the card off the page to mark it active/selected. @default false */
    active?: boolean;
};

/**
 * Elevated surface container for grouping related content.
 *
 * @example
 * <Card variant="accent">…</Card>
 * @example
 * <Card active>…</Card>
 */
export function Card({
    variant = 'default',
    active = false,
    className,
    children,
    ...rest
}: CardProps) {
    const tokens: string[] = ['card'];
    if (variant !== 'default') tokens.push(`card--${variant}`);
    if (active) tokens.push('card--active');
    if (className) tokens.push(className);

    return (
        <div className={tokens.join(' ')} {...rest}>
            {children}
        </div>
    );
}
