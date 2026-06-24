[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/areaChart

# components/areaChart

## Type Aliases

### AreaChartProps

> **AreaChartProps** = `object`

Defined in: components/areaChart.tsx:13

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/areaChart.tsx:29

Accessible name for the chart.

###### Default

```ts
'Area chart'
```

##### height?

> `optional` **height?**: `number`

Defined in: components/areaChart.tsx:21

SVG viewport height in px.

###### Default

```ts
260
```

##### labels?

> `optional` **labels?**: `ReadonlyArray`\<`string`\>

Defined in: components/areaChart.tsx:17

X-axis category labels; length should match the series data length.

##### max?

> `optional` **max?**: `number`

Defined in: components/areaChart.tsx:25

Upper bound of the value range. Defaults to the max across all series.

##### min?

> `optional` **min?**: `number`

Defined in: components/areaChart.tsx:23

Override the value range; defaults to 0..max across all series.

##### series

> **series**: `ReadonlyArray`\<[`AreaChartSeries`](#areachartseries)\>

Defined in: components/areaChart.tsx:15

One or more data series to overlay.

##### width?

> `optional` **width?**: `number`

Defined in: components/areaChart.tsx:19

SVG viewport width in px.

###### Default

```ts
520
```

##### yTicks?

> `optional` **yTicks?**: `number`

Defined in: components/areaChart.tsx:27

Number of horizontal grid lines / y-axis ticks.

###### Default

```ts
4
```

***

### AreaChartSeries

> **AreaChartSeries** = `object`

Defined in: components/areaChart.tsx:4

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: components/areaChart.tsx:10

Series colour. Defaults to the primary token.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: components/areaChart.tsx:8

Y values, one per category.

##### name

> **name**: `string`

Defined in: components/areaChart.tsx:6

Legend/label name for the series.

## Functions

### AreaChart()

> **AreaChart**(`__namedParameters`): `Element` \| `null`

Defined in: components/areaChart.tsx:37

Multi-series area chart. Self-contained SVG: each series is a line with a
 tinted fill down to the baseline, over a shared horizontal grid
 (CartesianGrid), with y-axis value ticks and x-axis labels. Zero deps.

#### Parameters

##### \_\_namedParameters

[`AreaChartProps`](#areachartprops)

#### Returns

`Element` \| `null`
