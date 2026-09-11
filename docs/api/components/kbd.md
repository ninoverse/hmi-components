[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/kbd

# components/kbd

## Type Aliases

### KbdProps

> **KbdProps** = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: [components/kbd.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/kbd.tsx#L6)

#### Type Declaration

##### children

> **children**: `ReactNode`

Key label (e.g. `⌘`, `Ctrl`).

##### size?

> `optional` **size?**: [`KbdSize`](#kbdsize)

Key cap size.

###### Default

```ts
'medium'
```

***

### KbdSize

> **KbdSize** = `"small"` \| `"medium"`

Defined in: [components/kbd.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/kbd.tsx#L4)

## Functions

### Kbd()

> **Kbd**(`__namedParameters`): `Element`

Defined in: [components/kbd.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/kbd.tsx#L19)

Renders a keyboard key cap (`<kbd>`).

#### Parameters

##### \_\_namedParameters

[`KbdProps`](#kbdprops)

#### Returns

`Element`

#### Example

```ts
<Kbd>⌘</Kbd> <Kbd>K</Kbd>
```
