import { createContext, useContext } from 'react';

/**
 * The custom-element host an overlay is rendered inside, or `null` for pure
 * React usage. Populated by the Web Component wrapper in `web-components.ts`;
 * never mounted by the plain React components, so it defaults to `null`.
 *
 * Overlays must portal into this host (not `document.body`) when present: r2wc
 * attaches React's event listener to the host, so a `document.body` portal
 * would let events bubble past it and React's synthetic events would never
 * fire on dialog content.
 */
export const HostElementContext = createContext<HTMLElement | null>(null);

/** Returns the custom-element host to portal into, or `null` in plain React. */
export function usePortalTarget(): HTMLElement | null {
    return useContext(HostElementContext);
}
