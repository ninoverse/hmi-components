import { css } from 'lit';

/* Asymmetric "leaf" corner with elevation-driven press feedback.
   Rest: elevation-1 → hover: elevation-3 → active: elevation-0 + 1px nudge. */
export const styles = css`
    :host {
        display: inline-flex;
        vertical-align: middle;
    }

    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
        height: calc(var(--_base) * 5);
        padding: 0 var(--space-8);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        border: calc(var(--_base) * 0.125) solid transparent;
        background: transparent;
        color: var(--on-background);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 600;
        letter-spacing: -0.005em;
        cursor: default;
        user-select: none;
        white-space: nowrap;
        box-shadow: var(--elevation-1);
        position: relative;
        transition:
            box-shadow var(--duration-short-3) var(--easing-standard),
            background var(--duration-short-3) var(--easing-standard),
            border-color var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard),
            transform var(--duration-short-1) var(--easing-emphasized-accelerate);
    }

    button:hover {
        box-shadow: var(--elevation-3);
    }

    button:not([disabled]):active {
        box-shadow: var(--elevation-0);
        transform: translateY(calc(var(--_base) * 0.125));
        transition-duration: var(--duration-short-1);
    }

    ::slotted(svg) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
        flex: none;
    }

    button[disabled] {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    /* Variants */
    :host([variant='primary']) button {
        background: var(--primary);
        color: var(--on-primary);
    }
    :host([variant='primary']) button:hover {
        background: color-mix(in oklab, var(--primary) 92%, #000 8%);
    }

    :host([variant='secondary']) button {
        background: var(--surface-container-lowest);
        color: var(--on-background);
        border-color: var(--outline-variant);
    }
    :host([variant='secondary']) button:hover {
        background: var(--surface-container);
        border-color: var(--outline);
    }

    :host([variant='ghost']) button {
        color: var(--on-background);
        box-shadow: none;
    }
    :host([variant='ghost']) button:hover {
        background: var(--surface-container-high);
        box-shadow: none;
    }
    :host([variant='ghost']) button:active {
        box-shadow: none;
    }

    :host([variant='soft']) button {
        background: var(--primary-container);
        color: var(--on-primary-container);
    }
    :host([variant='soft']) button:hover {
        background: color-mix(
            in oklab,
            var(--primary-container) 80%,
            var(--primary) 20%
        );
    }

    :host([variant='danger']) button {
        background: var(--error);
        color: var(--on-error);
    }
    :host([variant='danger']) button:hover {
        background: color-mix(in oklab, var(--error) 92%, #000 8%);
    }

    :host([variant='link']) button {
        height: auto;
        padding: 0;
        color: var(--ref-primary-40);
        text-decoration: underline;
        text-decoration-thickness: calc(var(--_base) * 0.125);
        text-underline-offset: calc(var(--_base) * 0.375);
        text-decoration-color: color-mix(
            in oklab,
            var(--ref-primary-40) 40%,
            transparent
        );
        box-shadow: none;
    }
    :host([variant='link']) button:hover {
        text-decoration-color: var(--ref-primary-40);
        box-shadow: none;
    }
    :host([variant='link']) button:active {
        box-shadow: none;
        transform: none;
    }

    /* Sizes */
    :host([size='small']) button {
        height: calc(var(--_base) * 4);
        padding: 0 var(--space-6);
        font-size: calc(var(--_base) * 1.5);
    }
    :host([size='large']) button {
        height: calc(var(--_base) * 6);
        padding: 0 var(--space-10);
        font-size: calc(var(--_base) * 2);
    }

    :host([as-icon]) button {
        width: calc(var(--_base) * 5);
        padding: 0;
    }
    :host([as-icon][size='small']) button {
        width: calc(var(--_base) * 4);
    }
    :host([as-icon][size='large']) button {
        width: calc(var(--_base) * 6);
    }
`;
