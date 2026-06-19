[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/spacer

# components/spacer

## Type Aliases

### SpacerAxis

> **SpacerAxis** = `"vertical"` \| `"horizontal"`

Defined in: components/spacer.tsx:5

***

### SpacerProps

> **SpacerProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: components/spacer.tsx:7

#### Type Declaration

##### axis?

> `optional` **axis?**: [`SpacerAxis`](#spaceraxis)

Axis the space is added along.

###### Default

```ts
'vertical'
```

##### grow?

> `optional` **grow?**: `boolean`

Grow to fill available space (e.g. push siblings apart in a flex row).

###### Default

```ts
false
```

##### size?

> `optional` **size?**: [`SpacerSize`](#spacersize)

Spacing amount preset.

###### Default

```ts
'medium'
```

***

### SpacerSize

> **SpacerSize** = `"small"` \| `"medium"` \| `"large"`

Defined in: components/spacer.tsx:4

## Functions

### Spacer()

> **Spacer**(`__namedParameters`): `Element`

Defined in: components/spacer.tsx:24

Blank spacing element. Use a fixed `size`/`axis`, or `grow` to absorb free
space in a flex layout.

#### Parameters

##### \_\_namedParameters

[`SpacerProps`](#spacerprops)

#### Returns

`Element`

#### Example

```ts
<Spacer size="large" />
<Flex><A /><Spacer grow /><B /></Flex>
```
