import type { ComponentPropsWithRef, ReactNode } from 'react';
import './styled/button.styled.css';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'soft'
    | 'danger'
    | 'link';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
    /** Visual style of the button. @default 'primary' */
    variant?: ButtonVariant;
    /** Control height — `1rem = 8px`. @default 'medium' */
    size?: ButtonSize;
    /** Element rendered before the label (e.g. an icon). */
    leftIcon?: ReactNode;
    /** Element rendered after the label (e.g. an icon). */
    rightIcon?: ReactNode;
    /** Render as a square, icon-only button (drops horizontal padding). @default false */
    asIcon?: boolean;
};

/**
 * Interactive button styled with MD3 tokens. Forwards all native `<button>`
 * props (including `ref`), and defaults `type` to `"button"`.
 *
 * @example
 * <Button variant="primary" size="large">Launch</Button>
 */
export function Button({
    variant = 'primary',
    size = 'medium',
    leftIcon,
    rightIcon,
    asIcon = false,
    className,
    children,
    type = 'button',
    ...rest
}: ButtonProps) {
    const tokens: string[] = ['button', `button--${variant}`];
    if (size !== 'medium') tokens.push(`button--${size}`);
    if (asIcon) tokens.push('button--icon');
    if (className) tokens.push(className);

    return (
        <button type={type} className={tokens.join(' ')} {...rest}>
            {leftIcon}
            {children}
            {rightIcon}
        </button>
    );
}
