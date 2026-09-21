import { css } from 'lit';

/* Skeleton — animated placeholder for loading content. A shimmering
   gradient slides across the surface to hint "data on the way". Use as
   an inline-block so it can stand in for text on the same baseline.

   The sizing lives on :host rather than on .base: `width: 100%` resolves
   against the containing block, and an inline-block host with no width of
   its own would shrink-wrap a percentage-width child to nothing. .base
   fills whatever box the host ends up with. Ported from
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
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(
            90deg,
            var(--surface-container-high) 0%,
            var(--surface-container-highest) 50%,
            var(--surface-container-high) 100%
        );
        background-size: 200% 100%;
        background-position: 100% 0;
        animation: skeleton-shimmer 1400ms linear infinite;
    }

    @keyframes skeleton-shimmer {
        to {
            background-position: -100% 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .base {
            animation-duration: 4200ms;
        }
    }
`;
