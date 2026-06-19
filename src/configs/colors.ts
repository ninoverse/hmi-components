/* CSS custom property names for the active theme palette.
   Read values imperatively with `getComputedStyle(document.documentElement).getPropertyValue(colors.primary)`. */

/**
 * Map of palette role → CSS custom property name for the active theme. Use to
 * read theme colours imperatively in JS/TS.
 *
 * @example
 * const primary = getComputedStyle(document.documentElement)
 *     .getPropertyValue(colors.primary);
 */
export const colors = {
    primary: '--primary',
    onPrimary: '--on-primary',
    primaryContainer: '--primary-container',
    onPrimaryContainer: '--on-primary-container',

    secondary: '--secondary',
    onSecondary: '--on-secondary',
    secondaryContainer: '--secondary-container',
    onSecondaryContainer: '--on-secondary-container',

    tertiary: '--tertiary',
    onTertiary: '--on-tertiary',
    tertiaryContainer: '--tertiary-container',
    onTertiaryContainer: '--on-tertiary-container',

    error: '--error',
    onError: '--on-error',
    errorContainer: '--error-container',
    onErrorContainer: '--on-error-container',

    background: '--background',
    onBackground: '--on-background',

    surface: '--surface',
    onSurface: '--on-surface',
    surfaceVariant: '--surface-variant',
    onSurfaceVariant: '--on-surface-variant',

    surfaceContainerLowest: '--surface-container-lowest',
    surfaceContainerLow: '--surface-container-low',
    surfaceContainer: '--surface-container',
    surfaceContainerHigh: '--surface-container-high',
    surfaceContainerHighest: '--surface-container-highest',

    outline: '--outline',
    outlineVariant: '--outline-variant',

    shadow: '--shadow',
    scrim: '--scrim',

    inverseSurface: '--inverse-surface',
    inverseOnSurface: '--inverse-on-surface',
    inversePrimary: '--inverse-primary',

    success: '--success',
    onSuccess: '--on-success',
    successContainer: '--success-container',
    onSuccessContainer: '--on-success-container',
    warning: '--warning',
    onWarning: '--on-warning',
    warningContainer: '--warning-container',
    onWarningContainer: '--on-warning-container',
} as const;

/** Union of palette role names (the keys of {@link colors}). */
export type ColorToken = keyof typeof colors;
