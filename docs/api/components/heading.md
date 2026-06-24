[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/heading

# components/heading

## Type Aliases

### HeadingLevel

> **HeadingLevel** = `1` \| `2` \| `3` \| `4` \| `5` \| `6`

Defined in: components/heading.tsx:4

***

### HeadingProps

> **HeadingProps** = `HTMLAttributes`\<`HTMLHeadingElement`\> & `object`

Defined in: components/heading.tsx:8

#### Type Declaration

##### children?

> `optional` **children?**: `ReactNode`

Heading text.

##### level?

> `optional` **level?**: [`HeadingLevel`](#headinglevel)

Semantic heading level, rendered as `h1`–`h6`.

###### Default

```ts
2
```

##### size?

> `optional` **size?**: [`HeadingSize`](#headingsize)

Visual size, decoupled from `level`. Defaults to a size matching `level`.

##### tone?

> `optional` **tone?**: [`HeadingTone`](#headingtone)

Colour tone.

###### Default

```ts
'default'
```

##### truncate?

> `optional` **truncate?**: `boolean`

Truncate to a single line with an ellipsis.

###### Default

```ts
false
```

***

### HeadingSize

> **HeadingSize** = `"xsmall"` \| `"small"` \| `"medium"` \| `"large"` \| `"xlarge"`

Defined in: components/heading.tsx:5

***

### HeadingTone

> **HeadingTone** = `"default"` \| `"muted"` \| `"primary"` \| `"inherit"`

Defined in: components/heading.tsx:6

## Functions

### Heading()

> **Heading**(`__namedParameters`): `Element`

Defined in: components/heading.tsx:39

#### Parameters

##### \_\_namedParameters

[`HeadingProps`](#headingprops)

#### Returns

`Element`
