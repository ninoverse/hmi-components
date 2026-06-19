import type { ComponentPropsWithRef, ReactNode } from 'react';
import './styled/radio.styled.css';

export type RadioProps = Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'checked' | 'defaultChecked' | 'onChange'
> & {
    /** Text shown beside the radio. */
    label?: ReactNode;
    /** Controlled checked state. Provide with `onChange`. */
    checked?: boolean;
    /** Initial checked state when uncontrolled. */
    defaultChecked?: boolean;
    /** Fires with the new checked state on selection. */
    onChange?: (checked: boolean) => void;
};

/**
 * Single labelled radio button. Usually composed via {@link RadioGroup}; share
 * a `name` to make radios mutually exclusive.
 *
 * @example
 * <Radio name="plan" value="pro" label="Pro" onChange={onChange} />
 */
export function Radio({
    label,
    className,
    ref,
    onChange,
    ...rest
}: RadioProps) {
    const tokens: string[] = ['radio'];
    if (className) tokens.push(className);

    return (
        <label className={tokens.join(' ')}>
            <input
                ref={ref}
                type="radio"
                className="radio__input"
                onChange={(event) => onChange?.(event.target.checked)}
                {...rest}
            />
            <span className="radio__box" aria-hidden="true" />
            {label && <span className="radio__label">{label}</span>}
        </label>
    );
}
