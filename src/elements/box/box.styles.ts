import { css } from 'lit';

/* Box — the foundational layout container. By default an unstyled block (the
   host, with the shared border-box sizing); background, padding, radius and
   border are opt-in through reflected attributes. The `leaf` radius mirrors the
   asymmetric corners used by Card. Ported from
   src/components/styled/box.styled.css. */
export const styles = css`
    :host {
        display: block;
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
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
    }

    :host([bordered]) {
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }
`;
