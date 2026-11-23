import { css } from 'lit';

/* Stat — a single KPI block: a label with an optional icon, a large value, and
   an optional footer carrying a coloured trend delta and/or help text. A
   self-contained surface, so it can sit alone or be tiled in a Grid; it paints
   from the panel tokens, so the glass and liquid materials reach it. The
   footer's dashed rule is the `divider` property, which also adds the spacing
   around it, or `--stat-divider: 1`, which the journal structure sets, as v5
   drew it there. Ported from src/components/styled/stat.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        /* A grid or flex row stretches the host; the surface fills it, and on
           its own the host is as tall as the surface. */
        height: 100%;
        padding: var(--space-8) var(--space-9);
        background: var(--panel-bg);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-start-start-radius: var(--corner-tl);
        border-start-end-radius: var(--corner-tr);
        border-end-end-radius: var(--corner-br);
        border-end-start-radius: var(--corner-bl);
        font-family: var(--font-default);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
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

    .icon {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
    }

    /* Any icon, an svg or an img, is drawn at the size v5 gave its svg. */
    ::slotted([slot='icon']) {
        display: block;
        flex: none;
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
        object-fit: contain;
    }

    .value {
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 4);
        font-weight: 700;
        line-height: 1;
        color: var(--on-background);
        /* A value with no break, such as $1,234,567, wraps inside the surface. */
        overflow-wrap: anywhere;
    }

    .footer {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--space-2) var(--space-4);
        /* 1 draws the rule and its spacing, 0 neither. */
        --_rule: var(--stat-divider, 0);
        margin-top: calc(var(--space-2) * var(--_rule));
        padding-top: calc(var(--space-3) * var(--_rule));
        border-top: calc(var(--_base) * 0.125 * var(--_rule)) dashed
            var(--outline-variant);
    }

    :host([divider]) .footer {
        --_rule: 1;
    }

    .icon[hidden],
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

    /* The container text roles that badge and alert use: --success and
       --error are under 4.5:1 for this size of text on the light surfaces. */
    .delta[data-tone='positive'] {
        color: var(--on-success-container);
    }

    .delta[data-tone='negative'] {
        color: var(--on-error-container);
    }

    .trend {
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

    .help {
        font-size: calc(var(--_base) * 1.5);
        color: var(--on-surface-variant);
    }
`;
