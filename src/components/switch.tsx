import type { ComponentPropsWithRef, ReactNode } from 'react';
import './styled/switch.styled.css';

export type SwitchProps = Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'checked' | 'defaultChecked' | 'onChange'
> & {
    /** Text shown beside the switch. */
    label?: ReactNode;
    /** Controlled on/off state. Provide with `onChange`. */
    checked?: boolean;
    /** Initial state when uncontrolled. */
    defaultChecked?: boolean;
    /** Fires with the new on/off state on toggle. */
    onChange?: (checked: boolean) => void;
};

/**
 * Labelled on/off toggle. Forwards native checkbox `<input>` props; `onChange`
 * is simplified to receive the boolean state.
 *
 * @example
 * <Switch label="Notifications" checked={on} onChange={setOn} />
 */
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
