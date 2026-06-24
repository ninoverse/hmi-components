import type { HTMLAttributes, ReactNode } from 'react';
import './styled/banner.styled.css';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger';

export type BannerProps = HTMLAttributes<HTMLDivElement> & {
    /** Tone, which sets the default icon and ARIA role. @default 'info' */
    variant?: BannerVariant;
    /** Optional bold heading above the message. */
    title?: ReactNode;
    /** Custom leading icon, overriding the variant default. */
    icon?: ReactNode;
    /** Trailing slot for an action (e.g. a button). */
    action?: ReactNode;
    /** When provided, renders a dismiss button that calls this on click. */
    onDismiss?: () => void;
    /** Accessible label for the dismiss button. @default 'Dismiss' */
    dismissLabel?: string;
};

const InfoIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Info</title>
        <circle cx="10" cy="10" r="8" />
        <path d="M10 9v5M10 6.5v.01" />
    </svg>
);

const SuccessIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Success</title>
        <circle cx="10" cy="10" r="8" />
        <path d="M6.5 10l2.5 2.5 4.5-5" />
    </svg>
);

const WarningIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Warning</title>
        <path d="M10 2.5L18 16.5H2L10 2.5z" />
        <path d="M10 8v4M10 14.5v.01" />
    </svg>
);

const DangerIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Error</title>
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4M10 13.5v.01" />
    </svg>
);

const VARIANT_ICONS = {
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon,
    danger: DangerIcon,
} as const;

/**
 * Page-level status banner with a variant icon, optional title/action and an
 * optional dismiss button. `danger`/`warning` use `role="alert"`, others
 * `role="status"`. The body is passed as `children`.
 *
 * @example
 * <Banner variant="success" title="Saved" onDismiss={hide}>All set.</Banner>
 */
export function Banner({
    variant = 'info',
    title,
    icon,
    action,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    ...rest
}: BannerProps) {
    const tokens: string[] = ['banner', `banner--${variant}`];
    if (className) tokens.push(className);
    const VariantIcon = VARIANT_ICONS[variant];
    const role =
        variant === 'danger' || variant === 'warning' ? 'alert' : 'status';

    return (
        <div className={tokens.join(' ')} role={role} {...rest}>
            <span className="banner__icon" aria-hidden="true">
                {icon ?? <VariantIcon />}
            </span>
            <div className="banner__content">
                {title && <p className="banner__title">{title}</p>}
                {children && <p className="banner__body">{children}</p>}
            </div>
            {action && <span className="banner__action">{action}</span>}
            {onDismiss && (
                <button
                    type="button"
                    className="banner__dismiss"
                    aria-label={dismissLabel}
                    onClick={onDismiss}
                >
                    <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <title>Dismiss</title>
                        <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                </button>
            )}
        </div>
    );
}
