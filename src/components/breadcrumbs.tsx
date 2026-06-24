import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import './styled/breadcrumbs.styled.css';

export type BreadcrumbItem = {
    /** Visible crumb text. */
    label: ReactNode;
    /** Link target. Ignored on the last (current) item. */
    href?: string;
    /** Click handler; when set, default navigation is prevented. */
    onClick?: () => void;
};

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
    /** Trail of crumbs; the last item is rendered as the current page. */
    items: ReadonlyArray<BreadcrumbItem>;
    /** Separator between crumbs. @default '/' */
    separator?: ReactNode;
};

/**
 * Navigation breadcrumb trail. The final item is marked `aria-current="page"`.
 *
 * @example
 * <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />
 */
export function Breadcrumbs({
    items,
    separator = '/',
    className,
    'aria-label': ariaLabel = 'Breadcrumb',
    ...rest
}: BreadcrumbsProps) {
    const tokens: string[] = ['crumbs'];
    if (className) tokens.push(className);

    return (
        <nav className={tokens.join(' ')} aria-label={ariaLabel} {...rest}>
            <ol className="crumbs__list">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li
                            // biome-ignore lint/suspicious/noArrayIndexKey: items array is the stable identity at this layer
                            key={i}
                            className="crumbs__item"
                        >
                            {isLast ? (
                                <span
                                    className="crumbs__current"
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <a
                                    className="crumbs__link"
                                    href={item.href ?? '#'}
                                    onClick={(
                                        event: MouseEvent<HTMLAnchorElement>,
                                    ) => {
                                        if (item.onClick) {
                                            event.preventDefault();
                                            item.onClick();
                                        }
                                    }}
                                >
                                    {item.label}
                                </a>
                            )}
                            {!isLast && (
                                <span
                                    aria-hidden="true"
                                    className="crumbs__sep"
                                >
                                    {separator}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
