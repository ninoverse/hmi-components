import {
    html,
    isServer,
    nothing,
    type PropertyValues,
    type TemplateResult,
} from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../popover/popover.js';
import type {
    HmiPopover,
    PopoverOpenChangeDetail,
} from '../popover/popover.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    addDays,
    addMonths,
    compareDays,
    type DateInput,
    endOfWeek,
    monthGrid,
    sameDay,
    startOfMonth,
    startOfWeek,
    toDate,
    toISODate,
} from '../shared/dates.js';
import { emit } from '../shared/events.js';
import {
    coerceFormValue,
    type FormKind,
    HmiFormField,
} from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './date-picker.styles.js';

export type { DateInput } from '../shared/dates.js';

/** Whether the picker takes one date or a start and an end. */
export type DatePickerMode = 'single' | 'range';

/** A range as the picker reports it: `YYYY-MM-DD` text, `end` `null` while only the start is chosen. */
export interface DatePickerRange {
    start: string;
    end: string | null;
}

/** A range as `value` accepts it: each end text or a `Date`. */
export interface DatePickerRangeInput {
    start: DateInput;
    end: DateInput | null;
}

/** What `value` accepts: a date, a range, or nothing. */
export type DatePickerValueInput = DateInput | DatePickerRangeInput | null;

/** What the picker reports: `YYYY-MM-DD` text (`''` for none) in single mode, a range (`null` for none) in range mode. */
export type DatePickerValue = string | DatePickerRange | null;

/** Detail of `hmi-change`: the value the picker now holds. */
export interface DatePickerChangeDetail {
    value: DatePickerValue;
}

/** Detail of `hmi-open-change`. */
export interface DatePickerOpenChangeDetail {
    /** Whether the calendar is open now. */
    open: boolean;
}

// A chosen date, or a range of them, as days at local midnight.
interface Selection {
    start: Date;
    end: Date | null;
}

const isRangeInput = (value: unknown): value is DatePickerRangeInput =>
    typeof value === 'object' && value !== null && !(value instanceof Date);

const calendarIcon = html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <rect x="2" y="3.5" width="12" height="10" rx="1.2" />
    <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
</svg>`;

interface Formats {
    locale: string;
    title: Intl.DateTimeFormat;
    narrow: Intl.DateTimeFormat;
    long: Intl.DateTimeFormat;
    full: Intl.DateTimeFormat;
    short: Intl.DateTimeFormat;
}

function makeFormats(locale: string): Formats {
    return {
        locale,
        title: new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
        }),
        narrow: new Intl.DateTimeFormat(locale, { weekday: 'narrow' }),
        long: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
        full: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
        short: new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }),
    };
}

/**
 * Calendar date picker: a trigger that shows the chosen date, and a month calendar
 * in a popover that opens under it. It is built from `hmi-popover`, so the calendar
 * is a panel in the top layer that the page's overflow cannot clip. `mode` is
 * `single` (one date, the default) or `range` (a start and an end).
 *
 * A date is its calendar day, never a moment: `value` is the plain `YYYY-MM-DD`
 * text of a native `<input type="date">`, in the user's own calendar, so it does
 * not move with a time zone and a server reads the day the user clicked. `value`,
 * `min` and `max` also take a `Date` (set as a property) or an ISO date-time, each
 * read as its local day, which is how a v5 value reads back. In `range` mode `value`
 * is a property, `{ start, end }`, with `end` `null` until the second date is
 * chosen, and `null` for none; in `single` mode it is a string, `''` for none.
 *
 * A native form control: it submits `name=value` (a single date, or a range as JSON,
 * `{"start":"2026-05-15","end":"2026-05-20"}`; nothing while none is chosen),
 * `form.reset()` restores `default-value`, and `required` makes an empty choice
 * invalid, with `required-message` as the text. A range counts as chosen only when
 * both ends are, so a start without an end is invalid while `required`. A non-empty
 * `error` makes it invalid with that message.
 *
 * The element owns `value`: choosing a date or a range fires `hmi-change` with
 * `{ value }`, in the shape of `value`, only when it differs from what it held. In
 * `single` mode choosing a date closes the calendar. In `range` mode the first date
 * fires `hmi-change` with `end` `null` and keeps it open, the second closes it (the
 * earlier of the two is the start), and a third starts a new range. To veto a
 * choice, set `value` back from a listener. It owns `open` too, which follows the
 * user; setting it from code opens or closes the calendar and fires nothing.
 *
 * The calendar is a `dialog` holding the month, previous and next buttons for month
 * and year, a `grid` of days and Today and Clear buttons. It is built when it opens,
 * on the month of the value (else today), and focus goes to the chosen day, else the
 * first day of a range, else today. The arrow keys move focus by a day or a week,
 * Home and End to the start and end of the week, PageUp and PageDown by a month, and
 * Shift with either by a year; Enter and Space choose. Escape closes the calendar
 * and gives focus back to the trigger. A day before `min` or after `max` is
 * `aria-disabled`: it takes focus, so the arrow keys cross the bound, and cannot be
 * chosen. Today is `aria-current="date"`.
 *
 * `locale` (a BCP 47 tag, default `en-GB`) sets the month and weekday names and the
 * trigger's text through `Intl`, and `week-start` the first day of the week, from 0
 * (Sunday) to 6, default 1 (Monday). The names of the buttons are properties.
 *
 * @tag hmi-date-picker
 * @csspart base - The trigger `<button>`.
 * @csspart icon - The calendar icon in the trigger.
 * @csspart value - The trigger's text: the chosen date or range.
 * @csspart placeholder - The trigger's text while nothing is chosen.
 * @csspart panel - The floating calendar panel.
 * @csspart header - The row of month and year buttons and the month title.
 * @csspart nav - A month or year button.
 * @csspart title - The month and year.
 * @csspart weekday - A weekday heading.
 * @csspart grid - The grid of days.
 * @csspart day - One day. `data-selected`, `data-in-range`, `data-today`, `data-outside` and `data-focus` mark it.
 * @csspart footer - The row of Today and Clear.
 * @csspart action - The Today and Clear buttons.
 * @csspart label - The label.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 * @fires {CustomEvent<DatePickerChangeDetail>} hmi-change - The user chose a different date or range, or cleared it.
 * @fires {CustomEvent<DatePickerOpenChangeDetail>} hmi-open-change - The user opened or closed the calendar. Not cancelable, and not fired when `open` is set from code.
 *
 * @example
 * <hmi-date-picker name="start" label="Start date" value="2026-05-15" min="2026-05-01"></hmi-date-picker>
 */
@customElement('hmi-date-picker')
export class HmiDatePicker extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** One date, or a start and an end. @default 'single' */
    @property({ reflect: true }) accessor mode: DatePickerMode = 'single';

    /** The chosen date as `YYYY-MM-DD` (`''` for none), or in `range` mode a `{ start, end }` property (`null` for none). Also a `Date` or an ISO date-time, as a property. The attribute is the initial value. @default '' */
    @property() accessor value: DatePickerValueInput = '';

    /** Initial value, and what `form.reset()` restores. Defaults to the value at first render. */
    @property({ attribute: 'default-value' }) accessor defaultValue:
        | DatePickerValueInput
        | undefined;

    /** The earliest day that can be chosen: `YYYY-MM-DD`, or a `Date` as a property. */
    @property() accessor min: DateInput | undefined;

    /** The latest day that can be chosen: `YYYY-MM-DD`, or a `Date` as a property. */
    @property() accessor max: DateInput | undefined;

    /** Trigger text while nothing is chosen. @default 'Pick a date' */
    @property() accessor placeholder = 'Pick a date';

    /** The language of the month and weekday names and the trigger's text: a BCP 47 tag. @default 'en-GB' */
    @property() accessor locale = 'en-GB';

    /** The first day of the week, 0 for Sunday to 6 for Saturday. @default 1 */
    @property({ type: Number, attribute: 'week-start' }) accessor weekStart = 1;

    /** Whether the calendar is open. @default false */
    @property({ type: Boolean, reflect: true }) accessor open = false;

    /** Text of the error a `required` picker reports while nothing is chosen. @default 'Please pick a date.' */
    @property({ attribute: 'required-message' }) accessor requiredMessage =
        'Please pick a date.';

    /** Accessible name of the previous-year button. @default 'Previous year' */
    @property({ attribute: 'prev-year-label' }) accessor prevYearLabel =
        'Previous year';

    /** Accessible name of the previous-month button. @default 'Previous month' */
    @property({ attribute: 'prev-month-label' }) accessor prevMonthLabel =
        'Previous month';

    /** Accessible name of the next-month button. @default 'Next month' */
    @property({ attribute: 'next-month-label' }) accessor nextMonthLabel =
        'Next month';

    /** Accessible name of the next-year button. @default 'Next year' */
    @property({ attribute: 'next-year-label' }) accessor nextYearLabel =
        'Next year';

    /** Text of the button that chooses today. @default 'Today' */
    @property({ attribute: 'today-label' }) accessor todayLabel = 'Today';

    /** Text of the button that clears the choice. @default 'Clear' */
    @property({ attribute: 'clear-label' }) accessor clearLabel = 'Clear';

    // The month the calendar shows, the day that has the focus, today and the day
    // under the pointer while a range is half chosen. They are read in the browser
    // as the calendar opens: the first render depends on properties alone.
    @state() private accessor viewMonth: Date | undefined;
    @state() private accessor focusDate: Date | undefined;
    @state() private accessor today: Date | undefined;
    @state() private accessor hoverEnd: Date | undefined;

    @query('.base') private accessor trigger!: HTMLButtonElement;
    @query('hmi-popover') private accessor list!: HmiPopover;

    #initialValue: DatePickerValueInput = '';
    #formats: Formats | undefined;

    protected get formValue(): DatePickerValue {
        const selection = this.#selection();
        return selection ? this.#output(selection) : null;
    }

    /* The trigger is not a native control that validates: `syncForm` reports validity itself. */
    protected get control(): null {
        return null;
    }

    protected resetFormValue(): void {
        this.value = this.defaultValue ?? this.#initialValue;
    }

    protected override restoreFormValue(
        state: string | File | FormData | null,
    ) {
        if (typeof state !== 'string') return;
        if (this.mode !== 'range') {
            this.value = state;
            return;
        }
        try {
            const range: unknown = JSON.parse(state);
            if (isRangeInput(range)) this.value = range;
        } catch {
            // A state that is not a range is ignored.
        }
    }

    /** Reports the chosen value, and a missing choice or an error anchored on the trigger. */
    protected override syncForm(): void {
        this.internals.setFormValue(
            coerceFormValue(this.formKind, this.formValue, this),
        );
        const anchor = this.trigger ?? undefined;
        const selection = this.#selection();
        const chosen =
            selection !== undefined &&
            (this.mode !== 'range' || selection.end !== null);
        if (this.error) {
            this.internals.setValidity(
                { customError: true },
                this.error,
                anchor,
            );
        } else if (this.required && !chosen && this.requiredMessage) {
            this.internals.setValidity(
                { valueMissing: true },
                this.requiredMessage,
                anchor,
            );
        } else {
            this.internals.setValidity({});
        }
    }

    /** A fieldset that disables the picker closes the calendar too. */
    override formDisabledCallback(disabled: boolean): void {
        super.formDisabledCallback(disabled);
        if (disabled) this.open = false;
    }

    override willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            if (this.defaultValue !== undefined && this.value === '') {
                this.value = this.defaultValue;
            }
            this.#initialValue = this.value;
        }
        // A disabled picker is closed, and cannot be opened from code. Only
        // `disabled` itself is read here: `isDisabled` still says disabled for one
        // update after it is set to false.
        if (this.disabled && this.open) this.open = false;
        if (changed.has('open') && !isServer) {
            if (this.open) this.#initCalendar();
            else this.hoverEnd = undefined;
        }
        super.willUpdate(changed);
    }

    // The chosen day, or the days of the chosen range, from `value`: undefined when
    // it holds none. Whatever the user set is read, not stored, so a `Date` works.
    #selection(): Selection | undefined {
        const value = this.value;
        if (this.mode === 'range') {
            if (!isRangeInput(value)) return undefined;
            const start = toDate(value.start);
            if (!start) return undefined;
            const end = value.end == null ? null : toDate(value.end);
            return end && compareDays(end, start) < 0
                ? { start: end, end: start }
                : { start, end };
        }
        const day = isRangeInput(value) ? null : toDate(value);
        return day ? { start: day, end: null } : undefined;
    }

    #output(selection: Selection): DatePickerValue {
        return this.mode === 'range'
            ? {
                  start: toISODate(selection.start),
                  end: selection.end ? toISODate(selection.end) : null,
              }
            : toISODate(selection.start);
    }

    #bounds(): { min: Date | null; max: Date | null } {
        return { min: toDate(this.min), max: toDate(this.max) };
    }

    #outOfBounds(day: Date): boolean {
        const { min, max } = this.#bounds();
        return (
            (min !== null && compareDays(day, min) < 0) ||
            (max !== null && compareDays(day, max) > 0)
        );
    }

    #week(): number {
        const start = Math.trunc(this.weekStart);
        return Number.isFinite(start) ? ((start % 7) + 7) % 7 : 1;
    }

    // The formats of the locale, made once; a tag `Intl` does not accept gives en-GB.
    #intl(): Formats {
        if (this.#formats?.locale === this.locale) return this.#formats;
        let formats: Formats;
        try {
            formats = makeFormats(this.locale);
        } catch {
            formats = makeFormats('en-GB');
        }
        this.#formats = { ...formats, locale: this.locale };
        return this.#formats;
    }

    // As the calendar opens: the month of the chosen day, else today's, and focus on
    // that day.
    #initCalendar(): void {
        const today = toDate(new Date()) as Date;
        const focus = this.#selection()?.start ?? today;
        this.today = today;
        this.focusDate = focus;
        this.viewMonth = startOfMonth(focus);
        this.hoverEnd = undefined;
    }

    #sameSelection(a: Selection | undefined, b: Selection | undefined) {
        if (!a || !b) return a === b;
        const end = (s: Selection) => s.end?.getTime();
        return sameDay(a.start, b.start) && end(a) === end(b);
    }

    // Holds a choice, and tells the consumer when it differs from the one held.
    #choose(next: Selection | undefined): void {
        const previous = this.#selection();
        this.value = next
            ? this.#output(next)
            : this.mode === 'range'
              ? null
              : '';
        if (this.#sameSelection(previous, next)) return;
        emit<DatePickerChangeDetail>(this, 'hmi-change', {
            value: this.value as DatePickerValue,
        });
    }

    #pick(day: Date): void {
        this.focusDate = day;
        const grid = monthGrid(this.viewMonth as Date, this.#week());
        if (!grid.some((cell) => sameDay(cell, day))) {
            this.viewMonth = startOfMonth(day);
        }
        if (this.#outOfBounds(day)) return;
        if (this.mode !== 'range') {
            this.#choose({ start: day, end: null });
            this.#setOpen(false);
            return;
        }
        const current = this.#selection();
        const next: Selection =
            !current || current.end !== null
                ? { start: day, end: null }
                : compareDays(day, current.start) < 0
                  ? { start: day, end: current.start }
                  : { start: current.start, end: day };
        this.#choose(next);
        if (next.end !== null) this.#setOpen(false);
    }

    #clear(): void {
        this.#choose(undefined);
    }

    // A change the user made: it is told to the consumer, and focus follows it.
    // Nothing is told for a change the consumer made through `open`.
    #setOpen(open: boolean): void {
        if (this.open === open) return;
        this.open = open;
        emit<DatePickerOpenChangeDetail>(this, 'hmi-open-change', { open });
        if (open) void this.#focusDay();
        else this.#restoreFocus();
    }

    // The focus date's cell takes focus, once the calendar has rendered and shown.
    async #focusDay(): Promise<void> {
        await this.updateComplete;
        await this.list?.updateComplete;
        this.renderRoot
            .querySelector<HTMLElement>('.day[data-focus]')
            ?.focus({ preventScroll: true });
    }

    // The browser gives focus back on close only to what had it when that was
    // inside the popover in the node tree, and the calendar is slotted: when focus
    // is still in it, or nowhere, it goes back to the trigger.
    #restoreFocus(): void {
        const inside = this.shadowRoot?.activeElement?.closest('.calendar');
        if (inside || document.activeElement === document.body) {
            this.trigger?.focus();
        }
    }

    // The popover's own report of what the user did to it: the picker tells the
    // consumer in its own name.
    #onPopoverOpenChange(event: CustomEvent<PopoverOpenChangeDetail>): void {
        event.stopPropagation();
        this.#setOpen(event.detail.open);
    }

    // Moves to a day, showing its month, and gives it focus.
    #moveTo(day: Date): void {
        this.focusDate = day;
        const view = this.viewMonth as Date;
        if (
            day.getMonth() !== view.getMonth() ||
            day.getFullYear() !== view.getFullYear()
        ) {
            this.viewMonth = startOfMonth(day);
        }
        void this.#focusDay();
    }

    // The month buttons move the view and the focus date with it, so the cell that
    // takes Tab is always in the month shown.
    #navigate(months: number): void {
        const target = addMonths(this.focusDate as Date, months);
        this.focusDate = target;
        this.viewMonth = startOfMonth(target);
    }

    #onGridKeydown(event: KeyboardEvent): void {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const focus = this.focusDate;
        if (!focus) return;
        const week = this.#week();
        let target: Date | undefined;
        switch (event.key) {
            case 'ArrowLeft':
                target = addDays(focus, -1);
                break;
            case 'ArrowRight':
                target = addDays(focus, 1);
                break;
            case 'ArrowUp':
                target = addDays(focus, -7);
                break;
            case 'ArrowDown':
                target = addDays(focus, 7);
                break;
            case 'Home':
                target = startOfWeek(focus, week);
                break;
            case 'End':
                target = endOfWeek(focus, week);
                break;
            case 'PageUp':
                target = addMonths(focus, event.shiftKey ? -12 : -1);
                break;
            case 'PageDown':
                target = addMonths(focus, event.shiftKey ? 12 : 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.#pick(focus);
                return;
            default:
                return;
        }
        event.preventDefault();
        this.#moveTo(target);
    }

    // Whether a day is inside the range, with a half-chosen one reaching to the
    // day under the pointer.
    #inRange(day: Date, selection: Selection | undefined): boolean {
        if (this.mode !== 'range' || !selection) return false;
        const end =
            selection.end ??
            (this.hoverEnd && compareDays(selection.start, this.hoverEnd) < 0
                ? this.hoverEnd
                : null);
        return (
            end !== null &&
            compareDays(day, selection.start) >= 0 &&
            compareDays(day, end) <= 0
        );
    }

    /** The label names the trigger together with the chosen date. */
    protected override renderLabel(): TemplateResult | typeof nothing {
        return this.label
            ? html`<label id="label" part="label" class="label" for="control"
                  >${this.label}${
                      this.required
                          ? html`<span class="required" aria-hidden="true">*</span>`
                          : nothing
}</label
              >`
            : nothing;
    }

    #triggerText(selection: Selection | undefined): string | undefined {
        if (!selection) return undefined;
        const { short } = this.#intl();
        return selection.end
            ? `${short.format(selection.start)} – ${short.format(selection.end)}`
            : short.format(selection.start);
    }

    #renderDay(
        day: Date,
        selection: Selection | undefined,
        view: Date,
    ): TemplateResult {
        const intl = this.#intl();
        const selected =
            selection !== undefined &&
            (sameDay(day, selection.start) ||
                (selection.end !== null && sameDay(day, selection.end)));
        const inRange = this.#inRange(day, selection);
        const focus = this.focusDate;
        const isFocus = focus !== undefined && sameDay(day, focus);
        const disabled = this.#outOfBounds(day);
        const today = this.today;
        const isToday = today !== undefined && sameDay(day, today);
        return html`<div
            part="day"
            class="day"
            role="gridcell"
            tabindex=${isFocus ? 0 : -1}
            aria-label=${intl.full.format(day)}
            aria-selected=${selected || (inRange && selection?.end) ? 'true' : 'false'}
            aria-disabled=${ifDefined(disabled ? 'true' : undefined)}
            aria-current=${ifDefined(isToday ? 'date' : undefined)}
            ?data-outside=${day.getMonth() !== view.getMonth()}
            ?data-today=${isToday}
            ?data-selected=${selected}
            ?data-in-range=${inRange}
            ?data-focus=${isFocus}
            ?data-disabled=${disabled}
            @click=${() => this.#pick(day)}
            @mouseenter=${() => {
                if (this.mode === 'range') this.hoverEnd = day;
            }}
            >${day.getDate()}</div
        >`;
    }

    #renderCalendar(name: string): TemplateResult {
        const intl = this.#intl();
        const view = this.viewMonth as Date;
        const days = monthGrid(view, this.#week());
        const rows = Array.from({ length: 6 }, (_, row) =>
            days.slice(row * 7, row * 7 + 7),
        );
        const selection = this.#selection();
        const nav = (label: string, glyph: string, months: number) =>
            html`<button
                part="nav"
                class="nav"
                type="button"
                aria-label=${label}
                @click=${() => this.#navigate(months)}
            >
                ${glyph}
            </button>`;
        return html`<div class="calendar" role="dialog" aria-label=${name}>
            <div part="header" class="header">
                ${nav(this.prevYearLabel, '«', -12)}
                ${nav(this.prevMonthLabel, '‹', -1)}
                <div id="title" part="title" class="title" aria-live="polite">
                    ${intl.title.format(view)}
                </div>
                ${nav(this.nextMonthLabel, '›', 1)}
                ${nav(this.nextYearLabel, '»', 12)}
            </div>
            <div
                part="grid"
                class="grid"
                role="grid"
                aria-labelledby="title"
                @keydown=${this.#onGridKeydown}
                @mouseleave=${() => {
                    this.hoverEnd = undefined;
                }}
            >
                <div class="row head" role="row">
                    ${(rows[0] ?? []).map(
                        (day) => html`<div
                            part="weekday"
                            class="weekday"
                            role="columnheader"
                            aria-label=${intl.long.format(day)}
                            >${intl.narrow.format(day)}</div
                        >`,
                    )}
                </div>
                ${rows.map(
                    (row) => html`<div class="row" role="row">
                        ${row.map((day) => this.#renderDay(day, selection, view))}
                    </div>`,
                )}
            </div>
            <div part="footer" class="footer">
                <button
                    part="action"
                    class="action"
                    type="button"
                    @click=${() => this.#pick(this.today as Date)}
                >
                    ${this.todayLabel}
                </button>
                <button
                    part="action"
                    class="action"
                    type="button"
                    @click=${this.#clear}
                >
                    ${this.clearLabel}
                </button>
            </div>
        </div>`;
    }

    override render() {
        const selection = this.#selection();
        const text = this.#triggerText(selection);
        const showing = this.open && !this.isDisabled;
        const name = this.label
            ? undefined
            : (this.getAttribute('aria-label') ?? 'Date picker');
        const describedBy = [
            this.describedBy,
            // Without a visible label the name is the fixed one, so the choice is
            // read as its description.
            this.label ? undefined : 'value',
        ]
            .filter(Boolean)
            .join(' ');
        return html`
            ${this.renderLabel()}
            <hmi-popover
                exportparts="panel"
                .width=${360}
                .open=${showing}
                @hmi-open-change=${this.#onPopoverOpenChange}
            >
                <button
                    slot="trigger"
                    id="control"
                    part="base"
                    class=${this.error ? 'base invalid' : 'base'}
                    type="button"
                    aria-haspopup="dialog"
                    aria-label=${ifDefined(name)}
                    aria-labelledby=${ifDefined(
                        this.label ? 'label value' : undefined,
                    )}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(describedBy || undefined)}
                    ?disabled=${this.isDisabled}
                >
                    <span part="icon" class="icon">${calendarIcon}</span>
                    <span
                        id="value"
                        part=${text === undefined ? 'placeholder' : 'value'}
                        class=${text === undefined ? 'placeholder' : 'value'}
                        >${text ?? this.placeholder}</span
                    >
                </button>
                ${
                    showing && this.viewMonth
                        ? this.#renderCalendar(name ?? this.label)
                        : nothing
                }
            </hmi-popover>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-date-picker': HmiDatePicker;
    }
}
