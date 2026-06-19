[**@ninoverse/hmi-components**](README.md)

***

[@ninoverse/hmi-components](README.md) / theme

# theme

## Type Aliases

### ThemeProviderProps

> **ThemeProviderProps** = `object`

Defined in: theme.tsx:52

#### Properties

##### children

> **children**: `ReactNode`

Defined in: theme.tsx:54

App subtree that should react to theme changes.

##### defaultStructure?

> `optional` **defaultStructure?**: [`Structure`](configs/themes.md#structure)

Defined in: theme.tsx:58

Initial structure theme when none is persisted in localStorage.

###### Default

```ts
'default'
```

##### defaultTheme?

> `optional` **defaultTheme?**: [`ColorTheme`](configs/themes.md#colortheme)

Defined in: theme.tsx:56

Initial color theme when none is persisted in localStorage.

###### Default

```ts
'default'
```

## Functions

### ThemeProvider()

> **ThemeProvider**(`__namedParameters`): `Element`

Defined in: theme.tsx:69

Provides runtime control of the two theme axes. Persists each choice to
localStorage and reflects it onto `html[data-theme]` / `html[data-structure]`,
so components re-theme instantly. Consume via [useTheme](#usetheme).

#### Parameters

##### \_\_namedParameters

[`ThemeProviderProps`](#themeproviderprops)

#### Returns

`Element`

#### Example

```ts
<ThemeProvider defaultTheme="ocean"><App /></ThemeProvider>
```

***

### useTheme()

> **useTheme**(): `ThemeContextValue`

Defined in: theme.tsx:115

Reads the current theme axes and their setters from [ThemeProvider](#themeprovider).
Throws if used outside a provider. Returns the active `theme`/`structure`,
their `setTheme`/`setStructure` setters, and the available option lists.

#### Returns

`ThemeContextValue`

#### Example

```ts
const { theme, setTheme, colorThemes } = useTheme();
```
