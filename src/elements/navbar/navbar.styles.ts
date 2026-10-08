import { css } from 'lit';

/* Navbar — horizontal app chrome: the brand on the left, a row of links in the
   middle (taking the remaining space) and a trailing slot for actions. A
   panel-like surface with asymmetric leaf corners, so it can sit at the top of
   a page without a hard edge against the canvas. Below 40em the links and the
   trailing slot collapse into a dropdown behind a menu button.

   Ported from src/components/styled/navbar.styled.css, with the surface and
   border re-based onto the --panel-* tokens so the glass and liquid materials
   reach the navbar (R4). Under the solid material those tokens resolve to
   exactly the values the React navbar used. 40em is the v5 breakpoint: a media
   query reads the browser's initial font size for em and rem alike. */
export const styles = css`
    :host {
        display: block;
    }

    .panel {
        display: flex;
        align-items: center;
        height: calc(var(--_base) * 7.5);
        padding: 0 var(--space-10);
        gap: var(--space-10);
        background: var(--panel-bg);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
        font-family: var(--font-default);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: var(--space-5);
        font-weight: 700;
        font-size: calc(var(--_base) * 2);
        letter-spacing: -0.01em;
        color: var(--on-background);
    }

    .brand[hidden] {
        display: none;
    }

    .brand-mark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 3.5);
        height: calc(var(--_base) * 3.5);
        border-radius: var(--corner-extra-small);
        background: var(--inverse-surface);
        color: var(--inverse-on-surface);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 1.625);
        font-weight: 700;
        text-transform: lowercase;
    }

    .links {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        flex: 1;
    }

    .link,
    .links slot::slotted(a) {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4) var(--space-7);
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

    .link:hover,
    .links slot::slotted(a:hover) {
        background: var(--surface-container);
        color: var(--on-background);
    }

    .link:focus-visible,
    .links slot::slotted(a:focus-visible) {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .link[data-active='true'],
    .links slot::slotted([aria-current='page']) {
        background: var(--surface-container);
        color: var(--on-background);
        font-weight: 600;
    }

    .cta {
        display: inline-flex;
        align-items: center;
        gap: var(--space-4);
    }

    .cta[hidden] {
        display: none;
    }

    /* The collapse wrapper is transparent on desktop (display: contents), so the
       links and the trailing content join the navbar's flex row. Below 40em it
       becomes the dropdown the menu button opens. */
    .collapse {
        display: contents;
    }

    .toggle {
        display: none;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 4.5);
        height: calc(var(--_base) * 4.5);
        padding: 0;
        margin: 0 0 0 auto;
        background: transparent;
        border: 0;
        border-radius: var(--corner-extra-small);
        color: var(--on-surface-variant);
        cursor: pointer;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            color var(--duration-short-2) var(--easing-standard),
            box-shadow var(--duration-short-2) var(--easing-standard);
    }

    .toggle:hover {
        background: var(--surface-container);
        color: var(--on-background);
    }

    .toggle:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .toggle svg {
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
    }

    @media (max-width: 40em) {
        .panel {
            height: auto;
            min-height: calc(var(--_base) * 7.5);
            flex-wrap: wrap;
            padding: var(--space-6);
            gap: var(--space-6);
        }

        .brand {
            flex: 1;
            min-width: 0;
        }

        .toggle {
            display: inline-flex;
        }

        .collapse {
            display: none;
            flex-basis: 100%;
            flex-direction: column;
            gap: var(--space-6);
        }

        .collapse[data-open='true'] {
            display: flex;
        }

        .links {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-1);
            width: 100%;
        }

        .cta {
            width: 100%;
        }
    }
`;
