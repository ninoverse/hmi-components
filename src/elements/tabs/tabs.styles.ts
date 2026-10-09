import { css } from 'lit';

/* Tabs — a segmented row of <button role="tab"> elements with a sliding
   indicator behind the active tab. Two variants:
   - pill (default): the tabs sit in a sunken surface and the indicator is an
     elevated pill that animates between active tabs.
   - underline: the tabs sit on a baseline and the indicator is a bar pinned to
     the bottom edge.
   Ported from src/components/styled/tabs.styled.css. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .tabs {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: var(--space-2);
        background: var(--surface-container);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
    }

    .tab {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        height: calc(var(--_base) * 4);
        margin: 0;
        padding: 0 var(--space-7);
        background: transparent;
        border: 0;
        border-radius: var(--corner-extra-small);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        font-weight: 600;
        color: var(--on-surface-variant);
        cursor: default;
        transition: color var(--duration-short-3) var(--easing-standard);
    }

    .tab:hover {
        color: var(--on-background);
    }

    .tab[data-active='true'] {
        color: var(--on-background);
    }

    .tab:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .icon {
        display: inline-flex;
        color: inherit;
    }

    .icon[hidden] {
        display: none;
    }

    .icon slot::slotted(svg) {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
    }

    .label {
        line-height: 1;
    }

    .indicator {
        position: absolute;
        left: 0;
        top: calc(var(--_base) * 0.5);
        bottom: calc(var(--_base) * 0.5);
        z-index: 0;
        background: var(--surface-container-lowest);
        border-radius: var(--corner-extra-small);
        box-shadow: var(--elevation-1);
        /* Placed by the element once it has measured the active tab. */
        width: 0;
        opacity: 0;
        transition:
            transform var(--duration-medium-1) var(--easing-spring),
            width var(--duration-medium-1) var(--easing-spring),
            opacity var(--duration-short-3) var(--easing-standard),
            border-radius var(--duration-short-3) var(--easing-standard);
    }

    /* The outer corners follow the strip's, so the indicator on the first or
       last tab fits its corner. A middle tab keeps the small radius. */
    :host(:not([variant='underline'])) .indicator[data-edge='start'] {
        border-top-left-radius: var(--corner-tl);
        border-bottom-left-radius: var(--corner-bl);
    }

    :host(:not([variant='underline'])) .indicator[data-edge='end'] {
        border-top-right-radius: var(--corner-tr);
        border-bottom-right-radius: var(--corner-br);
    }

    :host(:not([variant='underline'])) .indicator[data-edge='both'] {
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
    }

    :host([variant='underline']) .tabs {
        background: transparent;
        padding: 0;
        gap: var(--space-2);
        border-radius: 0;
        border-bottom: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }

    :host([variant='underline']) .tab {
        height: calc(var(--_base) * 5);
        padding: 0 var(--space-6);
        border-radius: 0;
    }

    :host([variant='underline']) .indicator {
        top: auto;
        bottom: calc(var(--_base) * -0.125);
        height: calc(var(--_base) * 0.25);
        background: var(--primary);
        box-shadow: none;
        border-radius: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        .indicator {
            transition-duration: 0ms;
        }
    }
`;
