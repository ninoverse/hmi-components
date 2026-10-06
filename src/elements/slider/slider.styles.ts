import { css } from 'lit';

/* Slider — a native range input. The fill left of the thumb is a gradient on
   the input driven by --slider-pct, which the element sets on the base. The
   thumb is styled for WebKit and Firefox. The label, hint and error around it
   come from the shared form styles. Ported from
   src/components/styled/slider.styled.css. */
export const styles = css`
    .base {
        --_fill: var(--primary);
        display: flex;
        align-items: center;
        gap: var(--space-6);
        width: 100%;
    }

    .invalid {
        --_fill: var(--error);
    }

    .control {
        flex: 1;
        min-width: 0;
        margin: 0;
        -webkit-appearance: none;
        appearance: none;
        height: calc(var(--_base) * 1);
        border-radius: var(--corner-full);
        background: linear-gradient(
            to right,
            var(--_fill) 0%,
            var(--_fill) var(--slider-pct),
            var(--surface-container-high) var(--slider-pct),
            var(--surface-container-high) 100%
        );
        outline: none;
        cursor: pointer;
    }

    .control:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .control::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: calc(var(--_base) * 2.25);
        height: calc(var(--_base) * 2.25);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.25) solid var(--_fill);
        border-radius: 50%;
        box-shadow: var(--elevation-1);
        cursor: pointer;
        transition: transform var(--duration-short-2) var(--easing-standard);
    }

    .control::-webkit-slider-thumb:hover {
        transform: scale(1.1);
    }

    .control::-webkit-slider-thumb:active {
        transform: scale(1.2);
    }

    .control::-moz-range-thumb {
        width: calc(var(--_base) * 2.25);
        height: calc(var(--_base) * 2.25);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.25) solid var(--_fill);
        border-radius: 50%;
        box-shadow: var(--elevation-1);
        cursor: pointer;
        transition: transform var(--duration-short-2) var(--easing-standard);
    }

    .control::-moz-range-thumb:hover {
        transform: scale(1.1);
    }

    .control::-moz-range-thumb:active {
        transform: scale(1.2);
    }

    /* Firefox does not blend the input's gradient under the thumb: a
       transparent track lets it show. */
    .control::-moz-range-track {
        height: calc(var(--_base) * 1);
        border-radius: var(--corner-full);
        background: transparent;
    }

    .disabled .control {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .disabled .control::-webkit-slider-thumb,
    .disabled .control::-moz-range-thumb {
        cursor: not-allowed;
    }

    .value {
        min-width: calc(var(--_base) * 4);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 600;
        color: var(--on-surface);
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    @media (prefers-reduced-motion: reduce) {
        .control::-webkit-slider-thumb,
        .control::-moz-range-thumb {
            transition: none;
        }
    }
`;
