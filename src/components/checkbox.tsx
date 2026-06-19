import type { ComponentPropsWithRef, ReactNode } from 'react';
import './styled/checkbox.styled.css';

export type CheckboxProps = Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'checked' | 'defaultChecked' | 'onChange'
> & {
    /** Text shown beside the checkbox. */
    label?: ReactNode;
    /** Controlled checked state. Provide with `onChange`. */
    checked?: boolean;
    /** Initial checked state when uncontrolled. */
    defaultChecked?: boolean;
    /** Fires with the new checked state on toggle. */
    onChange?: (checked: boolean) => void;
};

/**
 * Labelled checkbox. Forwards native `<input>` props; `onChange` is simplified
 * to receive the boolean checked state.
 *
 * @example
 * <Checkbox label="Subscribe" defaultChecked onChange={setOn} />
 */
export function Checkbox({
    label,
    className,
    ref,
    onChange,
    ...rest
}: CheckboxProps) {
    const tokens: string[] = ['checkbox'];
    if (className) tokens.push(className);

    return (
        <label className={tokens.join(' ')}>
            <input
                ref={ref}
                type="checkbox"
                className="checkbox__input"
                onChange={(event) => onChange?.(event.target.checked)}
                {...rest}
            />
            <span className="checkbox__box" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                    <title>Checked</title>
                    <path
                        d="M3 8.5l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            {label && <span className="checkbox__label">{label}</span>}
        </label>
    );
}
