import { css } from 'lit';

/* Progress — pill-shaped track with a coloured bar. Determinate: the bar's
   width follows the value. Indeterminate: it is pinned at 40% and slides across
   the track. The Field Journal border is the --progress-track-border token
   (none by default). Ported from src/components/styled/progress.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        position: relative;
        height: var(--_base);
        background: var(--surface-container-high);
        border: var(--progress-track-border);
        border-radius: var(--corner-full);
        overflow: hidden;
    }

    .bar {
        height: 100%;
        background: var(--primary);
        border-radius: var(--corner-full);
        transition: width var(--duration-long-1) var(--easing-standard);
    }

    :host([indeterminate]) .bar {
        width: 40%;
        animation: progress-indet 1400ms var(--easing-standard) infinite;
    }

    @keyframes progress-indet {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(250%);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :host([indeterminate]) .bar {
            animation-duration: 4200ms;
        }
    }
`;
