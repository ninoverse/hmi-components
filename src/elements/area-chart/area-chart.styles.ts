import { css } from 'lit';

/* AreaChart — a self-contained Cartesian area chart SVG. The line and the area
   fill take the consumer colour directly; the area sits at low opacity so
   overlapping series stay legible. The axis labels and the grid are tokenised,
   in shared/chart.ts. Ported from src/components/styled/areaChart.styled.css. */
export const styles = css`
    .area {
        opacity: 0.18;
    }

    .line {
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
`;
