import { css } from 'lit';

/* ScrollArea — a constrained, scrollable container with themed scrollbars.
   The inner .base scrolls; `orientation` picks which axis (the other is
   hidden), and it inherits the host's max-height so a CSS max-height on the
   host limits it too. Scrollbars use the standard scrollbar-* properties plus
   a WebKit fallback so the thumb and track match the warm surface palette.
   Ported from src/components/styled/scrollArea.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        max-height: inherit;
        scrollbar-width: thin;
        scrollbar-color: var(--outline) transparent;
    }

    :host([orientation='vertical']) .base {
        overflow-x: hidden;
        overflow-y: auto;
    }
    :host([orientation='horizontal']) .base {
        overflow-x: auto;
        overflow-y: hidden;
    }
    :host([orientation='both']) .base {
        overflow: auto;
    }

    .base::-webkit-scrollbar {
        width: var(--_base);
        height: var(--_base);
    }

    .base::-webkit-scrollbar-track {
        background: transparent;
    }

    .base::-webkit-scrollbar-thumb {
        background: var(--outline-variant);
        border: calc(var(--_base) * 0.25) solid transparent;
        background-clip: padding-box;
        border-radius: var(--corner-full);
    }

    .base::-webkit-scrollbar-thumb:hover {
        background: var(--outline);
        background-clip: padding-box;
    }
`;
