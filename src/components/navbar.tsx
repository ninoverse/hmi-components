import { type HTMLAttributes, type ReactNode, useId, useState } from 'react';
import './styled/navbar.styled.css';

export type NavbarLink<T extends string = string> = {
    value: T;
    label: ReactNode;
    href?: string;
};

export type NavbarProps<T extends string = string> =
    HTMLAttributes<HTMLElement> & {
        brand?: ReactNode;
        links?: ReadonlyArray<NavbarLink<T>>;
        current?: T;
        onNav?: (value: T) => void;
        right?: ReactNode;
    };

const MenuIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Open menu</title>
        <path d="M2 4h12M2 8h12M2 12h12" />
    </svg>
);

const CloseIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Close menu</title>
        <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
);

export function Navbar<T extends string = string>({
    brand,
    links,
    current,
    onNav,
    right,
    className,
    'aria-label': ariaLabel = 'Main',
    ...rest
}: NavbarProps<T>) {
    const menuId = useId();
    const [menuOpen, setMenuOpen] = useState(false);

    const hasLinks = !!links && links.length > 0;
    const collapsible = hasLinks || right !== undefined;

    const tokens: string[] = ['navbar'];
    if (className) tokens.push(className);

    return (
        <nav
            className={tokens.join(' ')}
            aria-label={ariaLabel}
            data-menu-open={menuOpen}
            {...rest}
        >
            {brand !== undefined && (
                <span className="navbar__brand">
                    {typeof brand === 'string' ? (
                        <>
                            <span
                                className="navbar__brand-mark"
                                aria-hidden="true"
                            >
                                {brand.charAt(0).toLowerCase() || 'n'}
                            </span>
                            <span>{brand}</span>
                        </>
                    ) : (
                        brand
                    )}
                </span>
            )}
            {collapsible && (
                <button
                    type="button"
                    className="navbar__toggle"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    aria-controls={menuId}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            )}
            {collapsible && (
                <div
                    className="navbar__collapse"
                    id={menuId}
                    data-open={menuOpen}
                >
                    {hasLinks && (
                        <div className="navbar__links">
                            {links.map((link) => (
                                <a
                                    key={link.value}
                                    href={link.href ?? '#'}
                                    className="navbar__link"
                                    data-active={current === link.value}
                                    {...(current === link.value
                                        ? { 'aria-current': 'page' }
                                        : {})}
                                    onClick={(event) => {
                                        if (!link.href) {
                                            event.preventDefault();
                                        }
                                        onNav?.(link.value);
                                        setMenuOpen(false);
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                    {right && <div className="navbar__cta">{right}</div>}
                </div>
            )}
        </nav>
    );
}
