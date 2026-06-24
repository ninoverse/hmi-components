import { type ReactNode, useState } from 'react';
import { Menu, MenuItem } from './menu';
import { Popover, type PopoverAlign } from './popover';
import './styled/select.styled.css';

export type SelectOption<T extends string = string> = {
    /** Value selected when this option is chosen. */
    value: T;
    /** Visible option label. */
    label: ReactNode;
    /** Optional leading icon. */
    icon?: ReactNode;
};

export type SelectProps<T extends string = string> = {
    /** Controlled selected value. Provide with `onChange`. */
    value?: T;
    /** Initial selected value when uncontrolled. */
    defaultValue?: T;
    /** Fires with the newly selected value. */
    onChange?: (value: T) => void;
    /** Options to render in the dropdown. */
    options: ReadonlyArray<SelectOption<T>>;
    /** Trigger text shown when nothing is selected. @default 'Select…' */
    placeholder?: ReactNode;
    /** Dropdown alignment to the trigger. @default 'start' */
    align?: PopoverAlign;
    /** Disable the trigger. @default false */
    disabled?: boolean;
};

/**
 * Single-select dropdown built on {@link Popover} + {@link Menu}. For
 * type-ahead filtering over many options, use {@link Combobox}. Works
 * controlled or uncontrolled.
 *
 * @example
 * <Select options={options} value={val} onChange={setVal} />
 */

const ChevronIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Open</title>
        <path d="M4 6l4 4 4-4" />
    </svg>
);

const CheckIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Selected</title>
        <path d="M3 8.5l3 3 7-7" />
    </svg>
);

export function Select<T extends string = string>({
    value,
    defaultValue,
    onChange,
    options,
    placeholder = 'Select…',
    align = 'start',
    disabled = false,
}: SelectProps<T>) {
    const [open, setOpen] = useState(false);
    const [internal, setInternal] = useState<T | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const selected = options.find((opt) => opt.value === current);

    const pick = (next: T) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
        setOpen(false);
    };

    return (
        <Popover
            open={open && !disabled}
            onOpenChange={setOpen}
            align={align}
            trigger={
                <button
                    type="button"
                    className="select-trigger"
                    disabled={disabled}
                >
                    {selected ? (
                        <span className="select-trigger__value">
                            {selected.icon && (
                                <span className="select-trigger__icon">
                                    {selected.icon}
                                </span>
                            )}
                            <span className="select-trigger__label">
                                {selected.label}
                            </span>
                        </span>
                    ) : (
                        <span className="select-trigger__placeholder">
                            {placeholder}
                        </span>
                    )}
                    <span className="select-trigger__chevron">
                        <ChevronIcon />
                    </span>
                </button>
            }
        >
            <Menu>
                {options.map((opt) => (
                    <MenuItem
                        key={opt.value}
                        icon={opt.icon}
                        onClick={() => pick(opt.value)}
                        shortcut={
                            current === opt.value ? (
                                <span className="select-option__check">
                                    <CheckIcon />
                                </span>
                            ) : undefined
                        }
                    >
                        {opt.label}
                    </MenuItem>
                ))}
            </Menu>
        </Popover>
    );
}
