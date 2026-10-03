import { css } from 'lit';

/* Alert — banner with a variant icon, title/body stack, and an optional
   action pinned right. The title, body and action need no wrappers: a slot
   with nothing assigned has no box, so an unused one adds no flex gap. Ported
   from src/components/styled/alert.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        align-items: flex-start;
        gap: var(--space-6);
        padding: var(--space-7) var(--space-8);
        background: var(--surface-container-high);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        font-family: var(--font-default);
        color: var(--on-background);
    }

    .icon {
        display: inline-flex;
        flex: none;
        margin-top: calc(var(--_base) * 0.125);
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
        line-height: 1.4;
        color: inherit;
    }

    ::slotted([slot='title']) {
        margin: 0;
        font-size: calc(var(--_base) * 1.75);
        font-weight: 700;
        line-height: 1.3;
    }

    ::slotted([slot='action']) {
        align-self: center;
        flex: none;
    }

    :host([variant='info']) .base {
        background: var(--tertiary-container);
        color: var(--on-tertiary-container);
        border-color: color-mix(
            in oklab,
            var(--tertiary) 30%,
            var(--outline-variant)
        );
    }
    :host([variant='info']) .icon {
        color: var(--tertiary);
    }

    :host([variant='success']) .base {
        background: var(--success-container);
        color: var(--on-success-container);
        border-color: color-mix(
            in oklab,
            var(--success) 30%,
            var(--outline-variant)
        );
    }
    :host([variant='success']) .icon {
        color: var(--success);
    }

    :host([variant='warning']) .base {
        background: var(--warning-container);
        color: var(--on-warning-container);
        border-color: color-mix(
            in oklab,
            var(--warning) 30%,
            var(--outline-variant)
        );
    }
    :host([variant='warning']) .icon {
        color: var(--warning);
    }

    :host([variant='danger']) .base {
        background: var(--error-container);
        color: var(--on-error-container);
        border-color: color-mix(
            in oklab,
            var(--error) 30%,
            var(--outline-variant)
        );
    }
    :host([variant='danger']) .icon {
        color: var(--error);
    }
`;
