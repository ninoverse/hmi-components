import { css } from 'lit';

/* Pagination — a <nav> with previous and next chevrons flanking a window of
   page buttons. The current page carries aria-current="page" and gets the
   primary pair. Ported from src/components/styled/pagination.styled.css. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-1);
    }

    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: calc(var(--_base) * 4);
        height: calc(var(--_base) * 4);
        margin: 0;
        padding: 0 var(--space-5);
        background: transparent;
        border: 0;
        border-radius: var(--corner-extra-small);
        color: var(--on-surface-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        font-weight: 600;
        cursor: default;
        transition:
            background var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .button:hover:not(:disabled):not([data-active='true']) {
        background: var(--surface-container);
        color: var(--on-background);
    }

    .button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .button[data-active='true'] {
        background: var(--primary);
        color: var(--on-primary);
    }

    .button:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .button svg {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
    }

    .ellipsis {
        padding: 0 var(--space-2);
        color: var(--ref-neutral-60);
        user-select: none;
    }
`;
