import { css } from 'lit';

/* Accordion — a stack of collapsible sections. The height animation uses the
   grid-template-rows 0fr → 1fr trick, so a panel collapses smoothly to its
   content's natural height without measuring it. Ported from
   src/components/styled/accordion.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        flex-direction: column;
    }

    .item {
        border-bottom: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }

    .item:first-child {
        border-top: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }

    .trigger {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-8);
        margin: 0;
        padding: var(--space-9) var(--space-2);
        background: transparent;
        border: 0;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 2);
        font-weight: 600;
        letter-spacing: -0.005em;
        color: var(--on-background);
        text-align: left;
        cursor: default;
        transition: color var(--duration-short-3) var(--easing-standard);
    }

    .trigger:hover {
        color: var(--primary);
    }

    .trigger:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
        border-radius: var(--corner-extra-small);
    }

    .trigger:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .trigger:disabled:hover {
        color: var(--on-background);
    }

    .title {
        flex: 1;
        min-width: 0;
    }

    .chevron {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
        transition:
            transform var(--duration-medium-1) var(--easing-spring),
            color var(--duration-short-3) var(--easing-standard);
    }

    .chevron svg {
        width: calc(var(--_base) * 2.25);
        height: calc(var(--_base) * 2.25);
    }

    .trigger[aria-expanded='true'] .chevron {
        transform: rotate(180deg);
        color: var(--primary);
    }

    .panel {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows var(--duration-medium-1)
            var(--easing-standard);
    }

    .panel[data-open='true'] {
        grid-template-rows: 1fr;
    }

    .panel-inner {
        overflow: hidden;
    }

    .body {
        padding: 0 var(--space-2) var(--space-9);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        line-height: 1.5;
        color: var(--on-surface-variant);
    }

    @media (prefers-reduced-motion: reduce) {
        .panel,
        .chevron {
            transition-duration: 0ms;
        }
    }
`;
