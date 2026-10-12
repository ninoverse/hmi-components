import { css } from 'lit';

/* FunnelChart — stacked trapezoid bands. The band fill takes the consumer or
   palette colour directly; the labels sit in a column over the page surface, so
   they use the on-surface token for contrast. Ported from
   src/components/styled/funnelChart.styled.css. */
export const styles = css`
    .stage-label {
        fill: var(--on-surface);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.5);
        font-weight: 600;
    }
`;
