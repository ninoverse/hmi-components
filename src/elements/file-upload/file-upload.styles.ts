import { css } from 'lit';

/* FileUpload — a dashed drop zone backed by a hidden file input, with the list
   of selected files below it. The error below comes from the shared form
   styles. Ported from src/components/styled/fileUpload.styled.css. */
export const styles = css`
    .base {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        width: 100%;
    }

    .picker {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    .zone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        padding: var(--space-12) var(--space-8);
        background: var(--surface-container);
        border: calc(var(--_base) * 0.25) dashed var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        color: var(--on-surface);
        font: inherit;
        cursor: pointer;
        text-align: center;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            background var(--duration-short-3) var(--easing-standard);
    }

    .zone:hover:not(:disabled) {
        border-color: var(--primary);
        background: var(--surface-container-high);
    }

    .drag-over .zone {
        border-color: var(--primary);
        background: var(--primary-container);
        color: var(--on-primary-container);
    }

    .invalid {
        border-color: var(--error);
    }

    .zone:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .icon {
        display: inline-flex;
        color: var(--primary);
    }

    .icon svg {
        width: calc(var(--_base) * 4);
        height: calc(var(--_base) * 4);
    }

    .prompt {
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.875);
        font-weight: 600;
        color: var(--on-surface);
    }

    .hint {
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
    }

    .list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4) var(--space-6);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-extra-small);
        font-family: var(--font-default);
        color: var(--on-surface);
    }

    .file-icon {
        display: inline-flex;
        color: var(--on-surface-variant);
        flex-shrink: 0;
    }

    .file-icon svg {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .file-name {
        flex: 1;
        font-size: calc(var(--_base) * 1.625);
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .size {
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
    }

    .remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 2.75);
        height: calc(var(--_base) * 2.75);
        padding: 0;
        flex-shrink: 0;
        background: transparent;
        border: 0;
        border-radius: 50%;
        cursor: pointer;
        color: var(--on-surface-variant);
        transition: background var(--duration-short-2) var(--easing-standard);
    }

    .remove:hover:not(:disabled) {
        background: var(--surface-container-high);
        color: var(--error);
    }

    .remove:disabled {
        cursor: not-allowed;
    }

    .remove svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
    }
`;
