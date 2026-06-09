import type { HTMLAttributes, ReactNode } from 'react';
import { Radio } from './radio';
import './styled/radio.styled.css';

export type RadioOption<T extends string = string> = {
    value: T;
    label: ReactNode;
    disabled?: boolean;
};

export type RadioGroupProps<T extends string = string> = Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    name: string;
    value?: T;
    defaultValue?: T;
    options: ReadonlyArray<RadioOption<T>>;
    onChange?: (value: T) => void;
};

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
