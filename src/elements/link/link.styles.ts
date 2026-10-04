import { css } from 'lit';

/* Link — inline anchor matching the Button `link` variant: the primary accent
   with a thick, offset underline that fades when idle and solidifies on hover.
   The underline can be always on, hover-only or off; the muted tone reuses the
   on-surface-variant role for secondary links. The accent is --ref-primary-40,
   as Button's link variant uses. Ported from
   src/components/styled/link.styled.css. */
export const styles = css`
    :host {
        display: inline;
    }

    .base {
        color: var(--ref-primary-40);
        font: inherit;
        cursor: pointer;
        text-decoration-thickness: calc(var(--_base) * 0.125);
        text-underline-offset: calc(var(--_base) * 0.375);
        transition: text-decoration-color 0.15s ease;
    }

    :host([underline='always']) .base,
    :host([underline='hover']) .base:hover {
        text-decoration-line: underline;
    }

    :host([underline='always']) .base {
        text-decoration-color: color-mix(
            in oklab,
            var(--ref-primary-40) 40%,
            transparent
        );
    }

    :host([underline='hover']) .base,
    :host([underline='none']) .base {
        text-decoration-line: none;
    }
    :host([underline='hover']) .base:hover {
        text-decoration-line: underline;
    }

    .base:hover {
        text-decoration-color: var(--ref-primary-40);
    }

    :host([tone='muted']) .base {
        color: var(--on-surface-variant);
    }
    :host([tone='muted'][underline='always']) .base {
        text-decoration-color: color-mix(
            in oklab,
            var(--on-surface-variant) 40%,
            transparent
        );
    }
    :host([tone='muted']) .base:hover {
        text-decoration-color: var(--on-surface-variant);
    }

    .base:focus-visible {
        outline: calc(var(--_base) * 0.25) solid var(--ring);
        outline-offset: calc(var(--_base) * 0.25);
        border-radius: var(--corner-extra-small);
    }
`;
