import {
    type MouseEvent,
    type ReactNode,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePortalTarget } from '../lib/portalTarget';
import { renderTriggerAnchor } from '../lib/triggerAnchor';
import './styled/contextMenu.styled.css';

export type ContextMenuProps = {
    /** Trigger element; right-clicking it opens the menu at the cursor. */
    children: ReactNode;
    /** Menu content rendered in a viewport-clamped portal (e.g. a `<Menu>`). */
    menu: ReactNode;
};

type Coords = { x: number; y: number };

/**
 * Right-click (context) menu. Wraps a trigger and opens `menu` at the pointer,
 * clamped within the viewport; closes on outside click, Escape or scroll.
 *
 * @example
 * <ContextMenu menu={<Menu items={items} />}><div>Right-click me</div></ContextMenu>
 */
export function ContextMenu({ children, menu }: ContextMenuProps) {
    const portalTarget = usePortalTarget();
    const triggerRef = useRef<HTMLElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 });

    // Clamp the menu inside the viewport once it has measurable size, so a
    // right-click near an edge never opens a menu that overflows off-screen.
    useLayoutEffect(() => {
        if (!open) return;
        const el = menuRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const margin = 8;
        const maxX = window.innerWidth - r.width - margin;
        const maxY = window.innerHeight - r.height - margin;
        const x = Math.max(margin, Math.min(coords.x, maxX));
        const y = Math.max(margin, Math.min(coords.y, maxY));
        if (x !== coords.x || y !== coords.y) setCoords({ x, y });
    }, [open, coords]);

    useEffect(() => {
        if (!open) return;
        const onDown = (event: globalThis.MouseEvent) => {
            const target = event.target as Node | null;
            if (target && menuRef.current?.contains(target)) return;
            setOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        const onScroll = () => setOpen(false);
        // Activating an item (a <button>) runs its handler — which bubbles
        // first — then dismisses; clicking padding or a label keeps it open.
        const onClick = (event: globalThis.MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target || !menuRef.current?.contains(target)) return;
            if (target.closest('button')) setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onScroll);
        };
    }, [open]);

    const triggerEl = renderTriggerAnchor(
        children,
        triggerRef,
        {
            onContextMenu: (event: MouseEvent<HTMLElement>) => {
                event.preventDefault();
                setCoords({ x: event.clientX, y: event.clientY });
                setOpen(true);
            },
        },
        'context-menu-trigger',
    );

    return (
        <>
            {triggerEl}
            {open &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={menuRef}
                        className="context-menu"
                        style={{ left: coords.x, top: coords.y }}
                    >
                        {menu}
                    </div>,
                    portalTarget ?? document.body,
                )}
        </>
    );
}
