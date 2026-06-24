import type { HTMLAttributes, ReactNode } from 'react';
import './styled/emptyState.styled.css';

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
    /** Optional decorative illustration/icon. */
    icon?: ReactNode;
    /** Primary heading. */
    title: ReactNode;
    /** Supporting text under the title. */
    description?: ReactNode;
    /** Call-to-action slot (e.g. a button). */
    action?: ReactNode;
};

/**
 * Placeholder shown when there's no content yet — an optional icon, a title,
 * description and an action.
 *
 * @example
 * <EmptyState title="No results" description="Try another search."
 *     action={<Button>Reset</Button>} />
 */
export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
    ...rest
}: EmptyStateProps) {
    const tokens: string[] = ['empty-state'];
    if (className) tokens.push(className);
    return (
        <div className={tokens.join(' ')} {...rest}>
            {icon && (
                <div className="empty-state__icon" aria-hidden="true">
                    {icon}
                </div>
            )}
            <h3 className="empty-state__title">{title}</h3>
            {description && (
                <p className="empty-state__description">{description}</p>
            )}
            {action && <div className="empty-state__action">{action}</div>}
        </div>
    );
}
