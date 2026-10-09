import { css } from 'lit';

/* Tree — an ARIA tree widget. Each treeitem wraps its own row plus the nested
   role="group" of its children. Indentation comes from a depth custom property
   on each row; the focus ring and the selected fill apply to the row only, not
   the whole subtree. Ported from src/components/styled/tree.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .tree {
        display: flex;
        flex-direction: column;
        font-family: var(--font-default);
        color: var(--on-background);
    }

    .group {
        display: flex;
        flex-direction: column;
    }

    .item {
        outline: none;
    }

    .row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding-block: calc(var(--_base) * 0.875);
        padding-inline-start: calc(
            var(--_depth, 0) * var(--_base) * 2.25 + var(--_base) * 0.75
        );
        padding-inline-end: var(--space-5);
        border-radius: var(--corner-extra-small);
        font-size: calc(var(--_base) * 1.625);
        line-height: 1.2;
        cursor: default;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            color var(--duration-short-2) var(--easing-standard),
            box-shadow var(--duration-short-2) var(--easing-standard);
    }

    .row:hover {
        background: var(--surface-container-highest);
    }

    .row[data-selected='true'] {
        background: var(--secondary-container);
        color: var(--on-secondary-container);
    }

    .item:focus-visible > .row {
        box-shadow: inset 0 0 0 calc(var(--_base) * 0.25) var(--ring);
    }

    .item[aria-disabled='true'] > .row {
        opacity: 0.45;
        cursor: not-allowed;
    }

    .chevron {
        display: inline-flex;
        flex: none;
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
        color: var(--on-surface-variant);
        transform: rotate(-90deg);
        transition: transform var(--duration-short-2) var(--easing-standard);
    }

    .chevron[data-expanded='true'] {
        transform: rotate(0deg);
    }

    .chevron[data-leaf='true'] {
        visibility: hidden;
    }

    .chevron svg {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
    }

    .icon {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
    }

    .icon[hidden] {
        display: none;
    }

    .row[data-selected='true'] .icon {
        color: var(--on-secondary-container);
    }

    .icon slot::slotted(svg) {
        width: calc(var(--_base) * 1.875);
        height: calc(var(--_base) * 1.875);
    }

    .label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce) {
        .row,
        .chevron {
            transition-duration: 0ms;
        }
    }
`;
