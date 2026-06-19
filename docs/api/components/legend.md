[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/legend

# components/legend

## Type Aliases

### LegendAlign

> **LegendAlign** = `"start"` \| `"center"` \| `"end"`

Defined in: components/legend.tsx:13

***

### LegendItem

> **LegendItem** = `object`

Defined in: components/legend.tsx:4

#### Properties

##### color

> **color**: `string`

Defined in: components/legend.tsx:8

Series colour — consumer data (e.g. a chart palette entry).

##### inactive?

> `optional` **inactive?**: `boolean`

Defined in: components/legend.tsx:10

Render the swatch as a hollow ring instead of a filled square.

##### label

> **label**: `ReactNode`

Defined in: components/legend.tsx:6

Series name shown beside the swatch.

***

### LegendProps

> **LegendProps** = `HTMLAttributes`\<`HTMLUListElement`\> & `object`

Defined in: components/legend.tsx:15

#### Type Declaration

##### align?

> `optional` **align?**: [`LegendAlign`](#legendalign)

Horizontal alignment of the row.

###### Default

```ts
'center'
```

##### items

> **items**: `ReadonlyArray`\<[`LegendItem`](#legenditem)\>

Series entries to list.

## Functions

### Legend()

> **Legend**(`__namedParameters`): `Element`

Defined in: components/legend.tsx:24

Chart legend: a horizontal row of colour swatches with series labels.
 Swatch colours come from consumer data; surrounding chrome is tokenised.

#### Parameters

##### \_\_namedParameters

[`LegendProps`](#legendprops)

#### Returns

`Element`
