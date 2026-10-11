import { css } from 'lit';

/* LineChart — a self-contained Cartesian chart SVG. The series stroke takes the
   consumer colour directly; the axis labels and the grid are tokenised, in
   shared/chart.ts. Ported from src/components/styled/lineChart.styled.css. */
export const styles = css`
    .line {
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
`;
