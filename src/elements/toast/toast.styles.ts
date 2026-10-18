import { css } from 'lit';

/* Toast — a slide-in stack pinned to the bottom right of the screen, in the top
   layer (`popover="manual"`). The stack ignores the pointer so it does not cover
   what is behind it, and each toast takes it back so its close button works. Ported
   from src/components/styled/toast.styled.css: the portal and its z-index are the
   popover, and the surface, the border and the blur are re-based onto the
   --panel-* tokens so the glass and liquid materials reach it (R4). Under the
   solid material those tokens resolve to the values the React toast used. */
export const styles = css`
    :host {
        display: contents;
    }

    /* A popover is a centred, bordered box by default: it is a bare column pinned
       to the corner here. Closed, it is display: none. */
    .list {
        position: fixed;
        inset: auto calc(var(--_base) * 3) calc(var(--_base) * 3) auto;
        box-sizing: border-box;
        flex-direction: column;
        gap: var(--space-5);
        width: auto;
        height: auto;
        margin: 0;
        padding: 0;
        border: 0;
        overflow: visible;
        background: transparent;
        color: inherit;
        pointer-events: none;
    }

    .list:popover-open {
        display: flex;
    }

    /* Without the Popover API the stack is a plain fixed element. */
    @supports not selector(:popover-open) {
        .list {
            display: flex;
            z-index: 1200;
        }
    }

    .toast {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: var(--space-6);
        box-sizing: border-box;
        width: calc(var(--_base) * 40);
        min-width: 0;
        max-width: min(calc(var(--_base) * 47.5), calc(100vw - var(--_base) * 6));
        padding: var(--space-7) var(--space-8);
        overflow: hidden;
        background: var(--panel-bg);
        color: var(--on-background);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        box-shadow: var(--elevation-3);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        pointer-events: auto;
        animation: toast-in var(--duration-medium-2) var(--easing-spring) both;
    }

    .toast[data-leaving='true'] {
        animation: toast-out var(--duration-short-4) var(--easing-standard) both;
    }

    @keyframes toast-in {
        from {
            opacity: 0;
            transform: translateX(calc(var(--_base) * 5)) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }

    @keyframes toast-out {
        to {
            opacity: 0;
            transform: translateX(calc(var(--_base) * 5)) scale(0.95);
        }
    }

    .icon {
        display: inline-flex;
        flex: none;
        margin-top: calc(var(--_base) * 0.125);
        color: var(--on-surface-variant);
    }

    .icon svg {
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
    }

    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: var(--space-1);
        min-width: 0;
    }

    .title {
        margin: 0;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 700;
        line-height: 1.3;
    }

    .body {
        margin: 0;
        color: var(--on-surface-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        line-height: 1.4;
    }

    .close {
        display: inline-flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 2.75);
        height: calc(var(--_base) * 2.75);
        margin-left: var(--space-2);
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: var(--corner-extra-small);
        color: var(--on-surface-variant);
        cursor: default;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            color var(--duration-short-2) var(--easing-standard),
            box-shadow var(--duration-short-2) var(--easing-standard);
    }

    .close:hover {
        background: var(--surface-container-highest);
        color: var(--on-background);
    }

    .close:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .close svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
    }

    .toast[data-variant='info'] .icon {
        color: var(--tertiary);
    }

    .toast[data-variant='success'] .icon {
        color: var(--success);
    }

    .toast[data-variant='warning'] .icon {
        color: var(--warning);
    }

    .toast[data-variant='danger'] .icon {
        color: var(--error);
    }

    @media (prefers-reduced-motion: reduce) {
        .toast,
        .toast[data-leaving='true'] {
            animation-duration: 0ms;
        }

        .close {
            transition-duration: 0ms;
        }
    }
`;
