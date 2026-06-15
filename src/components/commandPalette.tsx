import {
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePortalTarget } from '../lib/portalTarget';
import './styled/commandPalette.styled.css';

const EXIT_DURATION_MS = 310;

export type CommandPaletteCommand = {
    id: string;
    label: string;
    description?: string;
    icon?: ReactNode;
    shortcut?: ReactNode;
    group?: string;
    keywords?: ReadonlyArray<string>;
    onSelect?: () => void;
};

export type CommandPaletteProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    commands: ReadonlyArray<CommandPaletteCommand>;
    placeholder?: string;
    emptyMessage?: ReactNode;
    /** Fired with the chosen command's `id` when a command is committed. The
       serializable counterpart to a per-command `onSelect`, so the selection
       survives the Web Component boundary. */
    onAction?: (value: string) => void;
    'aria-label'?: string;
};

const matchesQuery = (
    cmd: CommandPaletteCommand,
    queryLower: string,
): boolean => {
    if (!queryLower) return true;
    if (cmd.label.toLowerCase().includes(queryLower)) return true;
    if (cmd.description?.toLowerCase().includes(queryLower)) return true;
    if (cmd.keywords?.some((k) => k.toLowerCase().includes(queryLower)))
        return true;
    return false;
};

export function CommandPalette({
    open,
    onOpenChange,
    commands,
    placeholder = 'Type a command or search…',
    emptyMessage = 'No matches',
    onAction,
    'aria-label': ariaLabel = 'Command palette',
}: CommandPaletteProps) {
    const portalTarget = usePortalTarget();
    const [query, setQuery] = useState('');
    const [highlight, setHighlight] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [exiting, setExiting] = useState(false);
    const isMountedRef = useRef(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const scrimRef = useRef<HTMLDivElement | null>(null);
    const surfaceRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);
    const listboxId = useId();
    const optionId = (i: number) => `${listboxId}-opt-${i}`;

    // Drive the mounted/exiting lifecycle for exit animations.
    useEffect(() => {
        if (open) {
            isMountedRef.current = true;
            setMounted(true);
            setExiting(false);
        } else if (isMountedRef.current) {
            setExiting(true);
            const timer = window.setTimeout(() => {
                setMounted(false);
                setExiting(false);
                isMountedRef.current = false;
            }, EXIT_DURATION_MS);
            return () => window.clearTimeout(timer);
        }
    }, [open]);

    // Reset query and selection whenever the palette closes / reopens.
    useEffect(() => {
        if (open) {
            previouslyFocused.current =
                (document.activeElement as HTMLElement | null) ?? null;
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            setQuery('');
            setHighlight(0);
            const timer = window.setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
            return () => {
                window.clearTimeout(timer);
                document.body.style.overflow = previousOverflow;
                previouslyFocused.current?.focus?.();
            };
        }
        return undefined;
    }, [open]);

    // Outside click & Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
            const e = event as globalThis.KeyboardEvent;
            if (e.key === 'Escape') {
                e.preventDefault();
                onOpenChange(false);
            }
        };
        const onDown = (event: globalThis.MouseEvent) => {
            if (event.target === scrimRef.current) onOpenChange(false);
        };
        document.addEventListener('keydown', onKey);
        const scrim = scrimRef.current;
        scrim?.addEventListener('mousedown', onDown);
        return () => {
            document.removeEventListener('keydown', onKey);
            scrim?.removeEventListener('mousedown', onDown);
        };
    }, [open, onOpenChange]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return commands.filter((c) => matchesQuery(c, q));
    }, [commands, query]);

    // Build display list as (header | command) entries so headers can render
    // inline while options remain a flat indexable list for keyboard nav.
    const entries = useMemo(() => {
        type Entry =
            | { kind: 'header'; group: string }
            | { kind: 'command'; cmd: CommandPaletteCommand; index: number };
        const list: Entry[] = [];
        let lastGroup: string | undefined;
        let cmdIndex = 0;
        for (const cmd of filtered) {
            const group = cmd.group;
            if (group && group !== lastGroup) {
                list.push({ kind: 'header', group });
                lastGroup = group;
            }
            list.push({ kind: 'command', cmd, index: cmdIndex });
            cmdIndex++;
        }
        return list;
    }, [filtered]);

    useEffect(() => {
        if (highlight >= filtered.length) {
            setHighlight(filtered.length > 0 ? 0 : -1);
        }
    }, [filtered, highlight]);

    const commit = (cmd: CommandPaletteCommand) => {
        cmd.onSelect?.();
        onAction?.(cmd.id);
        onOpenChange(false);
    };

    const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlight((h) => Math.min(filtered.length - 1, h + 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlight((h) => Math.max(0, h - 1));
        } else if (event.key === 'Enter') {
            const cmd = filtered[highlight];
            if (cmd) {
                event.preventDefault();
                commit(cmd);
            }
        } else if (event.key === 'Home') {
            event.preventDefault();
            setHighlight(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            setHighlight(filtered.length - 1);
        }
    };

    if (!mounted || typeof document === 'undefined') return null;

    const activeId =
        filtered[highlight] !== undefined ? optionId(highlight) : undefined;

    return createPortal(
        <div
            ref={scrimRef}
            className="command-palette-scrim"
            data-exiting={exiting}
        >
            <div
                ref={surfaceRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                className="command-palette"
                data-exiting={exiting}
            >
                <div className="command-palette__searchbox">
                    <span
                        className="command-palette__search-icon"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        >
                            <title>Search</title>
                            <circle cx="7" cy="7" r="4.5" />
                            <path d="M10.5 10.5L13.5 13.5" />
                        </svg>
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        role="combobox"
                        className="command-palette__input"
                        placeholder={placeholder}
                        value={query}
                        aria-expanded="true"
                        aria-autocomplete="list"
                        aria-controls={listboxId}
                        {...(activeId
                            ? { 'aria-activedescendant': activeId }
                            : {})}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setHighlight(0);
                        }}
                        onKeyDown={onInputKey}
                    />
                </div>
                <div
                    id={listboxId}
                    role="listbox"
                    className="command-palette__list"
                >
                    {filtered.length === 0 ? (
                        <div className="command-palette__empty">
                            {emptyMessage}
                        </div>
                    ) : (
                        entries.map((entry) => {
                            if (entry.kind === 'header') {
                                return (
                                    <div
                                        key={`hdr-${entry.group}`}
                                        className="command-palette__group"
                                        aria-hidden="true"
                                    >
                                        {entry.group}
                                    </div>
                                );
                            }
                            const { cmd, index } = entry;
                            const highlighted = index === highlight;
                            return (
                                <div
                                    key={cmd.id}
                                    id={optionId(index)}
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected={highlighted}
                                    data-highlighted={highlighted}
                                    className="command-palette__option"
                                    onMouseEnter={() => setHighlight(index)}
                                    onMouseDown={(
                                        event: MouseEvent<HTMLDivElement>,
                                    ) => {
                                        event.preventDefault();
                                        commit(cmd);
                                    }}
                                >
                                    {cmd.icon && (
                                        <span className="command-palette__option-icon">
                                            {cmd.icon}
                                        </span>
                                    )}
                                    <span className="command-palette__option-text">
                                        <span className="command-palette__option-label">
                                            {cmd.label}
                                        </span>
                                        {cmd.description && (
                                            <span className="command-palette__option-desc">
                                                {cmd.description}
                                            </span>
                                        )}
                                    </span>
                                    {cmd.shortcut && (
                                        <span className="command-palette__option-shortcut">
                                            {cmd.shortcut}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>,
        portalTarget ?? document.body,
    );
}
