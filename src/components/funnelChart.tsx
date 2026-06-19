import './styled/funnelChart.styled.css';

export type FunnelChartStage = {
    /** Stage name shown in the label column. */
    label: string;
    /** Stage magnitude; sets the band width relative to the largest stage. */
    value: number;
    /** Stage colour. Defaults to a palette entry. */
    color?: string;
};

export type FunnelChartProps = {
    /** Ordered stages, top (widest) to bottom. */
    stages: ReadonlyArray<FunnelChartStage>;
    /** SVG width in px. @default 500 */
    width?: number;
    /** SVG height in px. @default 280 */
    height?: number;
    /** Vertical gap between stage bands in px. @default 4 */
    gap?: number;
    /** Width reserved for the right-hand label column in px. @default 180 */
    labelWidth?: number;
    /** Append each stage's value and share of the first stage to its label. @default false */
    showValues?: boolean;
    /** Accessible name for the chart. @default 'Funnel chart' */
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

/** Funnel chart. Stacks centred trapezoid bands that narrow from stage to
 *  stage, so each band's width maps to its value. Stage labels sit in a
 *  right-hand column so they stay legible whatever the band width.
 *  Pure SVG, zero deps. */
export function FunnelChart({
    stages,
    width = 500,
    height = 280,
    gap = 4,
    labelWidth = 180,
    showValues = false,
    'aria-label': ariaLabel = 'Funnel chart',
}: FunnelChartProps) {
    const n = stages.length;
    if (n === 0) return null;

    const peak = Math.max(...stages.map((s) => s.value)) || 1;
    const funnelW = Math.max(0, width - labelWidth);
    const cx = funnelW / 2;
    const bandH = (height - gap * (n - 1)) / n;
    const wAt = (v: number) => (v / peak) * funnelW;

    return (
        <svg
            className="funnel-chart"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel}
        >
            {stages.map((s, i) => {
                const color = s.color ?? PALETTE[i % PALETTE.length];
                const topY = i * (bandH + gap);
                const bottomY = topY + bandH;
                const next = stages[i + 1] ?? s;
                const topW = wAt(s.value);
                const bottomW = wAt(next.value);
                const points = [
                    `${cx - topW / 2},${topY}`,
                    `${cx + topW / 2},${topY}`,
                    `${cx + bottomW / 2},${bottomY}`,
                    `${cx - bottomW / 2},${bottomY}`,
                ].join(' ');
                const share = Math.round((s.value / peak) * 100);
                return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: stages have no intrinsic id; their position in the funnel is the stable identity
                    <g key={`${s.label}-${i}`}>
                        <polygon
                            className="funnel-chart__band"
                            points={points}
                            fill={color}
                        />
                        <text
                            className="funnel-chart__label"
                            x={funnelW + 12}
                            y={topY + bandH / 2}
                            textAnchor="start"
                            dominantBaseline="middle"
                        >
                            {showValues
                                ? `${s.label} · ${s.value} (${share}%)`
                                : s.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
