import { css } from 'lit';

/* ColorPicker — a trigger with a colour box and the hex text, and a panel in
   hmi-popover (whose --panel-* tokens give it the surface) with preset swatches, a
   hex field and the browser's colour sampler. The label, hint and error around it
   come from the shared form styles. Ported from
   src/components/styled/colorPicker.styled.css. Two differences from it: the
   swatches are radios, so the chosen one is marked by aria-checked, and the trigger
   has a focus ring, where v5 used the browser's. */
export const styles = css`
    /* The trigger is as wide as its content, as in v5; the label and the message
       stack around it. */
    :host {
        display: inline-flex;
        align-items: flex-start;
    }

    .base {
        display: inline-flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-2) var(--space-4) var(--space-2) var(--space-2);
        background: var(--surface-container-high);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-small);
        color: var(--on-surface);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        cursor: pointer;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .base:focus-visible {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .base:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .invalid {
        border-color: var(--error);
    }

    .invalid:focus-visible {
        border-color: var(--error);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5)
            color-mix(in oklab, var(--error) 35%, transparent);
    }

    .preview {
        display: block;
        flex: none;
        box-sizing: border-box;
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-extra-small);
    }

    .value {
        font-variant-numeric: tabular-nums;
        text-transform: uppercase;
    }

    /* The panel's content, inside the popover's panel. */
    .body {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
        min-width: 0;
        width: min(calc(var(--_base) * 24), 90vw);
        color: var(--on-surface);
        font-family: var(--font-default);
    }

    .swatches {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
    }

    .swatch {
        box-sizing: border-box;
        width: 100%;
        aspect-ratio: 1;
        padding: 0;
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-small);
        cursor: pointer;
        transition: transform var(--duration-short-2) var(--easing-standard);
    }

    .swatch:hover {
        transform: scale(1.08);
    }

    .swatch[aria-checked='true'] {
        outline: calc(var(--_base) * 0.25) solid var(--primary);
        outline-offset: calc(var(--_base) * 0.25);
    }

    .swatch:focus-visible {
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .inputs {
        display: flex;
        align-items: center;
        gap: var(--space-4);
    }

    .hex {
        flex: 1;
        box-sizing: border-box;
        min-width: 0;
        padding: var(--space-3) var(--space-4);
        background: var(--surface-container-high);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-small);
        color: var(--on-surface);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.625);
        text-transform: uppercase;
    }

    .hex:focus-visible {
        outline: calc(var(--_base) * 0.25) solid var(--ring);
        outline-offset: calc(var(--_base) * 0.125);
        border-color: var(--primary);
    }

    .sample {
        box-sizing: border-box;
        width: calc(var(--_base) * 4);
        height: calc(var(--_base) * 4);
        padding: 0;
        background: none;
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-small);
        cursor: pointer;
    }

    @media (prefers-reduced-motion: reduce) {
        .base,
        .swatch {
            transition-duration: 0ms;
        }
    }
`;
