import './styled/bulletChart.styled.css';

export type BulletChartProps = {
    /** The measured value (the primary bar). */
    value: number;
    /** Target/comparison marker. */
    target?: number;
    /** Upper bound of the scale. Defaults to max(value, target, last range). */
    max?: number;
    /** Lower bound of the scale. Defaults to 0. */
    min?: number;
    /** Ascending qualitative-range thresholds (e.g. [40, 75] → poor/ok/good). */
    ranges?: ReadonlyArray<number>;
    /** Measure bar colour. Defaults to the primary token. */
    color?: string;
    /** Leading label rendered to the left of the track. */
    label?: string;
    /** SVG width in px. @default 360 */
    width?: number;
    /** SVG height in px. @default 48 */
    height?: number;
    /** Accessible name. Falls back to `label`, then `'Bullet chart'`. */
    'aria-label'?: string;
};

// Range band shades, light→dark, applied behind the measure bar.
const BAND_SHADES = [
    'var(--surface-container-high)',
    'var(--surface-container-highest)',
    'var(--outline-variant)',
];

/** Bullet chart (bullet graph): a compact horizontal KPI gauge. Qualitative
 *  range bands sit behind a measure bar, with a target tick for comparison.
 *  Pure SVG, zero deps, tokens-driven. */
export function BulletChart({
    value,
    target,
    max,
    min = 0,
    ranges = [],
    color = 'var(--primary)',
    label,
    width = 360,
    height = 48,
    'aria-label': ariaLabel,
}: BulletChartProps) {
    const labelW = label ? 96 : 0;
    const padX = 4;
    const trackLeft = labelW + padX;
    const trackW = width - trackLeft - padX;

    const hi =
        max ??
        Math.max(value, target ?? Number.NEGATIVE_INFINITY, ...ranges, 1);
    const span = hi - min || 1;
    const xAt = (v: number) =>
        trackLeft + ((Math.max(min, Math.min(v, hi)) - min) / span) * trackW;

    const trackTop = height * 0.18;
    const trackH = height * 0.64;
    const barTop = height * 0.32;
    const barH = height * 0.36;

    // Build band boundaries: min → ...ranges → hi.
    const bounds = [min, ...ranges.filter((r) => r > min && r < hi), hi];
    const bands = bounds.slice(0, -1).map((start, i) => {
        const end = bounds[i + 1] ?? hi;
        return { start, end, shade: BAND_SHADES[i % BAND_SHADES.length] };
    });

    return (
        <svg
            className="bullet-chart"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel ?? label ?? 'Bullet chart'}
        >
            {label && (
                <text
                    className="bullet-chart__label"
                    x={labelW}
                    y={height / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                >
                    {label}
                </text>
            )}

            {/* Qualitative range bands */}
            {bands.map((b) => (
                <rect
                    key={`band-${b.start}`}
                    className="bullet-chart__band"
                    x={xAt(b.start)}
                    y={trackTop}
                    width={Math.max(0, xAt(b.end) - xAt(b.start))}
                    height={trackH}
                    fill={b.shade}
                />
            ))}

            {/* Measure bar */}
            <rect
                className="bullet-chart__measure"
                x={trackLeft}
                y={barTop}
                width={Math.max(0, xAt(value) - trackLeft)}
                height={barH}
                rx={2}
                fill={color}
            />

            {/* Target marker */}
            {target != null && (
                <line
                    className="bullet-chart__target"
                    x1={xAt(target)}
                    y1={trackTop - 2}
                    x2={xAt(target)}
                    y2={trackTop + trackH + 2}
                />
            )}
        </svg>
    );
}
