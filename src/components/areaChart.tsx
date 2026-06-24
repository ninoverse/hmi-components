import { CartesianGrid } from './cartesianGrid';
import './styled/areaChart.styled.css';

export type AreaChartSeries = {
    /** Legend/label name for the series. */
    name: string;
    /** Y values, one per category. */
    data: ReadonlyArray<number>;
    /** Series colour. Defaults to the primary token. */
    color?: string;
};

export type AreaChartProps = {
    /** One or more data series to overlay. */
    series: ReadonlyArray<AreaChartSeries>;
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
    /** Accessible name for the chart. @default 'Area chart' */
    'aria-label'?: string;
};

const AXIS = { left: 44, bottom: 28, top: 12, right: 12 };

/** Multi-series area chart. Self-contained SVG: each series is a line with a
 *  tinted fill down to the baseline, over a shared horizontal grid
 *  (CartesianGrid), with y-axis value ticks and x-axis labels. Zero deps. */
export function AreaChart({
    series,
    labels,
    width = 520,
    height = 260,
    min,
    max,
    yTicks = 4,
    'aria-label': ariaLabel = 'Area chart',
}: AreaChartProps) {
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
    const baseY = yAt(Math.max(lo, 0));

    const yTickValues = Array.from(
        { length: yTicks + 1 },
        (_, i) => lo + (span * i) / yTicks,
    );

    return (
        <svg
            className="area-chart"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel}
        >
            <g transform={`translate(${left}, ${top})`}>
                <CartesianGrid
                    width={plotW}
                    height={plotH}
                    rows={yTicks}
                    horizontal
                    vertical={false}
                />
            </g>

            {/* Y axis ticks + labels */}
            {yTickValues.map((v) => (
                <text
                    key={`y-${v}`}
                    className="area-chart__axis-label"
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
                    className="area-chart__axis-label"
                    x={xAt(i)}
                    y={height - AXIS.bottom + 18}
                    textAnchor="middle"
                >
                    {label}
                </text>
            ))}

            {/* Series areas + lines */}
            {series.map((s) => {
                const color = s.color ?? 'var(--primary)';
                const line = s.data
                    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(v)}`)
                    .join(' ');
                const first = xAt(0);
                const lastIdx = s.data.length - 1;
                const area = `${line} L${xAt(lastIdx)},${baseY} L${first},${baseY} Z`;
                return (
                    <g key={s.name}>
                        <path
                            className="area-chart__area"
                            d={area}
                            fill={color}
                        />
                        <path
                            className="area-chart__line"
                            d={line}
                            fill="none"
                            stroke={color}
                        />
                    </g>
                );
            })}
        </svg>
    );
}
