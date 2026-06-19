import {
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import './styled/combobox.styled.css';

export type ComboboxOption<T extends string = string> = {
    /** Unique value committed on selection. */
    value: T;
    /** Text shown in the input and option row, and matched while filtering. */
    label: string;
    /** Optional secondary line under the label. */
    description?: ReactNode;
    /** Prevent selecting this option. @default false */
    disabled?: boolean;
};

export type ComboboxProps<T extends string = string> = {
    /** Controlled selected value, or `null` for none. Provide with `onChange`. */
    value?: T | null;
    /** Initial selected value when uncontrolled. */
    defaultValue?: T;
    /** Fires with the new value (or `null` when cleared). */
    onChange?: (value: T | null) => void;
    /** Selectable options. */
    options: ReadonlyArray<ComboboxOption<T>>;
    /** Input placeholder. @default 'Search…' */
    placeholder?: string;
    /** Disable the input. @default false */
    disabled?: boolean;
    /** Predicate for filtering options by query. Defaults to case-insensitive label match. */
    filterOption?: (option: ComboboxOption<T>, query: string) => boolean;
    /** Content shown when no option matches. @default 'No matches' */
    emptyMessage?: ReactNode;
    /** Accessible label for the input. @default 'Combobox' */
    'aria-label'?: string;
};

const defaultFilter = <T extends string>(
    opt: ComboboxOption<T>,
    query: string,
) => opt.label.toLowerCase().includes(query.toLowerCase());

/**
 * Editable single-select with type-ahead filtering, keyboard navigation and a
 * portalled listbox. Works controlled or uncontrolled.
 *
 * @example
 * <Combobox options={cities} onChange={setCity} placeholder="City" />
 */
export function Combobox<T extends string = string>({
    value,
    defaultValue,
    onChange,
    options,
    placeholder = 'Search…',
    disabled = false,
    filterOption = defaultFilter,
    emptyMessage = 'No matches',
    'aria-label': ariaLabel = 'Combobox',
}: ComboboxProps<T>) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<T | null>(defaultValue ?? null);
    const current = (isControlled ? value : internal) ?? null;
    const selected = options.find((opt) => opt.value === current) ?? null;

    const [query, setQuery] = useState(selected?.label ?? '');
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const listboxId = useId();
    const optionId = (i: number) => `${listboxId}-opt-${i}`;

    const filtered = useMemo(() => {
        if (!query) return options;
        // When the input still shows the selected option's label verbatim,
        // treat it as "no search" — otherwise opening the dropdown shrinks
        // it to one option, which feels broken.
        if (selected && query === selected.label) return options;
        return options.filter((opt) => filterOption(opt, query));
    }, [options, query, filterOption, selected]);

    useEffect(() => {
        if (highlight >= filtered.length) {
            setHighlight(filtered.length > 0 ? 0 : -1);
        }
    }, [filtered, highlight]);

    const [pos, setPos] = useState({ left: 0, top: 0, width: 0 });
    useLayoutEffect(() => {
        if (!open) return;
        const update = () => {
            const wrap = wrapperRef.current;
            if (!wrap) return;
            const r = wrap.getBoundingClientRect();
            setPos({
                left: r.left + window.scrollX,
                top: r.bottom + 6 + window.scrollY,
                width: r.width,
            });
        };
        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onDown = (event: globalThis.MouseEvent) => {
            const target = event.target as Node | null;
            if (target && wrapperRef.current?.contains(target)) return;
            if (target && listRef.current?.contains(target)) return;
            setOpen(false);
        };
        const handle = window.setTimeout(() => {
            document.addEventListener('mousedown', onDown);
        }, 0);
        return () => {
            window.clearTimeout(handle);
            document.removeEventListener('mousedown', onDown);
        };
    }, [open]);

    const commit = (opt: ComboboxOption<T>) => {
        if (opt.disabled) return;
        if (!isControlled) setInternal(opt.value);
        onChange?.(opt.value);
        setQuery(opt.label);
        setOpen(false);
    };

    const clear = () => {
        if (!isControlled) setInternal(null);
        onChange?.(null);
        setQuery('');
        setHighlight(0);
        inputRef.current?.focus();
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!open) setOpen(true);
            setHighlight((h) =>
                Math.min(filtered.length - 1, Math.max(0, h + 1)),
            );
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) setOpen(true);
            setHighlight((h) => Math.max(0, h - 1));
        } else if (event.key === 'Enter') {
            const opt = filtered[highlight];
            if (open && opt) {
                event.preventDefault();
                commit(opt);
            }
        } else if (event.key === 'Escape') {
            if (open) {
                event.preventDefault();
                setOpen(false);
            }
        } else if (event.key === 'Home') {
            if (open) {
                event.preventDefault();
                setHighlight(0);
            }
        } else if (event.key === 'End') {
            if (open) {
                event.preventDefault();
                setHighlight(filtered.length - 1);
            }
        }
    };

    const portalStyle: CSSProperties = {
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        width: pos.width,
    };

    const tokens: string[] = ['combobox'];
    if (disabled) tokens.push('combobox--disabled');

    const activeId =
        open && filtered[highlight] ? optionId(highlight) : undefined;

    return (
        <>
            <div ref={wrapperRef} className={tokens.join(' ')}>
                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    className="combobox__input"
                    aria-label={ariaLabel}
                    aria-expanded={open}
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    {...(activeId ? { 'aria-activedescendant': activeId } : {})}
                    value={query}
                    placeholder={placeholder}
                    disabled={disabled}
                    onFocus={() => setOpen(true)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                        setHighlight(0);
                        if (!event.target.value && current !== null) {
                            if (!isControlled) setInternal(null);
                            onChange?.(null);
                        }
                    }}
                    onKeyDown={onKeyDown}
                />
                {query && !disabled && (
                    <button
                        type="button"
                        className="combobox__clear"
                        aria-label="Clear"
                        onMouseDown={(event: MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault();
                        }}
                        onClick={clear}
                    >
                        <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <title>Clear</title>
                            <path d="M4 4l8 8M12 4l-8 8" />
                        </svg>
                    </button>
                )}
                <span className="combobox__chevron" aria-hidden="true">
                    <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <title>Open</title>
                        <path d="M4 6l4 4 4-4" />
                    </svg>
                </span>
            </div>
            {open &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={listRef}
                        id={listboxId}
                        role="listbox"
                        className="combobox__listbox"
                        style={portalStyle}
                    >
                        {filtered.length === 0 ? (
                            <div className="combobox__empty">
                                {emptyMessage}
                            </div>
                        ) : (
                            filtered.map((opt, i) => (
                                <div
                                    key={opt.value}
                                    id={optionId(i)}
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected={i === highlight}
                                    aria-disabled={opt.disabled || undefined}
                                    data-highlighted={i === highlight}
                                    data-disabled={opt.disabled || undefined}
                                    className="combobox__option"
                                    onMouseEnter={() => setHighlight(i)}
                                    onMouseDown={(
                                        event: MouseEvent<HTMLDivElement>,
                                    ) => {
                                        event.preventDefault();
                                        commit(opt);
                                    }}
                                >
                                    <div className="combobox__option-label">
                                        {opt.label}
                                    </div>
                                    {opt.description && (
                                        <div className="combobox__option-desc">
                                            {opt.description}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>,
                    document.body,
                )}
        </>
    );
}
