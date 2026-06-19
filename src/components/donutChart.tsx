import type { ReactNode } from 'react';
import './styled/donutChart.styled.css';

export type DonutChartSegment = {
    /** Segment name (used as the React key). */
    label: string;
    /** Segment magnitude; its share of the total sets the arc size. */
    value: number;
    /** Segment colour. Falls back to a token from the default palette. */
    color?: string;
};

export type DonutChartProps = {
    /** Segments to render around the ring. */
    segments: ReadonlyArray<DonutChartSegment>;
    /** SVG width/height in px. @default 220 */
    size?: number;
    /** Ring thickness as a fraction of the radius (0..1). @default 0.32 */
    thickness?: number;
    /** Gap between segments, in degrees. @default 2 */
    gap?: number;
    /** Content shown in the centre hole (e.g. a total). */
    centerLabel?: ReactNode;
    /** Accessible name for the chart. @default 'Donut chart' */
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

// Point on a circle for a given angle (degrees, 0 = 12 o'clock, clockwise).
const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
};

/** Donut (ring) chart. Each segment is an SVG arc sized by its share of the
 *  total, with a hole in the centre for an optional summary label. Pure SVG
 *  arc math, zero deps, tokens-driven palette. */
export function DonutChart({
    segments,
    size = 220,
    thickness = 0.32,
    gap = 2,
    centerLabel,
    'aria-label': ariaLabel = 'Donut chart',
}: DonutChartProps) {
    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
    if (segments.length === 0 || total <= 0) return null;

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 2;
    const innerR = r * (1 - thickness);

    let cursor = 0;
    const arcs = segments.map((s, i) => {
        const frac = Math.max(0, s.value) / total;
        const sweep = frac * 360;
        // Single full-circle segment can't be drawn as one arc; nudge it.
        const start = cursor + gap / 2;
        const end = cursor + sweep - gap / 2;
        cursor += sweep;
        const color = s.color ?? PALETTE[i % PALETTE.length];
        const large = end - start > 180 ? 1 : 0;
        const [ox1, oy1] = polar(cx, cy, r, start);
        const [ox2, oy2] = polar(cx, cy, r, end);
        const [ix2, iy2] = polar(cx, cy, innerR, end);
        const [ix1, iy1] = polar(cx, cy, innerR, start);
        const d = [
            `M${ox1},${oy1}`,
            `A${r},${r} 0 ${large} 1 ${ox2},${oy2}`,
            `L${ix2},${iy2}`,
            `A${innerR},${innerR} 0 ${large} 0 ${ix1},${iy1}`,
            'Z',
        ].join(' ');
        return { d, color, key: s.label };
    });

    return (
        <svg
            className="donut-chart"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={ariaLabel}
        >
            {arcs.map((a) => (
                <path
                    key={a.key}
                    className="donut-chart__segment"
                    d={a.d}
                    fill={a.color}
                />
            ))}
            {centerLabel != null && (
                <foreignObject
                    x={cx - innerR}
                    y={cy - innerR}
                    width={innerR * 2}
                    height={innerR * 2}
                >
                    <div className="donut-chart__center">{centerLabel}</div>
                </foreignObject>
            )}
        </svg>
    );
}
