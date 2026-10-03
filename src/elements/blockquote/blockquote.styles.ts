import { css } from 'lit';

/* Blockquote — a quotation block with a primary accent rule on the leading
   edge and a soft surface tint. The citation needs no wrapper: it is styled
   through ::slotted, so an unused slot adds no margin. Ported from
   src/components/styled/blockquote.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        margin: 0;
        padding: var(--space-6) var(--space-8);
        border-inline-start: calc(var(--_base) * 0.375) solid var(--primary);
        border-radius: 0 var(--corner-medium) var(--corner-medium) 0;
        background: var(--surface-container);
        color: var(--on-surface);
        font-family: var(--font-default);
    }

    .body {
        margin: 0;
        font-size: calc(var(--_base) * 1.875);
        font-style: italic;
        line-height: 1.5;
    }

    ::slotted([slot='cite']) {
        display: block;
        margin-top: var(--space-4);
        font-size: calc(var(--_base) * 1.5);
        font-style: normal;
        color: var(--on-surface-variant);
    }
`;
