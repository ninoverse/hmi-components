import { css } from 'lit';

/* Chip — pill tag, optionally toggleable and/or closable. The .base pill is a
   structural div; .control is the interactive surface (a button when
   selectable, a span otherwise) and .close is always a real button, so the
   markup never nests buttons or puts role="button" on a static span. The icon
   needs no wrapper: a slot with nothing assigned has no box, so its margin is
   only paid when an icon is slotted. Hover tints are a currentColor layer at
   --state-hover-opacity, so they follow the theme's ink. Ported from
   src/components/styled/chip.styled.css. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
        align-items: stretch;
        height: calc(var(--_base) * 3.75);
        border-radius: var(--corner-full);
        background: var(--surface-container-lowest);
        color: var(--on-background);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 500;
        user-select: none;
        overflow: hidden;
        transition:
            background var(--duration-short-3) var(--easing-standard),
            border-color var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard);
    }

    :host([selected]) .base {
        background: var(--primary-container);
        color: var(--on-primary-container);
        border-color: color-mix(
            in oklab,
            var(--primary) 35%,
            var(--outline-variant)
        );
    }

    .control {
        display: inline-flex;
        align-items: center;
        padding: 0 var(--space-6);
        background: transparent;
        border: 0;
        color: inherit;
        font: inherit;
        cursor: default;
        transition: background var(--duration-short-3) var(--easing-standard);
    }

    :host([selectable]) .control:hover {
        background: color-mix(
            in oklab,
            currentColor calc(var(--state-hover-opacity) * 100%),
            transparent
        );
    }

    :host([selectable][selected]) .control:hover {
        background: color-mix(in oklab, var(--primary) 12%, transparent);
    }

    .control:focus-visible,
    .close:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    ::slotted([slot='icon']) {
        display: inline-flex;
        margin-inline-end: var(--space-3);
        color: inherit;
    }

    ::slotted(svg[slot='icon']) {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
    }

    .label {
        line-height: 1;
    }

    .close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 3);
        margin: 0;
        padding: 0 var(--space-3) 0 var(--space-1);
        background: transparent;
        border: 0;
        color: inherit;
        cursor: default;
        transition: background var(--duration-short-3) var(--easing-standard);
    }

    .close:hover {
        background: color-mix(
            in oklab,
            currentColor calc(var(--state-hover-opacity) * 100%),
            transparent
        );
    }

    .close svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
    }
`;
