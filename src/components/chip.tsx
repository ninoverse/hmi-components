import type { HTMLAttributes, ReactNode } from 'react';
import './styled/chip.styled.css';

export type ChipProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
    /** Selected (pressed) state. @default false */
    selected?: boolean;
    /** Optional leading icon. */
    icon?: ReactNode;
    /** When set, the chip becomes a toggle button calling this on click. */
    onSelect?: () => void;
    /** When set, renders a trailing remove button calling this on click. */
    onClose?: () => void;
};

const CloseIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Remove</title>
        <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
);

/**
 * Compact tag/filter element. Becomes an interactive toggle when `onSelect` is
 * set, and gains a remove button when `onClose` is set.
 *
 * @example
 * <Chip selected onSelect={toggle} onClose={remove}>Filter</Chip>
 */
export function Chip({
    selected = false,
    icon,
    onSelect,
    onClose,
    className,
    children,
    ...rest
}: ChipProps) {
    const tokens: string[] = ['chip'];
    if (selected) tokens.push('chip--selected');
    if (onSelect) tokens.push('chip--interactive');
    if (className) tokens.push(className);

    const content = (
        <>
            {icon && <span className="chip__icon">{icon}</span>}
            <span className="chip__label">{children}</span>
        </>
    );

    return (
        <div className={tokens.join(' ')} data-selected={selected} {...rest}>
            {onSelect ? (
                <button
                    type="button"
                    className="chip__toggle"
                    aria-pressed={selected}
                    onClick={onSelect}
                >
                    {content}
                </button>
            ) : (
                <span className="chip__toggle">{content}</span>
            )}
            {onClose && (
                <button
                    type="button"
                    className="chip__close"
                    aria-label="Remove"
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>
            )}
        </div>
    );
}
