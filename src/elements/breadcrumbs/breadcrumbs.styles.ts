import { css } from 'lit';

/* Breadcrumbs — a semantic <nav><ol> with a decorative separator between
   items. Links have a soft hover background; the current item carries
   aria-current="page" and a heavier weight. Ported from
   src/components/styled/breadcrumbs.styled.css. */
export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
        align-items: center;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
    }

    .list {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .item {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
    }

    .link {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--corner-extra-small);
        color: var(--on-surface-variant);
        text-decoration: none;
        transition:
            background var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .link:hover {
        background: var(--surface-container);
        color: var(--on-background);
    }

    .link:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .separator {
        color: var(--ref-neutral-60);
        user-select: none;
    }

    .current {
        padding: var(--space-2) var(--space-4);
        color: var(--on-background);
        font-weight: 600;
    }

    /* The slotted separator is only the source of the copies. */
    .separator-source {
        display: none;
    }
`;
