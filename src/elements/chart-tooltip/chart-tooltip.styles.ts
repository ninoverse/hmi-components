import { css } from 'lit';

/* ChartTooltip — the card a chart shows on hover: an optional heading and one
   row per series (colour swatch, label, right-aligned value). Positioning is the
   consumer's job; this is content only. The swatch fill is a consumer series
   colour, set through `color` and consumed here as currentColor.

   Ported from src/components/styled/chartTooltip.styled.css, with the surface
   re-based onto the --panel-* tokens so the glass and liquid materials reach it
   (R4): --panel-ink-bg is the inverse surface the React tooltip used, so under
   the solid material nothing changes. */
export const styles = css`
    :host {
        display: inline-block;
        pointer-events: none;
    }

    .panel {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: calc(var(--_base) * 14);
        padding: var(--space-4) var(--space-5);
        background: var(--panel-ink-bg);
        color: var(--inverse-on-surface);
        border-radius: var(--corner-small);
        box-shadow: var(--elevation-3);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        font-family: var(--font-default);
    }

    .heading {
        font-size: calc(var(--_base) * 1.375);
        font-weight: 700;
        opacity: 0.85;
    }

    .heading[hidden] {
        display: none;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: calc(var(--_base) * 0.375);
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .row {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-size: calc(var(--_base) * 1.5);
    }

    .swatch {
        width: calc(var(--_base) * 1.25);
        height: calc(var(--_base) * 1.25);
        flex: none;
        border-radius: var(--corner-extra-small);
        background: currentColor;
    }

    .label {
        flex: 1;
        white-space: nowrap;
    }

    .value {
        margin-left: auto;
        font-family: var(--font-display);
        font-weight: 600;
    }
`;
