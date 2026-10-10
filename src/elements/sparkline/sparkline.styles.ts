import { css } from 'lit';

/* Sparkline — a compact, axis-less trend line. The line and the dot take the
   colour directly; the area fill reuses it at low opacity, so it reads as a
   tint under the line. Ported from src/components/styled/sparkline.styled.css. */
export const styles = css`
    :host {
        display: inline-block;
        vertical-align: middle;
    }

    .base {
        display: block;
    }

    .area {
        opacity: 0.15;
    }
`;
