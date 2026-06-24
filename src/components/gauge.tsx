import type { ReactNode } from 'react';
import './styled/gauge.styled.css';

export type GaugeProps = {
    /** Current value, clamped to `[min, max]`. */
    value: number;
    /** Lower bound of the scale. @default 0 */
    min?: number;
    /** Upper bound of the scale. @default 100 */
    max?: number;
    /** Arc colour. Defaults to the primary token. */
    color?: string;
    /** Track (unfilled arc) colour. */
    trackColor?: string;
    /** Thickness of the arc as a fraction of the radius (0..1). @default 0.22 */
    thickness?: number;
    /** SVG width in px (height is derived). @default 200 */
    size?: number;
    /** Content shown below the dial (e.g. the value). Defaults to the value. */
    label?: ReactNode;
    /** Accessible name. Defaults to `'Gauge: {value} of {max}'`. */
    'aria-label'?: string;
};

// Point on a circle (degrees, 0 = 3 o'clock, counter-clockwise positive in
// screen space we negate y). For a 180° gauge we sweep 180°→0°.
const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)] as const;
};

// Arc path from startDeg to endDeg (both measured from the +x axis, CCW).
const arcPath = (
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number,
) => {
    const [x1, y1] = polar(cx, cy, r, startDeg);
    const [x2, y2] = polar(cx, cy, r, endDeg);
    const large = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
    // Sweeping from 180° down to 0° is clockwise on screen (sweep-flag 1).
    return `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`;
};

/** Semicircular gauge dial. A value arc fills a 180° track from left to right;
 *  an optional label sits beneath. Pure SVG arc math, zero deps. */
export function Gauge({
    value,
    min = 0,
    max = 100,
    color = 'var(--primary)',
    trackColor = 'var(--surface-container-highest)',
    thickness = 0.22,
    size = 200,
    label,
    'aria-label': ariaLabel,
}: GaugeProps) {
    const span = max - min || 1;
    const frac = Math.max(0, Math.min((value - min) / span, 1));

    const cx = size / 2;
    const r = size / 2 - 4;
    const cy = r + 4; // baseline of the semicircle
    const stroke = r * thickness;
    const innerR = r - stroke / 2;

    // 180° (left) → 0° (right). Value angle interpolates across that sweep.
    const valueDeg = 180 - frac * 180;

    const height = cy + stroke / 2 + 4;

    return (
        <svg
            className="gauge"
            width={size}
            height={height + (label != null ? 36 : 0)}
            viewBox={`0 0 ${size} ${height + (label != null ? 36 : 0)}`}
            role="img"
            aria-label={ariaLabel ?? `Gauge: ${value} of ${max}`}
        >
            <path
                className="gauge__track"
                d={arcPath(cx, cy, innerR, 180, 0)}
                fill="none"
                stroke={trackColor}
                strokeWidth={stroke}
                strokeLinecap="round"
            />
            {frac > 0 && (
                <path
                    className="gauge__value"
                    d={arcPath(cx, cy, innerR, 180, valueDeg)}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />
            )}
            {label != null && (
                <text
                    className="gauge__label"
                    x={cx}
                    y={cy + 26}
                    textAnchor="middle"
                >
                    {label}
                </text>
            )}
        </svg>
    );
}
