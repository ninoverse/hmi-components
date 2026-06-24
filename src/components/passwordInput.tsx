import { useState } from 'react';
import { Input, type InputProps } from './input';
import './styled/passwordInput.styled.css';

/** Same as {@link InputProps}, minus `type` and `rightIcon` (used internally for the reveal toggle). */
export type PasswordInputProps = Omit<InputProps, 'type' | 'rightIcon'>;

const EyeIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
    >
        <title>Show password</title>
        <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z" />
        <circle cx="8" cy="8" r="2" />
    </svg>
);

const EyeOffIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Hide password</title>
        <path d="M1.5 8s2.5-4.5 6.5-4.5c1.4 0 2.6.5 3.6 1.1M14.5 8s-2.5 4.5-6.5 4.5c-1.4 0-2.6-.5-3.6-1.1" />
        <path d="M2 2l12 12" />
    </svg>
);

/**
 * {@link Input} preconfigured for passwords, with a built-in show/hide toggle.
 *
 * @example
 * <PasswordInput value={pw} onChange={setPw} />
 */
export function PasswordInput(props: PasswordInputProps) {
    const [show, setShow] = useState(false);
    return (
        <Input
            {...props}
            type={show ? 'text' : 'password'}
            rightIcon={
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    aria-pressed={show}
                >
                    {show ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            }
        />
    );
}
