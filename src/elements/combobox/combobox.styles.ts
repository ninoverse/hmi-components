import { css } from 'lit';

/* Combobox — the bordered field matches Input's shape and chrome, so a row of
   mixed fields lines up; the list is a manual popover in the top layer, placed
   under the field by PositionController and as wide as it. The label, hint and
   error around them come from the shared form styles. Ported from
   src/components/styled/combobox.styled.css: the portal and its inline width are
   the popover, and the list's surface and blur come from tokens (R4). The surface
   is --listbox-bg, which is the lowest surface under the solid material (what v5
   painted) and the material's strong surface under glass and liquid. */
export const styles = css`
    .base {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        height: calc(var(--_base) * 5);
        padding: 0 var(--space-6);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .base:hover {
        border-color: var(--outline);
    }

    .base:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .invalid {
        border-color: var(--error);
    }

    .invalid:focus-within {
        border-color: var(--error);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5)
            color-mix(in oklab, var(--error) 35%, transparent);
    }

    .disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .input {
        flex: 1;
        min-width: 0;
        height: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        color: var(--on-background);
        outline: none;
    }

    .input:focus-visible {
        outline: none;
    }

    .input::placeholder {
        color: var(--ref-neutral-60);
    }

    .clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: calc(var(--_base) * 2.75);
        height: calc(var(--_base) * 2.75);
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: 50%;
        cursor: pointer;
        color: var(--on-surface-variant);
        transition: background var(--duration-short-2) var(--easing-standard);
    }

    .clear:hover {
        background: var(--surface-container-high);
        color: var(--on-surface);
    }

    .clear svg {
        flex-shrink: 0;
        width: calc(var(--_base) * 1);
        height: calc(var(--_base) * 1);
    }

    .chevron {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--on-surface-variant);
        pointer-events: none;
    }

    .chevron svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
    }

    .panel {
        position: fixed;
        inset: auto;
        margin: 0;
        width: var(--_anchor-width, auto);
        max-height: calc(var(--_base) * 28);
        overflow-y: auto;
        padding: var(--space-2);
        background: var(--listbox-bg);
        color: var(--on-surface);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        box-shadow: var(--elevation-2);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        font-family: var(--font-default);
        text-align: start;
    }

    /* Without the Popover API the panel is a plain fixed element: the element
       shows it while it is open. */
    @supports not selector(:popover-open) {
        .panel {
            display: none;
            z-index: 1000;
        }

        :host([open]) .panel {
            display: block;
        }
    }

    .option {
        display: flex;
        flex-direction: column;
        gap: calc(var(--_base) * 0.125);
        padding: var(--space-4) var(--space-6);
        border-radius: var(--corner-extra-small);
        cursor: pointer;
        color: var(--on-surface);
        transition: background var(--duration-short-1) var(--easing-standard);
    }

    .option:first-of-type {
        border-top-left-radius: var(--corner-tl);
        border-top-right-radius: var(--corner-tr);
    }

    .option:last-of-type {
        border-bottom-right-radius: var(--corner-br);
        border-bottom-left-radius: var(--corner-bl);
    }

    .option[data-highlighted='true'] {
        background: var(--primary-container);
        color: var(--on-primary-container);
    }

    .option[data-disabled] {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .option-label {
        font-size: calc(var(--_base) * 1.75);
        font-weight: 500;
    }

    .description {
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
    }

    .description[hidden] {
        display: none;
    }

    .empty {
        padding: var(--space-6);
        color: var(--on-surface-variant);
        font-size: calc(var(--_base) * 1.625);
        text-align: center;
    }

    @media (prefers-reduced-motion: reduce) {
        .base,
        .clear,
        .option {
            transition-duration: 0ms;
        }
    }
`;
