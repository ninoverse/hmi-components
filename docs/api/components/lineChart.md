[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/lineChart

# components/lineChart

## Type Aliases

### LineChartProps

> **LineChartProps** = `object`

Defined in: components/lineChart.tsx:13

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/lineChart.tsx:31

Accessible name for the chart.

###### Default

```ts
'Line chart'
```

##### height?

> `optional` **height?**: `number`

Defined in: components/lineChart.tsx:21

SVG viewport height in px.

###### Default

```ts
260
```

##### labels?

> `optional` **labels?**: `ReadonlyArray`\<`string`\>

Defined in: components/lineChart.tsx:17

X-axis category labels; length should match the series data length.

##### max?

> `optional` **max?**: `number`

Defined in: components/lineChart.tsx:25

Upper bound of the value range. Defaults to the max across all series.

##### min?

> `optional` **min?**: `number`

Defined in: components/lineChart.tsx:23

Override the value range; defaults to 0..max across all series.

##### series

> **series**: `ReadonlyArray`\<[`LineChartSeries`](#linechartseries)\>

Defined in: components/lineChart.tsx:15

One or more series, each drawn as a polyline.

##### showDots?

> `optional` **showDots?**: `boolean`

Defined in: components/lineChart.tsx:29

Draw a dot at each data point.

###### Default

```ts
false
```

##### width?

> `optional` **width?**: `number`

Defined in: components/lineChart.tsx:19

SVG viewport width in px.

###### Default

```ts
520
```

##### yTicks?

> `optional` **yTicks?**: `number`

Defined in: components/lineChart.tsx:27

Number of horizontal grid lines / y-axis ticks.

###### Default

```ts
4
```

***

### LineChartSeries

> **LineChartSeries** = `object`

Defined in: components/lineChart.tsx:4

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: components/lineChart.tsx:10

Series colour. Defaults to the primary token.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: components/lineChart.tsx:8

Y values, one per category.

##### name

> **name**: `string`

Defined in: components/lineChart.tsx:6

Legend/label name for the series.

## Functions

### LineChart()

> **LineChart**(`__namedParameters`): `Element` \| `null`

Defined in: components/lineChart.tsx:39

Multi-series Cartesian line chart. Self-contained SVG: plots each series
 as a polyline over a shared grid (CartesianGrid) with y-axis value ticks
 and x-axis category labels. Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`LineChartProps`](#linechartprops)

#### Returns

`Element` \| `null`
