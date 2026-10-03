import { css } from 'lit';

/* EmptyState — placeholder shown when a list, table or search has no data.
   Stacks icon, title, description and action, centred on a soft surface with
   the library's asymmetric notch. Icon, description and action need no
   wrappers: the icon circle is the slotted element itself, so an unused slot
   draws nothing and adds no flex gap. Ported from
   src/components/styled/emptyState.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: var(--space-6);
        padding: var(--space-12) var(--space-11);
        background: var(--surface-container);
        border: calc(var(--_base) * 0.125) dashed var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        color: var(--on-surface);
    }

    ::slotted([slot='icon']) {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: calc(var(--_base) * 6);
        height: calc(var(--_base) * 6);
        padding: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
        background: var(--surface-container-high);
        border-radius: 50%;
    }

    .title {
        margin: 0;
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 2.5);
        font-weight: 600;
        color: var(--on-surface);
    }

    ::slotted([slot='description']) {
        margin: 0;
        max-width: calc(var(--_base) * 48);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        line-height: 1.5;
        color: var(--on-surface-variant);
    }

    ::slotted([slot='action']) {
        margin-top: var(--space-2);
    }
`;
