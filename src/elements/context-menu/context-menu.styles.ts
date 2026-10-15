import { css } from 'lit';

/* Context menu — a card at the pointer, in the top layer. The card is placed by
   the element with fixed left and top (it clamps them to the screen), so it takes
   no inset of its own here, and it is as wide as its content: measured by its
   layout size, it never shrinks to fit the room beside the pointer. Ported from
   src/components/styled/contextMenu.styled.css: the surface, the border and the
   blur are re-based onto the --panel-* tokens so the glass and liquid materials
   reach it (R4); under the solid material they resolve to the values the React
   context menu used. */
export const styles = css`
    :host {
        display: contents;
    }

    .trigger {
        display: contents;
    }

    .panel {
        position: fixed;
        inset: auto;
        box-sizing: border-box;
        margin: 0;
        width: max-content;
        min-width: calc(var(--_base) * 18);
        max-width: calc(100vw - var(--_base) * 2);
        padding: var(--space-2);
        overflow: visible;
        background: var(--panel-bg);
        color: var(--on-background);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        box-shadow: var(--elevation-3);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        transform-origin: top left;
    }

    .panel:popover-open {
        animation: context-menu-in var(--duration-short-4) var(--easing-spring)
            both;
    }

    /* Without the Popover API the card is a plain fixed element: the element
       shows it while it is open. */
    @supports not selector(:popover-open) {
        .panel {
            display: none;
            z-index: 1000;
        }

        :host([open]) .panel {
            display: block;
            animation: context-menu-in var(--duration-short-4)
                var(--easing-spring) both;
        }
    }

    @keyframes context-menu-in {
        from {
            opacity: 0;
            transform: scale(0.94);
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
