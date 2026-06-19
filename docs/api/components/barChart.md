[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/barChart

# components/barChart

## Type Aliases

### BarChartProps

> **BarChartProps** = `object`

Defined in: components/barChart.tsx:13

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/barChart.tsx:29

Accessible name for the chart.

###### Default

```ts
'Bar chart'
```

##### height?

> `optional` **height?**: `number`

Defined in: components/barChart.tsx:21

SVG viewport height in px.

###### Default

```ts
260
```

##### labels?

> `optional` **labels?**: `ReadonlyArray`\<`string`\>

Defined in: components/barChart.tsx:17

X-axis category labels; length should match the series data length.

##### max?

> `optional` **max?**: `number`

Defined in: components/barChart.tsx:25

Upper bound of the value range. Defaults to the max across all series.

##### min?

> `optional` **min?**: `number`

Defined in: components/barChart.tsx:23

Override the value range; defaults to 0..max across all series.

##### series

> **series**: `ReadonlyArray`\<[`BarChartSeries`](#barchartseries)\>

Defined in: components/barChart.tsx:15

One or more series rendered as grouped bars per category.

##### width?

> `optional` **width?**: `number`

Defined in: components/barChart.tsx:19

SVG viewport width in px.

###### Default

```ts
520
```

##### yTicks?

> `optional` **yTicks?**: `number`

Defined in: components/barChart.tsx:27

Number of horizontal grid lines / y-axis ticks.

###### Default

```ts
4
```

***

### BarChartSeries

> **BarChartSeries** = `object`

Defined in: components/barChart.tsx:4

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: components/barChart.tsx:10

Series colour. Defaults to the primary token.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: components/barChart.tsx:8

Y values, one per category.

##### name

> **name**: `string`

Defined in: components/barChart.tsx:6

Legend/label name for the series.

## Functions

### BarChart()

> **BarChart**(`__namedParameters`): `Element` \| `null`

Defined in: components/barChart.tsx:37

Multi-series grouped bar chart. Self-contained SVG: groups of bars per
 category over a shared horizontal grid (CartesianGrid), with y-axis value
 ticks and x-axis category labels. Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`BarChartProps`](#barchartprops)

#### Returns

`Element` \| `null`
