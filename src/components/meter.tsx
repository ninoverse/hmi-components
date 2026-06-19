import type { HTMLAttributes, ReactNode } from 'react';
import './styled/meter.styled.css';

export type MeterProps = HTMLAttributes<HTMLDivElement> & {
    /** Current measurement, clamped to `[min, max]`. */
    value: number;
    /** Lower bound of the scale. @default 0 */
    min?: number;
    /** Upper bound of the scale. @default 1 */
    max?: number;
    /** Lower threshold; below it the value is in the "low" band. Defaults to `min`. */
    low?: number;
    /** Upper threshold; above it the value is in the "high" band. Defaults to `max`. */
    high?: number;
    /** Where the ideal value sits; drives the optimal/suboptimal/poor colour. Defaults to `max`. */
    optimum?: number;
    /** Optional label shown above the bar. */
    label?: ReactNode;
    /** Show the numeric value beside the label. @default false */
    showValue?: boolean;
};

type MeterLevel = 'optimal' | 'suboptimal' | 'poor';

/* Mirrors the native <meter> coloring algorithm: the bar's quality
   depends on which band (below `low`, between, above `high`) the value
   falls in relative to where `optimum` sits. */
function resolveLevel(
    value: number,
    low: number,
    high: number,
    optimum: number,
): MeterLevel {
    const band = (v: number): 0 | 1 | 2 => (v <= low ? 0 : v >= high ? 2 : 1);
    const valueBand = band(value);
    const optimumBand = band(optimum);
    if (valueBand === optimumBand) return 'optimal';
    if (Math.abs(valueBand - optimumBand) === 1) return 'suboptimal';
    return 'poor';
}

/**
 * Scalar measurement bar within a known range (e.g. disk usage). Colour
 * reflects quality, mirroring the native `<meter>` algorithm via
 * `low`/`high`/`optimum`. For task progress, use {@link Progress} instead.
 *
 * @example
 * <Meter value={0.8} low={0.3} high={0.7} optimum={0.2} label="Disk" showValue />
 */
export function Meter({
    value,
    min = 0,
    max = 1,
    low,
    high,
    optimum,
    label,
    showValue = false,
    className,
    ...rest
}: MeterProps) {
    const span = max - min;
    const clamped = Math.max(min, Math.min(max, value));
    const percent = span > 0 ? ((clamped - min) / span) * 100 : 0;

    const lowBound = low ?? min;
    const highBound = high ?? max;
    const optimumPoint = optimum ?? max;
    const level = resolveLevel(clamped, lowBound, highBound, optimumPoint);

    const tokens: string[] = ['meter', `meter--${level}`];
    if (className) tokens.push(className);

    return (
        <div className={tokens.join(' ')} {...rest}>
            {(label !== undefined || showValue) && (
                <div className="meter__header">
                    {label !== undefined && (
                        <span className="meter__label">{label}</span>
                    )}
                    {showValue && (
                        <span className="meter__value">{clamped}</span>
                    )}
                </div>
            )}
            {/* biome-ignore lint/a11y/useSemanticElements: native <meter> exposes non-themeable shadow-DOM pseudo-elements, so (like the sibling Progress) this is a styled div carrying the meter role explicitly */}
            <div
                aria-label={typeof label === 'string' ? label : undefined}
                aria-valuemax={max}
                aria-valuemin={min}
                aria-valuenow={clamped}
                className="meter__track"
                role="meter"
            >
                <div className="meter__fill" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
