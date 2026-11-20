import { css } from 'lit';

/* Skeleton — animated placeholder for loading content. A highlight sweeps
   across the surface, from the inline start to the inline end, to hint "data
   on the way". Use as an inline-block so it can stand in for text on the same
   baseline.

   The sizing lives on :host rather than on .base: `width: 100%` resolves
   against the containing block, and an inline-block host with no width of
   its own would shrink-wrap a percentage-width child to nothing. .base
   fills whatever box the host ends up with.

   The surface is a flat fill, and the highlight a band on ::after moved by
   `transform`, so the sweep runs on the compositor instead of repainting the
   surface every frame. The band repeats every two widths of the surface, as
   v5's 200% background did, and travels two widths per loop, so it draws v5's
   moving gradient frame for frame. Inside an ink card the surface takes the card's track
   colour (--on-panel-track) and the band a touch of its text; elsewhere
   --skeleton-bg and --skeleton-highlight are opt-in hooks, with no default,
   over v5's container roles. Ported from
   src/components/styled/skeleton.styled.css. */
export const styles = css`
    :host {
        display: inline-block;
        border-radius: var(--corner-extra-small);
    }

    :host([variant='text']) {
        width: 100%;
        height: 1.5em;
        vertical-align: middle;
    }

    :host([variant='rect']) {
        width: 100%;
        height: calc(var(--_base) * 1);
    }

    :host([variant='circle']) {
        width: calc(var(--_base) * 5);
        height: calc(var(--_base) * 5);
        border-radius: 50%;
    }

    .base {
        /* Must be a block box: an inline <span> ignores width/height, which
           would collapse the shimmer surface to 0x0. */
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: inherit;
        /* Valid only inside an ink card, which sets both roles; elsewhere
           --on-panel-track is unset, so this is too and the hook applies. */
        --_ink-highlight: color-mix(
            in srgb,
            var(--on-panel-track) 92%,
            var(--on-panel)
        );
        background: var(
            --on-panel-track,
            var(--skeleton-bg, var(--surface-container-high))
        );
    }

    .base::after {
        content: '';
        position: absolute;
        inset-block: 0;
        left: 0;
        width: 400%;
        background-image: linear-gradient(
            90deg,
            transparent 0%,
            var(
                    --_ink-highlight,
                    var(--skeleton-highlight, var(--surface-container-highest))
                )
                50%,
            transparent 100%
        );
        background-size: 50% 100%;
        animation: skeleton-shimmer 1400ms linear infinite;
    }

    :host(:dir(rtl)) .base::after {
        left: auto;
        right: 0;
        animation-name: skeleton-shimmer-rtl;
    }

    @keyframes skeleton-shimmer {
        from {
            transform: translateX(-75%);
        }
        to {
            transform: translateX(-25%);
        }
    }

    @keyframes skeleton-shimmer-rtl {
        from {
            transform: translateX(75%);
        }
        to {
            transform: translateX(25%);
        }
    }

    /* Motion stops: a still surface. */
    @media (prefers-reduced-motion: reduce) {
        .base::after {
            display: none;
        }
    }

    /* The fill is a background, which forced colours drops: draw the edge. */
    @media (forced-colors: active) {
        .base {
            border: 1px solid CanvasText;
        }

        .base::after {
            display: none;
        }
    }
`;
