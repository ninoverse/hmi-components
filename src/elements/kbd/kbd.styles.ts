import { css } from 'lit';

/* Kbd — a styled <kbd> element that renders one keyboard key as a small
   key cap. Uses the Oxanium display font to feel tactile. Combos are
   composed by the consumer: <hmi-kbd>Ctrl</hmi-kbd> + <hmi-kbd>K</hmi-kbd>.
   Ported 1:1 from src/components/styled/kbd.styled.css. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: calc(var(--_base) * 2.5);
        padding: var(--space-1) var(--space-3);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.5);
        font-weight: 600;
        line-height: 1;
        color: var(--on-surface);
        background: var(--surface-container-high);
        border: 1px solid var(--outline-variant);
        border-bottom-width: 2px;
        border-radius: var(--corner-extra-small);
        box-shadow: 0 1px 0 0 var(--outline-variant);
        white-space: nowrap;
    }

    :host([size='small']) .base {
        min-width: calc(var(--_base) * 2);
        padding: calc(var(--_base) * 0.125) var(--space-2);
        font-size: calc(var(--_base) * 1.25);
    }
`;
