import type { HTMLAttributes, ReactNode } from 'react';
import './styled/alert.styled.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
    /** Tone, which also selects the leading status icon. @default 'info' */
    variant?: AlertVariant;
    /** Optional bold heading above the message. */
    title?: ReactNode;
    /** Trailing slot for an action (e.g. a button or dismiss control). */
    action?: ReactNode;
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
 * Inline message with a variant-matched icon, optional title and trailing
 * action. The body is passed as `children`.
 *
 * @example
 * <Alert variant="warning" title="Heads up">Disk almost full.</Alert>
 */
export function Alert({
    variant = 'info',
    title,
    action,
    className,
    children,
    ...rest
}: AlertProps) {
    const tokens: string[] = ['alert', `alert--${variant}`];
    if (className) tokens.push(className);
    const Icon = VARIANT_ICONS[variant];

    return (
        <div className={tokens.join(' ')} {...rest}>
            <span className="alert__icon">
                <Icon />
            </span>
            <div className="alert__content">
                {title && <p className="alert__title">{title}</p>}
                {children && <p className="alert__body">{children}</p>}
            </div>
            {action && <span className="alert__action">{action}</span>}
        </div>
    );
}
