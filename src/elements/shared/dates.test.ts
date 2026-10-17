import { describe, expect, it } from 'vitest';
import {
    addDays,
    addMonths,
    compareDays,
    endOfWeek,
    monthGrid,
    sameDay,
    startOfMonth,
    startOfWeek,
    toDate,
    toISODate,
} from './dates.js';

const ymd = (d: Date | null) => (d ? toISODate(d) : null);

describe('toDate', () => {
    it('reads YYYY-MM-DD as exactly that local day', () => {
        const date = toDate('2026-05-15') as Date;
        expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
            2026, 4, 15,
        ]);
        expect([date.getHours(), date.getMinutes()]).toEqual([0, 0]);
    });

    it('rejects a day that does not exist, and loose text', () => {
        expect(toDate('2026-02-30')).toBeNull();
        expect(toDate('2026-13-01')).toBeNull();
        expect(toDate('2026-5-1')).toBeNull();
        expect(toDate('May 15, 2026')).toBeNull();
        expect(toDate('')).toBeNull();
        expect(toDate(null)).toBeNull();
        expect(toDate(undefined)).toBeNull();
        expect(toDate(20260515)).toBeNull();
        expect(toDate(new Date('nope'))).toBeNull();
    });

    it('accepts the leap day of a leap year only', () => {
        expect(ymd(toDate('2024-02-29'))).toBe('2024-02-29');
        expect(toDate('2026-02-29')).toBeNull();
    });

    it('gives the local day of a Date, whatever its time', () => {
        expect(ymd(toDate(new Date(2026, 4, 15, 23, 59, 59)))).toBe(
            '2026-05-15',
        );
        expect(ymd(toDate(new Date(2026, 4, 15, 0, 0, 0)))).toBe('2026-05-15');
    });

    it('gives the local day of an ISO date-time, which reads a v5 value back', () => {
        const local = new Date(2026, 4, 15);
        expect(ymd(toDate(local.toISOString()))).toBe('2026-05-15');
        expect(ymd(toDate('2026-05-15T23:30:00'))).toBe('2026-05-15');
    });

    it('keeps a year below 100', () => {
        expect(toISODate(toDate('0099-01-02') as Date)).toBe('0099-01-02');
    });
});

describe('toISODate', () => {
    it('pads to YYYY-MM-DD', () => {
        expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
    });
});

describe('comparing', () => {
    it('compares by day, ignoring the time', () => {
        expect(
            compareDays(new Date(2026, 4, 15, 23), new Date(2026, 4, 15)),
        ).toBe(0);
        expect(
            compareDays(new Date(2026, 4, 14), new Date(2026, 4, 15)),
        ).toBeLessThan(0);
        expect(
            compareDays(new Date(2027, 0, 1), new Date(2026, 11, 31)),
        ).toBeGreaterThan(0);
        expect(
            sameDay(new Date(2026, 4, 15, 1), new Date(2026, 4, 15, 22)),
        ).toBe(true);
    });
});

describe('adding', () => {
    it('adds days across months and years', () => {
        expect(ymd(addDays(new Date(2026, 4, 31), 1))).toBe('2026-06-01');
        expect(ymd(addDays(new Date(2026, 0, 1), -1))).toBe('2025-12-31');
        expect(ymd(addDays(new Date(2026, 4, 15), 0))).toBe('2026-05-15');
    });

    it('adds whole days over a daylight-saving change', () => {
        // Whichever zone the browser is in, a day is a calendar day.
        for (const start of [
            '2026-03-28',
            '2026-10-24',
            '2026-03-07',
            '2026-11-01',
        ]) {
            const from = toDate(start) as Date;
            expect(ymd(addDays(from, 2))).toBe(
                toISODate(
                    new Date(
                        from.getFullYear(),
                        from.getMonth(),
                        from.getDate() + 2,
                    ),
                ),
            );
            expect(addDays(from, 2).getHours()).toBe(0);
        }
    });

    it('adds months and keeps the day of month, or the last day of a shorter month', () => {
        expect(ymd(addMonths(new Date(2026, 4, 15), 1))).toBe('2026-06-15');
        expect(ymd(addMonths(new Date(2026, 0, 31), 1))).toBe('2026-02-28');
        expect(ymd(addMonths(new Date(2024, 0, 31), 1))).toBe('2024-02-29');
        expect(ymd(addMonths(new Date(2026, 2, 31), -1))).toBe('2026-02-28');
        expect(ymd(addMonths(new Date(2026, 11, 15), 1))).toBe('2027-01-15');
        expect(ymd(addMonths(new Date(2026, 0, 15), -1))).toBe('2025-12-15');
        expect(ymd(addMonths(new Date(2026, 4, 15), 12))).toBe('2027-05-15');
    });

    it('finds the first of a month', () => {
        expect(ymd(startOfMonth(new Date(2026, 4, 15)))).toBe('2026-05-01');
    });
});

describe('weeks', () => {
    // 15 May 2026 is a Friday.
    it('finds the start and end of a week for any first weekday', () => {
        const friday = new Date(2026, 4, 15);
        expect(ymd(startOfWeek(friday, 1))).toBe('2026-05-11');
        expect(ymd(endOfWeek(friday, 1))).toBe('2026-05-17');
        expect(ymd(startOfWeek(friday, 0))).toBe('2026-05-10');
        expect(ymd(endOfWeek(friday, 0))).toBe('2026-05-16');
        expect(ymd(startOfWeek(friday, 6))).toBe('2026-05-09');
        expect(ymd(startOfWeek(friday, 5))).toBe('2026-05-15');
        expect(ymd(startOfWeek(new Date(2026, 4, 11), 1))).toBe('2026-05-11');
    });

    it('lays out six weeks from the week of the first day', () => {
        const grid = monthGrid(new Date(2026, 4, 20), 1);
        expect(grid).toHaveLength(42);
        expect(ymd(grid[0] ?? null)).toBe('2026-04-27');
        expect(ymd(grid[41] ?? null)).toBe('2026-06-07');
        expect(grid.filter((d) => d.getMonth() === 4)).toHaveLength(31);
        expect(ymd(monthGrid(new Date(2026, 4, 1), 0)[0] ?? null)).toBe(
            '2026-04-26',
        );
    });

    it('starts the grid on the first when the month starts on the first weekday', () => {
        // 1 June 2026 is a Monday.
        expect(ymd(monthGrid(new Date(2026, 5, 10), 1)[0] ?? null)).toBe(
            '2026-06-01',
        );
    });
});
