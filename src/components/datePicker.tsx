import { type KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { Popover } from './popover';
import './styled/datePicker.styled.css';

/** Internal Date-pair shape used for range rendering and state. */
export type DateRange = { start: Date; end: Date | null };

/** A date accepted across the prop boundary: an ISO-8601 string (so it can
   travel through an HTML attribute) or a live Date for the React API. */
export type DateInput = Date | string;
/** Range value accepted as props — each endpoint an ISO string or Date. */
export type DateRangeValue = { start: DateInput; end: DateInput | null };
/** Serializable range emitted by onChange (ISO-8601 strings). */
export type DateRangeISO = { start: string; end: string | null };

type CommonProps = {
    /** Earliest selectable date (ISO string or Date). */
    min?: DateInput;
    /** Latest selectable date (ISO string or Date). */
    max?: DateInput;
    /** Trigger text shown when nothing is selected. @default 'Pick a date' */
    placeholder?: string;
    /** Disable the trigger. @default false */
    disabled?: boolean;
    /** Accessible label for the trigger. @default 'Date picker' */
    'aria-label'?: string;
};

type SingleProps = CommonProps & {
    /** Select a single date. @default 'single' */
    mode?: 'single';
    /** Controlled value (ISO string or Date), or `null`. Provide with `onChange`. */
    value?: DateInput | null;
    /** Initial value when uncontrolled. */
    defaultValue?: DateInput;
    /** Fires with the selected date as an ISO-8601 string, or `null` when cleared. */
    onChange?: (date: string | null) => void;
};

type RangeProps = CommonProps & {
    /** Select a start/end date range. */
    mode: 'range';
    /** Controlled range value, or `null`. Provide with `onChange`. */
    value?: DateRangeValue | null;
    /** Initial range when uncontrolled. */
    defaultValue?: DateRangeValue;
    /** Fires with the selected range as ISO-8601 strings, or `null` when cleared. */
    onChange?: (range: DateRangeISO | null) => void;
};

export type DatePickerProps = SingleProps | RangeProps;

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

// Week starts Monday. Index 0 = Mon, 6 = Sun.
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const startOfDay = (d: Date) => {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
};

const before = (a: Date, b: Date) => startOfDay(a) < startOfDay(b);
const after = (a: Date, b: Date) => startOfDay(a) > startOfDay(b);

const formatShort = (d: Date) =>
    `${d.getDate()} ${MONTH_NAMES[d.getMonth()]?.slice(0, 3)} ${d.getFullYear()}`;

const buildGrid = (viewMonth: Date): Date[] => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const firstWeekday = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(start.getDate() - firstWeekday);
    return Array.from({ length: 42 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
};

const isOutOfBounds = (d: Date, min?: Date, max?: Date) => {
    if (min && before(d, min)) return true;
    if (max && after(d, max)) return true;
    return false;
};

// Boundary helpers: parse ISO strings / Dates coming in as props into live
// Date objects, and serialize selections back to ISO-8601 strings.
const toDate = (v: DateInput): Date => (v instanceof Date ? v : new Date(v));
const toDateOrNull = (v: DateInput | null | undefined): Date | null =>
    v == null ? null : toDate(v);
const toRange = (r: DateRangeValue | null | undefined): DateRange | null =>
    r
        ? { start: toDate(r.start), end: r.end == null ? null : toDate(r.end) }
        : null;
const rangeToISO = (r: DateRange): DateRangeISO => ({
    start: r.start.toISOString(),
    end: r.end ? r.end.toISOString() : null,
});

/**
 * Calendar date picker in a popover, supporting single-date or start/end range
 * selection, min/max bounds, and full keyboard navigation. Accepts ISO strings
 * or `Date`s and emits ISO-8601 strings (Web Component-safe). Works controlled
 * or uncontrolled.
 *
 * @example
 * <DatePicker onChange={setDate} />
 * <DatePicker mode="range" onChange={setRange} />
 */
export function DatePicker(props: DatePickerProps) {
    const {
        min,
        max,
        placeholder = 'Pick a date',
        disabled = false,
        'aria-label': ariaLabel = 'Date picker',
    } = props;

    const isRange = props.mode === 'range';
    const isControlled = props.value !== undefined;

    // Parse the ISO/Date bounds once for comparisons below.
    const minDate = min !== undefined ? toDate(min) : undefined;
    const maxDate = max !== undefined ? toDate(max) : undefined;

    // Single-mode state. Casts are sound because the runtime `isRange` guard
    // selects the matching union member that TS can't narrow from a boolean.
    const [internalSingle, setInternalSingle] = useState<Date | null>(
        !isRange
            ? toDateOrNull(props.defaultValue as DateInput | undefined)
            : null,
    );
    const currentSingle = !isRange
        ? isControlled
            ? toDateOrNull(props.value as DateInput | null | undefined)
            : internalSingle
        : null;

    // Range-mode state
    const [internalRange, setInternalRange] = useState<DateRange | null>(
        isRange
            ? toRange(props.defaultValue as DateRangeValue | undefined)
            : null,
    );
    const currentRange: DateRange | null = isRange
        ? isControlled
            ? toRange(props.value as DateRangeValue | null | undefined)
            : internalRange
        : null;

    const initialView = currentSingle ?? currentRange?.start ?? new Date();
    const [viewMonth, setViewMonth] = useState(
        new Date(initialView.getFullYear(), initialView.getMonth(), 1),
    );
    const [open, setOpen] = useState(false);
    const [hoverEnd, setHoverEnd] = useState<Date | null>(null);
    const [focusDate, setFocusDate] = useState<Date>(
        currentSingle ?? currentRange?.start ?? new Date(),
    );

    useEffect(() => {
        if (!open) setHoverEnd(null);
    }, [open]);

    const today = useMemo(() => startOfDay(new Date()), []);
    const grid = useMemo(() => buildGrid(viewMonth), [viewMonth]);

    const selectSingle = (d: Date) => {
        if (isOutOfBounds(d, minDate, maxDate)) return;
        if (!isControlled) setInternalSingle(d);
        if (!isRange) (props as SingleProps).onChange?.(d.toISOString());
        setOpen(false);
    };

    const selectRange = (d: Date) => {
        if (isOutOfBounds(d, minDate, maxDate)) return;
        const next: DateRange =
            !currentRange || currentRange.end !== null
                ? { start: d, end: null }
                : before(d, currentRange.start)
                  ? { start: d, end: currentRange.start }
                  : { start: currentRange.start, end: d };
        if (!isControlled) setInternalRange(next);
        if (isRange) (props as RangeProps).onChange?.(rangeToISO(next));
        if (next.end !== null) setOpen(false);
    };

    const onPick = (d: Date) => {
        setFocusDate(d);
        if (isRange) selectRange(d);
        else selectSingle(d);
    };

    const isSelected = (d: Date): boolean => {
        if (isRange) {
            if (!currentRange) return false;
            if (isSameDay(d, currentRange.start)) return true;
            if (currentRange.end && isSameDay(d, currentRange.end)) return true;
            return false;
        }
        return currentSingle ? isSameDay(d, currentSingle) : false;
    };

    const isInRange = (d: Date): boolean => {
        if (!isRange) return false;
        if (!currentRange) return false;
        const start = currentRange.start;
        const end =
            currentRange.end ??
            (hoverEnd && before(currentRange.start, hoverEnd)
                ? hoverEnd
                : null);
        if (!end) return false;
        if (before(d, start)) return false;
        if (after(d, end)) return false;
        return true;
    };

    const triggerLabel: string = isRange
        ? currentRange
            ? currentRange.end
                ? `${formatShort(currentRange.start)} – ${formatShort(currentRange.end)}`
                : formatShort(currentRange.start)
            : placeholder
        : currentSingle
          ? formatShort(currentSingle)
          : placeholder;

    const clear = () => {
        if (!isControlled) {
            if (isRange) setInternalRange(null);
            else setInternalSingle(null);
        }
        if (isRange) (props as RangeProps).onChange?.(null);
        else (props as SingleProps).onChange?.(null);
    };

    const goPrevMonth = () =>
        setViewMonth(
            new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
        );
    const goNextMonth = () =>
        setViewMonth(
            new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
        );
    const goPrevYear = () =>
        setViewMonth(
            new Date(viewMonth.getFullYear() - 1, viewMonth.getMonth(), 1),
        );
    const goNextYear = () =>
        setViewMonth(
            new Date(viewMonth.getFullYear() + 1, viewMonth.getMonth(), 1),
        );

    const moveFocus = (deltaDays: number) => {
        const next = new Date(focusDate);
        next.setDate(next.getDate() + deltaDays);
        if (
            next.getMonth() !== viewMonth.getMonth() ||
            next.getFullYear() !== viewMonth.getFullYear()
        ) {
            setViewMonth(new Date(next.getFullYear(), next.getMonth(), 1));
        }
        setFocusDate(next);
    };

    const onGridKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveFocus(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveFocus(1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            moveFocus(-7);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            moveFocus(7);
        } else if (event.key === 'PageUp') {
            event.preventDefault();
            if (event.shiftKey) goPrevYear();
            else goPrevMonth();
        } else if (event.key === 'PageDown') {
            event.preventDefault();
            if (event.shiftKey) goNextYear();
            else goNextMonth();
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onPick(focusDate);
        }
    };

    return (
        <Popover
            open={open && !disabled}
            onOpenChange={setOpen}
            width={360}
            trigger={
                <button
                    type="button"
                    className="date-picker__trigger"
                    disabled={disabled}
                    aria-label={ariaLabel}
                >
                    <span className="date-picker__icon" aria-hidden="true">
                        <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <title>Calendar</title>
                            <rect
                                x="2"
                                y="3.5"
                                width="12"
                                height="10"
                                rx="1.2"
                            />
                            <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
                        </svg>
                    </span>
                    <span
                        className={
                            triggerLabel === placeholder
                                ? 'date-picker__placeholder'
                                : 'date-picker__value'
                        }
                    >
                        {triggerLabel}
                    </span>
                </button>
            }
        >
            <div className="date-picker">
                <div className="date-picker__header">
                    <button
                        type="button"
                        className="date-picker__nav"
                        onClick={goPrevYear}
                        aria-label="Previous year"
                    >
                        «
                    </button>
                    <button
                        type="button"
                        className="date-picker__nav"
                        onClick={goPrevMonth}
                        aria-label="Previous month"
                    >
                        ‹
                    </button>
                    <div className="date-picker__title" aria-live="polite">
                        {MONTH_NAMES[viewMonth.getMonth()]}{' '}
                        {viewMonth.getFullYear()}
                    </div>
                    <button
                        type="button"
                        className="date-picker__nav"
                        onClick={goNextMonth}
                        aria-label="Next month"
                    >
                        ›
                    </button>
                    <button
                        type="button"
                        className="date-picker__nav"
                        onClick={goNextYear}
                        aria-label="Next year"
                    >
                        »
                    </button>
                </div>
                <div className="date-picker__weekdays">
                    {WEEKDAY_LABELS.map((label) => (
                        <div key={label} className="date-picker__weekday">
                            {label.slice(0, 1)}
                        </div>
                    ))}
                </div>
                {/* biome-ignore lint/a11y/useSemanticElements: ARIA grid pattern for date picker — keyboard handler lives on the wrapper since cells are focused via aria-activedescendant-style focusDate tracking */}
                <div
                    role="grid"
                    className="date-picker__grid"
                    onKeyDown={onGridKey}
                    tabIndex={0}
                >
                    {grid.map((d) => {
                        const outOfMonth =
                            d.getMonth() !== viewMonth.getMonth();
                        const disabledDay = isOutOfBounds(d, minDate, maxDate);
                        const selected = isSelected(d);
                        const inRange = isInRange(d);
                        const isToday = isSameDay(d, today);
                        const isFocus = isSameDay(d, focusDate);
                        return (
                            // biome-ignore lint/a11y/useSemanticElements: the calendar grid uses CSS grid (not <table>); each cell stays a real <button> so Enter/Space activate it
                            <button
                                key={dayKey(d)}
                                type="button"
                                role="gridcell"
                                aria-selected={selected}
                                aria-disabled={disabledDay || undefined}
                                tabIndex={-1}
                                disabled={disabledDay}
                                data-outside={outOfMonth || undefined}
                                data-today={isToday || undefined}
                                data-selected={selected || undefined}
                                data-in-range={inRange || undefined}
                                data-focus={isFocus || undefined}
                                className="date-picker__day"
                                onMouseEnter={
                                    isRange ? () => setHoverEnd(d) : undefined
                                }
                                onClick={() => onPick(d)}
                            >
                                {d.getDate()}
                            </button>
                        );
                    })}
                </div>
                <div className="date-picker__footer">
                    <button
                        type="button"
                        className="date-picker__footer-btn"
                        onClick={() => onPick(today)}
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        className="date-picker__footer-btn"
                        onClick={clear}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </Popover>
    );
}
