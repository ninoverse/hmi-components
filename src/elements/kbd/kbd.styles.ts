import { css } from 'lit';

/* Kbd — a styled <kbd> element that renders one keyboard key as a small
   key cap. Uses the display font to feel tactile. Combos are composed by the
   consumer: <hmi-kbd>Ctrl</hmi-kbd> + <hmi-kbd>K</hmi-kbd>. Ported from
   src/components/styled/kbd.styled.css, with the edge in --outline, the font
   from --kbd-font, and a label that follows the text around it. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: calc(var(--_base) * 2.5);
        padding: var(--space-1) var(--space-3);
        /* hmi-key-symbols, from base.css, draws only the arrows and key
           symbols, which none of the theme fonts has. */
        font-family: hmi-key-symbols, var(--kbd-font, var(--font-display));
        font-size: max(calc(var(--_base) * 1.5), 0.75em);
        font-weight: 600;
        line-height: 1;
        color: var(--on-surface);
        background: var(--surface-container-high);
        border: 1px solid var(--outline);
        border-bottom-width: 2px;
        border-radius: var(--corner-extra-small);
        box-shadow: 0 1px 0 0 var(--outline);
        white-space: nowrap;
    }

    .base[hidden] {
        display: none;
    }

    .keys {
        display: contents;
    }

    /* The label, heard in place of the glyph and never seen. */
    .name {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    :host([size='small']) .base {
        min-width: calc(var(--_base) * 2);
        padding: calc(var(--_base) * 0.125) var(--space-2);
        font-size: max(calc(var(--_base) * 1.25), 0.625em);
    }
`;
