import type { ComponentPropsWithRef, ReactNode } from 'react';
import './styled/switch.styled.css';

export type SwitchProps = Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'checked' | 'defaultChecked' | 'onChange'
> & {
    label?: ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
};

export function Switch({
    label,
    className,
    ref,
    onChange,
    ...rest
}: SwitchProps) {
    const tokens: string[] = ['switch'];
    if (className) tokens.push(className);

    return (
        <label className={tokens.join(' ')}>
            <input
                ref={ref}
                type="checkbox"
                className="switch__input"
                onChange={(event) => onChange?.(event.target.checked)}
                {...rest}
            />
            <span className="switch__track" aria-hidden="true">
                <span className="switch__thumb" />
            </span>
            {label && <span className="switch__label">{label}</span>}
        </label>
    );
}
