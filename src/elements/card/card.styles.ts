import { css } from 'lit';

/* Card — elevated surface with asymmetric leaf corners. The default variant
   carries elevation-1 to lift it off the page. Four variants: default (warm
   surface), flat (no shadow), ink (inverse-dark surface for high-contrast
   callouts), accent (primary tonal fill).

   Ported from src/components/styled/card.styled.css, with the surface, the
   border and the two tonal fills re-based onto the --panel-* tokens so the
   glass and liquid materials reach the card (R4). Under the solid material
   those tokens resolve to the values the React card used, but for the
   surface: the low container, a step under v5's high one.

   Each variant sets --on-panel, --on-panel-variant and --on-panel-link, the
   text, muted text and link colours of what it holds. They inherit through
   the slots, so hmi-text, hmi-heading and hmi-link read the card's colours
   on the ink and accent surfaces; the default card sets them back, so a card
   nested in an ink card reads its own.

   The ink card is the inverse surface, so the bars it holds take inverse
   colours too: --on-panel-track for the empty track, the card's text at 20% over the
   inverse surface, opaque so the glass and liquid sheens don't thin it,
   --on-panel-fill for progress's and slider's fill, and --on-panel-success,
   --on-panel-warning and --on-panel-error for meter's levels and slider's
   error, each blended toward the card's text. Progress, meter and slider
   read them before their own colours, and skeleton its surface from the track. Every other card leaves them unset. */
export const styles = css`
    :host {
        display: block;
    }

    .panel {
        --on-panel: var(--on-surface);
        --on-panel-variant: var(--on-surface-variant);
        --on-panel-link: var(--ref-primary-40);
        --on-panel-track: initial;
        --on-panel-fill: initial;
        --on-panel-success: initial;
        --on-panel-warning: initial;
        --on-panel-error: initial;
        background: var(--panel-bg);
        color: var(--on-background);
        border: calc(var(--_base) * 0.125) solid var(--panel-border);
        border-start-start-radius: var(--corner-tl);
        border-start-end-radius: var(--corner-tr);
        border-end-end-radius: var(--corner-br);
        border-end-start-radius: var(--corner-bl);
        /* A grid or flex row stretches the host; the panel fills it, and on
           its own the host is as tall as the panel. */
        height: 100%;
        padding: var(--space-10);
        box-shadow: var(--elevation-1);
        overflow-wrap: anywhere;
        -webkit-backdrop-filter: var(--panel-filter);
        backdrop-filter: var(--panel-filter);
    }

    /* The parts sit on the slots, which are boxes, so a consumer's margin or
       border on ::part(header) or ::part(footer) draws. An empty slot is 0 high. */
    slot[name] {
        display: block;
    }

    :host([variant='flat']) .panel {
        box-shadow: var(--elevation-0);
        border-color: var(--card-flat-border, var(--panel-border));
    }

    :host([variant='ink']) .panel {
        --on-panel: var(--inverse-on-surface);
        --on-panel-variant: color-mix(
            in oklab,
            var(--inverse-on-surface) 90%,
            var(--inverse-surface)
        );
        --on-panel-link: color-mix(
            in oklab,
            var(--inverse-primary) 35%,
            var(--inverse-on-surface)
        );
        --on-panel-track: color-mix(
            in srgb,
            var(--inverse-on-surface) 20%,
            var(--inverse-surface)
        );
        --on-panel-fill: var(--inverse-primary);
        --on-panel-success: color-mix(
            in oklab,
            var(--success) 55%,
            var(--inverse-on-surface)
        );
        --on-panel-warning: color-mix(
            in oklab,
            var(--warning) 55%,
            var(--inverse-on-surface)
        );
        --on-panel-error: color-mix(
            in oklab,
            var(--error) 55%,
            var(--inverse-on-surface)
        );
        background: var(--panel-ink-bg);
        color: var(--inverse-on-surface);
        border-color: transparent;
    }

    :host([variant='accent']) .panel {
        --on-panel: var(--on-primary-container);
        --on-panel-variant: color-mix(
            in oklab,
            var(--on-primary-container) 92%,
            var(--primary-container)
        );
        background: var(--panel-accent-bg);
        color: var(--on-primary-container);
        border-color: color-mix(
            in oklab,
            var(--primary) 18%,
            var(--panel-border)
        );
    }

    /* Active / selected — lifts the card off the page, and draws its edge in
       --outline, which shows where a shadow doesn't: on a dark page, and on a
       flat card. Token-driven, so it is a normal raised shadow in most
       structures and the flat accent offset under Field Journal. Placed last
       so an active+flat card still lifts. */
    :host([active]) .panel {
        box-shadow: var(--elevation-3);
        border-color: var(--outline);
    }

    /* Forced colours drop the shadow and the surfaces, so the active card
       takes a ring in the system's selection colour. */
    @media (forced-colors: active) {
        :host([active]) .panel {
            outline: calc(var(--_base) * 0.375) solid Highlight;
            outline-offset: calc(var(--_base) * 0.25);
        }
    }
`;
