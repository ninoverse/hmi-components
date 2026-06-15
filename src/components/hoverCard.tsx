import {
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePortalTarget } from '../lib/portalTarget';
import { renderTriggerAnchor } from '../lib/triggerAnchor';
import './styled/hoverCard.styled.css';

export type HoverCardSide = 'top' | 'bottom' | 'left' | 'right';
export type HoverCardAlign = 'start' | 'center' | 'end';

export type HoverCardProps = {
    trigger: ReactNode;
    children: ReactNode;
    side?: HoverCardSide;
    align?: HoverCardAlign;
    openDelay?: number;
    closeDelay?: number;
    width?: number | string;
};

type Position = { x: number; y: number; transform: string };

// Cross-axis translate fraction for the chosen alignment.
const ALIGN_SHIFT: Record<HoverCardAlign, string> = {
    start: '0',
    center: '-50%',
    end: '-100%',
};

export function HoverCard({
    trigger,
    children,
    side = 'bottom',
    align = 'center',
    openDelay = 300,
    closeDelay = 150,
    width,
}: HoverCardProps) {
    const portalTarget = usePortalTarget();
    const triggerRef = useRef<HTMLElement | null>(null);
    const timer = useRef<number | null>(null);
    const [show, setShow] = useState(false);
    const [pos, setPos] = useState<Position>({ x: 0, y: 0, transform: '' });

    const place = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const gap = 6;
        const sx = window.scrollX;
        const sy = window.scrollY;
        const shift = ALIGN_SHIFT[align];
        if (side === 'top' || side === 'bottom') {
            const x =
                align === 'start'
                    ? r.left
                    : align === 'end'
                      ? r.right
                      : r.left + r.width / 2;
            const top = side === 'top';
            setPos({
                x: x + sx,
                y: (top ? r.top - gap : r.bottom + gap) + sy,
                transform: `translate(${shift}, ${top ? '-100%' : '0'})`,
            });
        } else {
            const y =
                align === 'start'
                    ? r.top
                    : align === 'end'
                      ? r.bottom
                      : r.top + r.height / 2;
            const left = side === 'left';
            setPos({
                x: (left ? r.left - gap : r.right + gap) + sx,
                y: y + sy,
                transform: `translate(${left ? '-100%' : '0'}, ${shift})`,
            });
        }
    }, [side, align]);

    const open = useCallback(() => {
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            place();
            setShow(true);
        }, openDelay);
    }, [openDelay, place]);

    const close = useCallback(() => {
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            setShow(false);
        }, closeDelay);
    }, [closeDelay]);

    // Pointer entering the card cancels the pending close so the user can
    // interact with its content; it must not re-trigger the open delay.
    const keepOpen = useCallback(() => {
        if (timer.current !== null) window.clearTimeout(timer.current);
    }, []);

    useEffect(() => {
        return () => {
            if (timer.current !== null) window.clearTimeout(timer.current);
        };
    }, []);

    useEffect(() => {
        if (!show) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (timer.current !== null) window.clearTimeout(timer.current);
                setShow(false);
            }
        };
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        document.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
            document.removeEventListener('keydown', onKey);
        };
    }, [show, place]);

    const triggerEl = renderTriggerAnchor(
        trigger,
        triggerRef,
        {
            onMouseEnter: open,
            onMouseLeave: close,
            onFocus: open,
            onBlur: close,
        },
        'hover-card-trigger',
    );

    return (
        <>
            {triggerEl}
            {show &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="hover-card-anchor"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            transform: pos.transform,
                        }}
                    >
                        {/* biome-ignore lint/a11y/noStaticElementInteractions: keeping the card open while the pointer is over it is a sighted-pointer affordance with no corresponding ARIA role (matches the HoverCard pattern). */}
                        <div
                            className="hover-card"
                            data-side={side}
                            style={width !== undefined ? { width } : undefined}
                            onMouseEnter={keepOpen}
                            onMouseLeave={close}
                        >
                            {children}
                        </div>
                    </div>,
                    portalTarget ?? document.body,
                )}
        </>
    );
}
