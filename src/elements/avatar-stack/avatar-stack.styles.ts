import { css } from 'lit';

/* AvatarStack — overlapping row with a background-coloured rim separating each
   avatar from the one behind it.

   Ported from the `.avatar-stack*` and `.avatar--overflow` rules in
   src/components/styled/avatar.styled.css, which lived in Avatar's stylesheet
   but describe this element. Because the avatars are rendered into this root
   rather than slotted, `.avatar-stack .avatar` becomes a plain `hmi-avatar`
   selector — no cross-boundary reach, and no `::slotted()`, which could not
   have expressed the `+` overlap rule anyway.

   The overflow chip repeats Avatar's diameter scale rather than borrowing an
   `overflow` variant from hmi-avatar: the chip is this element's own UI, as it
   was in React, where AvatarStack hand-built a plain span. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
    }

    hmi-avatar,
    .overflow {
        border: calc(var(--_base) * 0.25) solid var(--surface);
    }

    /* Ported from .avatar + .avatar: every avatar after the first slides
       under its predecessor, the overflow chip included. */
    .base > :not(:first-child) {
        margin-left: calc(var(--_base) * -1.25);
    }

    .overflow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: calc(var(--_base) * 4.5);
        height: calc(var(--_base) * 4.5);
        border-radius: var(--corner-full);
        background: var(--surface-container-high);
        color: var(--on-surface-variant);
        font-family: var(--font-default);
        font-weight: 600;
        font-size: calc(var(--_base) * 1.625);
        letter-spacing: 0.01em;
        user-select: none;
    }

    :host([size='small']) .overflow {
        width: calc(var(--_base) * 3);
        height: calc(var(--_base) * 3);
        font-size: calc(var(--_base) * 1.25);
    }

    :host([size='large']) .overflow {
        width: calc(var(--_base) * 6);
        height: calc(var(--_base) * 6);
        font-size: calc(var(--_base) * 2);
    }

    :host([size='xlarge']) .overflow {
        width: calc(var(--_base) * 8);
        height: calc(var(--_base) * 8);
        font-size: calc(var(--_base) * 2.75);
    }
`;
