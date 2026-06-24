import type { HTMLAttributes, ReactNode } from 'react';
import './styled/chartTooltip.styled.css';

export type ChartTooltipItem = {
    /** Row label (e.g. the series name). */
    label: ReactNode;
    /** Row value at the hovered point. */
    value: ReactNode;
    /** Series colour — consumer data (e.g. a chart palette entry). */
    color?: string;
};

export type ChartTooltipProps = HTMLAttributes<HTMLDivElement> & {
    /** Optional heading (e.g. the hovered category/x value). */
    title?: ReactNode;
    /** One row per series at the hovered point. */
    items: ReadonlyArray<ChartTooltipItem>;
};

/** Presentational tooltip card for charts: a title and one colour-swatched
 *  row per series. Charts position it (absolute/fixed) on hover; this
 *  component only renders the content. */
export function ChartTooltip({
    title,
    items,
    className,
    ...rest
}: ChartTooltipProps) {
    const tokens: string[] = ['chart-tooltip'];
    if (className) tokens.push(className);

    return (
        <div className={tokens.join(' ')} role="tooltip" {...rest}>
            {title != null && (
                <div className="chart-tooltip__title">{title}</div>
            )}
            <ul className="chart-tooltip__list">
                {items.map((item, index) => {
                    const itemKey =
                        typeof item.label === 'string'
                            ? item.label
                            : `item-${index}`;
                    return (
                        <li className="chart-tooltip__row" key={itemKey}>
                            {item.color != null && (
                                <span
                                    className="chart-tooltip__swatch"
                                    style={{ color: item.color }}
                                />
                            )}
                            <span className="chart-tooltip__label">
                                {item.label}
                            </span>
                            <span className="chart-tooltip__value">
                                {item.value}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
