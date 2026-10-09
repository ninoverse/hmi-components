import { css } from 'lit';

/* Stepper — an ordered list of completed, active and upcoming steps with
   circular indicators joined by lines. Each step is a <li> whose data-status
   drives its look. A completed step is a button, so a wizard can revisit it.
   Ported from src/components/styled/stepper.styled.css. 40em is the v5
   breakpoint: a media query reads the browser's initial font size for em and
   rem alike. */
export const styles = css`
    :host {
        display: block;
    }

    .stepper {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 0;
        font-family: var(--font-default);
    }

    .stepper--horizontal {
        flex-direction: row;
        align-items: flex-start;
    }

    .stepper--vertical {
        flex-direction: column;
        align-items: stretch;
    }

    .item {
        display: flex;
        flex: 1;
        min-width: 0;
        position: relative;
        color: var(--on-surface-variant);
    }

    .stepper--horizontal .item {
        flex-direction: column;
        align-items: center;
    }

    .stepper--vertical .item {
        flex-direction: row;
        align-items: flex-start;
    }

    .button {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        text-align: center;
        background: transparent;
        border: 0;
        padding: 0;
        margin: 0;
        font-family: inherit;
        color: inherit;
        flex-shrink: 0;
    }

    .stepper--vertical .button {
        flex-direction: row;
        align-items: center;
        text-align: left;
        gap: var(--space-4);
    }

    button.button {
        cursor: pointer;
    }

    .indicator {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 4);
        height: calc(var(--_base) * 4);
        flex-shrink: 0;
        border-radius: 50%;
        background: var(--surface-container-high);
        color: var(--on-surface-variant);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        transition:
            background var(--duration-short-3) var(--easing-standard),
            border-color var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard);
    }

    .indicator svg {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .number {
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.875);
        font-weight: 600;
        line-height: 1;
    }

    .text {
        display: flex;
        flex-direction: column;
        gap: calc(var(--_base) * 0.125);
    }

    .label {
        font-size: calc(var(--_base) * 1.75);
        font-weight: 600;
        color: var(--on-surface-variant);
    }

    .description {
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
    }

    .description[hidden] {
        display: none;
    }

    .item[data-status='active'] .indicator {
        background: var(--primary);
        border-color: var(--primary);
        color: var(--on-primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .item[data-status='active'] .label {
        color: var(--on-surface);
        font-weight: 700;
    }

    .item[data-status='completed'] .indicator {
        background: var(--primary-container);
        border-color: var(--primary);
        color: var(--primary);
    }

    .item[data-status='completed'] .label {
        color: var(--on-surface);
    }

    button.button:hover .label {
        color: var(--primary);
    }

    button.button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
        border-radius: var(--corner-extra-small);
    }

    .connector {
        background: var(--outline-variant);
        transition: background var(--duration-medium-2) var(--easing-standard);
    }

    .stepper--horizontal .connector {
        position: absolute;
        top: calc(var(--_base) * 1.9375);
        left: calc(50% + var(--_base) * 2);
        right: calc(-50% + var(--_base) * 2);
        height: calc(var(--_base) * 0.125);
    }

    /* Vertical: the connector hangs below each indicator. */
    .stepper--vertical .connector {
        width: calc(var(--_base) * 0.125);
        position: absolute;
        top: calc(var(--_base) * 4.25);
        bottom: 0;
        left: calc(var(--_base) * 1.9375);
    }

    .item[data-status='completed'] .connector,
    .item[data-status='active'] .connector {
        background: var(--primary);
    }

    .stepper--vertical .item {
        padding-bottom: var(--stepper-item-gap, var(--space-8));
    }

    .stepper--vertical .item:last-child {
        padding-bottom: 0;
    }

    /* On narrow viewports a horizontal stepper can't fit its steps side by
       side, so it falls back to the vertical layout. */
    @media (max-width: 40em) {
        .stepper--horizontal {
            flex-direction: column;
            align-items: stretch;
        }

        .stepper--horizontal .item {
            flex: 1;
            align-items: flex-start;
            padding-bottom: calc(var(--_base) * 2);
        }

        .stepper--horizontal .item:last-child {
            flex: 1;
            padding-bottom: 0;
        }

        .stepper--horizontal .button {
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: calc(var(--_base) * 1);
        }

        .stepper--horizontal .connector {
            flex: none;
            width: calc(var(--_base) * 0.125);
            height: auto;
            position: absolute;
            top: calc(var(--_base) * 4.25);
            bottom: 0;
            left: calc(var(--_base) * 1.9375);
            right: auto;
            margin: 0;
        }
    }
`;
