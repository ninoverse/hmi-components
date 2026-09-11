[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/skeleton

# components/skeleton

## Type Aliases

### SkeletonProps

> **SkeletonProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: [components/skeleton.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/skeleton.tsx#L6)

#### Type Declaration

##### height?

> `optional` **height?**: `string` \| `number`

Explicit height; number = px.

##### radius?

> `optional` **radius?**: `string` \| `number`

Corner radius override; number = px.

##### variant?

> `optional` **variant?**: [`SkeletonVariant`](#skeletonvariant)

Shape preset.

###### Default

```ts
'text'
```

##### width?

> `optional` **width?**: `string` \| `number`

Explicit width; number = px.

***

### SkeletonVariant

> **SkeletonVariant** = `"text"` \| `"rect"` \| `"circle"`

Defined in: [components/skeleton.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/skeleton.tsx#L4)

## Functions

### Skeleton()

> **Skeleton**(`__namedParameters`): `Element`

Defined in: [components/skeleton.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/skeleton.tsx#L26)

Animated loading placeholder. `aria-hidden` by default so it isn't announced.

#### Parameters

##### \_\_namedParameters

[`SkeletonProps`](#skeletonprops)

#### Returns

`Element`

#### Example

```ts
<Skeleton variant="circle" width={40} height={40} />
```
