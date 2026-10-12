import { css } from 'lit';

/* BarChart — a self-contained Cartesian bar chart SVG. The bars take the
   consumer colour directly; the axis labels and the grid are tokenised, in
   shared/chart.ts. Ported from src/components/styled/barChart.styled.css, which
   has nothing beyond that shared styling. */
export const styles = css`
    .bar {
        shape-rendering: geometricPrecision;
    }
`;
