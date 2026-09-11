[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/grid

# components/grid

## Type Aliases

### GridGap

> **GridGap** = `"none"` \| `"small"` \| `"medium"` \| `"large"`

Defined in: [components/grid.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/grid.tsx#L9)

***

### GridProps

> **GridProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/grid.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/grid.tsx#L11)

#### Type Declaration

##### as?

> `optional` **as?**: `ElementType`

Element/component to render as.

###### Default

```ts
'div'
```

##### children?

> `optional` **children?**: `ReactNode`

Grid children.

##### columns?

> `optional` **columns?**: `number` \| `string`

Column count (equal columns) or a raw `grid-template-columns` value.

###### Default

```ts
2
```

##### gap?

> `optional` **gap?**: [`GridGap`](#gridgap)

Gap preset between cells.

###### Default

```ts
'none'
```

## Functions

### Grid()

> **Grid**(`__namedParameters`): `Element`

Defined in: [components/grid.tsx:29](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/grid.tsx#L29)

CSS Grid layout primitive. `columns` accepts a number (equal columns) or a
raw `grid-template-columns` string.

#### Parameters

##### \_\_namedParameters

[`GridProps`](#gridprops)

#### Returns

`Element`

#### Example

```ts
<Grid columns={3} gap="medium">…</Grid>
```
