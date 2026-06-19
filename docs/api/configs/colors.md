[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / configs/colors

# configs/colors

## Type Aliases

### ColorToken

> **ColorToken** = keyof *typeof* [`colors`](#colors)

Defined in: configs/colors.ts:68

Union of palette role names (the keys of [colors](#colors)).

## Variables

### colors

> `const` **colors**: `object`

Defined in: configs/colors.ts:12

Map of palette role → CSS custom property name for the active theme. Use to
read theme colours imperatively in JS/TS.

#### Type Declaration

##### background

> `readonly` **background**: `"--background"` = `'--background'`

##### error

> `readonly` **error**: `"--error"` = `'--error'`

##### errorContainer

> `readonly` **errorContainer**: `"--error-container"` = `'--error-container'`

##### inverseOnSurface

> `readonly` **inverseOnSurface**: `"--inverse-on-surface"` = `'--inverse-on-surface'`

##### inversePrimary

> `readonly` **inversePrimary**: `"--inverse-primary"` = `'--inverse-primary'`

##### inverseSurface

> `readonly` **inverseSurface**: `"--inverse-surface"` = `'--inverse-surface'`

##### onBackground

> `readonly` **onBackground**: `"--on-background"` = `'--on-background'`

##### onError

> `readonly` **onError**: `"--on-error"` = `'--on-error'`

##### onErrorContainer

> `readonly` **onErrorContainer**: `"--on-error-container"` = `'--on-error-container'`

##### onPrimary

> `readonly` **onPrimary**: `"--on-primary"` = `'--on-primary'`

##### onPrimaryContainer

> `readonly` **onPrimaryContainer**: `"--on-primary-container"` = `'--on-primary-container'`

##### onSecondary

> `readonly` **onSecondary**: `"--on-secondary"` = `'--on-secondary'`

##### onSecondaryContainer

> `readonly` **onSecondaryContainer**: `"--on-secondary-container"` = `'--on-secondary-container'`

##### onSuccess

> `readonly` **onSuccess**: `"--on-success"` = `'--on-success'`

##### onSuccessContainer

> `readonly` **onSuccessContainer**: `"--on-success-container"` = `'--on-success-container'`

##### onSurface

> `readonly` **onSurface**: `"--on-surface"` = `'--on-surface'`

##### onSurfaceVariant

> `readonly` **onSurfaceVariant**: `"--on-surface-variant"` = `'--on-surface-variant'`

##### onTertiary

> `readonly` **onTertiary**: `"--on-tertiary"` = `'--on-tertiary'`

##### onTertiaryContainer

> `readonly` **onTertiaryContainer**: `"--on-tertiary-container"` = `'--on-tertiary-container'`

##### onWarning

> `readonly` **onWarning**: `"--on-warning"` = `'--on-warning'`

##### onWarningContainer

> `readonly` **onWarningContainer**: `"--on-warning-container"` = `'--on-warning-container'`

##### outline

> `readonly` **outline**: `"--outline"` = `'--outline'`

##### outlineVariant

> `readonly` **outlineVariant**: `"--outline-variant"` = `'--outline-variant'`

##### primary

> `readonly` **primary**: `"--primary"` = `'--primary'`

##### primaryContainer

> `readonly` **primaryContainer**: `"--primary-container"` = `'--primary-container'`

##### scrim

> `readonly` **scrim**: `"--scrim"` = `'--scrim'`

##### secondary

> `readonly` **secondary**: `"--secondary"` = `'--secondary'`

##### secondaryContainer

> `readonly` **secondaryContainer**: `"--secondary-container"` = `'--secondary-container'`

##### shadow

> `readonly` **shadow**: `"--shadow"` = `'--shadow'`

##### success

> `readonly` **success**: `"--success"` = `'--success'`

##### successContainer

> `readonly` **successContainer**: `"--success-container"` = `'--success-container'`

##### surface

> `readonly` **surface**: `"--surface"` = `'--surface'`

##### surfaceContainer

> `readonly` **surfaceContainer**: `"--surface-container"` = `'--surface-container'`

##### surfaceContainerHigh

> `readonly` **surfaceContainerHigh**: `"--surface-container-high"` = `'--surface-container-high'`

##### surfaceContainerHighest

> `readonly` **surfaceContainerHighest**: `"--surface-container-highest"` = `'--surface-container-highest'`

##### surfaceContainerLow

> `readonly` **surfaceContainerLow**: `"--surface-container-low"` = `'--surface-container-low'`

##### surfaceContainerLowest

> `readonly` **surfaceContainerLowest**: `"--surface-container-lowest"` = `'--surface-container-lowest'`

##### surfaceVariant

> `readonly` **surfaceVariant**: `"--surface-variant"` = `'--surface-variant'`

##### tertiary

> `readonly` **tertiary**: `"--tertiary"` = `'--tertiary'`

##### tertiaryContainer

> `readonly` **tertiaryContainer**: `"--tertiary-container"` = `'--tertiary-container'`

##### warning

> `readonly` **warning**: `"--warning"` = `'--warning'`

##### warningContainer

> `readonly` **warningContainer**: `"--warning-container"` = `'--warning-container'`

#### Example

```ts
const primary = getComputedStyle(document.documentElement)
    .getPropertyValue(colors.primary);
```
