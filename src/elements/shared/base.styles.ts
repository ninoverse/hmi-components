import { css } from 'lit';

/* Shared by every element as `static override styles = [baseStyles, styles]`.
   Provides the sizing base (`--_base`, the root's `--hmi-base`, which
   `base.css` keeps as `--_hmi-root-base`), the box-sizing reset and the focus
   ring that the light-DOM `globals.css` gives the React tree — none of which
   cross a shadow boundary. `--hmi-base` set below the root changes nothing,
   as the theme's `--space-*` and `--corner-*` resolve at the root too. Without
   `base.css`, the nearest `--hmi-base` stands in. */
export const baseStyles = css`
    :host {
        --_base: var(--_hmi-root-base, var(--hmi-base, 8px));
        box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host([hidden]) {
        display: none !important;
    }

    :focus {
        outline: none;
    }

    :focus-visible {
        outline: calc(var(--_base) * 0.25) solid var(--ring);
        outline-offset: calc(var(--_base) * 0.25);
        border-radius: var(--corner-extra-small);
    }
`;
