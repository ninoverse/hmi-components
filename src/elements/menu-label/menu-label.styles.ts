import { css } from 'lit';

/* Menu label — a group heading. Ported from .menu__label in
   src/components/styled/menu.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        padding: var(--space-4) var(--space-5) var(--space-2);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.25);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--on-surface-variant);
    }
`;
