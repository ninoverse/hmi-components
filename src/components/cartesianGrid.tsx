import './styled/cartesianGrid.styled.css';

export type CartesianGridProps = {
    /** Grid area width in px. */
    width: number;
    /** Grid area height in px. */
    height: number;
    /** Number of horizontal grid lines (inclusive of the edges). */
    rows?: number;
    /** Number of vertical grid lines (inclusive of the edges). */
    cols?: number;
    /** Inset from each edge, in px. */
    padding?: number;
    /** Draw horizontal lines. */
    horizontal?: boolean;
    /** Draw vertical lines. */
    vertical?: boolean;
};

/** SVG grid for a Cartesian chart area. Renders a `<g>` of evenly spaced
 *  lines and is meant to be placed inside a chart's own `<svg>`. */
export function CartesianGrid({
    width,
    height,
    rows = 4,
    cols = 4,
    padding = 0,
    horizontal = true,
    vertical = true,
}: CartesianGridProps) {
    const left = padding;
    const right = width - padding;
    const top = padding;
    const bottom = height - padding;
    const innerW = right - left;
    const innerH = bottom - top;

    const hLines = horizontal
        ? Array.from({ length: rows + 1 }, (_, i) => top + (innerH * i) / rows)
        : [];
    const vLines = vertical
        ? Array.from({ length: cols + 1 }, (_, i) => left + (innerW * i) / cols)
        : [];

    return (
        <g className="cartesian-grid">
            {hLines.map((y) => (
                <line
                    key={`h-${y}`}
                    className="cartesian-grid__line"
                    x1={left}
                    y1={y}
                    x2={right}
                    y2={y}
                />
            ))}
            {vLines.map((x) => (
                <line
                    key={`v-${x}`}
                    className="cartesian-grid__line"
                    x1={x}
                    y1={top}
                    x2={x}
                    y2={bottom}
                />
            ))}
        </g>
    );
}
