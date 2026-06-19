import type { HTMLAttributes } from 'react';
import './styled/progress.styled.css';

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
    /** Completion percentage 0–100 (clamped). @default 0 */
    value?: number;
    /** Show a looping animation for unknown duration; ignores `value`. @default false */
    indeterminate?: boolean;
    /** Accessible label for the progress bar. */
    label?: string;
};

/**
 * Linear progress bar for a known or indeterminate task. For a scalar
 * measurement within a range, use {@link Meter} instead.
 *
 * @example
 * <Progress value={64} label="Uploading" />
 */
export function Progress({
    value = 0,
    indeterminate = false,
    label,
    className,
    style,
    ...rest
}: ProgressProps) {
    const clamped = Math.max(0, Math.min(100, value));
    const tokens: string[] = ['progress'];
    if (indeterminate) tokens.push('progress--indeterminate');
    if (className) tokens.push(className);

    return (
        <div
            className={tokens.join(' ')}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={indeterminate ? undefined : clamped}
            aria-label={label}
            style={style}
            {...rest}
        >
            <div
                className="progress__bar"
                style={indeterminate ? undefined : { width: `${clamped}%` }}
            />
        </div>
    );
}
