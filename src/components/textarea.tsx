import type { ComponentPropsWithRef } from 'react';
import './styled/textarea.styled.css';

export type TextareaProps = Omit<
    ComponentPropsWithRef<'textarea'>,
    'value' | 'defaultValue' | 'onChange'
> & {
    error?: boolean;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
};

export function Textarea({
    error = false,
    className,
    ref,
    onChange,
    ...rest
}: TextareaProps) {
    const tokens: string[] = ['textarea'];
    if (error) tokens.push('textarea--error');
    if (className) tokens.push(className);

    return (
        <textarea
            ref={ref}
            className={tokens.join(' ')}
            onChange={(event) => onChange?.(event.target.value)}
            {...rest}
        />
    );
}
