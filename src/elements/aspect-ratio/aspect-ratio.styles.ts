import { css } from 'lit';

/* AspectRatio — locks a frame to a width/height ratio (set on the inner .base
   from the `ratio` property) and clips the first slotted child to fill it, so
   images and embeds keep their proportions regardless of width. Ported from
   src/components/styled/aspectRatio.styled.css: the host takes v5's full width,
   and clips, so a radius or border set on it rounds the content; the frame
   takes the host's radius too, for a host a grid row stretches past it, and
   never grows past a height set on the host. */
export const styles = css`
    :host {
        display: block;
        width: 100%;
        overflow: hidden;
    }

    .base {
        width: 100%;
        max-height: 100%;
        overflow: hidden;
        border-radius: inherit;
    }

    ::slotted(:first-child) {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
