/* Available theme axes, switched independently at runtime by the ThemeProvider
   (src/theme.tsx). The active color theme drives the html[data-theme] attribute
   (its light/dark variant is resolved automatically via prefers-color-scheme);
   the active structure drives html[data-structure] (shape, density, motion,
   typography). Token values live in public/css/themes/. */

/** Available color themes, driving `html[data-theme]`. */
export const colorThemes = ['default', 'ocean', 'forest'] as const;
/** Available structure themes, driving `html[data-structure]` (shape/density/motion/type). */
export const structures = [
    'default',
    'rounded',
    'sharp',
    'pixel',
    'journal',
] as const;

/** Available surface materials, driving `html[data-material]` (finish/translucency).
    `solid` is the default no-op; `glass` frosts panels, `liquid` adds refractive
    "liquid glass" — both compose with any color+structure. */
export const materials = ['solid', 'glass', 'liquid'] as const;

/** Union of color theme names (members of {@link colorThemes}). */
export type ColorTheme = (typeof colorThemes)[number];
/** Union of structure theme names (members of {@link structures}). */
export type Structure = (typeof structures)[number];
/** Union of material names (members of {@link materials}). */
export type Material = (typeof materials)[number];
