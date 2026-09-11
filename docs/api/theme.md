[**@ninoverse/hmi-components**](README.md)

***

[@ninoverse/hmi-components](README.md) / theme

# theme

## Type Aliases

### ThemeProviderProps

> **ThemeProviderProps** = `object`

Defined in: [theme.tsx:58](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L58)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [theme.tsx:60](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L60)

App subtree that should react to theme changes.

##### customThemes?

> `optional` **customThemes?**: readonly `string`[]

Defined in: [theme.tsx:69](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L69)

Additional theme names beyond the built-ins. Each must have a corresponding
 CSS file loaded that defines `[data-theme='<name>'] { --primary: ...; }`.

##### defaultMaterial?

> `optional` **defaultMaterial?**: [`Material`](configs/themes.md#material)

Defined in: [theme.tsx:66](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L66)

Initial surface material when none is persisted in localStorage.

###### Default

```ts
'solid'
```

##### defaultStructure?

> `optional` **defaultStructure?**: [`Structure`](configs/themes.md#structure)

Defined in: [theme.tsx:64](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L64)

Initial structure theme when none is persisted in localStorage.

###### Default

```ts
'default'
```

##### defaultTheme?

> `optional` **defaultTheme?**: [`ColorTheme`](configs/themes.md#colortheme) \| `string` & `object`

Defined in: [theme.tsx:62](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L62)

Initial color theme when none is persisted in localStorage.

###### Default

```ts
'default'
```

## Functions

### ThemeProvider()

> **ThemeProvider**(`__namedParameters`): `Element`

Defined in: [theme.tsx:80](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L80)

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

Defined in: [theme.tsx:143](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/theme.tsx#L143)

Reads the current theme axes and their setters from [ThemeProvider](#themeprovider).
Throws if used outside a provider. Returns the active `theme`/`structure`,
their `setTheme`/`setStructure` setters, and the available option lists.

#### Returns

`ThemeContextValue`

#### Example

```ts
const { theme, setTheme, colorThemes } = useTheme();
```
