import { css } from 'lit';

/* Heatmap — a matrix of intensity cells. The cell fill takes the consumer
   colour directly, and its opacity carries the intensity; the labels are
   tokenised (the axis labels in shared/chart.ts). Ported from
   src/components/styled/heatmap.styled.css. */
export const styles = css`
    .value {
        fill: var(--on-surface);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.25);
        font-weight: 600;
    }
`;
