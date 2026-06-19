import type { HTMLAttributes, ReactNode } from 'react';
import './styled/timeline.styled.css';

export type TimelineColor =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error';

export type TimelineItem = {
    /** Event title. */
    title: ReactNode;
    /** Optional supporting text under the title. */
    description?: ReactNode;
    /** Optional timestamp shown beside the title. */
    time?: ReactNode;
    /** Optional icon shown in the marker. */
    icon?: ReactNode;
    /** Marker colour. @default 'default' */
    color?: TimelineColor;
};

export type TimelineProps = HTMLAttributes<HTMLOListElement> & {
    /** Events in chronological order. */
    items: ReadonlyArray<TimelineItem>;
};

/**
 * Vertical timeline of events, each with a colour-coded marker, title and
 * optional time/description.
 *
 * @example
 * <Timeline items={[{ title: 'Deployed', time: '2m ago', color: 'success' }]} />
 */
export function Timeline({ items, className, ...rest }: TimelineProps) {
    const tokens: string[] = ['timeline'];
    if (className) tokens.push(className);

    return (
        <ol className={tokens.join(' ')} {...rest}>
            {items.map((item, index) => {
                const itemKey =
                    typeof item.title === 'string'
                        ? item.title
                        : `item-${index}`;
                return (
                    <li
                        key={itemKey}
                        className="timeline__item"
                        data-color={item.color ?? 'default'}
                    >
                        <div className="timeline__marker">
                            {item.icon && (
                                <span className="timeline__icon">
                                    {item.icon}
                                </span>
                            )}
                        </div>
                        <div className="timeline__body">
                            <div className="timeline__head">
                                <span className="timeline__title">
                                    {item.title}
                                </span>
                                {item.time != null && (
                                    <span className="timeline__time">
                                        {item.time}
                                    </span>
                                )}
                            </div>
                            {item.description != null && (
                                <div className="timeline__desc">
                                    {item.description}
                                </div>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
