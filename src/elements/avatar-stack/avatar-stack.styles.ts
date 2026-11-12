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
   was in React, where AvatarStack hand-built a plain span. Its diameter is a
   minimum: a count of two digits or more widens it into a pill. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
    }

    hmi-avatar,
    .overflow {
        border: calc(var(--_base) * 0.25) solid
            var(--avatar-stack-rim, var(--surface));
    }

    /* Ported from .avatar + .avatar: every avatar after the first slides
       under its predecessor, the overflow chip included, on the side the
       text starts from. */
    .base > :not(:first-child) {
        margin-inline-start: calc(var(--_base) * -1.25);
    }

    .overflow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        min-width: calc(var(--_base) * 4.5);
        height: calc(var(--_base) * 4.5);
        /* The avatar before it covers its start by the overlap, so the
           count starts past that. */
        padding-inline: calc(var(--_base) * 1.25) calc(var(--_base) * 0.5);
        border-radius: var(--corner-full);
        background: var(--surface-container-high);
        color: var(--on-surface-variant);
        font-family: var(--font-default);
        font-weight: 600;
        font-size: calc(var(--_base) * 1.625);
        letter-spacing: 0.01em;
        white-space: nowrap;
        user-select: none;
    }

    /* "+3" reads the same in a right-to-left page. On the count, not the
       chip, whose inline start has to follow the page's direction. */
    .count {
        direction: ltr;
        unicode-bidi: isolate;
    }

    :host([size='small']) .overflow {
        min-width: calc(var(--_base) * 3);
        height: calc(var(--_base) * 3);
        font-size: calc(var(--_base) * 1.25);
    }

    :host([size='large']) .overflow {
        min-width: calc(var(--_base) * 6);
        height: calc(var(--_base) * 6);
        font-size: calc(var(--_base) * 2);
    }

    :host([size='xlarge']) .overflow {
        min-width: calc(var(--_base) * 8);
        height: calc(var(--_base) * 8);
        font-size: calc(var(--_base) * 2.75);
    }
`;
