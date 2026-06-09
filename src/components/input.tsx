import type { ComponentPropsWithRef, ReactNode } from 'react';
import './styled/input.styled.css';

export type InputProps = Omit<
    ComponentPropsWithRef<'input'>,
    'value' | 'defaultValue' | 'onChange'
> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    error?: boolean;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
};

export function Input({
    leftIcon,
    rightIcon,
    error = false,
    className,
    ref,
    onChange,
    ...rest
}: InputProps) {
    const tokens: string[] = ['input'];
    if (error) tokens.push('input--error');
    if (className) tokens.push(className);

    return (
        <span className={tokens.join(' ')}>
            {leftIcon && <span className="input__icon">{leftIcon}</span>}
            <input
                ref={ref}
                className="input__field"
                onChange={(event) => onChange?.(event.target.value)}
                {...rest}
            />
            {rightIcon && <span className="input__icon">{rightIcon}</span>}
        </span>
    );
}
