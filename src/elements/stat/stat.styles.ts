import { css } from 'lit';

/* Stat — a single KPI block: a label with an optional icon, a large value, and
   an optional footer carrying a coloured trend delta and/or help text. A
   self-contained surface, so it can sit alone or be tiled in a Grid. The
   footer's dashed rule is the `divider` property, which also adds the spacing
   around it (React drew it only under the Field Journal theme). Ported from
   src/components/styled/stat.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-8) var(--space-9);
        background: var(--surface-container-low);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        font-family: var(--font-default);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
    }

    .label {
        font-size: calc(var(--_base) * 1.5);
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--on-surface-variant);
    }

    ::slotted([slot='icon']) {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
    }

    ::slotted(svg[slot='icon']) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .value {
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 4);
        font-weight: 700;
        line-height: 1;
        color: var(--on-background);
    }

    .footer {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--space-2) var(--space-4);
    }

    :host([divider]) .footer {
        margin-top: var(--space-2);
        padding-top: var(--space-3);
        border-top: calc(var(--_base) * 0.125) dashed var(--outline-variant);
    }

    .footer[hidden],
    .delta[hidden] {
        display: none;
    }

    .delta {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: calc(var(--_base) * 1.625);
        font-weight: 600;
        color: var(--on-surface-variant);
    }

    .delta svg {
        width: calc(var(--_base) * 1.625);
        height: calc(var(--_base) * 1.625);
    }

    :host([trend='up']) .delta {
        color: var(--success);
    }

    :host([trend='down']) .delta {
        color: var(--error);
    }

    .help {
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
    }
`;
