import { css } from 'lit';

/* Code — monospace code rendering in two modes. Inline is a tinted <code>
   chip that sits within running text; block wraps a <pre><code> for
   multi-line snippets with horizontal scroll. The mono stack is spelled out
   here because the themes define no --font-mono token; it matches the one
   already used in menu shortcuts. Ported 1:1 from
   src/components/styled/code.styled.css. */
export const styles = css`
    :host {
        display: inline;
    }

    :host([block]) {
        display: block;
    }

    .base {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
        color: var(--on-surface);
    }

    :host(:not([block])) .base {
        padding: calc(var(--_base) * 0.125) calc(var(--_base) * 0.625);
        font-size: 0.9em;
        background: var(--surface-container-high);
        border: 1px solid var(--outline-variant);
        border-radius: var(--corner-extra-small);
        white-space: nowrap;
    }

    :host([block]) .base {
        margin: 0;
        padding: var(--space-6) var(--space-8);
        font-size: calc(var(--_base) * 1.5);
        line-height: 1.5;
        background: var(--surface-container-high);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-medium);
        overflow-x: auto;
    }

    .content {
        font-family: inherit;
    }
`;
