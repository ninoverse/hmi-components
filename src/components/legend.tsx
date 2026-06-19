import type { HTMLAttributes, ReactNode } from 'react';
import './styled/legend.styled.css';

export type LegendItem = {
    /** Series name shown beside the swatch. */
    label: ReactNode;
    /** Series colour — consumer data (e.g. a chart palette entry). */
    color: string;
    /** Render the swatch as a hollow ring instead of a filled square. */
    inactive?: boolean;
};

export type LegendAlign = 'start' | 'center' | 'end';

export type LegendProps = HTMLAttributes<HTMLUListElement> & {
    /** Series entries to list. */
    items: ReadonlyArray<LegendItem>;
    /** Horizontal alignment of the row. @default 'center' */
    align?: LegendAlign;
};

/** Chart legend: a horizontal row of colour swatches with series labels.
 *  Swatch colours come from consumer data; surrounding chrome is tokenised. */
export function Legend({
    items,
    align = 'center',
    className,
    ...rest
}: LegendProps) {
    const tokens: string[] = ['legend'];
    if (className) tokens.push(className);

    return (
        <ul className={tokens.join(' ')} data-align={align} {...rest}>
            {items.map((item, index) => {
                const itemKey =
                    typeof item.label === 'string'
                        ? item.label
                        : `item-${index}`;
                return (
                    <li className="legend__item" key={itemKey}>
                        <span
                            className="legend__swatch"
                            data-inactive={item.inactive || undefined}
                            style={{ color: item.color }}
                        />
                        <span className="legend__label">{item.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}
