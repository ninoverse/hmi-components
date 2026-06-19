import type { HTMLAttributes } from 'react';
import './styled/spinner.styled.css';

export type SpinnerSize = 'small' | 'medium' | 'large';

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
    /** Diameter preset. @default 'medium' */
    size?: SpinnerSize;
    /** Accessible status label. @default 'Loading' */
    label?: string;
};

/**
 * Indeterminate loading spinner with `role="status"`.
 *
 * @example
 * <Spinner size="large" label="Fetching" />
 */
export function Spinner({
    size = 'medium',
    label = 'Loading',
    className,
    ...rest
}: SpinnerProps) {
    const tokens: string[] = ['spinner'];
    if (size !== 'medium') tokens.push(`spinner--${size}`);
    if (className) tokens.push(className);

    return (
        <span
            role="status"
            aria-label={label}
            className={tokens.join(' ')}
            {...rest}
        />
    );
}
