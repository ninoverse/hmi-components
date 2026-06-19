import {
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useRef,
    useState,
} from 'react';
import './styled/segmentedControl.styled.css';

export type SegmentedControlSize = 'small' | 'medium' | 'large';

export type SegmentedControlOption<T extends string = string> = {
    /** Value selected when this segment is chosen. */
    value: T;
    /** Visible segment label. */
    label: ReactNode;
    /** Optional leading icon. */
    icon?: ReactNode;
    /** Disable this segment. @default false */
    disabled?: boolean;
};

export type SegmentedControlProps<T extends string = string> = Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    /** Controlled selected value. Provide with `onChange`. */
    value?: T;
    /** Initial selected value when uncontrolled. */
    defaultValue?: T;
    /** Fires with the newly selected value. */
    onChange?: (value: T) => void;
    /** Segments to render. */
    options: ReadonlyArray<SegmentedControlOption<T>>;
    /** Control size. @default 'medium' */
    size?: SegmentedControlSize;
    /** Stretch segments to fill the container width. @default false */
    fullWidth?: boolean;
    /** Disable the whole control. @default false */
    disabled?: boolean;
    /** Accessible label for the group. @default 'Segmented control' */
    'aria-label'?: string;
};

/**
 * Single-select control rendering options as adjacent segments, with full
 * keyboard (arrows/Home/End) support. Works controlled or uncontrolled.
 *
 * @example
 * <SegmentedControl options={views} value={view} onChange={setView} />
 */
export function SegmentedControl<T extends string = string>({
    value,
    defaultValue,
    onChange,
    options,
    size = 'medium',
    fullWidth = false,
    disabled = false,
    className,
    'aria-label': ariaLabel = 'Segmented control',
    ...rest
}: SegmentedControlProps<T>) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<T | undefined>(defaultValue);
    const current = isControlled ? value : internal;

    const refs = useRef<Array<HTMLButtonElement | null>>([]);

    const tokens: string[] = [
        'segmented-control',
        `segmented-control--${size}`,
    ];
    if (fullWidth) tokens.push('segmented-control--full-width');
    if (disabled) tokens.push('segmented-control--disabled');
    if (className) tokens.push(className);

    const enabledIndices = options
        .map((opt, i) => ({ opt, i }))
        .filter(({ opt }) => !opt.disabled)
        .map(({ i }) => i);

    const select = (next: T) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
    };

    const focusIndex = (idx: number) => {
        const el = refs.current[idx];
        if (el) el.focus();
    };

    const onKey = (
        event: KeyboardEvent<HTMLButtonElement>,
        currentIdx: number,
    ) => {
        const position = enabledIndices.indexOf(currentIdx);
        if (position < 0) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            const nextPos = (position + 1) % enabledIndices.length;
            const nextIdx = enabledIndices[nextPos];
            if (nextIdx === undefined) return;
            focusIndex(nextIdx);
            const opt = options[nextIdx];
            if (opt) select(opt.value);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            const prevPos =
                (position - 1 + enabledIndices.length) % enabledIndices.length;
            const prevIdx = enabledIndices[prevPos];
            if (prevIdx === undefined) return;
            focusIndex(prevIdx);
            const opt = options[prevIdx];
            if (opt) select(opt.value);
        } else if (event.key === 'Home') {
            event.preventDefault();
            const firstIdx = enabledIndices[0];
            if (firstIdx === undefined) return;
            focusIndex(firstIdx);
            const opt = options[firstIdx];
            if (opt) select(opt.value);
        } else if (event.key === 'End') {
            event.preventDefault();
            const lastIdx = enabledIndices[enabledIndices.length - 1];
            if (lastIdx === undefined) return;
            focusIndex(lastIdx);
            const opt = options[lastIdx];
            if (opt) select(opt.value);
        }
    };

    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className={tokens.join(' ')}
            {...rest}
        >
            {options.map((opt, idx) => {
                const checked = current === opt.value;
                const optionDisabled = disabled || opt.disabled;
                return (
                    // biome-ignore lint/a11y/useSemanticElements: button + role=radio keeps the visual segmented-control while exposing radio semantics; <input type=radio> would need a separate styled <label>
                    <button
                        key={opt.value}
                        ref={(el) => {
                            refs.current[idx] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        data-checked={checked}
                        disabled={optionDisabled}
                        tabIndex={
                            checked || (!current && idx === enabledIndices[0])
                                ? 0
                                : -1
                        }
                        className="segmented-control__option"
                        onClick={() => select(opt.value)}
                        onKeyDown={(event) => onKey(event, idx)}
                    >
                        {opt.icon && (
                            <span
                                className="segmented-control__icon"
                                aria-hidden="true"
                            >
                                {opt.icon}
                            </span>
                        )}
                        <span className="segmented-control__label">
                            {opt.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
