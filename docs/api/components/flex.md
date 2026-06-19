[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/flex

# components/flex

## Type Aliases

### FlexAlign

> **FlexAlign** = `"start"` \| `"center"` \| `"end"` \| `"stretch"` \| `"baseline"`

Defined in: components/flex.tsx:5

***

### FlexDirection

> **FlexDirection** = `"row"` \| `"column"` \| `"row-reverse"` \| `"column-reverse"`

Defined in: components/flex.tsx:4

***

### FlexGap

> **FlexGap** = `"none"` \| `"small"` \| `"medium"` \| `"large"`

Defined in: components/flex.tsx:13

***

### FlexJustify

> **FlexJustify** = `"start"` \| `"center"` \| `"end"` \| `"between"` \| `"around"` \| `"evenly"`

Defined in: components/flex.tsx:6

***

### FlexProps

> **FlexProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/flex.tsx:15

#### Type Declaration

##### align?

> `optional` **align?**: [`FlexAlign`](#flexalign)

Cross-axis alignment (`align-items`).

###### Default

```ts
'stretch'
```

##### as?

> `optional` **as?**: `ElementType`

Element/component to render as.

###### Default

```ts
'div'
```

##### children?

> `optional` **children?**: `ReactNode`

Flex children.

##### direction?

> `optional` **direction?**: [`FlexDirection`](#flexdirection)

Main-axis direction (`flex-direction`).

###### Default

```ts
'row'
```

##### gap?

> `optional` **gap?**: [`FlexGap`](#flexgap)

Gap preset between children.

###### Default

```ts
'none'
```

##### inline?

> `optional` **inline?**: `boolean`

Use `inline-flex` instead of `flex`.

###### Default

```ts
false
```

##### justify?

> `optional` **justify?**: [`FlexJustify`](#flexjustify)

Main-axis distribution (`justify-content`).

###### Default

```ts
'start'
```

##### wrap?

> `optional` **wrap?**: `boolean`

Allow children to wrap onto multiple lines.

###### Default

```ts
false
```

## Functions

### Flex()

> **Flex**(`__namedParameters`): `Element`

Defined in: components/flex.tsx:40

Flexbox layout primitive mapping direction/alignment/gap props to tokens.

#### Parameters

##### \_\_namedParameters

[`FlexProps`](#flexprops)

#### Returns

`Element`

#### Example

```ts
<Flex align="center" justify="between" gap="medium">…</Flex>
```
