import {
    type KeyboardEvent,
    type ReactNode,
    useMemo,
    useRef,
    useState,
} from 'react';
import './styled/tree.styled.css';

export type TreeNode<T extends string = string> = {
    value: T;
    label: ReactNode;
    icon?: ReactNode;
    children?: ReadonlyArray<TreeNode<T>>;
    disabled?: boolean;
};

export type TreeProps<T extends string = string> = {
    nodes: ReadonlyArray<TreeNode<T>>;
    expanded?: ReadonlyArray<T>;
    defaultExpanded?: ReadonlyArray<T>;
    onExpandedChange?: (expanded: T[]) => void;
    selected?: T;
    defaultSelected?: T;
    onSelect?: (value: T) => void;
    'aria-label'?: string;
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
        <title>Toggle</title>
        <path d="M4 6l4 4 4-4" />
    </svg>
);

type FlatNode<T extends string> = {
    value: T;
    depth: number;
    parent: T | null;
    hasChildren: boolean;
    disabled: boolean;
};

function flatten<T extends string>(
    nodes: ReadonlyArray<TreeNode<T>>,
    expanded: ReadonlySet<T>,
    depth = 0,
    parent: T | null = null,
    out: FlatNode<T>[] = [],
): FlatNode<T>[] {
    for (const node of nodes) {
        const hasChildren = !!node.children?.length;
        out.push({
            value: node.value,
            depth,
            parent,
            hasChildren,
            disabled: !!node.disabled,
        });
        if (hasChildren && expanded.has(node.value)) {
            flatten(node.children ?? [], expanded, depth + 1, node.value, out);
        }
    }
    return out;
}

export function Tree<T extends string = string>({
    nodes,
    expanded,
    defaultExpanded,
    onExpandedChange,
    selected,
    defaultSelected,
    onSelect,
    'aria-label': ariaLabel = 'Tree',
}: TreeProps<T>) {
    const isExpandedControlled = expanded !== undefined;
    const [expandedInternal, setExpandedInternal] = useState<ReadonlySet<T>>(
        () => new Set(defaultExpanded ?? []),
    );
    const expandedSet = isExpandedControlled
        ? new Set(expanded)
        : expandedInternal;
    const isSelectedControlled = selected !== undefined;
    const [selInternal, setSelInternal] = useState<T | undefined>(
        defaultSelected,
    );
    const selValue = isSelectedControlled ? selected : selInternal;
    const [active, setActive] = useState<T | null>(
        () => nodes[0]?.value ?? null,
    );
    const itemRefs = useRef(new Map<T, HTMLDivElement>());

    const flat = useMemo(
        () => flatten(nodes, expandedSet),
        [nodes, expandedSet],
    );

    const toggle = (value: T) => {
        const next = new Set(expandedSet);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        if (!isExpandedControlled) setExpandedInternal(next);
        onExpandedChange?.(Array.from(next));
    };

    const select = (value: T) => {
        if (!isSelectedControlled) setSelInternal(value);
        onSelect?.(value);
    };

    const focusValue = (value: T | undefined) => {
        if (value == null) return;
        setActive(value);
        itemRefs.current.get(value)?.focus();
    };

    // Next/previous enabled node in the flattened visible order.
    const step = (fromIdx: number, dir: 1 | -1): T | undefined => {
        for (let i = fromIdx + dir; i >= 0 && i < flat.length; i += dir) {
            const candidate = flat[i];
            if (candidate && !candidate.disabled) return candidate.value;
        }
        return undefined;
    };

    const onItemClick = (node: FlatNode<T>) => {
        if (node.disabled) return;
        setActive(node.value);
        if (node.hasChildren) toggle(node.value);
        select(node.value);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, value: T) => {
        const idx = flat.findIndex((f) => f.value === value);
        const cur = flat[idx];
        if (!cur) return;
        // treeitems nest, so a key event bubbles through ancestor treeitems;
        // stop it so only the focused item's handler runs.
        event.stopPropagation();
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                focusValue(step(idx, 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                focusValue(step(idx, -1));
                break;
            case 'Home':
                event.preventDefault();
                focusValue(flat.find((f) => !f.disabled)?.value);
                break;
            case 'End':
                event.preventDefault();
                focusValue(step(flat.length, -1));
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (cur.hasChildren) {
                    if (!expandedSet.has(value)) toggle(value);
                    else focusValue(flat[idx + 1]?.value);
                }
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (cur.hasChildren && expandedSet.has(value)) toggle(value);
                else if (cur.parent != null) focusValue(cur.parent);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (cur.disabled) break;
                if (cur.hasChildren) toggle(value);
                select(value);
                setActive(value);
                break;
            default:
                break;
        }
    };

    const renderLevel = (
        levelNodes: ReadonlyArray<TreeNode<T>>,
        depth: number,
    ): ReactNode =>
        levelNodes.map((node) => {
            const hasChildren = !!node.children?.length;
            const isExpanded = hasChildren && expandedSet.has(node.value);
            const isSelected = selValue === node.value;
            const flatNode: FlatNode<T> = {
                value: node.value,
                depth,
                parent: null,
                hasChildren,
                disabled: !!node.disabled,
            };
            return (
                <div
                    key={node.value}
                    role="treeitem"
                    aria-level={depth + 1}
                    aria-selected={isSelected}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-disabled={node.disabled || undefined}
                    tabIndex={active === node.value ? 0 : -1}
                    ref={(el) => {
                        if (el) itemRefs.current.set(node.value, el);
                        else itemRefs.current.delete(node.value);
                    }}
                    className="tree__item"
                    onClick={(event) => {
                        event.stopPropagation();
                        onItemClick(flatNode);
                    }}
                    onKeyDown={(event) => onKeyDown(event, node.value)}
                >
                    <div
                        className="tree__row"
                        data-selected={isSelected}
                        style={{
                            paddingInlineStart: `calc(${depth} * 2.25rem + 0.75rem)`,
                        }}
                    >
                        <span
                            className="tree__chevron"
                            data-expanded={isExpanded}
                            data-leaf={!hasChildren}
                        >
                            {hasChildren && <ChevronIcon />}
                        </span>
                        {node.icon && (
                            <span className="tree__icon">{node.icon}</span>
                        )}
                        <span className="tree__label">{node.label}</span>
                    </div>
                    {isExpanded && (
                        // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA tree pattern groups child treeitems under role="group"; no semantic HTML element conveys this.
                        <div role="group" className="tree__group">
                            {renderLevel(node.children ?? [], depth + 1)}
                        </div>
                    )}
                </div>
            );
        });

    return (
        <div className="tree" role="tree" aria-label={ariaLabel}>
            {renderLevel(nodes, 0)}
        </div>
    );
}
