import { css } from 'lit';

/* RadarChart — a polar grid with series polygons. The series fill and stroke
   take the consumer or palette colour directly; the rings, the spokes and the
   labels are tokenised (the labels in shared/chart.ts). Ported from
   src/components/styled/radarChart.styled.css. */
export const styles = css`
    .ring {
        fill: none;
        stroke: var(--outline-variant);
        stroke-width: 1;
    }

    .spoke {
        stroke: var(--outline-variant);
        stroke-width: 1;
    }

    .area {
        fill-opacity: 0.2;
        stroke-width: 2;
        stroke-linejoin: round;
    }
`;
