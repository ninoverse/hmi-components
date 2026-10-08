import { emit } from './events.js';

/** What a navigation link reports in `hmi-nav`: its own fields, plus the `href`. */
export type NavDetail = { href: string | undefined };

/** A click the browser handles itself: a new tab, a new window or a download. */
const isModified = (event: MouseEvent) =>
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey;

/**
 * The click handler of a navigation link (`<a href>`).
 *
 * A plain click fires the cancelable `hmi-nav`; if a listener cancels it, or the
 * link has no `href`, the browser does not navigate. A modified click fires
 * nothing, so a router that cancels `hmi-nav` to handle the navigation itself
 * cannot break "open in a new tab". A link without `href` never navigates, even
 * then.
 */
export function handleNavClick<T extends NavDetail>(
    host: EventTarget,
    event: MouseEvent,
    detail: T,
): void {
    if (!detail.href) event.preventDefault();
    if (isModified(event)) return;
    if (!emit<T>(host, 'hmi-nav', detail, { cancelable: true })) {
        event.preventDefault();
    }
}
