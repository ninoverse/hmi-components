import { css } from 'lit';

/* Avatar — circular initials chip or image, four sizes, optional status dot in
   the bottom-right corner.

   Ported from src/components/styled/avatar.styled.css. The host takes what
   `.avatar` carried — size, radius, position and typography — instead of an
   inner wrapper, because hmi-avatar-stack rims each avatar through
   `::slotted(hmi-avatar)`, and a rim only reads as round on the host itself.
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

    .status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: calc(var(--_base) * 1.25);
        height: calc(var(--_base) * 1.25);
        border-radius: 50%;
        border: calc(var(--_base) * 0.25) solid var(--surface);
        background: var(--success);
    }

    :host([status='away']) .status {
        background: var(--warning);
    }

    :host([status='offline']) .status {
        background: var(--outline);
    }
`;
