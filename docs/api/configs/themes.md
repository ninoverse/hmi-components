[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / configs/themes

# configs/themes

## Type Aliases

### ColorTheme

> **ColorTheme** = *typeof* [`colorThemes`](#colorthemes)\[`number`\]

Defined in: configs/themes.ts:13

Union of color theme names (members of [colorThemes](#colorthemes)).

***

### Structure

> **Structure** = *typeof* [`structures`](#structures)\[`number`\]

Defined in: configs/themes.ts:15

Union of structure theme names (members of [structures](#structures)).

## Variables

### colorThemes

> `const` **colorThemes**: readonly \[`"default"`, `"ocean"`, `"forest"`\]

Defined in: configs/themes.ts:8

Available color themes, driving `html[data-theme]`.

***

### structures

> `const` **structures**: readonly \[`"default"`, `"rounded"`, `"sharp"`, `"pixel"`\]

Defined in: configs/themes.ts:10

Available structure themes, driving `html[data-structure]` (shape/density/motion/type).
