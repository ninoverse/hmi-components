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
    type Material,
    materials,
    type Structure,
    structures,
} from './configs/themes';

const THEME_STORAGE_KEY = 'hmi-theme';
const STRUCTURE_STORAGE_KEY = 'hmi-structure';
const MATERIAL_STORAGE_KEY = 'hmi-material';

type ThemeContextValue = {
    theme: ColorTheme | string;
    setTheme: (theme: ColorTheme | (string & {})) => void;
    structure: Structure;
    setStructure: (structure: Structure) => void;
    material: Material;
    setMaterial: (material: Material) => void;
    colorThemes: readonly string[];
    structures: readonly Structure[];
    materials: readonly Material[];
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
    /** App subtree that should react to theme changes. */
    children: ReactNode;
    /** Initial color theme when none is persisted in localStorage. @default 'default' */
    defaultTheme?: ColorTheme | (string & {});
    /** Initial structure theme when none is persisted in localStorage. @default 'default' */
    defaultStructure?: Structure;
    /** Initial surface material when none is persisted in localStorage. @default 'solid' */
    defaultMaterial?: Material;
    /** Additional theme names beyond the built-ins. Each must have a corresponding
     *  CSS file loaded that defines `[data-theme='<name>'] { --primary: ...; }`. */
    customThemes?: readonly string[];
};

/**
 * Provides runtime control of the two theme axes. Persists each choice to
 * localStorage and reflects it onto `html[data-theme]` / `html[data-structure]`,
 * so components re-theme instantly. Consume via {@link useTheme}.
 *
 * @example
 * <ThemeProvider defaultTheme="ocean"><App /></ThemeProvider>
 */
export function ThemeProvider({
    children,
    defaultTheme = 'default',
    defaultStructure = 'default',
    defaultMaterial = 'solid',
    customThemes,
}: ThemeProviderProps) {
    const allColorThemes: readonly string[] = customThemes?.length
        ? [...colorThemes, ...customThemes]
        : colorThemes;

    const [theme, setTheme] = useState<ColorTheme | string>(() =>
        readStored(THEME_STORAGE_KEY, allColorThemes, defaultTheme as string),
    );
    const [structure, setStructure] = useState<Structure>(() =>
        readStored(STRUCTURE_STORAGE_KEY, structures, defaultStructure),
    );
    const [material, setMaterial] = useState<Material>(() =>
        readStored(MATERIAL_STORAGE_KEY, materials, defaultMaterial),
    );

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.dataset.structure = structure;
        window.localStorage.setItem(STRUCTURE_STORAGE_KEY, structure);
    }, [structure]);

    useEffect(() => {
        document.documentElement.dataset.material = material;
        window.localStorage.setItem(MATERIAL_STORAGE_KEY, material);
    }, [material]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                structure,
                setStructure,
                material,
                setMaterial,
                colorThemes: allColorThemes,
                structures,
                materials,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Reads the current theme axes and their setters from {@link ThemeProvider}.
 * Throws if used outside a provider. Returns the active `theme`/`structure`,
 * their `setTheme`/`setStructure` setters, and the available option lists.
 *
 * @example
 * const { theme, setTheme, colorThemes } = useTheme();
 */
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
