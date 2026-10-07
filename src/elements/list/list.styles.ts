import { css } from 'lit';

/* List — a vertical stack of rows inside one surface card. Each row has a
   bottom divider (except the last) and an optional drag handle. A dragged row
   fades; the drop target gets a primary-tinted highlight. The divider style is
   the --list-divider-style token (dashed in the journal structure). Ported from
   src/components/styled/list.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        list-style: none;
        background: var(--surface-container-high);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        overflow: hidden;
    }

    .item {
        display: flex;
        align-items: center;
        gap: var(--space-6);
        padding: var(--space-6) var(--space-8);
        border-bottom: calc(var(--_base) * 0.125)
            var(--list-divider-style, solid) var(--outline-variant);
        transition:
            background var(--duration-short-3) var(--easing-standard),
            opacity var(--duration-short-3) var(--easing-standard);
    }

    .item:last-child {
        border-bottom: 0;
    }

    .item:hover {
        background: var(--surface-container);
    }

    .item[draggable='true'] {
        cursor: grab;
    }

    .item[data-dragging='true'] {
        opacity: 0.4;
        cursor: grabbing;
    }

    .item[data-drag-over='true'] {
        background: var(--primary-container);
    }

    .handle {
        display: inline-flex;
        flex: none;
        margin: 0;
        padding: var(--space-2);
        border: 0;
        background: none;
        color: var(--ref-neutral-60);
        border-radius: var(--corner-extra-small);
        cursor: inherit;
    }

    .handle svg {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .main {
        flex: 1;
        min-width: 0;
    }

    .title,
    .subtitle {
        margin: 0;
    }

    .title {
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 600;
        color: var(--on-background);
        line-height: 1.3;
    }

    .subtitle {
        margin-top: var(--space-1);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
        line-height: 1.3;
    }

    .right {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        flex: none;
        color: var(--on-surface-variant);
    }

    .title[hidden],
    .subtitle[hidden],
    .right[hidden] {
        display: none;
    }

    .status {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
`;
