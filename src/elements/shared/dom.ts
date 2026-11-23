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
 * A CSS length from a size property: a number, or a string of only digits, is
 * px; any other string is a CSS length as authored. An attribute is always a
 * string, so `size="480"` and `.size = 480` mean the same.
 */
export function toCssLength(value: string | number): string {
    return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)
        ? `${value}px`
        : value;
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

/**
 * Runs the `slotchange` listeners of each slot in `root` that has content, as
 * a client render fires them. An element that reads its slots on `slotchange`
 * calls it from `firstUpdated()`: a root that Lit hydrates from server output
 * fires no `slotchange` for the slots the server already filled, so without
 * it that content stays hidden.
 */
export function readSlots(root: ParentNode): void {
    for (const slot of root.querySelectorAll('slot')) {
        if (slot.assignedNodes().length > 0) {
            slot.dispatchEvent(new Event('slotchange'));
        }
    }
}
