import { css } from 'lit';

/* DonutChart — a ring of arc segments with a hole in the middle. The segment
   fills take the consumer or palette colour directly; the centre is an HTML box
   over the hole, so slotted content is real text. Ported from
   src/components/styled/donutChart.styled.css, where the centre was a
   foreignObject inside the SVG. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        position: relative;
    }

    .chart {
        display: block;
    }

    .center {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        text-align: center;
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 2);
        font-weight: 700;
        color: var(--on-background);
    }

    .center[hidden] {
        display: none;
    }
`;
