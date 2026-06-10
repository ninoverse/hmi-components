import type { ComponentPropsWithRef } from 'react';
import { useControlledTextCaret } from '../lib/controlledTextCaret.utility';
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
    value,
    ...rest
}: TextareaProps) {
    const tokens: string[] = ['textarea'];
    if (error) tokens.push('textarea--error');
    if (className) tokens.push(className);

    const caret = useControlledTextCaret<HTMLTextAreaElement>(value, ref);

    return (
        <textarea
            ref={caret.ref}
            className={tokens.join(' ')}
            value={value}
            onChange={(event) => {
                caret.captureSelection(event);
                onChange?.(event.target.value);
            }}
            {...rest}
        />
    );
}
