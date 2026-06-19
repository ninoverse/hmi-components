import type { ComponentPropsWithRef, HTMLAttributes, ReactNode } from 'react';
import './styled/menu.styled.css';

export type MenuProps = HTMLAttributes<HTMLDivElement>;

/**
 * Menu container holding {@link MenuItem}, {@link MenuSeparator} and
 * {@link MenuLabel} children. Pair with {@link Popover}/{@link ContextMenu} for
 * dropdown/right-click menus.
 *
 * @example
 * <Menu><MenuItem>Edit</MenuItem><MenuSeparator /><MenuItem danger>Delete</MenuItem></Menu>
 */
export function Menu({ className, children, ...rest }: MenuProps) {
    const tokens: string[] = ['menu'];
    if (className) tokens.push(className);
    return (
        <div className={tokens.join(' ')} {...rest}>
            {children}
        </div>
    );
}

export type MenuItemProps = ComponentPropsWithRef<'button'> & {
    /** Leading icon. */
    icon?: ReactNode;
    /** Trailing hint (e.g. a keyboard shortcut). */
    shortcut?: ReactNode;
    /** Style as a destructive action. @default false */
    danger?: boolean;
};

/** Activatable menu row. Forwards native `<button>` props. */
export function MenuItem({
    icon,
    shortcut,
    danger = false,
    className,
    children,
    type = 'button',
    ref,
    ...rest
}: MenuItemProps) {
    const tokens: string[] = ['menu__item'];
    if (danger) tokens.push('menu__item--danger');
    if (className) tokens.push(className);
    return (
        <button ref={ref} type={type} className={tokens.join(' ')} {...rest}>
            {icon && <span className="menu__item-icon">{icon}</span>}
            <span className="menu__item-label">{children}</span>
            {shortcut && (
                <span className="menu__item-shortcut">{shortcut}</span>
            )}
        </button>
    );
}

export type MenuSeparatorProps = HTMLAttributes<HTMLHRElement>;

/** Horizontal divider between groups of menu items. */
export function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
    const tokens: string[] = ['menu__sep'];
    if (className) tokens.push(className);
    return <hr className={tokens.join(' ')} {...rest} />;
}

export type MenuLabelProps = HTMLAttributes<HTMLDivElement>;

/** Non-interactive group heading within a menu. */
export function MenuLabel({ className, children, ...rest }: MenuLabelProps) {
    const tokens: string[] = ['menu__label'];
    if (className) tokens.push(className);
    return (
        <div className={tokens.join(' ')} {...rest}>
            {children}
        </div>
    );
}
