import { css } from 'lit';

/* Image — a shell around one image, built in or slotted. It reserves space (an
   optional aspect ratio or explicit size), shows a placeholder behind the image
   while it loads, applies object-fit and token-based rounding, and swaps to a
   fallback on error. The shell is the positioning context and owns its stacking
   context: the image paints above the placeholder, so it appears as soon as the
   browser has decoded it, with no client script gating its visibility. Ported
   from src/components/styled/image.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        position: relative;
        isolation: isolate;
        display: block;
        overflow: hidden;
        background: var(--surface-container-highest);
        --_fit: cover;
    }

    .media {
        display: contents;
    }

    .media[hidden] {
        display: none;
    }

    .img,
    ::slotted(*) {
        position: relative;
        z-index: 1;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--_fit);
        object-position: var(--_position, 50% 50%);
    }

    .loader {
        position: absolute;
        inset: 0;
        z-index: 0;
        background: linear-gradient(
            90deg,
            var(--surface-container-high) 0%,
            var(--surface-container-highest) 50%,
            var(--surface-container-high) 100%
        );
        background-size: 200% 100%;
        background-position: 100% 0;
        animation: shimmer 1400ms linear infinite;
    }

    @keyframes shimmer {
        to {
            background-position: -100% 0;
        }
    }

    .fallback {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--on-surface-variant);
    }

    .fallback svg {
        width: 30%;
        max-width: calc(var(--_base) * 6);
        min-width: calc(var(--_base) * 3);
        height: auto;
    }

    .radius-none {
        border-radius: 0;
    }

    .radius-small {
        border-radius: var(--corner-small);
    }

    .radius-medium {
        border-radius: var(--corner-medium);
    }

    .radius-large {
        border-radius: var(--corner-large);
    }

    .radius-full {
        border-radius: var(--corner-full);
    }

    @media (prefers-reduced-motion: reduce) {
        .loader {
            animation-duration: 4200ms;
        }
    }
`;
