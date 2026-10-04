import { css } from 'lit';

/* VisuallyHidden — hides content visually while keeping it available to
   assistive technology (the standard sr-only clip technique). The host is the
   hidden box. Ported from src/components/styled/visuallyHidden.styled.css. */
export const styles = css`
    :host {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
    }
`;
