import { css } from 'lit';

/* Progress — pill-shaped track with a coloured bar. Determinate: the bar's
   width follows the value. Indeterminate: it is pinned at 40% and slides across
   the track, from the inline start to the inline end. The Field Journal border
   is the --progress-track-border token (none by default), and the bar's colour
   a hook a theme can deepen. Inside a panel the text takes the panel's own
   colours, as hmi-text does, and inside an ink card the track and bar take
   the card's (--on-panel-track, --on-panel-fill). Ported from
   src/components/styled/progress.styled.css. */
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
        position: relative;
        height: var(--_base);
        background: var(--on-panel-track, var(--surface-container-high));
        border: var(--progress-track-border);
        border-radius: var(--corner-full);
        overflow: hidden;
    }

    .bar {
        height: 100%;
        background: var(
            --on-panel-fill,
            var(--progress-indicator, var(--primary))
        );
        border-radius: var(--corner-full);
        transition: width var(--duration-long-1) var(--easing-standard);
    }

    :host([indeterminate]) .bar {
        width: 40%;
        animation: progress-indet 1400ms var(--easing-standard) infinite;
    }

    /* The bar sits at the inline start, so in right-to-left text it starts
       on the right and the loop runs leftward. */
    :host([indeterminate]:dir(rtl)) .bar {
        animation-name: progress-indet-rtl;
    }

    @keyframes progress-indet {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(250%);
        }
    }

    @keyframes progress-indet-rtl {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(-250%);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .bar {
            transition: none;
        }

        :host([indeterminate]) .bar {
            animation-duration: 4200ms;
        }
    }

    /* Forced colors repaint every background as Canvas, so the track and the
       bar would vanish: the track keeps an edge and the bar takes the text's
       colour, as the system palette has it. */
    @media (forced-colors: active) {
        .base {
            border: 1px solid CanvasText;
        }

        .bar {
            forced-color-adjust: none;
            background: CanvasText;
        }
    }
`;
