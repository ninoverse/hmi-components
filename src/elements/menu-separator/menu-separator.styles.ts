import { css } from 'lit';

/* Menu separator — a divider. Ported from .menu__sep in
   src/components/styled/menu.styled.css: the host carries the margin, which
   reaches past the menu's padding on both sides, and the line is the base. */
export const styles = css`
    :host {
        display: block;
        margin: var(--space-2) calc(var(--_base) * -0.5);
    }

    .base {
        height: calc(var(--_base) * 0.125);
        background: var(--outline-variant);
    }
`;
