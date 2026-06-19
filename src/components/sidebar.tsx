import type { HTMLAttributes, ReactNode } from 'react';
import { Badge, type BadgeVariant } from './badge';
import './styled/sidebar.styled.css';

export type SidebarItem<T extends string = string> = {
    /** Unique value, emitted via `onNav` and matched against `current`. */
    value: T;
    /** Visible item label. */
    label: ReactNode;
    /** Optional leading icon. */
    icon?: ReactNode;
    /** Link target; when omitted, navigation is handled via `onNav` only. */
    href?: string;
    /** Optional trailing {@link Badge} content. */
    badge?: ReactNode;
    /** Variant for the trailing badge. @default 'default' */
    badgeVariant?: BadgeVariant;
};

export type SidebarGroup<T extends string = string> = {
    /** Optional group heading. */
    label?: ReactNode;
    /** Items in this group. */
    items: ReadonlyArray<SidebarItem<T>>;
};

export type SidebarProps<T extends string = string> =
    HTMLAttributes<HTMLElement> & {
        /** Grouped navigation items. */
        groups: ReadonlyArray<SidebarGroup<T>>;
        /** Value of the active item, marked `aria-current="page"`. */
        current?: T;
        /** Fires with an item's `value` when it is activated. */
        onNav?: (value: T) => void;
    };

/**
 * Vertical side navigation with grouped, optionally-badged links and an active
 * state.
 *
 * @example
 * <Sidebar groups={groups} current={page} onNav={setPage} />
 */
export function Sidebar<T extends string = string>({
    groups,
    current,
    onNav,
    className,
    'aria-label': ariaLabel = 'Sidebar',
    ...rest
}: SidebarProps<T>) {
    const tokens: string[] = ['sidebar'];
    if (className) tokens.push(className);

    return (
        <aside className={tokens.join(' ')} aria-label={ariaLabel} {...rest}>
            {groups.map((group, groupIndex) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: groups are a stable, ordered configuration prop
                    key={groupIndex}
                    className="sidebar__group"
                >
                    {group.label && (
                        <div className="sidebar__label">{group.label}</div>
                    )}
                    {group.items.map((item) => {
                        const isActive = current === item.value;
                        return (
                            <a
                                key={item.value}
                                href={item.href ?? '#'}
                                className="sidebar__link"
                                data-active={isActive}
                                {...(isActive
                                    ? { 'aria-current': 'page' }
                                    : {})}
                                onClick={(event) => {
                                    if (!item.href) {
                                        event.preventDefault();
                                    }
                                    onNav?.(item.value);
                                }}
                            >
                                {item.icon && (
                                    <span className="sidebar__icon">
                                        {item.icon}
                                    </span>
                                )}
                                <span className="sidebar__label-text">
                                    {item.label}
                                </span>
                                {item.badge != null && (
                                    <Badge
                                        variant={item.badgeVariant ?? 'default'}
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                            </a>
                        );
                    })}
                </div>
            ))}
        </aside>
    );
}
