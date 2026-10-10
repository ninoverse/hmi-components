import { css } from 'lit';

/* Legend — a row of series swatches and labels for a chart. The swatch fill is
   a consumer-provided series colour (set through `color` and consumed here as
   currentColor); everything else is tokenised. Ported from
   src/components/styled/legend.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-3) var(--space-8);
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: var(--font-default);
    }

    :host([align='start']) .base {
        justify-content: flex-start;
    }

    :host([align='end']) .base {
        justify-content: flex-end;
    }

    .item {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
    }

    .swatch {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
        flex: none;
        border-radius: var(--corner-extra-small);
        background: currentColor;
    }

    .swatch[data-inactive] {
        background: transparent;
        box-shadow: inset 0 0 0 calc(var(--_base) * 0.1875) currentColor;
        opacity: 0.6;
    }

    .label {
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
    }
`;
