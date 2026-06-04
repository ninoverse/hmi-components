/* Available theme axes, switched independently at runtime by the ThemeProvider
   (src/theme.tsx). The active color theme drives the html[data-theme] attribute
   (its light/dark variant is resolved automatically via prefers-color-scheme);
   the active structure drives html[data-structure] (shape, density, motion,
   typography). Token values live in public/css/themes/. */

export const colorThemes = ['default', 'ocean'] as const;
export const structures = ['default', 'rounded', 'sharp', 'pixel'] as const;

export type ColorTheme = (typeof colorThemes)[number];
export type Structure = (typeof structures)[number];
