import { css } from 'lit';

/* Avatar — circular initials chip or image, four sizes, optional status dot in
   the bottom-right corner.

   Ported from src/components/styled/avatar.styled.css. The host takes what
   `.avatar` carried — size, radius, position and typography — instead of an
   inner wrapper, because hmi-avatar-stack rims each avatar with a plain
   `hmi-avatar` rule in its own root, and a rim only reads as round on the
   host itself.
   The `.avatar--overflow`, `.avatar-stack` and `.avatar-stack .avatar` rules in
   that file belong to hmi-avatar-stack and are left for its migration. */
export const styles = css`
    :host {
        position: relative;
        display: inline-flex;
        width: calc(var(--_base) * 4.5);
        height: calc(var(--_base) * 4.5);
        flex: none;
        border-radius: var(--corner-full);
        font-family: var(--font-default);
        font-weight: 600;
        font-size: calc(var(--_base) * 1.625);
        letter-spacing: 0.01em;
        user-select: none;
    }

    :host([size='small']) {
        width: calc(var(--_base) * 3);
        height: calc(var(--_base) * 3);
        font-size: calc(var(--_base) * 1.25);
    }

    :host([size='large']) {
        width: calc(var(--_base) * 6);
        height: calc(var(--_base) * 6);
        font-size: calc(var(--_base) * 2);
    }

    :host([size='xlarge']) {
        width: calc(var(--_base) * 8);
        height: calc(var(--_base) * 8);
        font-size: calc(var(--_base) * 2.75);
    }

    .base {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: var(--corner-full);
        background: var(--primary-container);
        color: var(--on-primary-container);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        clip-path: inset(0 round 50%);
    }

    /* Each presence has its own shape as well as its own colour (WCAG 1.4.1):
       online is filled, away half filled, offline a hollow ring. The colours
       reach 3:1 against the surface in every palette (WCAG 1.4.11): --warning
       and --outline alone fall to 2.3, so away is darkened towards the ink,
       and offline takes the variant ink. It sits at the inline end, so it
       follows the text direction. */
    .status {
        position: absolute;
        bottom: 0;
        inset-inline-end: 0;
        width: calc(var(--_base) * 1.25);
        height: calc(var(--_base) * 1.25);
        border-radius: 50%;
        border: calc(var(--_base) * 0.25) solid var(--surface);
        color: var(--success);
        background: currentColor;
    }

    :host([status='away']) .status {
        color: color-mix(in srgb, var(--warning) 70%, var(--on-surface));
        background: linear-gradient(to top, currentColor 50%, var(--surface) 50%);
        box-shadow: inset 0 0 0 calc(var(--_base) * 0.1875) currentColor;
    }

    :host([status='offline']) .status {
        color: var(--on-surface-variant);
        background: var(--surface);
        box-shadow: inset 0 0 0 calc(var(--_base) * 0.1875) currentColor;
    }

    /* Forced colours drop the tint and the box shadows: the circle keeps a
       rim, and the dot keeps its three shapes in system colours. */
    @media (forced-colors: active) {
        .base {
            border: 1px solid CanvasText;
        }

        .status {
            forced-color-adjust: none;
            color: CanvasText;
            border-color: Canvas;
        }

        :host([status='away']) .status {
            background: linear-gradient(to top, CanvasText 50%, Canvas 50%);
        }

        :host([status='offline']) .status {
            background: Canvas;
        }
    }
`;
