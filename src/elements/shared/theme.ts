import {
    type ColorTheme,
    colorThemes,
    type Material,
    materials,
    type Structure,
    structures,
} from '../../configs/themes.js';

export type { ColorTheme, Material, Structure };
export { colorThemes, materials, structures };

/** The three theme axes, as `<html>` carries them. */
export interface ThemeState {
    /** Colour theme, `data-theme`: one of `colorThemes`, or a name added with `registerColorTheme()`. */
    readonly theme: ColorTheme | (string & {});
    /** Structure theme, `data-structure`: shape, density, motion and type. */
    readonly structure: Structure;
    /** Surface material, `data-material`: the finish of panels. */
    readonly material: Material;
}

/** What `setTheme()` takes: the axes to change, the others stay as they are. */
export interface ThemeChange {
    /** A colour theme in `getColorThemes()`. */
    theme?: ThemeState['theme'] | undefined;
    /** One of `structures`. */
    structure?: Structure | undefined;
    /** One of `materials`. */
    material?: Material | undefined;
}

/** Called with the new state after any axis changes. */
export type ThemeListener = (state: ThemeState) => void;

type Axis = keyof ThemeState;

const AXES: readonly Axis[] = ['theme', 'structure', 'material'];

const ATTRIBUTE: Record<Axis, string> = {
    theme: 'data-theme',
    structure: 'data-structure',
    material: 'data-material',
};

// The keys v5's `ThemeProvider` saved to, unchanged.
const STORAGE_KEY: Record<Axis, string> = {
    theme: 'hmi-theme',
    structure: 'hmi-structure',
    material: 'hmi-material',
};

/** The state of a page whose `<html>` carries no theme attribute, and what the server reports. */
export const defaultTheme: ThemeState = Object.freeze({
    theme: 'default',
    structure: 'default',
    material: 'solid',
});

let snapshot: ThemeState = defaultTheme;
let knownColorThemes: readonly string[] = colorThemes;

const listeners = new Set<ThemeListener>();
let observer: MutationObserver | undefined;

// This module needs only a document, so it asks for that and not for Lit's
// `isServer`: it has no other use for Lit, and a test that runs a DOM under
// Node's export conditions would be switched off by it.
function documentRoot(): HTMLElement | undefined {
    return typeof document === 'undefined'
        ? undefined
        : document.documentElement;
}

function accepts(axis: Axis, value: unknown): value is string {
    if (typeof value !== 'string' || value === '') return false;
    const allowed: readonly string[] =
        axis === 'theme'
            ? knownColorThemes
            : axis === 'structure'
              ? structures
              : materials;
    return allowed.includes(value);
}

function readSaved(axis: Axis): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY[axis]);
    } catch {
        // Storage is blocked (private mode, a sandboxed frame): nothing is saved.
        return null;
    }
}

function save(axis: Axis, value: string): void {
    try {
        localStorage.setItem(STORAGE_KEY[axis], value);
    } catch {
        // Blocked or full: the choice applies to this page and is not kept.
    }
}

function read(root: HTMLElement): ThemeState {
    const structure = root.getAttribute(ATTRIBUTE.structure);
    const material = root.getAttribute(ATTRIBUTE.material);
    return {
        theme: root.getAttribute(ATTRIBUTE.theme) || defaultTheme.theme,
        structure: accepts('structure', structure)
            ? (structure as Structure)
            : defaultTheme.structure,
        material: accepts('material', material)
            ? (material as Material)
            : defaultTheme.material,
    };
}

/**
 * The theme now on `<html>`. `data-theme` is read as it stands, empty or missing
 * meaning `'default'`; `data-structure` and `data-material` read as `'default'`
 * and `'solid'` unless they name a built-in. The same object comes back until an
 * axis changes, so it can be a `useSyncExternalStore` snapshot. Without a
 * document (on the server) it is `defaultTheme`.
 *
 * @example
 * const { theme, structure, material } = getTheme();
 */
export function getTheme(): ThemeState {
    const root = documentRoot();
    if (!root) return snapshot;
    const next = read(root);
    if (
        next.theme !== snapshot.theme ||
        next.structure !== snapshot.structure ||
        next.material !== snapshot.material
    ) {
        snapshot = Object.freeze(next);
    }
    return snapshot;
}

// Tell the listeners when the page's theme is not what they last heard.
function refresh(): void {
    const before = snapshot;
    if (getTheme() === before) return;
    for (const listener of [...listeners]) listener(snapshot);
}

function onStorage(event: StorageEvent): void {
    const axis = AXES.find((candidate) => STORAGE_KEY[candidate] === event.key);
    if (!axis || !accepts(axis, event.newValue)) return;
    documentRoot()?.setAttribute(ATTRIBUTE[axis], event.newValue);
    refresh();
}

/**
 * Changes the axes it is given: sets `data-theme`, `data-structure` and
 * `data-material` on `<html>` and saves each to `localStorage` under `hmi-theme`,
 * `hmi-structure` and `hmi-material`. Each axis is checked on its own, and one
 * that is not a known value is left alone, with no error: `structure` and
 * `material` must be in `structures` and `materials`, and `theme` in
 * `getColorThemes()`. Does nothing without a document.
 *
 * @example
 * setTheme({ theme: 'ocean', material: 'glass' });
 */
export function setTheme(change: ThemeChange): void {
    const root = documentRoot();
    if (!root) return;
    for (const axis of AXES) {
        const value = change[axis];
        if (!accepts(axis, value)) continue;
        root.setAttribute(ATTRIBUTE[axis], value);
        save(axis, value);
    }
    refresh();
}

/**
 * Applies the choices saved by `setTheme()`: for each axis, the saved value if
 * it is a known one, and otherwise whatever `<html>` already says. Call it once
 * at startup, after `registerColorTheme()` if you use custom themes, since a
 * saved name that is not registered yet is skipped. The `useTheme()` hook does
 * this on its first mount. A page that wants no flash sets the attributes before
 * first paint instead (`docs/theming.md`). Does nothing without a document.
 *
 * @example
 * restoreTheme();
 */
export function restoreTheme(): void {
    const root = documentRoot();
    if (!root) return;
    for (const axis of AXES) {
        const saved = readSaved(axis);
        if (accepts(axis, saved)) root.setAttribute(ATTRIBUTE[axis], saved);
    }
    refresh();
}

/**
 * Calls `listener` with the new state whenever `data-theme`, `data-structure` or
 * `data-material` changes on `<html>`, whoever changed it: `setTheme()`, another
 * script, or another tab. While anything is subscribed the module also applies a
 * choice that another tab saves. Returns the function that stops listening.
 * Without a document it listens to nothing.
 *
 * @example
 * const stop = subscribe(({ theme }) => console.log(theme));
 */
export function subscribe(listener: ThemeListener): () => void {
    const root = documentRoot();
    if (!root) return () => undefined;
    // Nothing has kept the snapshot current since the last read; do it now, so
    // that the first change this listener hears about is a change from here.
    getTheme();
    // A wrapper, so that one function subscribed twice stops one at a time.
    const entry: ThemeListener = (state) => listener(state);
    if (listeners.size === 0) {
        observer = new MutationObserver(refresh);
        observer.observe(root, {
            attributes: true,
            attributeFilter: Object.values(ATTRIBUTE),
        });
        window.addEventListener('storage', onStorage);
    }
    listeners.add(entry);
    return () => {
        if (!listeners.delete(entry) || listeners.size > 0) return;
        observer?.disconnect();
        observer = undefined;
        window.removeEventListener('storage', onStorage);
    };
}

/**
 * Adds colour theme names that `setTheme()` and `restoreTheme()` accept, for a
 * theme whose CSS you load yourself (`[data-theme='midnight'] { --primary: … }`).
 * Names already known and empty ones are skipped. Structures and materials are
 * the built-in ones only.
 *
 * @example
 * registerColorTheme('midnight');
 * setTheme({ theme: 'midnight' });
 */
export function registerColorTheme(...names: string[]): void {
    const added = names.filter(
        (name, index) =>
            typeof name === 'string' &&
            name !== '' &&
            !knownColorThemes.includes(name) &&
            names.indexOf(name) === index,
    );
    if (added.length > 0) knownColorThemes = [...knownColorThemes, ...added];
}

/** The colour themes `setTheme()` accepts now: `colorThemes`, then the registered ones. A new array after each registration. */
export function getColorThemes(): readonly string[] {
    return knownColorThemes;
}
