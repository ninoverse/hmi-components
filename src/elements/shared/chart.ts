import { css, type SVGTemplateResult, svg } from 'lit';

/** What the grid needs to know about the plot area. */
export interface CartesianGridOptions {
    /** Grid area width in px. */
    width: number;
    /** Grid area height in px. */
    height: number;
    /** Number of horizontal grid lines, less one: `rows` bands. */
    rows: number;
    /** Number of vertical grid lines, less one: `cols` bands. */
    cols: number;
    /** Inset from each edge, in px. */
    padding: number;
    /** Draw the horizontal lines. */
    horizontal: boolean;
    /** Draw the vertical lines. */
    vertical: boolean;
}

/**
 * The lines of a Cartesian grid, as an SVG `<g>` to place inside a chart's own
 * `<svg>`. The `hmi-cartesian-grid` element and the charts that draw a grid
 * share it. Style the lines with {@link cartesianGridStyles}: an SVG
 * presentation attribute cannot resolve a CSS custom property, so the stroke
 * comes from a class.
 */
export function renderCartesianGrid({
    width,
    height,
    rows,
    cols,
    padding,
    horizontal,
    vertical,
}: CartesianGridOptions): SVGTemplateResult {
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
    return svg`<g class="cartesian-grid">
        ${hLines.map(
            (y) =>
                svg`<line part="grid-line" class="cartesian-grid__line" x1=${left} y1=${y} x2=${right} y2=${y} />`,
        )}
        ${vLines.map(
            (x) =>
                svg`<line part="grid-line" class="cartesian-grid__line" x1=${x} y1=${top} x2=${x} y2=${bottom} />`,
        )}
    </g>`;
}

/** The stroke of the grid lines, for every element that renders them. */
export const cartesianGridStyles = css`
    .cartesian-grid__line {
        stroke: var(--outline-variant);
        stroke-width: 1;
    }
`;
