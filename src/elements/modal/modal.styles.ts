import { css } from 'lit';

/* Modal — a centred panel over a scrim, in the top layer. The page behind is
   inert (`showModal()`) and the element stops it scrolling; Escape and a press
   on the backdrop ask to close it. Ported from
   src/components/styled/modal.styled.css: the scrim `div` is `::backdrop`, the
   box is the `<dialog>`, and the surface, the border and the blur are re-based
   onto the --panel-* tokens so the glass and liquid materials reach it (R4).
   Under the solid material those tokens resolve to the values the React modal
   used. */
export const styles = css`
    :host {
        display: contents;
    }

    .panel {
        box-sizing: border-box;
        width: calc(100% - var(--space-11) * 2);
        max-width: calc(var(--_base) * 55);
        max-height: calc(100% - var(--space-11) * 2);
        margin: auto;
        padding: var(--space-11);
        overflow: auto;
        background: var(--panel-bg-strong);
        color: var(--on-background);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        box-shadow: var(--elevation-4);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        outline: none;
    }

    :host([size='large']) .panel {
        max-width: calc(var(--_base) * 75);
    }

    .panel[open] {
        animation: modal-in var(--duration-medium-2) var(--easing-spring) both;
    }

    .panel::backdrop {
        background: rgba(43, 38, 32, 0.32);
        -webkit-backdrop-filter: blur(2px);
        backdrop-filter: blur(2px);
        animation: modal-scrim-in var(--duration-short-3) var(--easing-standard);
    }

    .title {
        margin: 0 0 var(--space-3);
        font-size: calc(var(--_base) * 2.5);
        font-weight: 700;
        letter-spacing: -0.015em;
        font-family: var(--font-default);
        line-height: 1.2;
    }

    .description {
        margin: 0 0 var(--space-10);
        color: var(--on-surface-variant);
        font-size: calc(var(--_base) * 1.75);
        line-height: 1.4;
    }

    .actions {
        display: flex;
        gap: var(--space-4);
        justify-content: flex-end;
        margin-top: var(--space-11);
    }

    .title[hidden],
    .description[hidden],
    .actions[hidden] {
        display: none;
    }

    @keyframes modal-scrim-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes modal-in {
        from {
            opacity: 0;
            transform: translateY(calc(var(--_base) * 2.5)) scale(0.96);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .panel[open],
        .panel::backdrop {
            animation-duration: 0ms;
        }
    }
`;
