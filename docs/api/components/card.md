[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/card

# components/card

## Type Aliases

### CardProps

> **CardProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/card.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/card.tsx#L6)

#### Type Declaration

##### active?

> `optional` **active?**: `boolean`

Lifts the card off the page to mark it active/selected.

###### Default

```ts
false
```

##### variant?

> `optional` **variant?**: [`CardVariant`](#cardvariant)

Surface treatment of the card.

###### Default

```ts
'default'
```

***

### CardVariant

> **CardVariant** = `"default"` \| `"flat"` \| `"ink"` \| `"accent"`

Defined in: [components/card.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/card.tsx#L4)

## Functions

### Card()

> **Card**(`__namedParameters`): `Element`

Defined in: [components/card.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/card.tsx#L21)

Elevated surface container for grouping related content.

#### Parameters

##### \_\_namedParameters

[`CardProps`](#cardprops)

#### Returns

`Element`

#### Examples

```ts
<Card variant="accent">…</Card>
```

```ts
<Card active>…</Card>
```
