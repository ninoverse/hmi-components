import { css } from 'lit';

/* Popover — a floating panel under a trigger, in the top layer. The panel is
   positioned by PositionController (shared/positioning.ts) with fixed insets, so
   it takes no inset of its own here, and its minimum width is the trigger's
   (--_anchor-width) unless `width` says otherwise (--_min-width). Ported from
   src/components/styled/popover.styled.css: the surface, the border and the blur
   are re-based onto the --panel-* tokens so the glass and liquid materials reach
   it (R4); under the solid material they resolve to the values the React popover
   used. */
export const styles = css`
    :host {
        display: contents;
    }

    /* A browser maps an \`align\` attribute on any element to \`text-align\`, and
       \`align="end"\` is ours: it would right-align the trigger and the panel's
       text through inheritance. */
    .trigger {
        display: contents;
        text-align: start;
    }

    .panel {
        position: fixed;
        box-sizing: border-box;
        margin: 0;
        min-width: var(--_min-width, var(--_anchor-width, 0px));
        max-width: calc(100vw - var(--_base) * 2);
        padding: var(--space-4);
        overflow: visible;
        background: var(--panel-bg);
        color: var(--on-background);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        box-shadow: var(--elevation-3);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        text-align: start;
        transform-origin: top;
    }

    .panel:popover-open {
        animation: popover-in var(--duration-short-4) var(--easing-spring) both;
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
            animation: popover-in var(--duration-short-4) var(--easing-spring)
                both;
        }
    }

    @keyframes popover-in {
        from {
            opacity: 0;
            transform: scale(0.94) translateY(calc(var(--_base) * -0.75));
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
