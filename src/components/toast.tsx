import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './styled/toast.styled.css';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export type ToastOptions = {
    /** Tone, which selects the icon and colour. @default 'info' */
    variant?: ToastVariant;
    /** Bold heading line. */
    title?: ReactNode;
    /** Secondary message line. */
    body?: ReactNode;
    /** Auto-dismiss after this many milliseconds. 0 disables auto-dismiss. @default 4000 */
    duration?: number;
};

type ToastItem = {
    id: number;
    variant: ToastVariant;
    title?: ReactNode;
    body?: ReactNode;
    duration: number;
    leaving?: boolean;
};

type Listener = (items: ToastItem[]) => void;

const listeners = new Set<Listener>();
const items: ToastItem[] = [];
let nextId = 0;
const EXIT_DURATION = 220;
const DEFAULT_DURATION = 4000;

function emit() {
    const snapshot = [...items];
    for (const fn of listeners) fn(snapshot);
}

function dismiss(id: number) {
    const idx = items.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const target = items[idx];
    if (!target) return;
    target.leaving = true;
    emit();
    window.setTimeout(() => {
        const j = items.findIndex((t) => t.id === id);
        if (j >= 0) items.splice(j, 1);
        emit();
    }, EXIT_DURATION);
}

function show(opts: ToastOptions): number {
    const id = ++nextId;
    const next: ToastItem = {
        id,
        variant: opts.variant ?? 'info',
        title: opts.title,
        body: opts.body,
        duration: opts.duration ?? DEFAULT_DURATION,
    };
    items.push(next);
    emit();
    if (next.duration > 0) {
        window.setTimeout(() => dismiss(id), next.duration);
    }
    return id;
}

type ShortcutOptions = Omit<ToastOptions, 'variant' | 'title' | 'body'>;

/**
 * Imperative toast API. Call `toast.show(...)` (or the `info`/`success`/
 * `warning`/`danger` shortcuts) from anywhere to enqueue a toast; render a
 * single {@link ToastHost} once near your app root to display them.
 *
 * @example
 * toast.success('Saved', 'Your changes are live.');
 * const id = toast.show({ variant: 'info', title: 'Working…', duration: 0 });
 * toast.dismiss(id);
 */
export const toast = {
    show,
    dismiss,
    info: (title: ReactNode, body?: ReactNode, opts?: ShortcutOptions) =>
        show({ ...opts, variant: 'info', title, body }),
    success: (title: ReactNode, body?: ReactNode, opts?: ShortcutOptions) =>
        show({ ...opts, variant: 'success', title, body }),
    warning: (title: ReactNode, body?: ReactNode, opts?: ShortcutOptions) =>
        show({ ...opts, variant: 'warning', title, body }),
    danger: (title: ReactNode, body?: ReactNode, opts?: ShortcutOptions) =>
        show({ ...opts, variant: 'danger', title, body }),
};

const InfoIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Info</title>
        <circle cx="10" cy="10" r="8" />
        <path d="M10 9v5M10 6.5v.01" />
    </svg>
);

const SuccessIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Success</title>
        <circle cx="10" cy="10" r="8" />
        <path d="M6.5 10l2.5 2.5 4.5-5" />
    </svg>
);

const WarningIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Warning</title>
        <path d="M10 2.5L18 16.5H2L10 2.5z" />
        <path d="M10 8v4M10 14.5v.01" />
    </svg>
);

const DangerIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Error</title>
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4M10 13.5v.01" />
    </svg>
);

const CloseIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Dismiss</title>
        <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
);

const VARIANT_ICONS = {
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon,
    danger: DangerIcon,
} as const;

/**
 * Renders queued toasts in a portal. Mount exactly once near your app root;
 * trigger toasts via the {@link toast} API.
 *
 * @example
 * <ToastHost />
 */
export function ToastHost() {
    const [list, setList] = useState<ToastItem[]>([]);

    useEffect(() => {
        const listener: Listener = (next) => setList(next);
        listeners.add(listener);
        setList([...items]);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="toast-host" aria-live="polite">
            {list.map((t) => {
                const Icon = VARIANT_ICONS[t.variant];
                return (
                    <div
                        key={t.id}
                        className={`toast toast--${t.variant}`}
                        data-leaving={t.leaving ? 'true' : 'false'}
                        role="status"
                    >
                        <span className="toast__icon">
                            <Icon />
                        </span>
                        <div className="toast__content">
                            {t.title && (
                                <p className="toast__title">{t.title}</p>
                            )}
                            {t.body && <p className="toast__body">{t.body}</p>}
                        </div>
                        <button
                            type="button"
                            className="toast__close"
                            aria-label="Dismiss"
                            onClick={() => dismiss(t.id)}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                );
            })}
        </div>,
        document.body,
    );
}
