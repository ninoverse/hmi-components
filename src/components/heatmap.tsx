import './styled/heatmap.styled.css';

export type HeatmapProps = {
    /** Row-major matrix of values; each inner array is one row. */
    data: ReadonlyArray<ReadonlyArray<number>>;
    /** Column (x-axis) labels; length should match the row length. */
    xLabels?: ReadonlyArray<string>;
    /** Row (y-axis) labels; length should match the number of rows. */
    yLabels?: ReadonlyArray<string>;
    /** Base cell colour; intensity is mapped to its opacity. */
    color?: string;
    /** Override the value range; defaults to the data extent. */
    min?: number;
    /** Upper bound of the value range. Defaults to the data max. */
    max?: number;
    /** Cell edge length in px. @default 40 */
    cellSize?: number;
    /** Gap between cells in px. @default 4 */
    gap?: number;
    /** Print each cell's value at its centre. @default false */
    showValues?: boolean;
    /** Accessible name for the chart. @default 'Heatmap' */
    'aria-label'?: string;
};

const Y_AXIS = 64;
const X_AXIS = 24;

/** Matrix heatmap. Renders a grid of cells whose colour intensity (opacity)
 *  maps to each value, with optional row/column labels. Pure SVG, zero deps. */
export function Heatmap({
    data,
    xLabels,
    yLabels,
    color = 'var(--primary)',
    min,
    max,
    cellSize = 40,
    gap = 4,
    showValues = false,
    'aria-label': ariaLabel = 'Heatmap',
}: HeatmapProps) {
    const rows = data.length;
    const cols = Math.max(0, ...data.map((r) => r.length));
    if (rows === 0 || cols === 0) return null;

    const values = data.flat();
    const lo = min ?? Math.min(...values);
    const hi = max ?? Math.max(...values);
    const span = hi - lo || 1;

    const step = cellSize + gap;
    const left = yLabels ? Y_AXIS : 0;
    const top = 0;
    const width = left + cols * step - gap;
    const height = top + rows * step - gap + (xLabels ? X_AXIS : 0);

    return (
        <svg
            className="heatmap"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel}
        >
            {/* Row (y) labels */}
            {yLabels?.map((label, r) => (
                <text
                    // biome-ignore lint/suspicious/noArrayIndexKey: rows have no intrinsic id; their position in the matrix is the stable identity
                    key={`y-${r}`}
                    className="heatmap__axis-label"
                    x={left - 8}
                    y={top + r * step + cellSize / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                >
                    {label}
                </text>
            ))}

            {/* Column (x) labels */}
            {xLabels?.map((label, c) => (
                <text
                    // biome-ignore lint/suspicious/noArrayIndexKey: columns have no intrinsic id; their position in the matrix is the stable identity
                    key={`x-${c}`}
                    className="heatmap__axis-label"
                    x={left + c * step + cellSize / 2}
                    y={top + rows * step - gap + 16}
                    textAnchor="middle"
                >
                    {label}
                </text>
            ))}

            {/* Cells */}
            {data.map((row, r) =>
                row.map((v, c) => (
                    <g
                        // biome-ignore lint/suspicious/noArrayIndexKey: matrix cells have no intrinsic id; their (row, col) position is the stable identity
                        key={`${r}-${c}`}
                    >
                        <rect
                            className="heatmap__cell"
                            x={left + c * step}
                            y={top + r * step}
                            width={cellSize}
                            height={cellSize}
                            rx={4}
                            fill={color}
                            fillOpacity={0.12 + 0.88 * ((v - lo) / span)}
                        />
                        {showValues && (
                            <text
                                className="heatmap__value"
                                x={left + c * step + cellSize / 2}
                                y={top + r * step + cellSize / 2}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {v}
                            </text>
                        )}
                    </g>
                )),
            )}
        </svg>
    );
}
