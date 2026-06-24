import type { ComponentPropsWithRef } from 'react';
import { useControlledTextCaret } from '../lib/controlledTextCaret.utility';
import './styled/textarea.styled.css';

export type TextareaProps = Omit<
    ComponentPropsWithRef<'textarea'>,
    'value' | 'defaultValue' | 'onChange'
> & {
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
 * Multi-line text field with an error state. `onChange` is simplified to
 * receive the string value; caret position is preserved when controlled.
 *
 * @example
 * <Textarea value={bio} onChange={setBio} rows={4} />
 */
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
