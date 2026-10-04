import { css } from 'lit';

/* Heading — display-level titles in the Oxanium family (matching EmptyState
   and navbar titles). The semantic level (the inner h1–h6) is decoupled from
   the visual size: each level picks a default size class, `size` overrides it.
   Tones reuse the standard text roles. Ported from
   src/components/styled/heading.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        margin: 0;
        font-family: var(--font-display);
        font-weight: 600;
        line-height: 1.2;
        color: var(--on-surface);
    }

    .size-xsmall {
        font-size: calc(var(--_base) * 2);
    }
    .size-small {
        font-size: calc(var(--_base) * 2.5);
    }
    .size-medium {
        font-size: calc(var(--_base) * 3);
    }
    .size-large {
        font-size: calc(var(--_base) * 3.75);
    }
    .size-xlarge {
        font-size: calc(var(--_base) * 4.5);
    }

    :host([tone='muted']) .base {
        color: var(--on-surface-variant);
    }
    :host([tone='primary']) .base {
        color: var(--primary);
    }
    :host([tone='inherit']) .base {
        color: inherit;
    }

    :host([truncate]) .base {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
