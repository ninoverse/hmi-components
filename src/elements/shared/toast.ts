import { isServer } from 'lit';

/** The tone of a toast, which picks its icon and colour. */
export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

/** What a toast's title or body holds: text, or a DOM node the caller built. */
export type ToastContent = string | Node;

export interface ToastOptions {
    /** Tone, which selects the icon and colour. @default 'info' */
    variant?: ToastVariant;
    /** Bold heading line. */
    title?: ToastContent | undefined;
    /** Secondary message line. */
    body?: ToastContent | undefined;
    /** Auto-dismiss after this many milliseconds. 0 disables auto-dismiss. @default 4000 */
    duration?: number;
}

/** A queued toast, as the host renders it. */
export interface ToastItem {
    readonly id: number;
    readonly variant: ToastVariant;
    readonly title?: ToastContent | undefined;
    readonly body?: ToastContent | undefined;
    readonly duration: number;
    /** Set while it plays its exit animation, before it leaves the queue. */
    readonly leaving: boolean;
}

type Listener = (items: readonly ToastItem[]) => void;

interface Timer {
    handle: ReturnType<typeof setTimeout> | undefined;
    started: number;
    remaining: number;
}

const EXIT_DURATION = 220;
const DEFAULT_DURATION = 4000;

const listeners = new Set<Listener>();
const timers = new Map<number, Timer>();
let items: readonly ToastItem[] = [];
let nextId = 0;

function publish(next: readonly ToastItem[]): void {
    items = next;
    for (const listener of listeners) listener(items);
}

function schedule(id: number, ms: number): void {
    const timer = timers.get(id) ?? {
        handle: undefined,
        started: 0,
        remaining: 0,
    };
    timer.started = Date.now();
    timer.remaining = ms;
    timer.handle = setTimeout(() => {
        timers.delete(id);
        dismiss(id);
    }, ms);
    timers.set(id, timer);
}

/** Starts the exit animation of a toast, and takes it out of the queue once it has played. Does nothing for an id that is not queued. */
function dismiss(id: number): void {
    if (isServer) return;
    const item = items.find((candidate) => candidate.id === id);
    if (!item || item.leaving) return;
    const timer = timers.get(id);
    if (timer) {
        clearTimeout(timer.handle);
        timers.delete(id);
    }
    publish(
        items.map((candidate) =>
            candidate.id === id ? { ...candidate, leaving: true } : candidate,
        ),
    );
    setTimeout(
        () => publish(items.filter((candidate) => candidate.id !== id)),
        EXIT_DURATION,
    );
}

/** Queues a toast and returns its id. Does nothing on the server, and returns 0. */
function show(options: ToastOptions = {}): number {
    if (isServer) return 0;
    const id = ++nextId;
    const duration = options.duration ?? DEFAULT_DURATION;
    publish([
        ...items,
        {
            id,
            variant: options.variant ?? 'info',
            title: options.title,
            body: options.body,
            duration,
            leaving: false,
        },
    ]);
    if (duration > 0) schedule(id, duration);
    return id;
}

type ShortcutOptions = Omit<ToastOptions, 'variant' | 'title' | 'body'>;

/**
 * Imperative toast API. Call `toast.show(...)` (or the `info`/`success`/
 * `warning`/`danger` shortcuts) from anywhere to enqueue a toast; mount a single
 * `<hmi-toast>` near your app root to display them. `show` returns the toast's id,
 * which `dismiss` takes. The queue is module-level state: every `<hmi-toast>` on
 * the page shows it, and a second copy of this module (a second bundle) has a
 * queue of its own.
 *
 * @example
 * toast.success('Saved', 'Your changes are live.');
 * const id = toast.show({ variant: 'info', title: 'Working…', duration: 0 });
 * toast.dismiss(id);
 */
export const toast = {
    show,
    dismiss,
    info: (
        title: ToastContent,
        body?: ToastContent,
        options?: ShortcutOptions,
    ) => show({ ...options, variant: 'info', title, body }),
    success: (
        title: ToastContent,
        body?: ToastContent,
        options?: ShortcutOptions,
    ) => show({ ...options, variant: 'success', title, body }),
    warning: (
        title: ToastContent,
        body?: ToastContent,
        options?: ShortcutOptions,
    ) => show({ ...options, variant: 'warning', title, body }),
    danger: (
        title: ToastContent,
        body?: ToastContent,
        options?: ShortcutOptions,
    ) => show({ ...options, variant: 'danger', title, body }),
};

/** The toasts that are queued now, the leaving ones included. */
export function getToasts(): readonly ToastItem[] {
    return items;
}

/** Calls `listener` with the queue whenever it changes. Returns the function that stops it. */
export function subscribeToasts(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

/** Stops a toast's auto-dismiss clock, keeping the time it has left. */
export function pauseToast(id: number): void {
    const timer = timers.get(id);
    if (!timer || timer.handle === undefined) return;
    clearTimeout(timer.handle);
    timer.handle = undefined;
    timer.remaining = Math.max(
        0,
        timer.remaining - (Date.now() - timer.started),
    );
}

/** Starts a paused toast's clock again, with the time it had left. */
export function resumeToast(id: number): void {
    const timer = timers.get(id);
    if (!timer || timer.handle !== undefined) return;
    schedule(id, timer.remaining);
}

/** Empties the queue and stops every clock. For tests. */
export function resetToasts(): void {
    for (const timer of timers.values()) clearTimeout(timer.handle);
    timers.clear();
    publish([]);
}
