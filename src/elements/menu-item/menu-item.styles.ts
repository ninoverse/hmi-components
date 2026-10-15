import { css } from 'lit';

/* Menu item — a row of a menu. Ported from .menu__item in
   src/components/styled/menu.styled.css: a flex button that highlights on hover
   and focus, with the danger colours. The first and last item of a menu take the
   menu's corner radii through --_radius-*, which hmi-menu sets on them. The icon
   and shortcut wrappers have no box (display: contents), so an empty one adds
   neither width nor gap; the label's flex: 1 pushes the shortcut to the end. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: flex;
        align-items: center;
        gap: var(--space-5);
        width: 100%;
        padding: var(--space-4) var(--space-5);
        background: transparent;
        border: 0;
        border-top-left-radius: var(--_radius-tl, var(--corner-extra-small));
        border-top-right-radius: var(--_radius-tr, var(--corner-extra-small));
        border-bottom-right-radius: var(--_radius-br, var(--corner-extra-small));
        border-bottom-left-radius: var(--_radius-bl, var(--corner-extra-small));
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
        color: var(--on-background);
        text-align: start;
        cursor: default;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            color var(--duration-short-2) var(--easing-standard),
            box-shadow var(--duration-short-2) var(--easing-standard);
    }

    .base:hover:not([disabled]) {
        background: var(--surface-container-highest);
    }

    .base:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
        background: var(--surface-container-highest);
    }

    .base[disabled] {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    :host([danger]) .base {
        color: var(--error);
    }

    :host([danger]) .base:hover:not([disabled]) {
        background: var(--error-container);
    }

    .icon,
    .shortcut {
        display: contents;
    }

    .icon {
        color: var(--on-surface-variant);
    }

    ::slotted([slot='icon']) {
        display: inline-flex;
        flex: none;
    }

    ::slotted(svg[slot='icon']) {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
    }

    :host([danger]) .icon {
        color: var(--error);
    }

    .label {
        flex: 1;
        line-height: 1.2;
    }

    .shortcut {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
        font-size: calc(var(--_base) * 1.375);
        color: var(--on-surface-variant);
    }

    @media (prefers-reduced-motion: reduce) {
        .base {
            transition-duration: 0ms;
        }
    }
`;
