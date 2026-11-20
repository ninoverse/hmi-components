import { css } from 'lit';

/* Meter — a static scalar measurement within a known range (unlike Progress,
   which tracks task completion). The fill colour reflects the value's quality
   band: optimal = success, suboptimal = warning, poor = error, each behind a
   hook a theme can deepen. The track's edge is a hook too, none by default
   and an outline in journal, as progress's. Inside a panel
   the text takes the panel's own colours, as hmi-text does. Ported from
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
        color: var(--on-panel, var(--on-surface));
    }

    .value {
        color: var(--on-panel-variant, var(--on-surface-variant));
        font-variant-numeric: tabular-nums;
    }

    .base {
        height: var(--_base);
        background: var(--surface-container-high);
        border: var(--meter-track-border, none);
        border-radius: var(--corner-full);
        overflow: hidden;
    }

    .fill {
        height: 100%;
        border-radius: var(--corner-full);
        transition: width var(--duration-long-1) var(--easing-standard);
    }

    .optimal {
        background: var(--meter-optimal, var(--success));
    }
    .suboptimal {
        background: var(--meter-suboptimal, var(--warning));
    }
    .poor {
        background: var(--meter-poor, var(--error));
    }

    @media (prefers-reduced-motion: reduce) {
        .fill {
            transition: none;
        }
    }

    /* Forced colors repaint every background as Canvas, so the track and the
       fill would vanish: the track keeps an edge and the fill takes the
       text's colour, as the system palette has it. */
    @media (forced-colors: active) {
        .base {
            border: 1px solid CanvasText;
        }

        .fill {
            forced-color-adjust: none;
            background: CanvasText;
        }
    }
`;
