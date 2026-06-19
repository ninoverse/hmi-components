[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/scatterPlot

# components/scatterPlot

## Type Aliases

### ScatterPlotPoint

> **ScatterPlotPoint** = `object`

Defined in: components/scatterPlot.tsx:5

A single `{x, y}` data point.

#### Properties

##### x

> **x**: `number`

Defined in: components/scatterPlot.tsx:5

##### y

> **y**: `number`

Defined in: components/scatterPlot.tsx:5

***

### ScatterPlotProps

> **ScatterPlotProps** = `object`

Defined in: components/scatterPlot.tsx:16

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/scatterPlot.tsx:38

Accessible name for the chart.

###### Default

```ts
'Scatter plot'
```

##### height?

> `optional` **height?**: `number`

Defined in: components/scatterPlot.tsx:22

SVG viewport height in px.

###### Default

```ts
260
```

##### radius?

> `optional` **radius?**: `number`

Defined in: components/scatterPlot.tsx:36

Marker radius in px.

###### Default

```ts
4
```

##### series

> **series**: `ReadonlyArray`\<[`ScatterPlotSeries`](#scatterplotseries)\>

Defined in: components/scatterPlot.tsx:18

One or more series of points.

##### width?

> `optional` **width?**: `number`

Defined in: components/scatterPlot.tsx:20

SVG viewport width in px.

###### Default

```ts
520
```

##### xMax?

> `optional` **xMax?**: `number`

Defined in: components/scatterPlot.tsx:26

Upper bound of the x range. Defaults to the data max.

##### xMin?

> `optional` **xMin?**: `number`

Defined in: components/scatterPlot.tsx:24

Override the x range; defaults to the data extent.

##### xTicks?

> `optional` **xTicks?**: `number`

Defined in: components/scatterPlot.tsx:32

Number of x-axis ticks / vertical grid lines.

###### Default

```ts
5
```

##### yMax?

> `optional` **yMax?**: `number`

Defined in: components/scatterPlot.tsx:30

Upper bound of the y range. Defaults to the data max.

##### yMin?

> `optional` **yMin?**: `number`

Defined in: components/scatterPlot.tsx:28

Override the y range; defaults to the data extent.

##### yTicks?

> `optional` **yTicks?**: `number`

Defined in: components/scatterPlot.tsx:34

Number of y-axis ticks / horizontal grid lines.

###### Default

```ts
4
```

***

### ScatterPlotSeries

> **ScatterPlotSeries** = `object`

Defined in: components/scatterPlot.tsx:7

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: components/scatterPlot.tsx:13

Series colour. Defaults to the primary token.

##### data

> **data**: `ReadonlyArray`\<[`ScatterPlotPoint`](#scatterplotpoint)\>

Defined in: components/scatterPlot.tsx:11

Points to plot for this series.

##### name

> **name**: `string`

Defined in: components/scatterPlot.tsx:9

Legend/label name for the series.

## Functions

### ScatterPlot()

> **ScatterPlot**(`__namedParameters`): `Element` \| `null`

Defined in: components/scatterPlot.tsx:46

Cartesian scatter plot. Both axes are numeric: each series renders its
 {x, y} points as markers over a shared grid (CartesianGrid). Pure SVG,
 zero deps.

#### Parameters

##### \_\_namedParameters

[`ScatterPlotProps`](#scatterplotprops)

#### Returns

`Element` \| `null`
