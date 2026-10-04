import { css } from 'lit';

/* AspectRatio — locks a frame to a width/height ratio (set on the inner .base
   from the `ratio` property) and clips the first slotted child to fill it, so
   images and embeds keep their proportions regardless of width. Ported from
   src/components/styled/aspectRatio.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        width: 100%;
        overflow: hidden;
    }

    ::slotted(:first-child) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
