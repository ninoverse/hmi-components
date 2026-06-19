import type { HTMLAttributes, ReactNode } from 'react';
import './styled/formControl.styled.css';

export type FormControlProps = HTMLAttributes<HTMLDivElement> & {
    /** Field label above the control. */
    label?: ReactNode;
    /** Helper text below the control; hidden when `error` is set. */
    hint?: ReactNode;
    /** Error message below the control; takes precedence over `hint`. */
    error?: ReactNode;
};

/**
 * Wrapper that adds a label and a hint/error message around any form control
 * passed as `children`.
 *
 * @example
 * <FormControl label="Email" error={err}><Input /></FormControl>
 */
export function FormControl({
    label,
    hint,
    error,
    className,
    children,
    ...rest
}: FormControlProps) {
    const tokens: string[] = ['form-control'];
    if (className) tokens.push(className);
    const message = error ?? hint;

    return (
        <div className={tokens.join(' ')} {...rest}>
            {label && <span className="form-control__label">{label}</span>}
            {children}
            {message && (
                <span
                    className={
                        error
                            ? 'form-control__hint form-control__hint--error'
                            : 'form-control__hint'
                    }
                >
                    {message}
                </span>
            )}
        </div>
    );
}
