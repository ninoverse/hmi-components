[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/spacer

# components/spacer

## Type Aliases

### SpacerAxis

> **SpacerAxis** = `"vertical"` \| `"horizontal"`

Defined in: [components/spacer.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/spacer.tsx#L5)

***

### SpacerProps

> **SpacerProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: [components/spacer.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/spacer.tsx#L7)

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

Defined in: [components/spacer.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/spacer.tsx#L4)

## Functions

### Spacer()

> **Spacer**(`__namedParameters`): `Element`

Defined in: [components/spacer.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/spacer.tsx#L24)

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
