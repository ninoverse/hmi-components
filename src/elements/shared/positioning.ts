import {
    isServer,
    type ReactiveController,
    type ReactiveControllerHost,
} from 'lit';

/** The side of the anchor a floating panel sits on. */
export type PlacementSide = 'top' | 'bottom' | 'left' | 'right';

/** How the panel lines up with the anchor along that side. */
export type PlacementAlign = 'start' | 'center' | 'end';

/** The box of an anchor, and the viewport it is measured in, in px. */
export interface PlacementInput {
    anchor: Pick<
        DOMRect,
        'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'
    >;
    viewport: { width: number; height: number };
    side: PlacementSide;
    align: PlacementAlign;
    /** The gap between the anchor and the panel. */
    offset: number;
}

/** What to write on a `position: fixed` panel: each inset, and a `translate`. */
export interface PlacementStyle {
    top: string;
    right: string;
    bottom: string;
    left: string;
    translate: string;
}

const px = (value: number) => `${value}px`;

/**
 * Where a `position: fixed` panel goes to sit against an anchor. A panel in the
 * top layer is positioned against the viewport, so the insets are measured from
 * the viewport's edges: `bottom` and `right` count from the far edge, which lets
 * a panel above or to the left of its anchor grow away from it. A centred panel
 * is moved back by half its own size with `translate`, which composes with an
 * entry animation's `transform`.
 */
export function placement({
    anchor,
    viewport,
    side,
    align,
    offset,
}: PlacementInput): PlacementStyle {
    const style: PlacementStyle = {
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
        translate: 'none',
    };
    if (side === 'bottom') style.top = px(anchor.bottom + offset);
    else if (side === 'top') {
        style.bottom = px(viewport.height - anchor.top + offset);
    } else if (side === 'right') style.left = px(anchor.right + offset);
    else style.right = px(viewport.width - anchor.left + offset);

    if (side === 'top' || side === 'bottom') {
        if (align === 'start') style.left = px(anchor.left);
        else if (align === 'end') {
            style.right = px(viewport.width - anchor.right);
        } else {
            style.left = px(anchor.left + anchor.width / 2);
            style.translate = '-50% 0';
        }
    } else if (align === 'start') style.top = px(anchor.top);
    else if (align === 'end') {
        style.bottom = px(viewport.height - anchor.bottom);
    } else {
        style.top = px(anchor.top + anchor.height / 2);
        style.translate = '0 -50%';
    }
    return style;
}

export interface PositionOptions {
    /** The element the panel is placed against. */
    anchor: () => Element | null | undefined;
    /** The floating panel: a `position: fixed` element, usually in the top layer. */
    panel: () => HTMLElement | null | undefined;
    /** The side of the anchor it sits on. @default 'bottom' */
    side?: () => PlacementSide;
    /** How it lines up along that side. @default 'start' */
    align?: () => PlacementAlign;
    /** The gap between the anchor and the panel, in px: a number, or a function for a base class whose subclasses differ. @default 0 */
    offset?: number | (() => number);
    /** Writes the anchor's width on the panel as `--_anchor-width`, for a `min-width`. @default false */
    matchWidth?: boolean;
}

/**
 * Keeps a floating panel against an anchor: `start()` places it, then again on
 * every scroll (any scroller, captured), resize and size change of the anchor or
 * the panel, until `stop()`. The elements of the popover group call `start()` as
 * they open and `stop()` as they close, so nothing listens while a panel is
 * closed. It is rect maths on `position: fixed` insets; CSS anchor positioning
 * is in `TODO.md`.
 *
 * Browser only: `start()` does nothing on the server.
 */
export class PositionController implements ReactiveController {
    readonly #options: PositionOptions;
    #abort: AbortController | undefined;
    #resize: ResizeObserver | undefined;
    #frame = 0;

    constructor(host: ReactiveControllerHost, options: PositionOptions) {
        this.#options = options;
        host.addController(this);
    }

    hostConnected(): void {}

    hostDisconnected(): void {
        this.stop();
    }

    /** Places the panel now, and keeps it placed. */
    start(): void {
        if (isServer) return;
        this.stop();
        this.update();
        this.#abort = new AbortController();
        const { signal } = this.#abort;
        const schedule = () => this.#schedule();
        window.addEventListener('scroll', schedule, {
            capture: true,
            passive: true,
            signal,
        });
        window.addEventListener('resize', schedule, { signal });
        this.#resize = new ResizeObserver(schedule);
        const anchor = this.#options.anchor();
        const panel = this.#options.panel();
        if (anchor) this.#resize.observe(anchor);
        if (panel) this.#resize.observe(panel);
    }

    /** Stops following the anchor. */
    stop(): void {
        this.#abort?.abort();
        this.#abort = undefined;
        this.#resize?.disconnect();
        this.#resize = undefined;
        if (this.#frame) cancelAnimationFrame(this.#frame);
        this.#frame = 0;
    }

    /** Places the panel once. */
    update(): void {
        if (isServer) return;
        const anchor = this.#options.anchor();
        const panel = this.#options.panel();
        if (!anchor || !panel) return;
        const box = anchor.getBoundingClientRect();
        const offset = this.#options.offset ?? 0;
        const style = placement({
            anchor: box,
            viewport: {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
            },
            side: this.#options.side?.() ?? 'bottom',
            align: this.#options.align?.() ?? 'start',
            offset: typeof offset === 'function' ? offset() : offset,
        });
        for (const [name, value] of Object.entries(style)) {
            panel.style.setProperty(name, value);
        }
        if (this.#options.matchWidth) {
            panel.style.setProperty('--_anchor-width', `${box.width}px`);
        }
    }

    // Scroll, resize and size changes arrive in bursts: place once a frame.
    #schedule(): void {
        if (this.#frame) return;
        this.#frame = requestAnimationFrame(() => {
            this.#frame = 0;
            this.update();
        });
    }
}
