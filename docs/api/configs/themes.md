[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / configs/themes

# configs/themes

## Type Aliases

### ColorTheme

> **ColorTheme** = *typeof* [`colorThemes`](#colorthemes)\[`number`\]

Defined in: [configs/themes.ts:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/configs/themes.ts#L24)

Union of color theme names (members of [colorThemes](#colorthemes)).

***

### Material

> **Material** = *typeof* [`materials`](#materials)\[`number`\]

Defined in: [configs/themes.ts:28](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/configs/themes.ts#L28)

Union of material names (members of [materials](#materials)).

***

### Structure

> **Structure** = *typeof* [`structures`](#structures)\[`number`\]

Defined in: [configs/themes.ts:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/configs/themes.ts#L26)

Union of structure theme names (members of [structures](#structures)).

## Variables

### colorThemes

> `const` **colorThemes**: readonly \[`"default"`, `"ocean"`, `"forest"`\]

Defined in: [configs/themes.ts:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/configs/themes.ts#L8)

Available color themes, driving `html[data-theme]`.

***

### materials

> `const` **materials**: readonly \[`"solid"`, `"glass"`, `"liquid"`\]

Defined in: [configs/themes.ts:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/configs/themes.ts#L21)

Available surface materials, driving `html[data-material]` (finish/translucency).
`solid` is the default no-op; `glass` frosts panels, `liquid` adds refractive
"liquid glass" — both compose with any color+structure.

***

### structures

> `const` **structures**: readonly \[`"default"`, `"rounded"`, `"sharp"`, `"pixel"`, `"journal"`\]

Defined in: [configs/themes.ts:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/configs/themes.ts#L10)

Available structure themes, driving `html[data-structure]` (shape/density/motion/type).
