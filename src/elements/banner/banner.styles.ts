import { css } from 'lit';

/* Banner — full-width persistent notification that spans the layout it sits
   in (unlike Alert, which fits its content). The title, body and action need no
   wrappers: a slot with nothing assigned has no box, so an unused one adds no
   flex gap. Ported from src/components/styled/banner.styled.css. Info's
   colours are the default, so a variant outside the four looks like info, as
   its icon, tone and role already are. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        align-items: flex-start;
        gap: var(--space-5);
        width: 100%;
        padding: var(--space-6) var(--space-7);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        border-inline-start: calc(var(--_base) * 0.5) solid var(--tertiary);
        background: var(--tertiary-container);
        color: var(--on-tertiary-container);
        font-family: var(--font-default);
    }

    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        color: inherit;
        margin-top: var(--space-1);
    }

    .icon svg,
    ::slotted(svg[slot='icon']) {
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
    }

    .content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        font-size: calc(var(--_base) * 1.625);
        line-height: 1.5;
        color: inherit;
    }

    /* Read before the message, never seen: the icon and colour show it. */
    .tone {
        position: absolute;
        width: calc(var(--_base) * 0.125);
        height: calc(var(--_base) * 0.125);
        margin: calc(var(--_base) * -0.125);
        padding: 0;
        border: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    /* A body in a paragraph sits as bare text does, as v5's own <p> did. */
    ::slotted(p) {
        margin: 0;
    }

    ::slotted([slot='title']) {
        margin: 0;
        font-size: calc(var(--_base) * 1.875);
        font-weight: 700;
    }

    ::slotted([slot='action']) {
        align-self: center;
        flex: none;
    }

    .dismiss {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 3);
        height: calc(var(--_base) * 3);
        flex: none;
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: 50%;
        cursor: pointer;
        color: inherit;
        transition: background var(--duration-short-2) var(--easing-standard);
    }

    .dismiss:hover {
        background: color-mix(in oklab, currentColor 12%, transparent);
    }

    .dismiss svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
    }

    :host([variant='success']) .base {
        background: var(--success-container);
        color: var(--on-success-container);
        border-inline-start-color: var(--success);
    }

    :host([variant='warning']) .base {
        background: var(--warning-container);
        color: var(--on-warning-container);
        border-inline-start-color: var(--warning);
    }

    :host([variant='danger']) .base {
        background: var(--error-container);
        color: var(--on-error-container);
        border-inline-start-color: var(--error);
    }
`;
