[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/card

# components/card

## Type Aliases

### CardProps

> **CardProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/card.tsx:6

#### Type Declaration

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

Defined in: components/card.tsx:4

## Functions

### Card()

> **Card**(`__namedParameters`): `Element`

Defined in: components/card.tsx:17

Elevated surface container for grouping related content.

#### Parameters

##### \_\_namedParameters

[`CardProps`](#cardprops)

#### Returns

`Element`

#### Example

```ts
<Card variant="accent">…</Card>
```
