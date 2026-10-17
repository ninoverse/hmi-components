import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { HmiPopover } from '../popover/popover.js';
import './date-picker.js';
import type {
    DatePickerChangeDetail,
    DatePickerOpenChangeDetail,
    HmiDatePicker,
} from './date-picker.js';
import { DatePicker } from './date-picker.react.js';

// May 2026 starts on a Friday, so a Monday-first grid begins on 27 April and
// ends on 7 June.
const TODAY = new Date(2026, 4, 15, 14, 30);

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiDatePicker> {
    const host = document.createElement('div');
    document.body.append(host);
    render(
        html`<div style="padding: 40px 20px; width: 360px">${template}</div>
            <button
                id="elsewhere"
                style="position: fixed; right: 0; top: 0"
            >
                Elsewhere
            </button>
            <div
                id="outside"
                style="position: fixed; left: 0; bottom: 0; width: 60px; height: 40px"
            ></div>`,
        host,
    );
    const el = host.querySelector('hmi-date-picker') as HmiDatePicker;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
}

// The attributes are parsed from text, as a page's markup would give them.
const plain = async (attrs = ''): Promise<HmiDatePicker> => {
    const host = document.createElement('div');
    host.innerHTML = `<div style="padding: 40px 20px; width: 360px">
            <hmi-date-picker aria-label="x" ${attrs}></hmi-date-picker>
        </div>
        <button id="elsewhere" style="position: fixed; right: 0; top: 0">Elsewhere</button>
        <div id="outside" style="position: fixed; left: 0; bottom: 0; width: 60px; height: 40px"></div>`;
    document.body.append(host);
    const el = host.querySelector('hmi-date-picker') as HmiDatePicker;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return el;
};

const trigger = (el: HmiDatePicker) =>
    el.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;
const popover = (el: HmiDatePicker) =>
    el.shadowRoot?.querySelector('hmi-popover') as HmiPopover;
const panel = (el: HmiDatePicker) =>
    popover(el).shadowRoot?.querySelector('.panel') as HTMLElement;
const isShown = (el: HmiDatePicker) => panel(el).matches(':popover-open');
const calendar = (el: HmiDatePicker) =>
    el.shadowRoot?.querySelector<HTMLElement>('.calendar') ?? null;
const days = (el: HmiDatePicker) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>('[part="day"]') ?? [],
    );
const part = (el: HmiDatePicker, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);
const parts = (el: HmiDatePicker, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );
const focused = (el: HmiDatePicker) => el.shadowRoot?.activeElement;
const text = (node: Element | null | undefined) => node?.textContent?.trim();
const outside = () => document.getElementById('outside') as HTMLElement;

/** The in-month day with this number. */
const day = (el: HmiDatePicker, n: number) =>
    days(el).find(
        (cell) => !cell.hasAttribute('data-outside') && text(cell) === `${n}`,
    ) as HTMLElement;
/** The day cells that carry a data attribute, as their numbers. */
const marked = (el: HmiDatePicker, attr: string) =>
    days(el)
        .filter((cell) => cell.hasAttribute(attr))
        .map((cell) => Number(text(cell)));
const title = (el: HmiDatePicker) => text(part(el, 'title'));
const button = (el: HmiDatePicker, label: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLButtonElement>(
            '.calendar button',
        ) ?? [],
    ).find(
        (b) => b.getAttribute('aria-label') === label || text(b) === label,
    ) as HTMLButtonElement;
const full = (year: number, month: number, date: number) =>
    new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(
        new Date(year, month, date),
    );

/** Lets the picker render, its popover show or hide, and a queued toggle event arrive. */
async function settle(el: HmiDatePicker) {
    await el.updateComplete;
    await popover(el).updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
}

const open = async (el: HmiDatePicker) => {
    await userEvent.click(trigger(el));
    await settle(el);
};

const listen = <T>(el: HmiDatePicker, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};

beforeEach(() => {
    // Only the clock: timers and animation frames stay real.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(TODAY);
});

// The real pointer stays where a test left it: park it in a corner, away from
// where the next test puts its picker.
afterEach(async () => {
    vi.useRealTimers();
    document.body.replaceChildren();
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-date-picker', () => {
    it('registers', () => {
        expect(customElements.get('hmi-date-picker')).toBeDefined();
    });

    it('renders a closed trigger, with no calendar built', async () => {
        const el = await plain();
        expect(el.mode).toBe('single');
        expect(el.value).toBe('');
        expect(el.open).toBe(false);
        expect(trigger(el).tagName).toBe('BUTTON');
        expect(calendar(el)).toBeNull();
        expect(isShown(el)).toBe(false);
    });

    describe('the trigger', () => {
        it('shows the placeholder, Pick a date by default, while nothing is chosen', async () => {
            const el = await plain();
            expect(part(el, 'value')).toBeNull();
            expect(text(part(el, 'placeholder'))).toBe('Pick a date');
            el.placeholder = 'When?';
            await el.updateComplete;
            expect(text(part(el, 'placeholder'))).toBe('When?');
        });

        it('shows the chosen day as day, month and year', async () => {
            const el = await plain('value="2026-05-15"');
            expect(text(part(el, 'value'))).toBe('15 May 2026');
            expect(part(el, 'placeholder')).toBeNull();
        });

        it('shows a range as its two ends, and a half-chosen one as its start', async () => {
            const el = await fixture(
                html`<hmi-date-picker
                    mode="range"
                    .value=${{ start: '2026-05-15', end: '2026-05-20' }}
                ></hmi-date-picker>`,
            );
            expect(text(part(el, 'value'))).toBe('15 May 2026 – 20 May 2026');
            el.value = { start: '2026-05-15', end: null };
            await el.updateComplete;
            expect(text(part(el, 'value'))).toBe('15 May 2026');
            el.value = { start: '2026-05-20', end: '2026-05-15' };
            await el.updateComplete;
            expect(text(part(el, 'value'))).toBe('15 May 2026 – 20 May 2026');
            el.value = null;
            await el.updateComplete;
            expect(text(part(el, 'placeholder'))).toBe('Pick a date');
        });

        it('reads a Date, and a v5 ISO date-time, as its local day', async () => {
            const el = await plain();
            el.value = new Date(2026, 4, 15, 23, 59);
            await el.updateComplete;
            expect(text(part(el, 'value'))).toBe('15 May 2026');
            el.value = new Date(2026, 4, 16).toISOString();
            await el.updateComplete;
            expect(text(part(el, 'value'))).toBe('16 May 2026');
        });

        it('shows the placeholder for text that is not a date', async () => {
            const el = await plain();
            for (const value of ['yesterday', '2026-02-30', '15/05/2026']) {
                el.value = value;
                await el.updateComplete;
                expect(part(el, 'value')).toBeNull();
            }
        });

        it('writes the day in the locale', async () => {
            const el = await plain('locale="it-IT" value="2026-05-15"');
            expect(text(part(el, 'value'))).toBe('15 mag 2026');
        });

        it('has the calendar icon', async () => {
            const el = await plain();
            const svg = part(el, 'icon')?.querySelector('svg');
            expect(svg?.getBoundingClientRect().width).toBeGreaterThan(0);
        });
    });

    describe('opening', () => {
        it('opens on a press on the trigger, and tells the consumer', async () => {
            const el = await plain();
            const events = listen<DatePickerOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await open(el);
            expect(el.open).toBe(true);
            expect(el.hasAttribute('open')).toBe(true);
            expect(isShown(el)).toBe(true);
            expect(trigger(el).getAttribute('aria-expanded')).toBe('true');
            expect(events.map((e) => e.detail)).toEqual([{ open: true }]);
        });

        it('dispatches hmi-open-change from the picker and not the popover', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-open-change', listener);
            await open(el);
            document.removeEventListener('hmi-open-change', listener);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<DatePickerOpenChangeDetail>;
            expect(event.target).toBe(el);
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
            expect(event.cancelable).toBe(false);
        });

        it('builds the calendar on the month of the value, else of today', async () => {
            const el = await plain('value="2026-09-03"');
            await open(el);
            expect(title(el)).toBe('September 2026');
            document.body.replaceChildren();
            const empty = await plain();
            await open(empty);
            expect(title(empty)).toBe('May 2026');
        });

        it('builds it again on every open, from the value then', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            await userEvent.click(button(el, 'Next year'));
            await settle(el);
            expect(title(el)).toBe('May 2027');
            await userEvent.keyboard('{Escape}');
            await settle(el);
            expect(calendar(el)).toBeNull();
            await open(el);
            expect(title(el)).toBe('May 2026');
        });

        it('gives focus to the chosen day, else the start of a range, else today', async () => {
            const el = await plain('value="2026-05-20"');
            await open(el);
            expect(focused(el)).toBe(day(el, 20));
            document.body.replaceChildren();
            const range = await fixture(
                html`<hmi-date-picker
                    mode="range"
                    .value=${{ start: '2026-05-04', end: '2026-05-08' }}
                ></hmi-date-picker>`,
            );
            await open(range);
            expect(focused(range)).toBe(day(range, 4));
            document.body.replaceChildren();
            const empty = await plain();
            await open(empty);
            expect(focused(empty)).toBe(day(empty, 15));
        });

        it('opens on Enter and on Space from the trigger', async () => {
            for (const key of ['{Enter}', ' ']) {
                const el = await plain('value="2026-05-15"');
                trigger(el).focus();
                await userEvent.keyboard(key);
                await settle(el);
                expect(el.open).toBe(true);
                expect(focused(el)).toBe(day(el, 15));
                document.body.replaceChildren();
            }
        });

        it('closes on Escape, tells the consumer, and gives focus back to the trigger', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            const events = listen<DatePickerOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            await userEvent.keyboard('{Escape}');
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            expect(calendar(el)).toBeNull();
            expect(events.map((e) => e.detail)).toEqual([{ open: false }]);
            expect(focused(el)).toBe(trigger(el));
        });

        it('closes on a click outside, without taking focus from what was clicked', async () => {
            const el = await plain();
            await open(el);
            await userEvent.click(outside());
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            const elsewhere = document.getElementById(
                'elsewhere',
            ) as HTMLElement;
            await open(el);
            await userEvent.click(elsewhere);
            await settle(el);
            expect(el.open).toBe(false);
            expect(document.activeElement).toBe(elsewhere);
        });

        it('tells nothing, and moves no focus, when open is set from code', async () => {
            const el = await plain('value="2026-05-15"');
            const opens = listen<DatePickerOpenChangeDetail>(
                el,
                'hmi-open-change',
            );
            el.open = true;
            await settle(el);
            expect(isShown(el)).toBe(true);
            expect(title(el)).toBe('May 2026');
            expect(focused(el)).toBeNull();
            el.open = false;
            await settle(el);
            expect(isShown(el)).toBe(false);
            expect(opens).toHaveLength(0);
        });

        it('reads open from the attribute', async () => {
            const el = await plain('open value="2026-05-15"');
            await settle(el);
            expect(el.open).toBe(true);
            expect(isShown(el)).toBe(true);
        });

        it('exports the panel part, so a page can style the calendar', async () => {
            const style = document.createElement('style');
            style.textContent =
                'hmi-date-picker::part(panel) { padding: 37px }';
            document.head.append(style);
            try {
                const el = await plain();
                el.open = true;
                await settle(el);
                expect(getComputedStyle(panel(el)).paddingTop).toBe('37px');
            } finally {
                style.remove();
            }
        });
    });

    describe('the calendar', () => {
        it('is a dialog with a title, a grid of six weeks and a footer', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            expect(calendar(el)?.getAttribute('role')).toBe('dialog');
            expect(title(el)).toBe('May 2026');
            expect(part(el, 'title')?.getAttribute('aria-live')).toBe('polite');
            const grid = part(el, 'grid') as HTMLElement;
            expect(grid.getAttribute('role')).toBe('grid');
            expect(grid.getAttribute('aria-labelledby')).toBe('title');
            expect(days(el)).toHaveLength(42);
            expect(grid.querySelectorAll('[role="row"]')).toHaveLength(7);
            expect(parts(el, 'weekday')).toHaveLength(7);
            expect(parts(el, 'nav')).toHaveLength(4);
            expect(parts(el, 'action').map(text)).toEqual(['Today', 'Clear']);
            expect(part(el, 'header')).not.toBeNull();
            expect(part(el, 'footer')).not.toBeNull();
        });

        it('starts the grid on Monday, and shows the days of the neighbouring months as outside', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            const first = days(el)[0] as HTMLElement;
            expect(first.getAttribute('aria-label')).toBe(full(2026, 3, 27));
            expect(days(el)[41]?.getAttribute('aria-label')).toBe(
                full(2026, 5, 7),
            );
            expect(marked(el, 'data-outside')).toEqual([
                27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7,
            ]);
            expect(parts(el, 'weekday').map(text)).toEqual([
                'M',
                'T',
                'W',
                'T',
                'F',
                'S',
                'S',
            ]);
        });

        it('is a grid of cells that name their date, and say which is chosen and which is today', async () => {
            const el = await plain('value="2026-05-20"');
            await open(el);
            const cell = day(el, 20);
            expect(cell.getAttribute('role')).toBe('gridcell');
            expect(cell.getAttribute('aria-label')).toBe(full(2026, 4, 20));
            expect(cell.getAttribute('aria-selected')).toBe('true');
            expect(day(el, 21).getAttribute('aria-selected')).toBe('false');
            expect(day(el, 15).getAttribute('aria-current')).toBe('date');
            expect(day(el, 16).hasAttribute('aria-current')).toBe(false);
            expect(marked(el, 'data-today')).toEqual([15]);
            expect(marked(el, 'data-selected')).toEqual([20]);
            for (const weekday of parts(el, 'weekday')) {
                expect(weekday.getAttribute('role')).toBe('columnheader');
            }
        });

        it('puts one day in the Tab order, the one with focus', async () => {
            const el = await plain('value="2026-05-20"');
            await open(el);
            const tabbable = days(el).filter((cell) => cell.tabIndex === 0);
            expect(tabbable).toEqual([day(el, 20)]);
            expect(marked(el, 'data-focus')).toEqual([20]);
        });

        it('shows a day before min or after max as disabled, and keeps it focusable', async () => {
            const el = await plain(
                'value="2026-05-15" min="2026-05-10" max="2026-05-20"',
            );
            await open(el);
            const disabled = marked(el, 'data-disabled');
            expect(disabled).toContain(9);
            expect(disabled).toContain(21);
            expect(disabled).not.toContain(10);
            expect(disabled).not.toContain(20);
            expect(day(el, 9).getAttribute('aria-disabled')).toBe('true');
            expect(day(el, 10).hasAttribute('aria-disabled')).toBe(false);
            expect(day(el, 21).getAttribute('aria-disabled')).toBe('true');
            expect(day(el, 9).hasAttribute('disabled')).toBe(false);
        });

        it('takes min and max as a Date too', async () => {
            const el = await plain('value="2026-05-15"');
            el.min = new Date(2026, 4, 10, 18);
            el.max = new Date(2026, 4, 20, 6);
            await open(el);
            expect(day(el, 9).hasAttribute('data-disabled')).toBe(true);
            expect(day(el, 10).hasAttribute('data-disabled')).toBe(false);
            expect(day(el, 20).hasAttribute('data-disabled')).toBe(false);
            expect(day(el, 21).hasAttribute('data-disabled')).toBe(true);
        });

        it('starts the week where week-start says, and clamps a number out of range', async () => {
            const el = await plain('value="2026-05-15" week-start="0"');
            await open(el);
            expect(days(el)[0]?.getAttribute('aria-label')).toBe(
                full(2026, 3, 26),
            );
            expect(parts(el, 'weekday')[0]?.getAttribute('aria-label')).toBe(
                'Sunday',
            );
            el.weekStart = 8;
            await settle(el);
            expect(parts(el, 'weekday')[0]?.getAttribute('aria-label')).toBe(
                'Monday',
            );
            el.weekStart = -1;
            await settle(el);
            expect(parts(el, 'weekday')[0]?.getAttribute('aria-label')).toBe(
                'Saturday',
            );
        });

        it('writes month and weekday names in the locale, and falls back for a tag Intl does not take', async () => {
            const el = await plain('value="2026-05-15" locale="it-IT"');
            await open(el);
            expect(title(el)).toBe('maggio 2026');
            expect(parts(el, 'weekday')[0]?.getAttribute('aria-label')).toBe(
                'lunedì',
            );
            el.locale = 'not a locale';
            await settle(el);
            expect(title(el)).toBe('May 2026');
        });

        it('takes the names of its buttons from properties', async () => {
            const el = await plain('value="2026-05-15"');
            Object.assign(el, {
                prevYearLabel: 'Anno prima',
                prevMonthLabel: 'Mese prima',
                nextMonthLabel: 'Mese dopo',
                nextYearLabel: 'Anno dopo',
                todayLabel: 'Oggi',
                clearLabel: 'Cancella',
            });
            await open(el);
            expect(
                parts(el, 'nav').map((nav) => nav.getAttribute('aria-label')),
            ).toEqual(['Anno prima', 'Mese prima', 'Mese dopo', 'Anno dopo']);
            expect(parts(el, 'action').map(text)).toEqual(['Oggi', 'Cancella']);
        });

        it('reads the names from their attributes', async () => {
            const el = await plain(
                'value="2026-05-15" prev-year-label="A" prev-month-label="B" next-month-label="C" next-year-label="D" today-label="E" clear-label="F"',
            );
            await open(el);
            expect(
                parts(el, 'nav').map((nav) => nav.getAttribute('aria-label')),
            ).toEqual(['A', 'B', 'C', 'D']);
            expect(parts(el, 'action').map(text)).toEqual(['E', 'F']);
        });
    });

    describe('the month buttons', () => {
        it('move the month and the year, and take the day with focus along', async () => {
            const el = await plain('value="2026-05-31"');
            await open(el);
            await userEvent.click(button(el, 'Next month'));
            await settle(el);
            expect(title(el)).toBe('June 2026');
            // 31 May clamps to the last day of June.
            expect(marked(el, 'data-focus')).toEqual([30]);
            await userEvent.click(button(el, 'Previous month'));
            await userEvent.click(button(el, 'Previous month'));
            await settle(el);
            expect(title(el)).toBe('April 2026');
            await userEvent.click(button(el, 'Next year'));
            await settle(el);
            expect(title(el)).toBe('April 2027');
            await userEvent.click(button(el, 'Previous year'));
            await userEvent.click(button(el, 'Previous year'));
            await settle(el);
            expect(title(el)).toBe('April 2025');
        });

        it('choose nothing, and leave the picker open', async () => {
            const el = await plain('value="2026-05-15"');
            const changes = listen(el, 'hmi-change');
            await open(el);
            await userEvent.click(button(el, 'Next month'));
            await settle(el);
            expect(changes).toHaveLength(0);
            expect(el.value).toBe('2026-05-15');
            expect(el.open).toBe(true);
        });
    });

    describe('from the keyboard', () => {
        const press = async (el: HmiDatePicker, key: string) => {
            await userEvent.keyboard(key);
            await settle(el);
        };

        it('moves focus by a day with the left and right arrows, and by a week with up and down', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            await press(el, '{ArrowRight}');
            expect(focused(el)).toBe(day(el, 16));
            await press(el, '{ArrowLeft}');
            await press(el, '{ArrowLeft}');
            expect(focused(el)).toBe(day(el, 14));
            await press(el, '{ArrowDown}');
            expect(focused(el)).toBe(day(el, 21));
            await press(el, '{ArrowUp}');
            await press(el, '{ArrowUp}');
            expect(focused(el)).toBe(day(el, 7));
        });

        it('crosses into the next month and the one before, and shows it', async () => {
            const el = await plain('value="2026-05-31"');
            await open(el);
            await press(el, '{ArrowRight}');
            expect(title(el)).toBe('June 2026');
            expect(focused(el)).toBe(day(el, 1));
            await press(el, '{ArrowLeft}');
            expect(title(el)).toBe('May 2026');
            expect(focused(el)).toBe(day(el, 31));
        });

        it('moves to the start and the end of the week with Home and End', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            await press(el, '{Home}');
            expect(focused(el)).toBe(day(el, 11));
            await press(el, '{End}');
            expect(focused(el)).toBe(day(el, 17));
        });

        it('moves by a month with PageUp and PageDown, and by a year with Shift', async () => {
            const el = await plain('value="2026-05-31"');
            await open(el);
            await press(el, '{PageDown}');
            expect(title(el)).toBe('June 2026');
            expect(focused(el)).toBe(day(el, 30));
            await press(el, '{PageUp}');
            await press(el, '{PageUp}');
            expect(title(el)).toBe('April 2026');
            await press(el, '{Shift>}{PageDown}{/Shift}');
            expect(title(el)).toBe('April 2027');
            await press(el, '{Shift>}{PageUp}{PageUp}{/Shift}');
            expect(title(el)).toBe('April 2025');
        });

        it('leaves a key with a modifier to the browser', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            await press(el, '{Control>}{ArrowRight}{/Control}');
            expect(focused(el)).toBe(day(el, 15));
        });

        it('chooses the focused day on Enter and on Space, and gives focus back', async () => {
            for (const key of ['{Enter}', ' ']) {
                const el = await plain('value="2026-05-15"');
                const changes = listen<DatePickerChangeDetail>(
                    el,
                    'hmi-change',
                );
                await open(el);
                await press(el, '{ArrowRight}');
                await press(el, key);
                expect(el.value).toBe('2026-05-16');
                expect(changes.map((e) => e.detail)).toEqual([
                    { value: '2026-05-16' },
                ]);
                expect(el.open).toBe(false);
                expect(focused(el)).toBe(trigger(el));
                document.body.replaceChildren();
            }
        });

        it('lets an arrow key cross min, and does not choose a day out of bounds', async () => {
            const el = await plain('value="2026-05-10" min="2026-05-10"');
            await open(el);
            await press(el, '{ArrowLeft}');
            expect(focused(el)).toBe(day(el, 9));
            await press(el, '{Enter}');
            expect(el.value).toBe('2026-05-10');
            expect(el.open).toBe(true);
        });
    });

    describe('choosing a date', () => {
        it('chooses a day on click: value, hmi-change, closed, focus back on the trigger', async () => {
            const el = await plain('value="2026-05-15"');
            const changes = listen<DatePickerChangeDetail>(el, 'hmi-change');
            await open(el);
            await userEvent.click(day(el, 20));
            await settle(el);
            expect(el.value).toBe('2026-05-20');
            expect(changes.map((e) => e.detail)).toEqual([
                { value: '2026-05-20' },
            ]);
            expect(el.open).toBe(false);
            expect(calendar(el)).toBeNull();
            expect(text(part(el, 'value'))).toBe('20 May 2026');
            expect(focused(el)).toBe(trigger(el));
        });

        it('dispatches hmi-change that bubbles, crosses the shadow root, and cannot be cancelled', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-change', listener);
            await open(el);
            await userEvent.click(day(el, 20));
            await settle(el);
            document.removeEventListener('hmi-change', listener);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<DatePickerChangeDetail>;
            expect(event.target).toBe(el);
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
            expect(event.cancelable).toBe(false);
        });

        it('tells nothing for the day that is already chosen, and closes', async () => {
            const el = await plain('value="2026-05-15"');
            const changes = listen(el, 'hmi-change');
            await open(el);
            await userEvent.click(day(el, 15));
            await settle(el);
            expect(changes).toHaveLength(0);
            expect(el.open).toBe(false);
        });

        it('chooses a day of a neighbouring month, and shows that month', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            const outsideDay = days(el).find(
                (cell) => cell.getAttribute('aria-label') === full(2026, 5, 2),
            ) as HTMLElement;
            await userEvent.click(outsideDay);
            await settle(el);
            expect(el.value).toBe('2026-06-02');
            await open(el);
            expect(title(el)).toBe('June 2026');
        });

        it('does not choose a day out of bounds, and stays open', async () => {
            const el = await plain('value="2026-05-15" min="2026-05-10"');
            const changes = listen(el, 'hmi-change');
            await open(el);
            // Playwright will not click what is aria-disabled: press it as a script.
            day(el, 3).click();
            await settle(el);
            expect(el.value).toBe('2026-05-15');
            expect(changes).toHaveLength(0);
            expect(el.open).toBe(true);
        });

        it('lets a listener veto a choice by setting value back', async () => {
            const el = await plain('value="2026-05-15"');
            el.addEventListener('hmi-change', () => {
                el.value = '2026-05-15';
            });
            await open(el);
            await userEvent.click(day(el, 20));
            await settle(el);
            expect(el.value).toBe('2026-05-15');
            expect(text(part(el, 'value'))).toBe('15 May 2026');
        });

        it('chooses today with the Today button, on a calendar that shows another month', async () => {
            const el = await plain('value="2026-09-03"');
            const changes = listen<DatePickerChangeDetail>(el, 'hmi-change');
            await open(el);
            await userEvent.click(button(el, 'Today'));
            await settle(el);
            expect(el.value).toBe('2026-05-15');
            expect(changes.map((e) => e.detail)).toEqual([
                { value: '2026-05-15' },
            ]);
            expect(el.open).toBe(false);
        });

        it('clears with the Clear button, tells the consumer, and stays open', async () => {
            const el = await plain('value="2026-05-15"');
            const changes = listen<DatePickerChangeDetail>(el, 'hmi-change');
            await open(el);
            await userEvent.click(button(el, 'Clear'));
            await settle(el);
            expect(el.value).toBe('');
            expect(changes.map((e) => e.detail)).toEqual([{ value: '' }]);
            expect(el.open).toBe(true);
            expect(text(part(el, 'placeholder'))).toBe('Pick a date');
            expect(marked(el, 'data-selected')).toEqual([]);
        });

        it('tells nothing when Clear has nothing to clear', async () => {
            const el = await plain();
            const changes = listen(el, 'hmi-change');
            await open(el);
            await userEvent.click(button(el, 'Clear'));
            await settle(el);
            expect(changes).toHaveLength(0);
        });
    });

    describe('choosing a range', () => {
        const rangePicker = (value?: unknown) =>
            fixture(
                html`<hmi-date-picker
                    mode="range"
                    aria-label="x"
                    .value=${value ?? null}
                ></hmi-date-picker>`,
            );

        it('takes a start and an end: the first keeps the calendar open, the second closes it', async () => {
            const el = await rangePicker();
            const changes = listen<DatePickerChangeDetail>(el, 'hmi-change');
            await open(el);
            await userEvent.click(day(el, 12));
            await settle(el);
            expect(el.value).toEqual({ start: '2026-05-12', end: null });
            expect(el.open).toBe(true);
            await userEvent.click(day(el, 18));
            await settle(el);
            expect(el.value).toEqual({
                start: '2026-05-12',
                end: '2026-05-18',
            });
            expect(el.open).toBe(false);
            expect(changes.map((e) => e.detail)).toEqual([
                { value: { start: '2026-05-12', end: null } },
                { value: { start: '2026-05-12', end: '2026-05-18' } },
            ]);
            expect(text(part(el, 'value'))).toBe('12 May 2026 – 18 May 2026');
        });

        it('makes the earlier of the two dates the start', async () => {
            const el = await rangePicker();
            await open(el);
            await userEvent.click(day(el, 18));
            await userEvent.click(day(el, 12));
            await settle(el);
            expect(el.value).toEqual({
                start: '2026-05-12',
                end: '2026-05-18',
            });
        });

        it('starts a new range on a third date', async () => {
            const el = await rangePicker({
                start: '2026-05-12',
                end: '2026-05-18',
            });
            await open(el);
            await userEvent.click(day(el, 3));
            await settle(el);
            expect(el.value).toEqual({ start: '2026-05-03', end: null });
            expect(el.open).toBe(true);
        });

        it('chooses a one-day range with the same date twice', async () => {
            const el = await rangePicker();
            await open(el);
            await userEvent.click(day(el, 12));
            await userEvent.click(day(el, 12));
            await settle(el);
            expect(el.value).toEqual({
                start: '2026-05-12',
                end: '2026-05-12',
            });
            expect(el.open).toBe(false);
        });

        it('marks the start, the end and the days between them', async () => {
            const el = await rangePicker({
                start: '2026-05-12',
                end: '2026-05-16',
            });
            await open(el);
            expect(marked(el, 'data-selected')).toEqual([12, 16]);
            expect(marked(el, 'data-in-range')).toEqual([12, 13, 14, 15, 16]);
            expect(day(el, 14).getAttribute('aria-selected')).toBe('true');
            expect(day(el, 17).getAttribute('aria-selected')).toBe('false');
        });

        it('previews the range to the day under the pointer while only the start is chosen', async () => {
            const el = await rangePicker({ start: '2026-05-12', end: null });
            await open(el);
            expect(marked(el, 'data-in-range')).toEqual([]);
            await userEvent.hover(day(el, 16));
            await el.updateComplete;
            expect(marked(el, 'data-in-range')).toEqual([12, 13, 14, 15, 16]);
            await userEvent.hover(day(el, 10));
            await el.updateComplete;
            expect(marked(el, 'data-in-range')).toEqual([]);
            await userEvent.hover(part(el, 'footer') as HTMLElement);
            await el.updateComplete;
            expect(marked(el, 'data-in-range')).toEqual([]);
        });

        it('clears to null', async () => {
            const el = await rangePicker({
                start: '2026-05-12',
                end: '2026-05-16',
            });
            const changes = listen<DatePickerChangeDetail>(el, 'hmi-change');
            await open(el);
            await userEvent.click(button(el, 'Clear'));
            await settle(el);
            expect(el.value).toBeNull();
            expect(changes.map((e) => e.detail)).toEqual([{ value: null }]);
        });

        it('chooses today as the start of a range', async () => {
            const el = await rangePicker();
            await open(el);
            await userEvent.click(button(el, 'Today'));
            await settle(el);
            expect(el.value).toEqual({ start: '2026-05-15', end: null });
            expect(el.open).toBe(true);
        });

        it('takes Dates as the ends, and reports text', async () => {
            const el = await rangePicker({
                start: new Date(2026, 4, 12, 9),
                end: new Date(2026, 4, 16, 22),
            });
            expect(text(part(el, 'value'))).toBe('12 May 2026 – 16 May 2026');
            const changes = listen<DatePickerChangeDetail>(el, 'hmi-change');
            await open(el);
            await userEvent.click(button(el, 'Clear'));
            await settle(el);
            expect(changes).toHaveLength(1);
        });

        it('shows no choice for a text value in range mode, and for a range in single mode', async () => {
            const el = await rangePicker('2026-05-15');
            expect(part(el, 'value')).toBeNull();
            const single = await plain();
            single.value = { start: '2026-05-15', end: null };
            await single.updateComplete;
            expect(part(single, 'value')).toBeNull();
        });
    });

    describe('disabled', () => {
        it('boolean attribute presence', async () => {
            const el = await plain('disabled');
            expect(el.disabled).toBe(true);
            expect(trigger(el).disabled).toBe(true);
        });

        it('does not open, and closes a calendar that is open', async () => {
            const el = await plain('value="2026-05-15"');
            await open(el);
            el.disabled = true;
            await settle(el);
            expect(el.open).toBe(false);
            expect(calendar(el)).toBeNull();
            el.open = true;
            await settle(el);
            expect(el.open).toBe(false);
            expect(isShown(el)).toBe(false);
            el.disabled = false;
            await settle(el);
            expect(trigger(el).disabled).toBe(false);
            await open(el);
            expect(el.open).toBe(true);
        });
    });

    describe('roles', () => {
        it('names the trigger by the label together with the chosen date', async () => {
            const el = await fixture(
                html`<hmi-date-picker
                    label="Start"
                    hint="When it begins"
                    value="2026-05-15"
                ></hmi-date-picker>`,
            );
            const base = trigger(el);
            expect(base.getAttribute('aria-haspopup')).toBe('dialog');
            expect(base.getAttribute('aria-expanded')).toBe('false');
            expect(base.getAttribute('aria-labelledby')).toBe('label value');
            expect(base.hasAttribute('aria-label')).toBe(false);
            expect(base.getAttribute('aria-describedby')).toBe('hint');
            expect(base.hasAttribute('aria-invalid')).toBe(false);
            const label = part(el, 'label') as HTMLLabelElement;
            expect(label.id).toBe('label');
            expect(label.htmlFor).toBe('control');
            expect(base.id).toBe('control');
            expect(
                el.shadowRoot?.querySelector('#value')?.textContent?.trim(),
            ).toBe('15 May 2026');
        });

        it('without a label, is named by aria-label, Date picker by default, and describes itself by the chosen date', async () => {
            const el = await fixture(
                html`<hmi-date-picker value="2026-05-15"></hmi-date-picker>`,
            );
            expect(trigger(el).getAttribute('aria-label')).toBe('Date picker');
            expect(trigger(el).hasAttribute('aria-labelledby')).toBe(false);
            expect(trigger(el).getAttribute('aria-describedby')).toBe('value');
            const named = await plain();
            expect(trigger(named).getAttribute('aria-label')).toBe('x');
        });

        it('names the calendar by what names the trigger', async () => {
            const labelled = await fixture(
                html`<hmi-date-picker label="Start"></hmi-date-picker>`,
            );
            await open(labelled);
            expect(calendar(labelled)?.getAttribute('aria-label')).toBe(
                'Start',
            );
            document.body.replaceChildren();
            const bare = await plain();
            await open(bare);
            expect(calendar(bare)?.getAttribute('aria-label')).toBe('x');
        });

        it('marks an error on the trigger, as an alert', async () => {
            const el = await fixture(
                html`<hmi-date-picker error="Required"></hmi-date-picker>`,
            );
            expect(trigger(el).getAttribute('aria-invalid')).toBe('true');
            expect(trigger(el).getAttribute('aria-describedby')).toBe(
                'error value',
            );
            expect(part(el, 'error')?.getAttribute('role')).toBe('alert');
            expect(trigger(el).classList.contains('invalid')).toBe(true);
        });

        it('shows the required marker on the label', async () => {
            const el = await fixture(
                html`<hmi-date-picker label="Start" required></hmi-date-picker>`,
            );
            expect(
                part(el, 'label')?.querySelector('.required'),
            ).not.toBeNull();
        });
    });

    describe('as a form control', () => {
        async function inForm(template: ReturnType<typeof html>) {
            const form = document.createElement('form');
            document.body.append(form);
            render(template, form);
            const el = form.querySelector('hmi-date-picker') as HmiDatePicker;
            await el.updateComplete;
            return { form, el };
        }

        it('submits the chosen day under its name, and nothing while none is chosen', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker name="start"></hmi-date-picker>`,
            );
            expect(new FormData(form).has('start')).toBe(false);
            el.value = '2026-05-15';
            await el.updateComplete;
            expect(new FormData(form).get('start')).toBe('2026-05-15');
        });

        it('submits the day of a Date, as the plain text', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker name="start"></hmi-date-picker>`,
            );
            el.value = new Date(2026, 4, 15, 23, 59);
            await el.updateComplete;
            expect(new FormData(form).get('start')).toBe('2026-05-15');
        });

        it('submits what the user chose', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker name="start"></hmi-date-picker>`,
            );
            await open(el);
            await userEvent.click(day(el, 20));
            await settle(el);
            expect(new FormData(form).get('start')).toBe('2026-05-20');
        });

        it('submits a range as JSON', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker name="stay" mode="range"></hmi-date-picker>`,
            );
            expect(new FormData(form).has('stay')).toBe(false);
            el.value = { start: '2026-05-12', end: '2026-05-18' };
            await el.updateComplete;
            expect(
                JSON.parse(new FormData(form).get('stay') as string),
            ).toEqual({
                start: '2026-05-12',
                end: '2026-05-18',
            });
        });

        it('submits its value and resets', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker name="start" value="2026-05-15"></hmi-date-picker>`,
            );
            expect(new FormData(form).get('start')).toBe('2026-05-15');
            el.value = '2026-06-01';
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('2026-05-15');
            expect(text(part(el, 'value'))).toBe('15 May 2026');
        });

        it('restores default-value on reset, and starts from it', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker name="start" default-value="2026-05-15"></hmi-date-picker>`,
            );
            expect(el.value).toBe('2026-05-15');
            el.value = '2026-06-01';
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toBe('2026-05-15');
        });

        it('resets a range to its default', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker
                    name="stay"
                    mode="range"
                    .defaultValue=${{ start: '2026-05-12', end: '2026-05-18' }}
                ></hmi-date-picker>`,
            );
            expect(el.value).toEqual({
                start: '2026-05-12',
                end: '2026-05-18',
            });
            el.value = null;
            await el.updateComplete;
            form.reset();
            await el.updateComplete;
            expect(el.value).toEqual({
                start: '2026-05-12',
                end: '2026-05-18',
            });
        });

        it('restores its state, a range from JSON', async () => {
            const { el } = await inForm(
                html`<hmi-date-picker name="stay" mode="range"></hmi-date-picker>`,
            );
            el.formStateRestoreCallback(
                '{"start":"2026-05-12","end":"2026-05-18"}',
            );
            await el.updateComplete;
            expect(el.value).toEqual({
                start: '2026-05-12',
                end: '2026-05-18',
            });
            el.formStateRestoreCallback('not json');
            expect(el.value).toEqual({
                start: '2026-05-12',
                end: '2026-05-18',
            });
            const single = await inForm(
                html`<hmi-date-picker name="start"></hmi-date-picker>`,
            );
            single.el.formStateRestoreCallback('2026-05-15');
            await single.el.updateComplete;
            expect(single.el.value).toBe('2026-05-15');
        });

        it('is invalid while required and nothing is chosen, with required-message as the text', async () => {
            const { form, el } = await inForm(
                html`<hmi-date-picker name="start" required></hmi-date-picker>`,
            );
            expect(el.validity.valueMissing).toBe(true);
            expect(el.validationMessage).toBe('Please pick a date.');
            expect(form.checkValidity()).toBe(false);
            el.requiredMessage = 'Choose a day.';
            await el.updateComplete;
            expect(el.validationMessage).toBe('Choose a day.');
            el.value = '2026-05-15';
            await el.updateComplete;
            expect(el.validity.valid).toBe(true);
            expect(form.checkValidity()).toBe(true);
        });

        it('needs both ends of a required range', async () => {
            const { el } = await inForm(
                html`<hmi-date-picker name="stay" mode="range" required></hmi-date-picker>`,
            );
            expect(el.validity.valueMissing).toBe(true);
            el.value = { start: '2026-05-12', end: null };
            await el.updateComplete;
            expect(el.validity.valueMissing).toBe(true);
            el.value = { start: '2026-05-12', end: '2026-05-18' };
            await el.updateComplete;
            expect(el.validity.valid).toBe(true);
        });

        it('reports a required miss on the trigger', async () => {
            const { el } = await inForm(
                html`<hmi-date-picker name="start" required></hmi-date-picker>`,
            );
            el.reportValidity();
            expect(focused(el)).toBe(trigger(el));
        });

        it('is invalid with the message of a non-empty error', async () => {
            const { el } = await inForm(
                html`<hmi-date-picker name="start" value="2026-05-15" error="Not allowed"></hmi-date-picker>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Not allowed');
            expect(text(part(el, 'error'))).toBe('Not allowed');
        });

        it('is not submitted, and the trigger is disabled, inside a disabled fieldset', async () => {
            const fieldset = document.createElement('fieldset');
            fieldset.disabled = true;
            document.body.append(fieldset);
            render(
                html`<hmi-date-picker name="start" value="2026-05-15"></hmi-date-picker>`,
                fieldset,
            );
            const el = fieldset.querySelector(
                'hmi-date-picker',
            ) as HmiDatePicker;
            await el.updateComplete;
            await el.updateComplete;
            expect(trigger(el).disabled).toBe(true);
        });

        it('closes when a fieldset disables it', async () => {
            const fieldset = document.createElement('fieldset');
            document.body.append(fieldset);
            render(html`<hmi-date-picker></hmi-date-picker>`, fieldset);
            const el = fieldset.querySelector(
                'hmi-date-picker',
            ) as HmiDatePicker;
            await el.updateComplete;
            await open(el);
            fieldset.disabled = true;
            await settle(el);
            expect(el.open).toBe(false);
            expect(calendar(el)).toBeNull();
        });
    });
});

describe('DatePicker (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const onChange = vi.fn();
        const onOpenChange = vi.fn();
        await act(async () => {
            root.render(
                createElement(DatePicker, {
                    value: '2026-05-15',
                    name: 'start',
                    label: 'Start',
                    required: true,
                    onChange,
                    onOpenChange,
                }),
            );
        });
        const el = host.querySelector('hmi-date-picker') as HmiDatePicker;
        await el.updateComplete;
        expect(el.value).toBe('2026-05-15');
        expect(el.name).toBe('start');
        expect(el.required).toBe(true);
        expect(text(part(el, 'value'))).toBe('15 May 2026');
        await open(el);
        expect(onOpenChange).toHaveBeenCalledOnce();
        expect(onOpenChange.mock.calls[0]?.[0].detail).toEqual({ open: true });
        await userEvent.click(day(el, 20));
        await settle(el);
        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange.mock.calls[0]?.[0].detail).toEqual({
            value: '2026-05-20',
        });
        expect(el.value).toBe('2026-05-20');
        await act(async () => root.unmount());
    });

    it('takes a range, and a Date, as properties', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(DatePicker, {
                    mode: 'range',
                    value: { start: new Date(2026, 4, 12), end: '2026-05-18' },
                }),
            );
        });
        const el = host.querySelector('hmi-date-picker') as HmiDatePicker;
        await el.updateComplete;
        expect(el.mode).toBe('range');
        expect(text(part(el, 'value'))).toBe('12 May 2026 – 18 May 2026');
        await act(async () => root.unmount());
    });
});
