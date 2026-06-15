import {
    cloneElement,
    type HTMLAttributes,
    isValidElement,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

type PropBag = Record<string, unknown>;

/**
 * Render a floating component's trigger as an anchor that owns a ref + event
 * handlers and is guaranteed to have a layout box for positioning.
 *
 * - An intrinsic DOM element (`<button>`, `<span>`, …) is the pure-React
 *   ergonomic path: it is cloned with the ref forwarded and our handlers merged
 *   onto any the author already set (the author's run first).
 * - Anything else — slotted live nodes projected across the Web Component
 *   boundary, a primitive, or a custom component that can't reliably take a ref
 *   — is wrapped in an `inline-block` span so the floating UI gets a real
 *   bounding rect and pointer target.
 */
export function renderTriggerAnchor(
    node: ReactNode,
    anchorRef: Ref<HTMLElement>,
    handlers: PropBag,
    className: string,
): ReactNode {
    if (isValidElement(node) && typeof node.type === 'string') {
        const element = node as ReactElement<PropBag>;
        return cloneElement(element, {
            ref: anchorRef,
            ...mergeHandlers(element.props, handlers),
        });
    }
    return (
        <span
            className={className}
            ref={anchorRef as Ref<HTMLSpanElement>}
            {...(handlers as unknown as HTMLAttributes<HTMLSpanElement>)}
        >
            {node}
        </span>
    );
}

/** Merge our handlers onto an element's existing props: when both define the
   same event handler, call the author's first then ours; pass the rest through
   (e.g. aria-* attributes we set on the trigger). */
function mergeHandlers(original: PropBag, ours: PropBag): PropBag {
    const merged: PropBag = {};
    for (const [key, value] of Object.entries(ours)) {
        const prev = original[key];
        if (typeof value === 'function' && typeof prev === 'function') {
            merged[key] = (...args: unknown[]) => {
                (prev as (...a: unknown[]) => void)(...args);
                (value as (...a: unknown[]) => void)(...args);
            };
        } else {
            merged[key] = value;
        }
    }
    return merged;
}
