import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';
import './styled/numberInput.styled.css';

export type NumberInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
> & {
    /** Controlled value, or `null` when empty. Provide with `onChange`. */
    value?: number | null;
    /** Initial value when uncontrolled. */
    defaultValue?: number;
    /** Minimum value; clamped on blur and disables the decrement at the bound. */
    min?: number;
    /** Maximum value; clamped on blur and disables the increment at the bound. */
    max?: number;
    /** Increment/decrement step. @default 1 */
    step?: number;
    /** Apply error styling. @default false */
    error?: boolean;
    /** Fires with the new number, or `null` when the field is cleared. */
    onChange?: (value: number | null) => void;
};

/**
 * Numeric field with stepper buttons and min/max clamping (applied on blur).
 * Empty input is represented as `null`. Works controlled or uncontrolled.
 *
 * @example
 * <NumberInput min={0} max={10} value={qty} onChange={setQty} />
 */
export function NumberInput({
    value,
    defaultValue,
    min,
    max,
    step = 1,
    error = false,
    onChange,
    className,
    disabled,
    readOnly,
    ...rest
}: NumberInputProps) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<number | null>(
        defaultValue ?? null,
    );
    const current = isControlled ? value : internal;

    const tokens: string[] = ['number-input'];
    if (error) tokens.push('number-input--error');
    if (disabled) tokens.push('number-input--disabled');
    if (className) tokens.push(className);

    const clamp = (n: number) => {
        let result = n;
        if (min !== undefined) result = Math.max(min, result);
        if (max !== undefined) result = Math.min(max, result);
        return result;
    };

    const set = (next: number | null) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
    };

    const bump = (delta: number) => {
        const base = current ?? min ?? 0;
        set(clamp(base + delta));
    };

    const stepDisabled = disabled || readOnly;
    const atMin = current !== null && min !== undefined && current <= min;
    const atMax = current !== null && max !== undefined && current >= max;

    return (
        <span className={tokens.join(' ')}>
            <input
                type="number"
                className="number-input__field"
                value={current ?? ''}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                readOnly={readOnly}
                onChange={(event) => {
                    const raw = event.target.value;
                    if (raw === '') {
                        set(null);
                        return;
                    }
                    const n = Number(raw);
                    if (Number.isNaN(n)) return;
                    set(n);
                }}
                onBlur={() => {
                    if (current !== null) {
                        const clamped = clamp(current);
                        if (clamped !== current) set(clamped);
                    }
                }}
                {...rest}
            />
            <span className="number-input__steppers">
                <button
                    type="button"
                    className="number-input__step number-input__step--up"
                    aria-label="Increase"
                    onClick={() => bump(step)}
                    disabled={stepDisabled || atMax}
                    tabIndex={-1}
                >
                    <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <title>Increase</title>
                        <path d="M2.5 7.5L6 4L9.5 7.5" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="number-input__step number-input__step--down"
                    aria-label="Decrease"
                    onClick={() => bump(-step)}
                    disabled={stepDisabled || atMin}
                    tabIndex={-1}
                >
                    <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <title>Decrease</title>
                        <path d="M2.5 4.5L6 8L9.5 4.5" />
                    </svg>
                </button>
            </span>
        </span>
    );
}
