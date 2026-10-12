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

/** The default colours of the charts that colour per item, cycled by index. */
const PALETTE = [
    'var(--primary)',
    'var(--tertiary)',
    'var(--secondary)',
    'var(--success)',
    'var(--warning)',
    'var(--error)',
] as const;

/** The default colour of the item at `index`: the palette repeats past six. */
export function paletteColor(index: number): string {
    return PALETTE[index % PALETTE.length] ?? 'var(--primary)';
}

/** Space the Cartesian charts leave around the plot area, in px. */
export const AXIS = { left: 44, bottom: 28, top: 12, right: 12 } as const;

/** One series of a category chart: a value per category. */
export interface CategorySeries {
    /** The series name. */
    name: string;
    /** One value per category. */
    data: readonly number[];
    /** The series colour: any CSS colour, including a token such as `var(--primary)`. @default 'var(--primary)' */
    color?: string;
}

/** The smallest and largest of `values`, without spreading them into a call. */
export function extent(values: readonly number[]): [number, number] {
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const value of values) {
        if (value < lo) lo = value;
        if (value > hi) hi = value;
    }
    return [lo, hi];
}

/** `ticks + 1` values from `lo` upward, evenly spaced across `span`. */
export function tickValues(lo: number, span: number, ticks: number): number[] {
    return Array.from({ length: ticks + 1 }, (_, i) => lo + (span * i) / ticks);
}

/** The geometry a category chart is drawn in. */
export interface CategoryScale {
    /** The longest series: how many categories there are. */
    count: number;
    /** Plot area width, in px. */
    plotW: number;
    /** Plot area height, in px. */
    plotH: number;
    /** Left edge of the plot area, in px. */
    left: number;
    /** Top edge of the plot area, in px. */
    top: number;
    /** Lower end of the value range. */
    lo: number;
    /** Upper end of the value range. */
    hi: number;
    /** `hi - lo`, or 1 for a flat range. */
    span: number;
    /** The y coordinate of a value. */
    yAt: (value: number) => number;
    /** The y-axis tick values, from `lo` to `hi`. */
    yTickValues: number[];
}

export interface CategoryScaleOptions {
    series: readonly CategorySeries[];
    width: number;
    height: number;
    /** Lower end of the range; defaults to 0, or the smallest value if lower. */
    min: number | undefined;
    /** Upper end of the range; defaults to the largest value. */
    max: number | undefined;
    yTicks: number;
}

/**
 * The scale of a chart that plots one value per category: line, area and bar.
 * `undefined` when there is nothing to plot, so the chart renders nothing.
 */
export function categoryScale({
    series,
    width,
    height,
    min,
    max,
    yTicks,
}: CategoryScaleOptions): CategoryScale | undefined {
    let count = 0;
    for (const s of series) count = Math.max(count, s.data.length);
    if (series.length === 0 || count === 0) return undefined;
    const plotW = width - AXIS.left - AXIS.right;
    const plotH = height - AXIS.top - AXIS.bottom;
    const [dataLo, dataHi] = extent(series.flatMap((s) => s.data));
    const lo = min ?? Math.min(0, dataLo);
    const hi = max ?? dataHi;
    const span = hi - lo || 1;
    return {
        count,
        plotW,
        plotH,
        left: AXIS.left,
        top: AXIS.top,
        lo,
        hi,
        span,
        yAt: (value) => AXIS.top + plotH - ((value - lo) / span) * plotH,
        yTickValues: tickValues(lo, span, yTicks),
    };
}

/** The y-axis tick labels, right-aligned against the plot area. */
export function renderYAxisLabels(
    values: readonly number[],
    yAt: (value: number) => number,
    left: number,
): SVGTemplateResult[] {
    return values.map(
        (v) =>
            svg`<text part="axis-label" class="axis-label" x=${left - 8} y=${yAt(v)} text-anchor="end" dominant-baseline="middle">${Math.round(v)}</text>`,
    );
}

/** The x-axis labels, each centred on its x coordinate, under the plot area. */
export function renderXAxisLabels(
    items: readonly { x: number; text: string | number }[],
    height: number,
): SVGTemplateResult[] {
    return items.map(
        ({ x, text }) =>
            svg`<text part="axis-label" class="axis-label" x=${x} y=${height - AXIS.bottom + 18} text-anchor="middle">${text}</text>`,
    );
}

/**
 * What every chart's SVG shares: it fits its container's width, and the axis
 * labels use the display font and a quiet token colour.
 */
export const chartStyles = css`
    :host {
        display: block;
    }

    .chart {
        display: block;
        max-width: 100%;
        height: auto;
    }

    .axis-label {
        fill: var(--on-surface-variant);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.25);
    }
`;
