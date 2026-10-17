import { css } from 'lit';

/* DatePicker — the trigger button matches Input's shape and chrome, so a row of
   mixed fields lines up; the calendar is slotted into hmi-popover, whose panel
   gives the surface (the --panel-* tokens). The label, hint and error around it
   come from the shared form styles. Ported from
   src/components/styled/datePicker.styled.css. Three differences from it: the
   days are cells of a grid that take real focus, so the focus ring is
   :focus-visible rather than a marker on one of them; the weekday headings and
   the days are rows of a grid, one row each; and a day under the pointer does
   not lose the selected or range colours. */
export const styles = css`
    .base {
        display: inline-flex;
        align-items: center;
        gap: var(--space-4);
        width: 100%;
        height: calc(var(--_base) * 5);
        padding: 0 var(--space-6);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        color: var(--on-background);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        text-align: left;
        cursor: pointer;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .base:hover {
        border-color: var(--outline);
    }

    .base:focus-visible,
    .base[aria-expanded='true'] {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .base:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .base:disabled:hover {
        border-color: var(--outline-variant);
    }

    .invalid {
        border-color: var(--error);
    }

    .invalid:focus-visible,
    .invalid[aria-expanded='true'] {
        border-color: var(--error);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5)
            color-mix(in oklab, var(--error) 35%, transparent);
    }

    .icon {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
    }

    .icon svg {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .value,
    .placeholder {
        display: block;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .placeholder {
        color: var(--ref-neutral-60);
    }

    /* The calendar inside the popover's panel. */
    .calendar {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-4);
        color: var(--on-surface);
        font-family: var(--font-default);
    }

    .header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }

    .title {
        flex: 1;
        color: var(--on-surface);
        font-size: calc(var(--_base) * 1.875);
        font-weight: 600;
        text-align: center;
    }

    .nav {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 3.5);
        height: calc(var(--_base) * 3.5);
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: var(--corner-extra-small);
        color: var(--on-surface-variant);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 2);
        cursor: pointer;
        transition: background var(--duration-short-2) var(--easing-standard);
    }

    .nav:hover {
        background: var(--surface-container-high);
        color: var(--primary);
    }

    .grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: var(--space-1);
    }

    /* v5 spaced the weekday headings from the days by the calendar's gap, not the
       grid's. */
    .head {
        margin-bottom: calc(var(--space-4) - var(--space-1));
    }

    .weekday {
        padding: var(--space-2) 0;
        color: var(--on-surface-variant);
        font-size: calc(var(--_base) * 1.375);
        font-weight: 600;
        text-align: center;
    }

    .day {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        background: transparent;
        border-radius: var(--corner-extra-small);
        color: var(--on-surface);
        font-size: calc(var(--_base) * 1.625);
        cursor: pointer;
        user-select: none;
        transition:
            background var(--duration-short-1) var(--easing-standard),
            color var(--duration-short-1) var(--easing-standard);
    }

    .day:hover:not([data-selected], [data-in-range], [data-disabled]) {
        background: var(--surface-container-high);
    }

    .day[data-outside] {
        color: var(--ref-neutral-60);
    }

    .day[data-today] {
        color: var(--primary);
        font-weight: 700;
    }

    .day[data-in-range] {
        background: var(--primary-container);
        border-radius: 0;
        color: var(--on-primary-container);
    }

    .day[data-selected] {
        background: var(--primary);
        border-radius: var(--corner-extra-small);
        color: var(--on-primary);
        font-weight: 600;
    }

    .day[data-disabled] {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .day:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.125) var(--primary) inset;
    }

    .day[data-selected]:focus-visible {
        box-shadow: 0 0 0 calc(var(--_base) * 0.25) var(--on-primary) inset;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        gap: var(--space-2);
        padding-top: var(--space-3);
        border-top: calc(var(--_base) * 0.0625) solid var(--outline-variant);
    }

    .action {
        flex: 1;
        height: calc(var(--_base) * 3);
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: var(--corner-extra-small);
        color: var(--on-surface-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        cursor: pointer;
        transition: background var(--duration-short-2) var(--easing-standard);
    }

    .action:hover {
        background: var(--surface-container-high);
        color: var(--primary);
    }

    .nav:focus-visible,
    .action:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.25) var(--ring);
    }

    @media (prefers-reduced-motion: reduce) {
        .base,
        .nav,
        .day,
        .action {
            transition-duration: 0ms;
        }
    }
`;
