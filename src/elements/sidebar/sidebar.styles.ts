import { css } from 'lit';

/* Sidebar — a vertical app navigation panel grouped by section. Each group has
   an optional uppercase heading and a stack of icon + label links. The current
   link takes the primary tonal pair so it stands out against the neutral
   surface. A panel-like element.

   Ported from src/components/styled/sidebar.styled.css, with the surface and
   border re-based onto the --panel-* tokens so the glass and liquid materials
   reach the sidebar (R4). Under the solid material those tokens resolve to
   the values the React sidebar used, but for the surface: the low container,
   a step under v5's high one. The host carries the width, as the
   v5 <aside> did, so it behaves the same as a flex item. */
export const styles = css`
    :host {
        display: block;
        width: 100%;
        max-width: calc(var(--_base) * 30);
    }

    .panel {
        display: flex;
        flex-direction: column;
        gap: var(--space-8);
        padding: var(--space-8);
        background: var(--panel-bg);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-start-start-radius: var(--corner-tl);
        border-start-end-radius: var(--corner-tr);
        border-end-end-radius: var(--corner-br);
        border-end-start-radius: var(--corner-bl);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        font-family: var(--font-default);
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .group-label {
        padding: 0 var(--space-4) var(--space-2);
        font-size: calc(var(--_base) * 1.375);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--on-surface-variant);
    }

    .link,
    .group slot::slotted(a) {
        display: flex;
        align-items: center;
        gap: var(--space-5);
        padding: var(--space-4) var(--space-5);
        border-radius: var(--corner-extra-small);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        font-weight: 500;
        color: var(--on-surface-variant);
        text-decoration: none;
        transition:
            background var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .group:first-child > slot:first-child > .link {
        border-start-start-radius: var(--corner-tl);
        border-start-end-radius: var(--corner-tr);
    }

    .group:last-child > slot:last-child > .link {
        border-end-end-radius: var(--corner-br);
        border-end-start-radius: var(--corner-bl);
    }

    .link:hover,
    .group slot::slotted(a:hover) {
        background: var(--surface-container);
        color: var(--on-background);
    }

    .link:focus-visible,
    .group slot::slotted(a:focus-visible) {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .link[data-active='true'],
    .group slot::slotted([aria-current='page']) {
        background: var(--primary-container);
        color: var(--on-primary-container);
        font-weight: 600;
    }

    .icon {
        display: inline-flex;
        flex: none;
        color: var(--on-surface-variant);
    }

    .icon[hidden] {
        display: none;
    }

    .icon slot::slotted(svg) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .link[data-active='true'] .icon {
        color: var(--on-primary-container);
    }

    .text {
        flex: 1;
        min-width: 0;
        line-height: 1.2;
    }
`;
