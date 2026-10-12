import { css } from 'lit';

/* ScatterPlot — a self-contained Cartesian scatter SVG. The markers take the
   consumer colour directly; the axis labels and the grid are tokenised, in
   shared/chart.ts. Ported from src/components/styled/scatterPlot.styled.css,
   whose only rule beyond that shared styling is the markers' translucency. */
export const styles = css`
    .point {
        fill-opacity: 0.75;
    }
`;
