import {
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    useEffect,
    useId,
    useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { usePortalTarget } from '../lib/portalTarget';
import { type DialogAction, renderDialogActions } from './modal';
import './styled/drawer.styled.css';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export type DrawerProps = HTMLAttributes<HTMLDivElement> & {
    open: boolean;
    onClose: () => void;
    side?: DrawerSide;
    size?: string | number;
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode | DialogAction[];
    onAction?: (value: string) => void;
};

const toCss = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);

export function Drawer({
    open,
    onClose,
    side = 'right',
    size,
    title,
    description,
    actions,
    onAction,
    className,
    children,
    ...rest
}: DrawerProps) {
    const titleId = useId();
    const descId = useId();
    const portalTarget = usePortalTarget();
    const scrimRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;
        previouslyFocused.current =
            (document.activeElement as HTMLElement | null) ?? null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        const onScrimDown = (event: globalThis.MouseEvent) => {
            if (event.target === scrimRef.current) onClose();
        };
        document.addEventListener('keydown', onKey);
        const scrim = scrimRef.current;
        scrim?.addEventListener('mousedown', onScrimDown);
        return () => {
            document.removeEventListener('keydown', onKey);
            scrim?.removeEventListener('mousedown', onScrimDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused.current?.focus?.();
        };
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    const tokens: string[] = ['drawer', `drawer--${side}`];
    if (className) tokens.push(className);

    const horizontal = side === 'left' || side === 'right';
    const sizeStyle: CSSProperties = size
        ? horizontal
            ? { width: toCss(size) }
            : { height: toCss(size) }
        : {};

    return createPortal(
        <div ref={scrimRef} className="drawer-scrim" data-side={side}>
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                {...(title ? { 'aria-labelledby': titleId } : {})}
                {...(description ? { 'aria-describedby': descId } : {})}
                tabIndex={-1}
                className={tokens.join(' ')}
                style={sizeStyle}
                {...rest}
            >
                {title && (
                    <h2 id={titleId} className="drawer__title">
                        {title}
                    </h2>
                )}
                {description && (
                    <p id={descId} className="drawer__description">
                        {description}
                    </p>
                )}
                <div className="drawer__body">{children}</div>
                {actions && (
                    <div className="drawer__actions">
                        {renderDialogActions(actions, onAction)}
                    </div>
                )}
            </div>
        </div>,
        portalTarget ?? document.body,
    );
}
