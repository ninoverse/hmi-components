import { css } from 'lit';

/* Menu — a vertical list of items. Ported from .menu in
   src/components/styled/menu.styled.css. It paints no surface: the popover or the
   context menu around it supplies the chrome, as in the React tree. The first and
   last item take the surface's corner radii, which the React CSS did with
   .menu > .menu__item:first-child and :last-child; here the menu sets the
   --_radius-* properties on its first and last slotted item, and the item's
   button reads them. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        flex-direction: column;
        gap: calc(var(--_base) * 0.125);
    }

    ::slotted(hmi-menu-item:first-child) {
        --_radius-tl: var(--corner-tl);
        --_radius-tr: var(--corner-tr);
    }

    ::slotted(hmi-menu-item:last-child) {
        --_radius-br: var(--corner-br);
        --_radius-bl: var(--corner-bl);
    }
`;
