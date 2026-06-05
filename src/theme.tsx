/* ThemeProvider / useTheme — runtime control of the two manual theme axes.

   - color theme  -> html[data-theme]      (light/dark auto via prefers-color-scheme)
   - structure    -> html[data-structure]  (shape, density, motion, typography)

   Each choice is validated against the lists in ./configs/themes and persisted
   to localStorage. Components read the resulting CSS custom properties, so a
   change re-themes the whole tree instantly. To avoid a flash of the default
   choice before mount, also set data-theme/data-structure on <html> (or run a
   tiny inline script that reads the same localStorage keys) — see index.html. */

import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    type ColorTheme,
    colorThemes,
    type Structure,
    structures,
} from './configs/themes';

const THEME_STORAGE_KEY = 'hmi-theme';
const STRUCTURE_STORAGE_KEY = 'hmi-structure';

type ThemeContextValue = {
    theme: ColorTheme;
    setTheme: (theme: ColorTheme) => void;
    structure: Structure;
    setStructure: (structure: Structure) => void;
    colorThemes: readonly ColorTheme[];
    structures: readonly Structure[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored<T extends string>(
    key: string,
    allowed: readonly T[],
    fallback: T,
): T {
    if (typeof window === 'undefined') return fallback;
    const stored = window.localStorage.getItem(key);
    return stored && (allowed as readonly string[]).includes(stored)
        ? (stored as T)
        : fallback;
}

export type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: ColorTheme;
    defaultStructure?: Structure;
};

export function ThemeProvider({
    children,
    defaultTheme = 'default',
    defaultStructure = 'default',
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<ColorTheme>(() =>
        readStored(THEME_STORAGE_KEY, colorThemes, defaultTheme),
    );
    const [structure, setStructure] = useState<Structure>(() =>
        readStored(STRUCTURE_STORAGE_KEY, structures, defaultStructure),
    );

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.dataset.structure = structure;
        window.localStorage.setItem(STRUCTURE_STORAGE_KEY, structure);
    }, [structure]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                structure,
                setStructure,
                colorThemes,
                structures,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
