import type { BlockquoteHTMLAttributes, ReactNode } from 'react';
import './styled/blockquote.styled.css';

export type BlockquoteProps = Omit<
    BlockquoteHTMLAttributes<HTMLQuoteElement>,
    'cite'
> & {
    /** Attribution shown in the quote footer. */
    cite?: ReactNode;
    /** Quotation body. */
    children?: ReactNode;
};

/**
 * Styled block quotation with an optional citation footer.
 *
 * @example
 * <Blockquote cite="Ada Lovelace">That brain of mine is something more than mortal.</Blockquote>
 */
export function Blockquote({
    cite,
    className,
    children,
    ...rest
}: BlockquoteProps) {
    const tokens: string[] = ['blockquote'];
    if (className) tokens.push(className);

    return (
        <blockquote className={tokens.join(' ')} {...rest}>
            <p className="blockquote__body">{children}</p>
            {cite !== undefined && (
                <footer className="blockquote__cite">{cite}</footer>
            )}
        </blockquote>
    );
}
