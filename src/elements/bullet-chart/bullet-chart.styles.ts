import { css } from 'lit';

/* BulletChart — a horizontal KPI gauge SVG. The range bands use tokenised
   surface shades, set per band from the element; the measure bar takes the
   consumer colour; the target is a strong vertical tick. Ported from
   src/components/styled/bulletChart.styled.css. */
export const styles = css`
    .caption {
        fill: var(--on-surface-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.5);
        font-weight: 600;
    }

    .target {
        stroke: var(--on-background);
        stroke-width: 3;
    }
`;
