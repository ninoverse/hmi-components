import { css } from 'lit';

/* CartesianGrid — evenly spaced grid lines for a chart's plot area, in an SVG of
   its own. The line stroke is in shared/chart.ts, with the lines, so the charts
   that draw the same grid share it. Ported from
   src/components/styled/cartesianGrid.styled.css. */
export const styles = css`
    :host {
        display: inline-block;
    }

    .base {
        display: block;
    }
`;
