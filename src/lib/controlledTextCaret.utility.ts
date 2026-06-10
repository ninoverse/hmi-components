import {
    type ChangeEvent,
    type Ref,
    type RefCallback,
    useCallback,
    useLayoutEffect,
    useRef,
} from 'react';

type SelectionCapableElement = HTMLInputElement | HTMLTextAreaElement;

/* Only these <input> types expose a usable selection API; others
   (number, email, ...) return null from selectionStart and throw on
   setSelectionRange. <textarea> always supports selection. */
const SELECTION_CAPABLE_INPUT_TYPES = new Set([
    'text',
    'search',
    'password',
    'tel',
    'url',
]);

function supportsSelection(element: SelectionCapableElement): boolean {
    if (element instanceof HTMLTextAreaElement) return true;
    return SELECTION_CAPABLE_INPUT_TYPES.has(element.type.toLowerCase());
}

/**
 * Preserve the caret across controlled `value` updates when the host echoes
 * the user's edit asynchronously (web-component hosts: Dioxus, Vue, Angular).
 *
 * Without this, every mid-string keystroke lands with the caret at the end:
 * React reverts the DOM to the old prop, the host's echo arrives a tick
 * later, React assigns `el.value = newValue`, and the HTML spec clamps the
 * selection to end. We capture `{ value, selectionStart, selectionEnd }` in
 * our own onChange (which runs before React's controlled-state restoration);
 * once the prop catches up to the captured value, a layout effect restores
 * the selection before paint.
 */
export function useControlledTextCaret<T extends SelectionCapableElement>(
    value: string | undefined,
    forwardedRef: Ref<T> | undefined,
): {
    ref: RefCallback<T>;
    captureSelection: (event: ChangeEvent<T>) => void;
} {
    const innerRef = useRef<T | null>(null);
    const captureRef = useRef<{
        value: string;
        start: number;
        end: number;
    } | null>(null);

    const ref = useCallback<RefCallback<T>>(
        (node) => {
            innerRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef)
                (forwardedRef as { current: T | null }).current = node;
        },
        [forwardedRef],
    );

    const captureSelection = (event: ChangeEvent<T>) => {
        /* IME composition: setSelectionRange mid-composition desynchronises
           the IME's internal state and breaks candidate selection. */
        const native = event.nativeEvent;
        if ('isComposing' in native && native.isComposing) return;
        const element = event.currentTarget;
        if (!supportsSelection(element)) return;
        const start = element.selectionStart;
        const end = element.selectionEnd;
        if (start === null || end === null) return;
        captureRef.current = { value: element.value, start, end };
    };

    useLayoutEffect(() => {
        const captured = captureRef.current;
        if (!captured) return;
        captureRef.current = null;
        const element = innerRef.current;
        if (!element) return;
        if (document.activeElement !== element) return;
        if (!supportsSelection(element)) return;
        /* The prop disagrees with the user's edit (host transformed or
           rejected the input). Let the default end-clamp stand — there is
           no meaningful position to restore to. */
        if (captured.value !== value) return;
        element.setSelectionRange(captured.start, captured.end);
    }, [value]);

    return { ref, captureSelection };
}
