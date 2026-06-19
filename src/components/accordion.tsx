import { type HTMLAttributes, type ReactNode, useId, useState } from 'react';
import './styled/accordion.styled.css';

export type AccordionItem = {
    /** Header content shown on the always-visible trigger. */
    title: ReactNode;
    /** Panel content revealed when the item is open. */
    body: ReactNode;
    /** Disable the trigger so the panel can't be toggled. @default false */
    disabled?: boolean;
};

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
    /** Ordered list of sections to render. */
    items: ReadonlyArray<AccordionItem>;
    /** Allow multiple panels open at once instead of one. @default false */
    multiple?: boolean;
    /** Controlled set of open item indices. Provide with `onOpenChange`. */
    open?: ReadonlyArray<number>;
    /** Initially open item indices when uncontrolled. */
    defaultOpen?: ReadonlyArray<number>;
    /** Fires after a toggle with the new sorted list of open indices. */
    onOpenChange?: (open: number[]) => void;
};

const ChevronIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Expand</title>
        <path d="M4 6l4 4 4-4" />
    </svg>
);

/**
 * Vertically stacked, collapsible sections. Works controlled (`open` +
 * `onOpenChange`) or uncontrolled (`defaultOpen`).
 *
 * @example
 * <Accordion
 *     multiple
 *     items={[{ title: 'Section', body: 'Details…' }]}
 * />
 */
export function Accordion({
    items,
    multiple = false,
    open,
    defaultOpen,
    onOpenChange,
    className,
    ...rest
}: AccordionProps) {
    const idRoot = useId();
    const isControlled = open !== undefined;
    const [internal, setInternal] = useState<ReadonlySet<number>>(
        () => new Set(defaultOpen ?? []),
    );
    const current = isControlled ? new Set(open) : internal;

    const toggle = (index: number) => {
        const next = new Set(multiple ? current : []);
        if (current.has(index)) {
            next.delete(index);
        } else {
            if (!multiple) next.clear();
            next.add(index);
        }
        if (!isControlled) setInternal(next);
        onOpenChange?.(Array.from(next).sort((a, b) => a - b));
    };

    const tokens: string[] = ['acc'];
    if (className) tokens.push(className);

    return (
        <div className={tokens.join(' ')} {...rest}>
            {items.map((item, i) => {
                const isOpen = current.has(i);
                const headerId = `${idRoot}-h-${i}`;
                const panelId = `${idRoot}-p-${i}`;
                return (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: items array is the stable identity at this layer
                        key={i}
                        className="acc__item"
                    >
                        <button
                            type="button"
                            id={headerId}
                            className="acc__trigger"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            disabled={item.disabled}
                            onClick={() => toggle(i)}
                        >
                            <span className="acc__title">{item.title}</span>
                            <span className="acc__chev">
                                <ChevronIcon />
                            </span>
                        </button>
                        <section
                            id={panelId}
                            aria-labelledby={headerId}
                            className="acc__panel"
                            data-open={isOpen}
                        >
                            <div className="acc__panel-inner">
                                <div className="acc__panel-body">
                                    {item.body}
                                </div>
                            </div>
                        </section>
                    </div>
                );
            })}
        </div>
    );
}
