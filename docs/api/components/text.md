[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/text

# components/text

## Type Aliases

### TextAlign

> **TextAlign** = `"start"` \| `"center"` \| `"end"`

Defined in: [components/text.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/text.tsx#L7)

***

### TextProps

> **TextProps** = `HTMLAttributes`\<`HTMLParagraphElement`\> & `object`

Defined in: [components/text.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/text.tsx#L9)

#### Type Declaration

##### align?

> `optional` **align?**: [`TextAlign`](#textalign)

Text alignment.

##### as?

> `optional` **as?**: `ElementType`

Element/component to render as.

###### Default

```ts
'p'
```

##### children?

> `optional` **children?**: `ReactNode`

Text content.

##### size?

> `optional` **size?**: [`TextSize`](#textsize)

Font size preset.

###### Default

```ts
'medium'
```

##### tone?

> `optional` **tone?**: [`TextTone`](#texttone)

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

##### weight?

> `optional` **weight?**: [`TextWeight`](#textweight)

Font weight preset.

###### Default

```ts
'regular'
```

***

### TextSize

> **TextSize** = `"xsmall"` \| `"small"` \| `"medium"` \| `"large"` \| `"xlarge"`

Defined in: [components/text.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/text.tsx#L4)

***

### TextTone

> **TextTone** = `"default"` \| `"muted"` \| `"primary"` \| `"error"` \| `"inherit"`

Defined in: [components/text.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/text.tsx#L6)

***

### TextWeight

> **TextWeight** = `"regular"` \| `"medium"` \| `"semibold"` \| `"bold"`

Defined in: [components/text.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/text.tsx#L5)

## Functions

### Text()

> **Text**(`__namedParameters`): `Element`

Defined in: [components/text.tsx:33](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/text.tsx#L33)

Body text primitive with size/weight/tone/alignment presets and optional
truncation. Render as any element via `as`.

#### Parameters

##### \_\_namedParameters

[`TextProps`](#textprops)

#### Returns

`Element`

#### Example

```ts
<Text size="small" tone="muted">Last updated just now</Text>
```
