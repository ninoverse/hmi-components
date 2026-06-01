import './styled/radarChart.styled.css';

export type RadarChartSeries = {
    name: string;
    /** One value per axis; length should match the axes length. */
    data: ReadonlyArray<number>;
    /** Series colour. Defaults to a palette entry. */
    color?: string;
};

export type RadarChartProps = {
    /** Axis labels, one per spoke. */
    axes: ReadonlyArray<string>;
    series: ReadonlyArray<RadarChartSeries>;
    size?: number;
    /** Override the value range; defaults to 0..max across all series. */
    min?: number;
    max?: number;
    /** Number of concentric grid rings. */
    rings?: number;
    'aria-label'?: string;
};

const PALETTE = [
    'var(--primary)',
    'var(--tertiary)',
    'var(--secondary)',
    'var(--success)',
    'var(--warning)',
    'var(--error)',
];

/** Place a point on a spoke: angle measured clockwise from the top. */
const polar = (cx: number, cy: number, r: number, i: number, n: number) => {
    const ang = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)] as const;
};

/** Radar (spider) chart. Plots each series as a closed polygon over a polar
 *  grid of concentric rings and radial spokes. Pure SVG, zero deps. */
export function RadarChart({
    axes,
    series,
    size = 300,
    min,
    max,
    rings = 4,
    'aria-label': ariaLabel = 'Radar chart',
}: RadarChartProps) {
    const n = axes.length;
    if (n < 3 || series.length === 0) return null;

    const cx = size / 2;
    const cy = size / 2;
    const pad = 36;
    const radius = size / 2 - pad;

    const allValues = series.flatMap((s) => s.data);
    const lo = min ?? Math.min(0, ...allValues);
    const hi = max ?? Math.max(...allValues);
    const span = hi - lo || 1;
    const rAt = (v: number) => ((v - lo) / span) * radius;

    const ringPoints = (r: number) =>
        Array.from({ length: n }, (_, i) =>
            polar(cx, cy, r, i, n).join(','),
        ).join(' ');

    return (
        <svg
            className="radar-chart"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={ariaLabel}
        >
            {/* Concentric grid rings */}
            {Array.from({ length: rings }, (_, i) => (
                <polygon
                    // biome-ignore lint/suspicious/noArrayIndexKey: rings are evenly spaced; the index is the stable identity
                    key={`ring-${i}`}
                    className="radar-chart__ring"
                    points={ringPoints((radius * (i + 1)) / rings)}
                />
            ))}

            {/* Radial spokes + axis labels */}
            {axes.map((label, i) => {
                const [x, y] = polar(cx, cy, radius, i, n);
                const [lx, ly] = polar(cx, cy, radius + 16, i, n);
                return (
                    <g key={label}>
                        <line
                            className="radar-chart__spoke"
                            x1={cx}
                            y1={cy}
                            x2={x}
                            y2={y}
                        />
                        <text
                            className="radar-chart__axis-label"
                            x={lx}
                            y={ly}
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {label}
                        </text>
                    </g>
                );
            })}

            {/* Series polygons */}
            {series.map((s, si) => {
                const color = s.color ?? PALETTE[si % PALETTE.length];
                const points = s.data
                    .map((v, i) => polar(cx, cy, rAt(v), i, n).join(','))
                    .join(' ');
                return (
                    <polygon
                        key={s.name}
                        className="radar-chart__area"
                        points={points}
                        fill={color}
                        stroke={color}
                    />
                );
            })}
        </svg>
    );
}
