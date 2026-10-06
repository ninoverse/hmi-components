import { css } from 'lit';

/* Timeline — a vertical list of events. Each has a circular marker in a left
   rail, joined to the next by a connector line, and a body with a title and an
   optional time and description. The item's colour sets the marker fill. The
   optional divider is a hairline between events, starting at the body so it
   does not cross the connector. Ported from
   src/components/styled/timeline.styled.css. */
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
    }

    .item {
        position: relative;
        display: flex;
        gap: var(--space-6);
        padding-bottom: var(--space-10);
    }

    .item:last-child {
        padding-bottom: 0;
    }

    /* The connector runs from below this marker to the next item, centred on
       the 2-unit-wide marker. */
    .item:not(:last-child) .marker::after {
        content: '';
        position: absolute;
        top: calc(var(--_base) * 2.25);
        bottom: calc(var(--_base) * -0.25);
        left: calc(var(--_base) * 0.875);
        width: calc(var(--_base) * 0.25);
        background: var(--outline-variant);
    }

    :host([divider]) .item:not(:last-child)::after {
        content: '';
        position: absolute;
        left: calc(var(--_base) * 2 + var(--space-6));
        right: 0;
        bottom: calc(var(--space-10) / 2);
        height: calc(var(--_base) * 0.125);
        background: var(--outline-variant);
    }

    .marker {
        position: relative;
        flex: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
        margin-top: var(--space-1);
        border-radius: var(--corner-full);
        background: var(--outline);
        color: var(--on-primary);
    }

    .icon {
        display: inline-flex;
    }

    .icon[hidden] {
        display: none;
    }

    ::slotted(svg) {
        width: calc(var(--_base) * 1.25);
        height: calc(var(--_base) * 1.25);
    }

    .item[data-color='primary'] .marker {
        background: var(--primary);
    }

    .item[data-color='success'] .marker {
        background: var(--success);
    }

    .item[data-color='warning'] .marker {
        background: var(--warning);
    }

    .item[data-color='error'] .marker {
        background: var(--error);
    }

    .body {
        flex: 1;
        min-width: 0;
        padding-top: calc(var(--_base) * 0.125);
    }

    .head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: var(--space-2) var(--space-5);
    }

    .title {
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.875);
        font-weight: 600;
        color: var(--on-background);
    }

    .time {
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.375);
        color: var(--on-surface-variant);
    }

    .time[hidden],
    .description[hidden] {
        display: none;
    }

    .description {
        margin-top: var(--space-2);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        line-height: 1.4;
        color: var(--on-surface-variant);
    }
`;
