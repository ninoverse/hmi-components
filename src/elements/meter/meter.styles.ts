import { css } from 'lit';

/* Meter — a static scalar measurement within a known range (unlike Progress,
   which tracks task completion). The fill colour reflects the value's quality
   band: optimal = success, suboptimal = warning, poor = error. Ported from
   src/components/styled/meter.styled.css. */
export const styles = css`
    :host {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        font-family: var(--font-default);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: var(--space-4);
        font-size: calc(var(--_base) * 1.5);
    }

    .header[hidden] {
        display: none;
    }

    .label {
        color: var(--on-surface);
    }

    .value {
        color: var(--on-surface-variant);
        font-variant-numeric: tabular-nums;
    }

    .base {
        height: var(--_base);
        background: var(--surface-container-high);
        border-radius: var(--corner-full);
        overflow: hidden;
    }

    .fill {
        height: 100%;
        border-radius: var(--corner-full);
        transition: width var(--duration-long-1) var(--easing-standard);
    }

    .optimal {
        background: var(--success);
    }
    .suboptimal {
        background: var(--warning);
    }
    .poor {
        background: var(--error);
    }
`;
