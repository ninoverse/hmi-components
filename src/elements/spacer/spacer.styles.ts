import { css } from 'lit';

/* Spacer — inserts empty space between siblings. A fixed size applies on the
   chosen axis (height for vertical, width for horizontal) in base units;
   `grow` instead expands to fill free space in a flex container, pushing
   neighbours apart. Purely presentational. Ported from
   src/components/styled/spacer.styled.css. */
export const styles = css`
    :host {
        display: block;
        flex: 0 0 auto;
    }

    :host([grow]) {
        flex: 1 1 0;
        align-self: stretch;
    }

    :host([axis='vertical']:not([grow])[size='small']) {
        height: var(--_base);
    }
    :host([axis='vertical']:not([grow])[size='medium']) {
        height: calc(var(--_base) * 2);
    }
    :host([axis='vertical']:not([grow])[size='large']) {
        height: calc(var(--_base) * 3);
    }

    :host([axis='horizontal']:not([grow])[size='small']) {
        width: var(--_base);
    }
    :host([axis='horizontal']:not([grow])[size='medium']) {
        width: calc(var(--_base) * 2);
    }
    :host([axis='horizontal']:not([grow])[size='large']) {
        width: calc(var(--_base) * 3);
    }
`;
