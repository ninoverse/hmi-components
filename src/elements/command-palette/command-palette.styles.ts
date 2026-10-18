import { css } from 'lit';

/* CommandPalette — a search field over a scrolling list of commands, in a modal
   dialog near the top of the screen. The page behind is inert (`showModal()`) and
   the element stops it scrolling; Escape and a press outside ask to close it.
   Ported from src/components/styled/commandPalette.styled.css: the scrim `div` is
   `::backdrop`, the box is the `<dialog>`, pinned 12vh from the top with an
   auto margin instead of flex alignment, and the blur comes from a token (R4). The
   surface is --palette-bg, which is the lowest surface under the solid material
   (what v5 painted) and the material's strong surface under glass and liquid, as
   --drawer-bg is. */
export const styles = css`
    :host {
        display: contents;
    }

    .panel {
        box-sizing: border-box;
        width: min(calc(var(--_base) * 72), 92vw);
        max-width: none;
        max-height: 76vh;
        margin: 12vh auto auto;
        padding: 0;
        border: 0;
        overflow: hidden;
        background: var(--palette-bg);
        color: var(--on-background);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        box-shadow: var(--elevation-4);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        font-family: var(--font-default);
        outline: none;
    }

    /* A closed dialog has display: none; only an open one is a column. */
    .panel[open] {
        display: flex;
        flex-direction: column;
        animation: palette-pop var(--duration-medium-3) var(--easing-spring) both;
    }

    .panel::backdrop {
        background: var(--scrim);
        animation: palette-scrim-fade var(--duration-medium-2)
            var(--easing-standard) both;
    }

    .searchbox {
        display: flex;
        flex: none;
        align-items: center;
        gap: var(--space-4);
        height: calc(var(--_base) * 5.5);
        padding: 0 var(--space-6);
        border-bottom: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }

    .search-icon {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
    }

    .search-icon svg {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .input {
        flex: 1;
        min-width: 0;
        height: 100%;
        border: 0;
        background: transparent;
        color: var(--on-background);
        font-family: inherit;
        font-size: calc(var(--_base) * 2);
        outline: none;
    }

    .input::placeholder {
        color: var(--ref-neutral-60);
    }

    .list {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-3);
    }

    .group {
        padding: var(--space-4) var(--space-4) var(--space-2);
        color: var(--on-surface-variant);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.25);
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .option {
        display: flex;
        align-items: center;
        gap: var(--space-5);
        padding: var(--space-4) var(--space-5);
        border-radius: var(--corner-extra-small);
        color: var(--on-surface);
        cursor: pointer;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            color var(--duration-short-2) var(--easing-standard);
    }

    .option[data-highlighted='true'] {
        background: var(--primary-container);
        color: var(--on-primary-container);
    }

    .option-icon {
        display: inline-flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
        color: var(--on-surface-variant);
    }

    .option-icon svg,
    ::slotted(svg[slot^='icon-']) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .option-text {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: calc(var(--_base) * 0.125);
        min-width: 0;
    }

    .option-label {
        font-size: calc(var(--_base) * 1.75);
        font-weight: 500;
    }

    .option-description {
        color: var(--on-surface-variant);
        font-size: calc(var(--_base) * 1.5);
    }

    .shortcut {
        display: inline-flex;
        flex: none;
        align-items: center;
        gap: calc(var(--_base) * 0.375);
        color: var(--on-surface-variant);
    }

    .option-icon[hidden],
    .option-description[hidden],
    .shortcut[hidden] {
        display: none;
    }

    .empty {
        padding: var(--space-10) var(--space-6);
        color: var(--on-surface-variant);
        font-size: calc(var(--_base) * 1.625);
        text-align: center;
    }

    @keyframes palette-scrim-fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes palette-pop {
        from {
            opacity: 0;
            transform: translateY(calc(var(--_base) * -0.75)) scale(0.97);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .panel[open],
        .panel::backdrop {
            animation-duration: 1ms;
        }

        .option {
            transition-duration: 0ms;
        }
    }
`;
