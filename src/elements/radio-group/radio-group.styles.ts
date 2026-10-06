import { css } from 'lit';

/* RadioGroup — the radios in a column. The label, hint and error around it come
   from the shared form styles. Ported from the .radio-group rule of
   src/components/styled/radio.styled.css. */
export const styles = css`
    .base {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-5);
    }
`;
