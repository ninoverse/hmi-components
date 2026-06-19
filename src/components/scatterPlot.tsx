import { CartesianGrid } from './cartesianGrid';
import './styled/scatterPlot.styled.css';

/** A single `{x, y}` data point. */
export type ScatterPlotPoint = { x: number; y: number };

export type ScatterPlotSeries = {
    /** Legend/label name for the series. */
    name: string;
    /** Points to plot for this series. */
    data: ReadonlyArray<ScatterPlotPoint>;
    /** Series colour. Defaults to the primary token. */
    color?: string;
};

export type ScatterPlotProps = {
    /** One or more series of points. */
    series: ReadonlyArray<ScatterPlotSeries>;
    /** SVG viewport width in px. @default 520 */
    width?: number;
    /** SVG viewport height in px. @default 260 */
    height?: number;
    /** Override the x range; defaults to the data extent. */
    xMin?: number;
    /** Upper bound of the x range. Defaults to the data max. */
    xMax?: number;
    /** Override the y range; defaults to the data extent. */
    yMin?: number;
    /** Upper bound of the y range. Defaults to the data max. */
    yMax?: number;
    /** Number of x-axis ticks / vertical grid lines. @default 5 */
    xTicks?: number;
    /** Number of y-axis ticks / horizontal grid lines. @default 4 */
    yTicks?: number;
    /** Marker radius in px. @default 4 */
    radius?: number;
    /** Accessible name for the chart. @default 'Scatter plot' */
    'aria-label'?: string;
};

const AXIS = { left: 44, bottom: 28, top: 12, right: 12 };

/** Cartesian scatter plot. Both axes are numeric: each series renders its
 *  {x, y} points as markers over a shared grid (CartesianGrid). Pure SVG,
 *  zero deps. */
export function ScatterPlot({
    series,
    width = 520,
    height = 260,
    xMin,
    xMax,
    yMin,
    yMax,
    xTicks = 5,
    yTicks = 4,
    radius = 4,
    'aria-label': ariaLabel = 'Scatter plot',
}: ScatterPlotProps) {
    const points = series.flatMap((s) => s.data);
    if (series.length === 0 || points.length === 0) return null;

    const plotW = width - AXIS.left - AXIS.right;
    const plotH = height - AXIS.top - AXIS.bottom;
    const left = AXIS.left;
    const top = AXIS.top;

    const xLo = xMin ?? Math.min(...points.map((p) => p.x));
    const xHi = xMax ?? Math.max(...points.map((p) => p.x));
    const yLo = yMin ?? Math.min(0, ...points.map((p) => p.y));
    const yHi = yMax ?? Math.max(...points.map((p) => p.y));
    const xSpan = xHi - xLo || 1;
    const ySpan = yHi - yLo || 1;

    const xAt = (x: number) => left + ((x - xLo) / xSpan) * plotW;
    const yAt = (y: number) => top + plotH - ((y - yLo) / ySpan) * plotH;

    const xTickValues = Array.from(
        { length: xTicks + 1 },
        (_, i) => xLo + (xSpan * i) / xTicks,
    );
    const yTickValues = Array.from(
        { length: yTicks + 1 },
        (_, i) => yLo + (ySpan * i) / yTicks,
    );

    return (
        <svg
            className="scatter-plot"
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
                    cols={xTicks}
                    horizontal
                    vertical
                />
            </g>

            {/* Y axis ticks + labels */}
            {yTickValues.map((v) => (
                <text
                    key={`y-${v}`}
                    className="scatter-plot__axis-label"
                    x={left - 8}
                    y={yAt(v)}
                    textAnchor="end"
                    dominantBaseline="middle"
                >
                    {Math.round(v)}
                </text>
            ))}

            {/* X axis ticks + labels */}
            {xTickValues.map((v) => (
                <text
                    key={`x-${v}`}
                    className="scatter-plot__axis-label"
                    x={xAt(v)}
                    y={height - AXIS.bottom + 18}
                    textAnchor="middle"
                >
                    {Math.round(v)}
                </text>
            ))}

            {/* Series markers */}
            {series.map((s) => {
                const color = s.color ?? 'var(--primary)';
                return (
                    <g key={s.name}>
                        {s.data.map((p, i) => (
                            <circle
                                // biome-ignore lint/suspicious/noArrayIndexKey: data points have no intrinsic id; their position in the series is the stable identity
                                key={`${s.name}-${i}`}
                                className="scatter-plot__point"
                                cx={xAt(p.x)}
                                cy={yAt(p.y)}
                                r={radius}
                                fill={color}
                            />
                        ))}
                    </g>
                );
            })}
        </svg>
    );
}
