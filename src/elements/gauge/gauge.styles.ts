import { css } from 'lit';

/* Gauge — a semicircular dial. The track and value arcs take their colours from
   the element; the caption is an HTML box under the dial, so slotted content is
   real text. Ported from src/components/styled/gauge.styled.css, where the label
   was an SVG <text>. */
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

    .track,
    .arc {
        fill: none;
        stroke-linecap: round;
    }

    .caption {
        position: absolute;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 38px;
        text-align: center;
        line-height: 1;
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 2.5);
        font-weight: 700;
        color: var(--on-background);
    }

    .caption[hidden] {
        display: none;
    }
`;
