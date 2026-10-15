import { css } from 'lit';

/* Hover card — a card against its trigger, in the top layer. The card is placed
   by PositionController (shared/positioning.ts) with fixed insets, so it takes
   none of its own. Ported from src/components/styled/hoverCard.styled.css: the
   surface, the border and the blur are re-based onto the --panel-* tokens so the
   glass and liquid materials reach it (R4); under the solid material they resolve
   to the values the React hover card used. Unlike the tooltip, the card is
   interactive, so it keeps the pointer. */
export const styles = css`
    .panel {
        width: var(--_width, auto);
        min-width: 0;
        max-width: min(
            calc(var(--_base) * 40),
            calc(100vw - var(--_base) * 2)
        );
        padding: var(--space-6);
        background: var(--panel-bg);
        color: var(--on-background);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        box-shadow: var(--elevation-3);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
    }

    .panel:popover-open {
        animation: hover-card-in var(--duration-short-4) var(--easing-spring)
            both;
    }

    @supports not selector(:popover-open) {
        :host([open]) .panel {
            animation: hover-card-in var(--duration-short-4)
                var(--easing-spring) both;
        }
    }

    @keyframes hover-card-in {
        from {
            opacity: 0;
            transform: scale(0.96);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .panel:popover-open,
        :host([open]) .panel {
            animation-duration: 0ms;
        }
    }
`;
