import { css } from 'lit';

/* Layout and text of the pieces every form element renders around its control:
   the label, the required marker, and the hint or error below. Ported from
   src/components/styled/formControl.styled.css, whose job these now do. */
export const formStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
    }

    .label {
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 600;
        color: var(--on-background);
        letter-spacing: -0.005em;
    }

    .required {
        margin-inline-start: var(--space-1);
        color: var(--error);
    }

    .message {
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.5);
    }

    .hint {
        color: var(--on-surface-variant);
    }

    .error {
        color: var(--error);
    }
`;
