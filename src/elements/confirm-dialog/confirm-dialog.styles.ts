import { css } from 'lit';

/* ConfirmDialog — has no styles of its own, as in v5: the panel, the scrim and
   the footer come from the <hmi-modal> it renders. The host takes no box. */
export const styles = css`
    :host {
        display: contents;
    }
`;
