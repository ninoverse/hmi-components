import { css } from 'lit';

/* Carousel — a horizontal slideshow. The viewport clips a flex track holding
   all the slides side by side; the track is translated by index * 100% to bring
   the current slide into view. Arrows overlay the viewport edges and dots sit
   below. Ported from src/components/styled/carousel.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .viewport {
        position: relative;
        overflow: hidden;
        border-radius: var(--corner-large);
        background: var(--surface-container-highest);
    }

    .track {
        display: flex;
        transition: transform var(--duration-medium-2) var(--easing-emphasized);
    }

    ::slotted(*) {
        flex: 0 0 100%;
        min-width: 0;
        box-sizing: border-box;
        display: block;
        width: 100%;
    }

    .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 5);
        height: calc(var(--_base) * 5);
        margin: 0;
        padding: 0;
        background: var(--surface);
        color: var(--on-surface);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-full);
        box-shadow: var(--elevation-2);
        cursor: pointer;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            opacity var(--duration-short-2) var(--easing-standard),
            box-shadow var(--duration-short-2) var(--easing-standard);
    }

    .arrow:hover:not(:disabled) {
        background: var(--surface-container-high);
    }

    .arrow:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .arrow:disabled {
        opacity: 0;
        pointer-events: none;
    }

    .arrow svg {
        width: calc(var(--_base) * 2.25);
        height: calc(var(--_base) * 2.25);
    }

    .prev {
        left: calc(var(--_base) * 1.5);
    }

    .next {
        right: calc(var(--_base) * 1.5);
    }

    .dots {
        display: flex;
        justify-content: center;
        gap: var(--space-4);
    }

    .dot {
        width: calc(var(--_base) * 1.25);
        height: calc(var(--_base) * 1.25);
        margin: 0;
        padding: 0;
        background: var(--outline-variant);
        border: 0;
        border-radius: var(--corner-full);
        cursor: pointer;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            width var(--duration-short-2) var(--easing-standard);
    }

    .dot[data-active='true'] {
        width: calc(var(--_base) * 3);
        background: var(--primary);
    }

    .dot:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    @media (prefers-reduced-motion: reduce) {
        .track {
            transition: none;
        }
    }
`;
