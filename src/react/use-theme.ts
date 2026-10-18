import { useEffect, useMemo, useSyncExternalStore } from 'react';
import {
    defaultTheme,
    getTheme,
    restoreTheme,
    setTheme,
    subscribe,
    type ThemeChange,
    type ThemeState,
} from '../elements/shared/theme.js';

export type { ThemeChange, ThemeState };

/** What `useTheme()` returns: the three axes, and `set` to change them. */
export interface UseThemeResult extends ThemeState {
    /** Changes the axes it is given, saves them and re-renders everything that reads the theme. The module's `setTheme`. */
    set: (change: ThemeChange) => void;
}

// The saved choice is applied by the first mount on the page, as v5's provider
// did, and not again by later ones: a script that sets an attribute directly
// since then is not undone.
let restored = false;

const getServerTheme = () => defaultTheme;

/**
 * The theme axes on `<html>` (`theme`, `structure`, `material`) and `set` to
 * change them, re-rendering the component when anything changes them, `set` or
 * not. Needs no provider. The first mount in the page applies the choices
 * saved by `set`, after first paint (put the attributes in your HTML shell to
 * avoid a flash: `docs/theming.md`). On the server, and while hydrating, it
 * reports the defaults. For the lists to build a switcher from, import
 * `colorThemes`, `structures` and `materials` from
 * `@ninoverse/hmi-components/wc/theme`, with `getColorThemes()` for the custom
 * ones you registered.
 *
 * @example
 * const { theme, set } = useTheme();
 * <button onClick={() => set({ theme: 'ocean' })}>{theme}</button>
 */
export function useTheme(): UseThemeResult {
    const state = useSyncExternalStore(subscribe, getTheme, getServerTheme);
    useEffect(() => {
        if (restored) return;
        restored = true;
        restoreTheme();
    }, []);
    return useMemo(() => ({ ...state, set: setTheme }), [state]);
}
