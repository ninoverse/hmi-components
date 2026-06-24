import type { HTMLAttributes, ReactNode } from 'react';
import { Radio } from './radio';
import './styled/radio.styled.css';

export type RadioOption<T extends string = string> = {
    /** Value selected when this option is chosen. */
    value: T;
    /** Visible option label. */
    label: ReactNode;
    /** Disable this option. @default false */
    disabled?: boolean;
};

export type RadioGroupProps<T extends string = string> = Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    /** Shared input `name` that links the radios. */
    name: string;
    /** Controlled selected value. Provide with `onChange`. */
    value?: T;
    /** Initial selected value when uncontrolled. */
    defaultValue?: T;
    /** Options to render. */
    options: ReadonlyArray<RadioOption<T>>;
    /** Fires with the newly selected value. */
    onChange?: (value: T) => void;
};

/**
 * Group of mutually exclusive {@link Radio}s built from an options array.
 * Works controlled or uncontrolled.
 *
 * @example
 * <RadioGroup name="plan" options={plans} value={plan} onChange={setPlan} />
 */
export function RadioGroup<T extends string = string>({
    name,
    value,
    defaultValue,
    options,
    onChange,
    className,
    ...rest
}: RadioGroupProps<T>) {
    const isControlled = value !== undefined;
    const tokens: string[] = ['radio-group'];
    if (className) tokens.push(className);

    return (
        <div className={tokens.join(' ')} role="radiogroup" {...rest}>
            {options.map((opt) => (
                <Radio
                    key={opt.value}
                    name={name}
                    value={opt.value}
                    label={opt.label}
                    disabled={opt.disabled}
                    {...(isControlled
                        ? { checked: opt.value === value }
                        : { defaultChecked: opt.value === defaultValue })}
                    onChange={(checked) => {
                        if (checked) onChange?.(opt.value);
                    }}
                />
            ))}
        </div>
    );
}
