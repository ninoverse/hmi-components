import { css } from 'lit';

/* Drawer — a panel pinned to an edge, in the top layer, over a scrim. The page
   behind is inert (`showModal()`) and the element stops it scrolling; Escape and
   a press on the scrim ask to close it. The slide-in is keyframed per side, and
   prefers-reduced-motion shortens it to a blink. Ported from
   src/components/styled/drawer.styled.css: the scrim `div` is `::backdrop`, the
   box is the `<dialog>`, pinned with `inset` instead of flex alignment, and the
   surface and the blur come from tokens (R4). The surface is --drawer-bg, which
   is the lowest surface under the solid material (what v5 painted) and the
   material's strong surface under glass and liquid. */
export const styles = css`
    :host {
        display: contents;
    }

    .panel {
        box-sizing: border-box;
        margin: 0;
        padding: var(--space-10);
        border: 0;
        overflow-y: auto;
        background: var(--drawer-bg);
        color: var(--on-surface);
        box-shadow: var(--elevation-4);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        outline: none;
    }

    /* A closed dialog has display: none; only an open one is a column. */
    .panel[open] {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .panel::backdrop {
        background: var(--scrim);
        animation: drawer-scrim-fade var(--duration-medium-2)
            var(--easing-standard);
    }

    :host([side='left']) .panel,
    :host([side='right']) .panel,
    :host(:not([side])) .panel {
        width: var(--_size, calc(var(--_base) * 40));
        max-width: 90vw;
        height: 100%;
        max-height: none;
    }

    :host([side='top']) .panel,
    :host([side='bottom']) .panel {
        width: 100%;
        max-width: none;
        height: var(--_size, calc(var(--_base) * 36));
        max-height: 90vh;
    }

    :host([side='left']) .panel {
        inset: 0 auto 0 0;
        border-radius: 0 var(--corner-tr) var(--corner-br) 0;
    }

    :host([side='right']) .panel,
    :host(:not([side])) .panel {
        inset: 0 0 0 auto;
        border-radius: var(--corner-tl) 0 0 var(--corner-bl);
    }

    :host([side='top']) .panel {
        inset: 0 0 auto 0;
        border-radius: 0 0 var(--corner-br) var(--corner-bl);
    }

    :host([side='bottom']) .panel {
        inset: auto 0 0 0;
        border-radius: var(--corner-tl) var(--corner-tr) 0 0;
    }

    :host([side='left']) .panel[open] {
        animation: drawer-slide-left var(--duration-medium-3)
            var(--easing-emphasized-decelerate);
    }

    :host([side='right']) .panel[open],
    :host(:not([side])) .panel[open] {
        animation: drawer-slide-right var(--duration-medium-3)
            var(--easing-emphasized-decelerate);
    }

    :host([side='top']) .panel[open] {
        animation: drawer-slide-top var(--duration-medium-3)
            var(--easing-emphasized-decelerate);
    }

    :host([side='bottom']) .panel[open] {
        animation: drawer-slide-bottom var(--duration-medium-3)
            var(--easing-emphasized-decelerate);
    }

    .title {
        margin: 0;
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 2.5);
        font-weight: 600;
    }

    .description {
        margin: 0;
        font-size: calc(var(--_base) * 1.75);
        color: var(--on-surface-variant);
    }

    .body {
        flex: 1;
        min-height: 0;
    }

    .actions {
        display: flex;
        gap: var(--space-4);
        flex-wrap: wrap;
        justify-content: flex-end;
        padding-top: var(--space-4);
        border-top: calc(var(--_base) * 0.0625) solid var(--outline-variant);
    }

    .title[hidden],
    .description[hidden],
    .actions[hidden] {
        display: none;
    }

    @keyframes drawer-scrim-fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes drawer-slide-left {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes drawer-slide-right {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes drawer-slide-top {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }

    @keyframes drawer-slide-bottom {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .panel[open],
        .panel::backdrop {
            animation-duration: 1ms;
        }
    }
`;
