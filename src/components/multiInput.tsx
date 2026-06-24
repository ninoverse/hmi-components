import {
    type ClipboardEvent,
    type KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import './styled/multiInput.styled.css';

export type MultiInputType = 'numeric' | 'text';

export type MultiInputProps = {
    /** Number of single-character cells. @default 6 */
    length?: number;
    /** Insert a separator every N cells (e.g. `3` → `XXX–XXX`). */
    groupSize?: number;
    /** Separator string shown between groups. @default '–' */
    separator?: string;
    /** Controlled value (concatenated cells). Provide with `onChange`. */
    value?: string;
    /** Initial value when uncontrolled. */
    defaultValue?: string;
    /** Fires with the concatenated value on every edit. */
    onChange?: (value: string) => void;
    /** Fires with the value once every cell is filled. */
    onComplete?: (value: string) => void;
    /** Allowed characters and input mode. @default 'numeric' */
    type?: MultiInputType;
    /** Custom single-character validation pattern, overriding `type`. */
    pattern?: RegExp;
    /** Mask entered characters (password style). @default false */
    mask?: boolean;
    /** Disable all cells. @default false */
    disabled?: boolean;
    /** Make all cells read-only. @default false */
    readOnly?: boolean;
    /** Focus the first cell on mount. @default false */
    autoFocus?: boolean;
    /** `autocomplete` for the first cell (e.g. `'one-time-code'`). @default 'off' */
    autoComplete?: string;
    /** Accessible label for the group. @default 'Segmented input' */
    'aria-label'?: string;
};

/**
 * Segmented single-character input for codes/OTP/PIN, with auto-advance,
 * paste-to-fill, keyboard navigation and optional grouping. Works controlled
 * or uncontrolled.
 *
 * @example
 * <MultiInput length={6} groupSize={3} onComplete={verify} />
 */

const NUMERIC_PATTERN = /^[0-9]$/;
const NON_WHITESPACE_PATTERN = /^\S$/;

export function MultiInput({
    length = 6,
    groupSize,
    separator = '–',
    value,
    defaultValue,
    onChange,
    onComplete,
    type = 'numeric',
    pattern,
    mask = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    autoComplete = 'off',
    'aria-label': ariaLabel = 'Segmented input',
}: MultiInputProps) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<string>(defaultValue ?? '');
    const current = (isControlled ? value : internal).slice(0, length);

    const refs = useRef<Array<HTMLInputElement | null>>([]);
    const cells: string[] = Array.from({ length }, (_, i) => current[i] ?? '');

    const validate: (ch: string) => boolean = pattern
        ? (ch) => pattern.test(ch)
        : type === 'numeric'
          ? (ch) => NUMERIC_PATTERN.test(ch)
          : (ch) => NON_WHITESPACE_PATTERN.test(ch);

    const setValue = (next: string) => {
        const clipped = next.slice(0, length);
        if (!isControlled) setInternal(clipped);
        onChange?.(clipped);
        const filledCells = Array.from({ length }, (_, i) => clipped[i] ?? '');
        if (filledCells.every((c) => c !== '')) {
            onComplete?.(clipped);
        }
    };

    const focusCell = (idx: number) => {
        const el = refs.current[idx];
        if (el) {
            el.focus();
            el.select();
        }
    };

    const onCellChange = (idx: number, raw: string) => {
        if (raw === '') {
            const next = cells.slice();
            next[idx] = '';
            setValue(next.join(''));
            return;
        }
        const ch = raw.slice(-1);
        if (!validate(ch)) return;
        const next = cells.slice();
        next[idx] = ch;
        setValue(next.join(''));
        if (idx < length - 1) focusCell(idx + 1);
    };

    const onCellKey = (idx: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace') {
            if (cells[idx]) return;
            if (idx > 0) {
                event.preventDefault();
                const next = cells.slice();
                next[idx - 1] = '';
                setValue(next.join(''));
                focusCell(idx - 1);
            }
        } else if (event.key === 'ArrowLeft' && idx > 0) {
            event.preventDefault();
            focusCell(idx - 1);
        } else if (event.key === 'ArrowRight' && idx < length - 1) {
            event.preventDefault();
            focusCell(idx + 1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            focusCell(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            focusCell(length - 1);
        }
    };

    const onPaste = (idx: number, event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const text = event.clipboardData.getData('text');
        const filtered = Array.from(text).filter(validate).join('');
        if (!filtered) return;
        const next = cells.slice();
        let pos = idx;
        for (const ch of filtered) {
            if (pos >= length) break;
            next[pos] = ch;
            pos++;
        }
        setValue(next.join(''));
        focusCell(Math.min(pos, length - 1));
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: focus on mount only
    useEffect(() => {
        if (autoFocus) focusCell(0);
    }, []);

    const tokens: string[] = ['multi-input'];
    if (disabled) tokens.push('multi-input--disabled');

    return (
        <fieldset className={tokens.join(' ')} aria-label={ariaLabel}>
            {cells.map((cell, i) => {
                const showSeparatorBefore =
                    groupSize !== undefined &&
                    groupSize > 0 &&
                    i > 0 &&
                    i % groupSize === 0;
                return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: cells are positionally identified
                    <span key={i} className="multi-input__slot">
                        {showSeparatorBefore && (
                            <span
                                className="multi-input__separator"
                                aria-hidden="true"
                            >
                                {separator}
                            </span>
                        )}
                        <input
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            type={mask ? 'password' : 'text'}
                            inputMode={type === 'numeric' ? 'numeric' : 'text'}
                            autoComplete={i === 0 ? autoComplete : 'off'}
                            maxLength={1}
                            className="multi-input__cell"
                            aria-label={`Segment ${i + 1} of ${length}`}
                            value={cell}
                            disabled={disabled}
                            readOnly={readOnly}
                            onChange={(event) =>
                                onCellChange(i, event.target.value)
                            }
                            onKeyDown={(event) => onCellKey(i, event)}
                            onPaste={(event) => onPaste(i, event)}
                            onFocus={(event) => event.target.select()}
                        />
                    </span>
                );
            })}
        </fieldset>
    );
}
