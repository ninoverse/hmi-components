import { css } from 'lit';

/* Badge — small pill for counts, statuses, and inline labels. The dot uses
   currentColor at 70% opacity so it always sits on top of the variant text
   colour. Ported 1:1 from src/components/styled/badge.styled.css. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        height: calc(var(--_base) * 2.75);
        padding: 0 var(--space-4);
        border-radius: var(--corner-full);
        background: var(--surface-container);
        color: var(--on-surface-variant);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.5);
        font-weight: 600;
        letter-spacing: 0.01em;
        white-space: nowrap;
        line-height: 1;
    }

    :host([variant='primary']) .base {
        background: var(--primary-container);
        color: var(--on-primary-container);
        border-color: color-mix(
            in oklab,
            var(--primary) 20%,
            var(--outline-variant)
        );
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

    :host([variant='warning']) .base {
        background: var(--warning-container);
        color: var(--on-warning-container);
        border-color: color-mix(
            in oklab,
            var(--warning) 30%,
            var(--outline-variant)
        );
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

    :host([variant='info']) .base {
        background: var(--tertiary-container);
        color: var(--on-tertiary-container);
        border-color: color-mix(
            in oklab,
            var(--tertiary) 30%,
            var(--outline-variant)
        );
    }

    .dot {
        width: calc(var(--_base) * 0.75);
        height: calc(var(--_base) * 0.75);
        border-radius: 50%;
        background: currentColor;
        opacity: 0.7;
        flex: none;
    }

    /* Forced colors repaint every background as Canvas, so the dot would
       vanish: paint it in the text's colour, as the system palette has it. */
    @media (forced-colors: active) {
        .dot {
            forced-color-adjust: none;
            background: CanvasText;
        }
    }
`;
