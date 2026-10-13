// How many dialogs hold the lock, and the page's own inline `overflow`, which
// the last one gives back.
let holders = 0;
let previous = '';

/**
 * Stops the page scrolling behind an open dialog, and returns the function that
 * lets it scroll again. `<dialog>.showModal()` makes the page behind it inert,
 * but does not stop it scrolling, so a modal surface takes this lock while it is
 * open.
 *
 * The lock is counted: stacked dialogs (a confirm-dialog over a drawer) share
 * it, and the page's own `overflow` comes back only when the last one lets go.
 * Browser only: call it from a lifecycle that never runs on the server.
 */
export function lockScroll(): () => void {
    const root = document.documentElement;
    if (holders === 0) {
        previous = root.style.overflow;
        root.style.overflow = 'hidden';
    }
    holders += 1;
    let released = false;
    return () => {
        if (released) return;
        released = true;
        holders -= 1;
        if (holders === 0) root.style.overflow = previous;
    };
}
