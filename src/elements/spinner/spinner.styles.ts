import { css } from 'lit';

/* Spinner — a thin ring with one solid arc, spun by CSS animation. The ring
   is role="status" so assistive tech announces it as loading; the visual
   itself is just a styled border, tinted from currentColor, which inherits
   through the shadow boundary. Sizes from
   src/components/styled/spinner.styled.css. */
export const styles = css`
    :host {
        display: inline-block;
    }

    /* A block, so the host is exactly the ring: an inline-block ring left a
       line's strut under it, and a centred spinner sat high. The host is
       still an inline-block, so in text the ring sits on the baseline. */
    .base {
        display: block;
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
        border-radius: 50%;
        border: calc(var(--_base) * 0.375) solid
            color-mix(in oklab, currentColor 18%, transparent);
        border-top-color: currentColor;
        animation: spinner-rotate 800ms linear infinite;
    }

    :host([size='small']) .base {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
        border-width: calc(var(--_base) * 0.25);
    }

    :host([size='large']) .base {
        width: calc(var(--_base) * 4);
        height: calc(var(--_base) * 4);
        border-width: calc(var(--_base) * 0.5);
    }

    /* Read by assistive tech, never seen. */
    .label {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    @keyframes spinner-rotate {
        to {
            transform: rotate(360deg);
        }
    }

    /* The spin is the meaning, so it slows rather than stops. */
    @media (prefers-reduced-motion: reduce) {
        .base {
            animation-duration: 2400ms;
        }
    }

    /* Forced colors would paint both the track and the arc CanvasText, a
       full ring with no spin to see: the arc keeps CanvasText and the track
       drops out. */
    @media (forced-colors: active) {
        .base {
            forced-color-adjust: none;
            border-color: transparent;
            border-top-color: CanvasText;
        }
    }
`;
