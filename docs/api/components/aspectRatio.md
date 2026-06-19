[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/aspectRatio

# components/aspectRatio

## Type Aliases

### AspectRatioProps

> **AspectRatioProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/aspectRatio.tsx:4

#### Type Declaration

##### children?

> `optional` **children?**: `ReactNode`

Content constrained to the ratio.

##### ratio?

> `optional` **ratio?**: `number` \| `string`

Width-to-height ratio, e.g. `16 / 9` or `'4 / 3'`.

###### Default

```ts
1
```

## Functions

### AspectRatio()

> **AspectRatio**(`__namedParameters`): `Element`

Defined in: components/aspectRatio.tsx:17

Constrains its child to a fixed width-to-height ratio via CSS `aspect-ratio`.

#### Parameters

##### \_\_namedParameters

[`AspectRatioProps`](#aspectratioprops)

#### Returns

`Element`

#### Example

```ts
<AspectRatio ratio={16 / 9}><img src="…" alt="" /></AspectRatio>
```
