import { css } from 'lit';

/* Box — the foundational layout container. By default an unstyled block (the
   host, with the shared border-box sizing); background, padding, radius and
   border are opt-in through reflected attributes. The `leaf` radius mirrors the
   asymmetric corners used by Card. A box that paints a surface resets the
   card's --on-panel* colours, so hmi-text and the rest inside it read the
   surface roles again, as v5's Text in a Box did. Ported from
   src/components/styled/box.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    :host([background='surface']),
    :host([background='surface-variant']),
    :host([background='surface-container']),
    :host([background='surface-container-low']),
    :host([background='surface-container-high']) {
        --on-panel: initial;
        --on-panel-variant: initial;
        --on-panel-link: initial;
        --on-panel-track: initial;
        --on-panel-fill: initial;
        --on-panel-success: initial;
        --on-panel-warning: initial;
        --on-panel-error: initial;
    }

    :host([background='surface']) {
        background: var(--surface);
        color: var(--on-surface);
    }
    :host([background='surface-variant']) {
        background: var(--surface-variant);
        color: var(--on-surface-variant);
    }
    :host([background='surface-container']) {
        background: var(--surface-container);
        color: var(--on-surface);
    }
    :host([background='surface-container-low']) {
        background: var(--surface-container-low);
        color: var(--on-surface);
    }
    :host([background='surface-container-high']) {
        background: var(--surface-container-high);
        color: var(--on-surface);
    }

    :host([padding='small']) {
        padding: var(--space-4);
    }
    :host([padding='medium']) {
        padding: var(--space-8);
    }
    :host([padding='large']) {
        padding: var(--space-11);
    }

    :host([radius='small']) {
        border-radius: var(--corner-small);
    }
    :host([radius='medium']) {
        border-radius: var(--corner-medium);
    }
    :host([radius='large']) {
        border-radius: var(--corner-large);
    }
    :host([radius='full']) {
        border-radius: var(--corner-full);
    }
    :host([radius='leaf']) {
        border-start-start-radius: var(--corner-tl);
        border-start-end-radius: var(--corner-tr);
        border-end-end-radius: var(--corner-br);
        border-end-start-radius: var(--corner-bl);
    }

    :host([bordered]) {
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }

    /* Forced colours repaint the surface as the page's canvas, so a box drawn
       by its background alone would lose its edge: an outline inside the edge
       marks it without changing its size. A border is kept as it is. */
    @media (forced-colors: active) {
        :host([background]:not([background='none']):not([bordered])) {
            outline: calc(var(--_base) * 0.125) solid CanvasText;
            outline-offset: calc(var(--_base) * -0.125);
        }
    }
`;
