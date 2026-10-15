import { css } from 'lit';

/* Tooltip — a bubble against its trigger, in the top layer. The bubble is placed
   by PositionController (shared/positioning.ts) with fixed insets, so it takes
   none of its own. Ported from src/components/styled/tooltip.styled.css: the
   inverse surface, the type, the shadow and the arrow, a 45deg-rotated square
   pinned to the edge that faces the trigger. Not panel-like (R4): it paints from
   --inverse-surface, as the React tooltip did. */
export const styles = css`
    .panel {
        padding: var(--space-3) var(--space-5);
        background: var(--inverse-surface);
        color: var(--inverse-on-surface);
        border: none;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.5);
        font-weight: 500;
        line-height: 1.2;
        border-radius: var(--corner-small);
        box-shadow: var(--elevation-3);
        white-space: nowrap;
        pointer-events: none;
    }

    .panel:popover-open {
        animation: tooltip-in var(--duration-short-4) var(--easing-spring) both;
    }

    .panel::after {
        content: "";
        position: absolute;
        width: var(--_base);
        height: var(--_base);
        background: var(--inverse-surface);
        transform: rotate(45deg);
    }

    :host([side='top']) .panel::after {
        bottom: calc(var(--_base) * -0.375);
        left: 50%;
        margin-left: calc(var(--_base) * -0.5);
    }

    :host([side='bottom']) .panel::after {
        top: calc(var(--_base) * -0.375);
        left: 50%;
        margin-left: calc(var(--_base) * -0.5);
    }

    :host([side='left']) .panel::after {
        right: calc(var(--_base) * -0.375);
        top: 50%;
        margin-top: calc(var(--_base) * -0.5);
    }

    :host([side='right']) .panel::after {
        left: calc(var(--_base) * -0.375);
        top: 50%;
        margin-top: calc(var(--_base) * -0.5);
    }

    @supports not selector(:popover-open) {
        :host([open]) .panel {
            animation: tooltip-in var(--duration-short-4) var(--easing-spring)
                both;
        }
    }

    @keyframes tooltip-in {
        from {
            opacity: 0;
            transform: scale(0.85) translateY(calc(var(--_base) * 0.5));
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .panel:popover-open,
        :host([open]) .panel {
            animation-duration: 0ms;
        }
    }
`;
