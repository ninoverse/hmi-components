import { css } from 'lit';

/* Heading — display-level titles in the display font. The semantic level (the
   inner h1–h6) is decoupled from the visual size: each level picks a default
   size, `size` overrides it, and a size it doesn't know keeps the level's.
   The host carries the type, as hmi-text does, and the heading inherits it,
   so the host's `style` and `class` restyle it like any element. Long words
   break, and a heading that wraps is balanced. */
export const styles = css`
    :host {
        display: block;
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 3.75);
        font-weight: 600;
        line-height: 1.2;
        color: var(--on-panel, var(--on-surface));
        overflow-wrap: break-word;
        text-wrap: balance;
    }

    :host([level='1']) {
        font-size: calc(var(--_base) * 4.5);
    }
    :host([level='3']) {
        font-size: calc(var(--_base) * 3);
    }
    :host([level='4']),
    :host([level='5']) {
        font-size: calc(var(--_base) * 2.5);
    }
    :host([level='6']) {
        font-size: calc(var(--_base) * 2);
    }

    :host([size='xsmall']) {
        font-size: calc(var(--_base) * 2);
    }
    :host([size='small']) {
        font-size: calc(var(--_base) * 2.5);
    }
    :host([size='medium']) {
        font-size: calc(var(--_base) * 3);
    }
    :host([size='large']) {
        font-size: calc(var(--_base) * 3.75);
    }
    :host([size='xlarge']) {
        font-size: calc(var(--_base) * 4.5);
    }

    :host([tone='muted']) {
        color: var(--on-panel-variant, var(--on-surface-variant));
    }
    /* The link's text colour, which each surface sets for itself: --primary
       is a fill, too light to read as text. */
    :host([tone='primary']) {
        color: var(--on-panel-link, var(--ref-primary-40));
    }
    :host([tone='inherit']) {
        color: inherit;
    }

    .base {
        margin: 0;
        font: inherit;
        color: inherit;
    }

    /* A flex or grid item shrinks to its track only below its content's width
       when told it may. */
    :host([truncate]) {
        min-width: 0;
    }
    :host([truncate]) .base {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
