import { css } from 'lit';

/* Blockquote — a quotation block with a primary accent rule on the leading
   edge and a soft surface tint. The citation needs no wrapper: it is styled
   through ::slotted, so an unused slot adds no margin. Every edge and corner is
   logical, so the rule and the square corners follow the writing direction.
   Ported from src/components/styled/blockquote.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        margin: 0;
        padding: var(--space-6) var(--space-8);
        border-inline-start: calc(var(--_base) * 0.375) solid
            var(--blockquote-accent, var(--primary));
        border-radius: var(--corner-medium);
        border-start-start-radius: 0;
        border-end-start-radius: 0;
        background: var(--surface-container);
        color: var(--on-surface);
        font-family: var(--font-default);
        overflow-wrap: anywhere;
    }

    .body {
        margin: 0;
        font-size: calc(var(--_base) * 1.875);
        font-style: italic;
        line-height: 1.5;
    }

    /* Block content slotted into the quote: no outer margin, and a gap
       between consecutive blocks. Inline content ignores block margins. */
    slot:not([name])::slotted(*) {
        margin-block: 0;
    }

    slot:not([name])::slotted(:not(:first-child)) {
        margin-block-start: var(--space-6);
    }

    /* Scripts with no true italic are set upright rather than slanted. */
    :host(:lang(ar)) .body,
    :host(:lang(fa)) .body,
    :host(:lang(ur)) .body,
    :host(:lang(he)) .body,
    :host(:lang(yi)) .body,
    :host(:lang(zh)) .body,
    :host(:lang(ja)) .body,
    :host(:lang(ko)) .body {
        font-style: normal;
    }

    .caption {
        margin: 0;
    }

    ::slotted([slot='cite']) {
        display: block;
        margin-block-start: var(--space-4);
        font-size: calc(var(--_base) * 1.5);
        font-style: normal;
        color: var(--on-surface-variant);
    }
`;
