/*
 * Calendar-date maths on the local calendar: a day is its year, month and day
 * of month, never a point in time. Every function builds its `Date` from those
 * fields, so no result moves with the time zone or a daylight-saving change, and
 * a value travels as the plain `YYYY-MM-DD` text of a native `<input type="date">`.
 */

/** A date as the elements accept it: `YYYY-MM-DD` (or an ISO date-time), or a `Date`. */
export type DateInput = string | Date;

const PLAIN_DATE = /^(\d{4,6})-(\d{2})-(\d{2})$/;

/** A `Date` at local midnight of that calendar day, even for years below 100. */
function make(year: number, month: number, day: number): Date {
    const date = new Date(2000, 0, 1);
    date.setFullYear(year, month, day);
    return date;
}

/**
 * The calendar day of an input, at local midnight, or `null` when it is not one.
 * A `YYYY-MM-DD` string is that day exactly (and `2026-02-30` is not one); any
 * other string is read as an ISO date-time and gives its local day, which is how
 * the v5 value, a UTC instant, still reads back; a `Date` gives its local day.
 */
export function toDate(input: unknown): Date | null {
    if (input instanceof Date) {
        return Number.isNaN(input.getTime())
            ? null
            : make(input.getFullYear(), input.getMonth(), input.getDate());
    }
    if (typeof input !== 'string' || input === '') return null;
    const plain = PLAIN_DATE.exec(input);
    if (plain) {
        const [year, month, day] = [
            Number(plain[1]),
            Number(plain[2]) - 1,
            Number(plain[3]),
        ] as const;
        const date = make(year, month, day);
        return date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
            ? date
            : null;
    }
    // An ISO date-time needs a time part: `Date` also reads loose text such as
    // "May 15", which is no value.
    if (!/^\d{4,6}-\d{2}-\d{2}T/.test(input)) return null;
    return toDate(new Date(input));
}

/** The `YYYY-MM-DD` text of a day. */
export function toISODate(date: Date): string {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/** Negative, zero or positive as `a` is before, the same day as, or after `b`. */
export function compareDays(a: Date, b: Date): number {
    return (
        a.getFullYear() - b.getFullYear() ||
        a.getMonth() - b.getMonth() ||
        a.getDate() - b.getDate()
    );
}

export function sameDay(a: Date, b: Date): boolean {
    return compareDays(a, b) === 0;
}

export function addDays(date: Date, days: number): Date {
    return make(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function startOfMonth(date: Date): Date {
    return make(date.getFullYear(), date.getMonth(), 1);
}

/** The same day of month `months` later, or the last day of that month when it has fewer days. */
export function addMonths(date: Date, months: number): Date {
    const first = make(date.getFullYear(), date.getMonth() + months, 1);
    const last = make(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return make(
        first.getFullYear(),
        first.getMonth(),
        Math.min(date.getDate(), last),
    );
}

/** The first day of the week that holds `date`; `weekStart` is 0 for Sunday to 6 for Saturday. */
export function startOfWeek(date: Date, weekStart: number): Date {
    return addDays(date, -((date.getDay() - weekStart + 7) % 7));
}

export function endOfWeek(date: Date, weekStart: number): Date {
    return addDays(startOfWeek(date, weekStart), 6);
}

/** The 42 days of a month's calendar, six full weeks from the week that holds its first day. */
export function monthGrid(month: Date, weekStart: number): Date[] {
    const first = startOfWeek(startOfMonth(month), weekStart);
    return Array.from({ length: 42 }, (_, index) => addDays(first, index));
}
