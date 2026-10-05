import { css } from 'lit';

/* SearchInput — the built-in search icon, drawn as the fallback of Input's
   left-icon slot. It is styled like a slotted icon, which the slot's own rules
   do not reach inside the shadow root. The box, label and message are Input's.
   Ported from the icon in src/components/searchInput.tsx. */
export const styles = css`
    .search-icon {
        display: flex;
        color: var(--on-surface-variant);
    }

    .search-icon svg {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }
`;
