import { CartesianGrid } from './cartesianGrid';
import './styled/lineChart.styled.css';

export type LineChartSeries = {
    /** Legend/label name for the series. */
    name: string;
    /** Y values, one per category. */
    data: ReadonlyArray<number>;
    /** Series colour. Defaults to the primary token. */
    color?: string;
};

export type LineChartProps = {
    /** One or more series, each drawn as a polyline. */
    series: ReadonlyArray<LineChartSeries>;
    /** X-axis category labels; length should match the series data length. */
    labels?: ReadonlyArray<string>;
    /** SVG viewport width in px. @default 520 */
    width?: number;
    /** SVG viewport height in px. @default 260 */
    height?: number;
    /** Override the value range; defaults to 0..max across all series. */
    min?: number;
    /** Upper bound of the value range. Defaults to the max across all series. */
    max?: number;
    /** Number of horizontal grid lines / y-axis ticks. @default 4 */
    yTicks?: number;
    /** Draw a dot at each data point. @default false */
    showDots?: boolean;
    /** Accessible name for the chart. @default 'Line chart' */
    'aria-label'?: string;
};

const AXIS = { left: 44, bottom: 28, top: 12, right: 12 };

/** Multi-series Cartesian line chart. Self-contained SVG: plots each series
 *  as a polyline over a shared grid (CartesianGrid) with y-axis value ticks
 *  and x-axis category labels. Pure SVG, zero deps. */
export function LineChart({
    series,
    labels,
    width = 520,
    height = 260,
    min,
    max,
    yTicks = 4,
    showDots = false,
    'aria-label': ariaLabel = 'Line chart',
}: LineChartProps) {
    const count = Math.max(0, ...series.map((s) => s.data.length));
    if (series.length === 0 || count === 0) return null;

    const plotW = width - AXIS.left - AXIS.right;
    const plotH = height - AXIS.top - AXIS.bottom;
    const left = AXIS.left;
    const top = AXIS.top;

    const allValues = series.flatMap((s) => s.data);
    const lo = min ?? Math.min(0, ...allValues);
    const hi = max ?? Math.max(...allValues);
    const span = hi - lo || 1;

    const xAt = (i: number) =>
        count === 1 ? left + plotW / 2 : left + (plotW * i) / (count - 1);
    const yAt = (v: number) => top + plotH - ((v - lo) / span) * plotH;

    const yTickValues = Array.from(
        { length: yTicks + 1 },
        (_, i) => lo + (span * i) / yTicks,
    );

    return (
        <svg
            className="line-chart"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel}
        >
            {/* Grid lives in the plot area; offset via a translate group. */}
            <g transform={`translate(${left}, ${top})`}>
                <CartesianGrid
                    width={plotW}
                    height={plotH}
                    rows={yTicks}
                    cols={Math.max(1, count - 1)}
                    horizontal
                    vertical={false}
                />
            </g>

            {/* Y axis ticks + labels */}
            {yTickValues.map((v) => (
                <text
                    key={`y-${v}`}
                    className="line-chart__axis-label"
                    x={left - 8}
                    y={yAt(v)}
                    textAnchor="end"
                    dominantBaseline="middle"
                >
                    {Math.round(v)}
                </text>
            ))}

            {/* X axis labels */}
            {labels?.map((label, i) => (
                <text
                    key={`x-${label}`}
                    className="line-chart__axis-label"
                    x={xAt(i)}
                    y={height - AXIS.bottom + 18}
                    textAnchor="middle"
                >
                    {label}
                </text>
            ))}

            {/* Series polylines */}
            {series.map((s) => {
                const color = s.color ?? 'var(--primary)';
                const d = s.data
                    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(v)}`)
                    .join(' ');
                return (
                    <g key={s.name}>
                        <path
                            className="line-chart__line"
                            d={d}
                            fill="none"
                            stroke={color}
                        />
                        {showDots &&
                            s.data.map((v, i) => (
                                <circle
                                    // biome-ignore lint/suspicious/noArrayIndexKey: data points have no intrinsic id; their position in the series is the stable identity
                                    key={`${s.name}-${i}`}
                                    cx={xAt(i)}
                                    cy={yAt(v)}
                                    r={3}
                                    fill={color}
                                />
                            ))}
                    </g>
                );
            })}
        </svg>
    );
}
