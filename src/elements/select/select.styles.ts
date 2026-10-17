import { css } from 'lit';

/* Select — the trigger button matches Input's shape and chrome, so a row of
   mixed fields lines up. The chevron flips 180deg through the trigger's
   aria-expanded attribute, which hmi-popover sets on it. The label, hint and
   error around it come from the shared form styles, and the list's surface from
   the popover. Ported from src/components/styled/select.styled.css. */
export const styles = css`
    /* A browser maps an \`align\` attribute on any element to \`text-align\`, and
       \`align="end"\` is ours: it would right-align the label, the hint and the
       list's text through inheritance. */
    :host {
        text-align: start;
    }

    .base {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        width: 100%;
        height: calc(var(--_base) * 5);
        padding: 0 var(--space-6);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        color: var(--on-background);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 500;
        text-align: left;
        cursor: default;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard),
            background var(--duration-short-3) var(--easing-standard);
    }

    .base:hover {
        border-color: var(--outline);
    }

    .base:focus-visible,
    .base[aria-expanded='true'] {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .base:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .base:disabled:hover {
        border-color: var(--outline-variant);
    }

    .invalid {
        border-color: var(--error);
    }

    .invalid:focus-visible,
    .invalid[aria-expanded='true'] {
        border-color: var(--error);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5)
            color-mix(in oklab, var(--error) 35%, transparent);
    }

    .value,
    .placeholder {
        display: block;
        flex: 1;
        min-width: 0;
    }

    .value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .placeholder {
        color: var(--ref-neutral-60);
    }

    .chevron {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
        transition: transform var(--duration-short-3) var(--easing-standard);
    }

    .chevron svg {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
    }

    .base[aria-expanded='true'] .chevron {
        transform: rotate(180deg);
    }

    /* An option's row: the icon, when one is slotted, then the label. */
    .option {
        display: inline-flex;
        align-items: center;
        gap: var(--space-5);
    }

    .icon {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
    }

    .icon[hidden] {
        display: none;
    }

    ::slotted(svg[slot^='icon-']) {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
    }

    .check {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
        color: var(--primary);
    }

    @media (prefers-reduced-motion: reduce) {
        .base,
        .chevron {
            transition-duration: 0ms;
        }
    }
`;
