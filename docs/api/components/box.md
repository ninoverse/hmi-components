[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/box

# components/box

## Type Aliases

### BoxBackground

> **BoxBackground** = `"none"` \| `"surface"` \| `"surface-variant"` \| `"surface-container"` \| `"surface-container-low"` \| `"surface-container-high"`

Defined in: components/box.tsx:4

***

### BoxPadding

> **BoxPadding** = `"none"` \| `"small"` \| `"medium"` \| `"large"`

Defined in: components/box.tsx:11

***

### BoxProps

> **BoxProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/box.tsx:14

#### Type Declaration

##### as?

> `optional` **as?**: `ElementType`

Element/component to render as.

###### Default

```ts
'div'
```

##### background?

> `optional` **background?**: [`BoxBackground`](#boxbackground)

Surface token applied as the background.

###### Default

```ts
'none'
```

##### bordered?

> `optional` **bordered?**: `boolean`

Add a 1px outline-variant border.

###### Default

```ts
false
```

##### children?

> `optional` **children?**: `ReactNode`

Box content.

##### padding?

> `optional` **padding?**: [`BoxPadding`](#boxpadding)

Inner padding preset.

###### Default

```ts
'none'
```

##### radius?

> `optional` **radius?**: [`BoxRadius`](#boxradius)

Corner radius preset.

###### Default

```ts
'none'
```

***

### BoxRadius

> **BoxRadius** = `"none"` \| `"small"` \| `"medium"` \| `"large"` \| `"full"` \| `"leaf"`

Defined in: components/box.tsx:12

## Functions

### Box()

> **Box**(`__namedParameters`): `Element`

Defined in: components/box.tsx:36

Primitive container that maps surface, padding, radius and border props to
theme tokens. Render as any element via `as`.

#### Parameters

##### \_\_namedParameters

[`BoxProps`](#boxprops)

#### Returns

`Element`

#### Example

```ts
<Box as="section" background="surface-variant" padding="medium" radius="medium" bordered>…</Box>
```
