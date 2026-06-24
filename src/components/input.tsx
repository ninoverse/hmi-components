import type { ComponentPropsWithRef, ReactNode } from 'react';
import { useControlledTextCaret } from '../lib/controlledTextCaret.utility';
import './styled/input.styled.css';

export type InputProps = Omit<
    ComponentPropsWithRef<'input'>,
    'value' | 'defaultValue' | 'onChange'
> & {
    /** Icon rendered inside the field, before the text. */
    leftIcon?: ReactNode;
    /** Icon rendered inside the field, after the text. */
    rightIcon?: ReactNode;
    /** Apply error styling. @default false */
    error?: boolean;
    /** Controlled value. Provide with `onChange`. */
    value?: string;
    /** Initial value when uncontrolled. */
    defaultValue?: string;
    /** Fires with the new string value on input. */
    onChange?: (value: string) => void;
};

/**
 * Single-line text field with optional leading/trailing icons and an error
 * state. `onChange` is simplified to receive the string value; caret position
 * is preserved when controlled.
 *
 * @example
 * <Input value={q} onChange={setQ} leftIcon={<SearchIcon />} />
 */
export function Input({
    leftIcon,
    rightIcon,
    error = false,
    className,
    ref,
    onChange,
    value,
    ...rest
}: InputProps) {
    const tokens: string[] = ['input'];
    if (error) tokens.push('input--error');
    if (className) tokens.push(className);

    const caret = useControlledTextCaret<HTMLInputElement>(value, ref);

    return (
        <span className={tokens.join(' ')}>
            {leftIcon && <span className="input__icon">{leftIcon}</span>}
            <input
                ref={caret.ref}
                className="input__field"
                value={value}
                onChange={(event) => {
                    caret.captureSelection(event);
                    onChange?.(event.target.value);
                }}
                {...rest}
            />
            {rightIcon && <span className="input__icon">{rightIcon}</span>}
        </span>
    );
}
