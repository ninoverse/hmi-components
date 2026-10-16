import { css } from 'lit';

/* Table — wrapped in a surface card with asymmetric leaf corners. Sortable
   headers hold a <button>, so the keyboard works natively; the active sort
   column gets the primary-coloured arrow (rotated 180deg for descending).
   Ported from src/components/styled/table.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        overflow-x: auto;
        background: var(--surface-container-high);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        color: var(--on-background);
    }

    .header,
    .cell {
        text-align: left;
        padding: var(--space-6) var(--space-8);
        border-bottom: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }

    .header {
        font-size: calc(var(--_base) * 1.5);
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--on-surface-variant);
        background: var(--surface-container);
        user-select: none;
    }

    .label {
        line-height: 1.2;
    }

    .sort {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 0;
        margin: 0;
        background: transparent;
        border: 0;
        color: inherit;
        font: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        cursor: default;
        border-radius: var(--corner-extra-small);
        transition:
            color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .sort:hover {
        color: var(--on-background);
    }

    .sort:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .sort-icon {
        display: inline-flex;
        color: inherit;
        opacity: 0.4;
        transition:
            opacity var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard),
            transform var(--duration-short-3) var(--easing-spring);
    }

    .sort-icon svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
    }

    .header[data-sort='asc'] .sort-icon,
    .header[data-sort='desc'] .sort-icon {
        opacity: 1;
        color: var(--primary);
    }

    .header[data-sort='desc'] .sort-icon {
        transform: rotate(180deg);
    }

    .row {
        transition: background var(--duration-short-3) var(--easing-standard);
    }

    .row:hover {
        background: var(--surface-container);
    }

    .row:last-child .cell {
        border-bottom: 0;
    }

    .actions {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
    }
`;
