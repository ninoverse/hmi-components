import { css } from 'lit';

/* ResponsiveContainer — a full-width block that reports its measured pixel size.
   Its height is fixed, or derived from an aspect ratio against the measured
   width. Ported from src/components/styled/responsiveContainer.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        position: relative;
        width: 100%;
    }
`;
