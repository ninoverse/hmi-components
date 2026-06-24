[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/heatmap

# components/heatmap

## Type Aliases

### HeatmapProps

> **HeatmapProps** = `object`

Defined in: components/heatmap.tsx:3

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/heatmap.tsx:23

Accessible name for the chart.

###### Default

```ts
'Heatmap'
```

##### cellSize?

> `optional` **cellSize?**: `number`

Defined in: components/heatmap.tsx:17

Cell edge length in px.

###### Default

```ts
40
```

##### color?

> `optional` **color?**: `string`

Defined in: components/heatmap.tsx:11

Base cell colour; intensity is mapped to its opacity.

##### data

> **data**: `ReadonlyArray`\<`ReadonlyArray`\<`number`\>\>

Defined in: components/heatmap.tsx:5

Row-major matrix of values; each inner array is one row.

##### gap?

> `optional` **gap?**: `number`

Defined in: components/heatmap.tsx:19

Gap between cells in px.

###### Default

```ts
4
```

##### max?

> `optional` **max?**: `number`

Defined in: components/heatmap.tsx:15

Upper bound of the value range. Defaults to the data max.

##### min?

> `optional` **min?**: `number`

Defined in: components/heatmap.tsx:13

Override the value range; defaults to the data extent.

##### showValues?

> `optional` **showValues?**: `boolean`

Defined in: components/heatmap.tsx:21

Print each cell's value at its centre.

###### Default

```ts
false
```

##### xLabels?

> `optional` **xLabels?**: `ReadonlyArray`\<`string`\>

Defined in: components/heatmap.tsx:7

Column (x-axis) labels; length should match the row length.

##### yLabels?

> `optional` **yLabels?**: `ReadonlyArray`\<`string`\>

Defined in: components/heatmap.tsx:9

Row (y-axis) labels; length should match the number of rows.

## Functions

### Heatmap()

> **Heatmap**(`__namedParameters`): `Element` \| `null`

Defined in: components/heatmap.tsx:31

Matrix heatmap. Renders a grid of cells whose colour intensity (opacity)
 maps to each value, with optional row/column labels. Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`HeatmapProps`](#heatmapprops)

#### Returns

`Element` \| `null`
