/**
 * The focused element, following `shadowRoot.activeElement` through every
 * open shadow root. `document.activeElement` alone stops at the outermost host.
 */
export function activeElementDeep(
    root: Document | ShadowRoot = document,
): Element | null {
    let active = root.activeElement;
    while (active?.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active;
}

/** Whether the Popover API (`popover` attribute, `showPopover()`) is available. */
export function supportsPopover(): boolean {
    return (
        typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype
    );
}

/**
 * Hides the parent of a `slotchange` slot that has no content and no text
 * fallback, and shows it again once something is slotted.
 */
export function toggleEmpty(event: Event, hasText: boolean): void {
    const slot = event.target as HTMLSlotElement;
    (slot.parentElement as HTMLElement).hidden =
        slot.assignedNodes().length === 0 && !hasText;
}
