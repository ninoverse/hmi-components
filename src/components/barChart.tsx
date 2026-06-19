import { CartesianGrid } from './cartesianGrid';
import './styled/barChart.styled.css';

export type BarChartSeries = {
    /** Legend/label name for the series. */
    name: string;
    /** Y values, one per category. */
    data: ReadonlyArray<number>;
    /** Series colour. Defaults to the primary token. */
    color?: string;
};

export type BarChartProps = {
    /** One or more series rendered as grouped bars per category. */
    series: ReadonlyArray<BarChartSeries>;
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
    /** Accessible name for the chart. @default 'Bar chart' */
    'aria-label'?: string;
};

const AXIS = { left: 44, bottom: 28, top: 12, right: 12 };

/** Multi-series grouped bar chart. Self-contained SVG: groups of bars per
 *  category over a shared horizontal grid (CartesianGrid), with y-axis value
 *  ticks and x-axis category labels. Pure SVG, zero deps. */
export function BarChart({
    series,
    labels,
    width = 520,
    height = 260,
    min,
    max,
    yTicks = 4,
    'aria-label': ariaLabel = 'Bar chart',
}: BarChartProps) {
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

    const yAt = (v: number) => top + plotH - ((v - lo) / span) * plotH;
    const zeroY = yAt(Math.max(lo, 0));

    // Each category occupies an equal slot; bars within a group share it,
    // with outer gaps around the group and inner gaps between series bars.
    const slot = plotW / count;
    const groupPad = slot * 0.18;
    const groupW = slot - groupPad * 2;
    const barGap = series.length > 1 ? groupW * 0.08 : 0;
    const barW = (groupW - barGap * (series.length - 1)) / series.length;

    const yTickValues = Array.from(
        { length: yTicks + 1 },
        (_, i) => lo + (span * i) / yTicks,
    );

    return (
        <svg
            className="bar-chart"
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
                    className="bar-chart__axis-label"
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
                    className="bar-chart__axis-label"
                    x={left + slot * i + slot / 2}
                    y={height - AXIS.bottom + 18}
                    textAnchor="middle"
                >
                    {label}
                </text>
            ))}

            {/* Bars */}
            {Array.from({ length: count }, (_, i) => {
                const groupX = left + slot * i + groupPad;
                return series.map((s, si) => {
                    const v = s.data[i] ?? 0;
                    const barX = groupX + si * (barW + barGap);
                    const y = yAt(v);
                    const h = Math.abs(zeroY - y);
                    const color = s.color ?? 'var(--primary)';
                    return (
                        <rect
                            // biome-ignore lint/suspicious/noArrayIndexKey: category index is the stable positional identity; combined with the series name it is unique
                            key={`${s.name}-${i}`}
                            className="bar-chart__bar"
                            x={barX}
                            y={Math.min(y, zeroY)}
                            width={Math.max(0, barW)}
                            height={h}
                            rx={2}
                            fill={color}
                        />
                    );
                });
            })}
        </svg>
    );
}
