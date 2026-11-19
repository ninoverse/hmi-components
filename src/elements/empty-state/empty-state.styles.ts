import { css } from 'lit';

/* EmptyState — placeholder shown when a list, table or search has no data.
   Stacks icon, title, description and action, centred on a soft surface with
   the library's asymmetric notch. The icon circle is the slotted element
   itself, inside a box-less wrapper that hides it from screen readers, so an
   unused slot draws nothing and adds no flex gap; the heading and the actions'
   row are hidden while their slots are empty. Ported from
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
        border: calc(var(--_base) * 0.125) dashed var(--outline);
        border-start-start-radius: var(--corner-tl);
        border-start-end-radius: var(--corner-tr);
        border-end-end-radius: var(--corner-br);
        border-end-start-radius: var(--corner-bl);
        color: var(--on-surface);
        overflow-wrap: anywhere;
    }

    .icon {
        display: contents;
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

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-4);
        margin-top: var(--space-2);
    }

    .title[hidden],
    .actions[hidden] {
        display: none;
    }

    @media (forced-colors: active) {
        ::slotted([slot='icon']) {
            color: CanvasText;
            background: Canvas;
            border: calc(var(--_base) * 0.125) solid CanvasText;
        }
    }
`;
