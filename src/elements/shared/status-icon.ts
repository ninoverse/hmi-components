import { html, nothing, svg } from 'lit';

export type StatusVariant = 'info' | 'success' | 'warning' | 'danger';

/* Library-owned status icons, shown by Alert and Banner while their `icon`
   slot is empty. */
const ICON_PATHS: Record<StatusVariant, readonly string[]> = {
    info: ['M10 9v5M10 6.5v.01'],
    success: ['M6.5 10l2.5 2.5 4.5-5'],
    warning: ['M10 2.5L18 16.5H2L10 2.5z', 'M10 8v4M10 14.5v.01'],
    danger: ['M10 6v4M10 13.5v.01'],
};

export const statusIcon = (variant: StatusVariant) =>
    html`<svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
    >
        ${variant === 'warning' ? nothing : svg`<circle cx="10" cy="10" r="8" />`}
        ${(ICON_PATHS[variant] ?? ICON_PATHS.info).map(
            (d) => svg`<path d=${d} />`,
        )}
    </svg>`;
