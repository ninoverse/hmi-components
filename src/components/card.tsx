import type { HTMLAttributes } from 'react';
import './styled/card.styled.css';

export type CardVariant = 'default' | 'flat' | 'ink' | 'accent';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    /** Surface treatment of the card. @default 'default' */
    variant?: CardVariant;
};

/**
 * Elevated surface container for grouping related content.
 *
 * @example
 * <Card variant="accent">…</Card>
 */
export function Card({
    variant = 'default',
    className,
    children,
    ...rest
}: CardProps) {
    const tokens: string[] = ['card'];
    if (variant !== 'default') tokens.push(`card--${variant}`);
    if (className) tokens.push(className);

    return (
        <div className={tokens.join(' ')} {...rest}>
            {children}
        </div>
    );
}
