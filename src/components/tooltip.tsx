import {
    type ReactNode,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { renderTriggerAnchor } from '../lib/triggerAnchor';
import './styled/tooltip.styled.css';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export type TooltipProps = {
    /** Tooltip content shown on hover/focus. */
    label: ReactNode;
    /** Side of the trigger to position on. @default 'top' */
    side?: TooltipSide;
    /** Delay before showing, in ms. @default 200 */
    delay?: number;
    /** Trigger element the tooltip describes. */
    children: ReactNode;
};

/**
 * Text tooltip shown on hover/focus, positioned in a portal and wired to the
 * trigger via `aria-describedby`.
 *
 * @example
 * <Tooltip label="Copy"><Button asIcon><CopyIcon /></Button></Tooltip>
 */

type Position = { x: number; y: number; transform: string };

export function Tooltip({
    label,
    side = 'top',
    delay = 200,
    children,
}: TooltipProps) {
    const id = useId();
    const triggerRef = useRef<HTMLElement | null>(null);
    const timer = useRef<number | null>(null);
    const [show, setShow] = useState(false);
    const [pos, setPos] = useState<Position>({ x: 0, y: 0, transform: '' });

    const place = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const gap = 8;
        const sx = window.scrollX;
        const sy = window.scrollY;
        const cx = r.left + r.width / 2 + sx;
        const cy = r.top + r.height / 2 + sy;
        if (side === 'top') {
            setPos({
                x: cx,
                y: r.top - gap + sy,
                transform: 'translate(-50%, -100%)',
            });
        } else if (side === 'bottom') {
            setPos({
                x: cx,
                y: r.bottom + gap + sy,
                transform: 'translate(-50%, 0)',
            });
        } else if (side === 'left') {
            setPos({
                x: r.left - gap + sx,
                y: cy,
                transform: 'translate(-100%, -50%)',
            });
        } else {
            setPos({
                x: r.right + gap + sx,
                y: cy,
                transform: 'translate(0, -50%)',
            });
        }
    }, [side]);

    useEffect(() => {
        return () => {
            if (timer.current !== null) window.clearTimeout(timer.current);
        };
    }, []);

    const open = useCallback(() => {
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            place();
            setShow(true);
        }, delay);
    }, [delay, place]);

    const close = useCallback(() => {
        if (timer.current !== null) window.clearTimeout(timer.current);
        setShow(false);
    }, []);

    const trigger = renderTriggerAnchor(
        children,
        triggerRef,
        {
            onMouseEnter: open,
            onMouseLeave: close,
            onFocus: open,
            onBlur: close,
            'aria-describedby': show ? id : undefined,
        },
        'tooltip-trigger',
    );

    return (
        <>
            {trigger}
            {show &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="tooltip-anchor"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            transform: pos.transform,
                        }}
                    >
                        <div
                            id={id}
                            role="tooltip"
                            className="tooltip"
                            data-side={side}
                        >
                            {label}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
