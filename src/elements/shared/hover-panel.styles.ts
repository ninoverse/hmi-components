import { css } from 'lit';

/* What the hover panels (tooltip, hover-card) share: a host with no box, the
   trigger wrapper, and a fixed panel that PositionController (positioning.ts)
   places with insets, so it takes none here. Each element adds its own surface and
   animation. `align` is an attribute the hover-card reflects, and a browser maps
   it to `text-align` on any element: reset it on the wrapper and the panel, or
   it would reach the trigger and the card's text through inheritance. */
export const hoverPanelStyles = css`
    :host {
        display: contents;
    }

    .trigger {
        display: contents;
        text-align: start;
    }

    .panel {
        position: fixed;
        box-sizing: border-box;
        margin: 0;
        overflow: visible;
        text-align: start;
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
        }
    }
`;
