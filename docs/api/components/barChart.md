[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/barChart

# components/barChart

## Type Aliases

### BarChartProps

> **BarChartProps** = `object`

Defined in: [components/barChart.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L13)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/barChart.tsx:29](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L29)

Accessible name for the chart.

###### Default

```ts
'Bar chart'
```

##### height?

> `optional` **height?**: `number`

Defined in: [components/barChart.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L21)

SVG viewport height in px.

###### Default

```ts
260
```

##### labels?

> `optional` **labels?**: `ReadonlyArray`\<`string`\>

Defined in: [components/barChart.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L17)

X-axis category labels; length should match the series data length.

##### max?

> `optional` **max?**: `number`

Defined in: [components/barChart.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L25)

Upper bound of the value range. Defaults to the max across all series.

##### min?

> `optional` **min?**: `number`

Defined in: [components/barChart.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L23)

Override the value range; defaults to 0..max across all series.

##### series

> **series**: `ReadonlyArray`\<[`BarChartSeries`](#barchartseries)\>

Defined in: [components/barChart.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L15)

One or more series rendered as grouped bars per category.

##### width?

> `optional` **width?**: `number`

Defined in: [components/barChart.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L19)

SVG viewport width in px.

###### Default

```ts
520
```

##### yTicks?

> `optional` **yTicks?**: `number`

Defined in: [components/barChart.tsx:27](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L27)

Number of horizontal grid lines / y-axis ticks.

###### Default

```ts
4
```

***

### BarChartSeries

> **BarChartSeries** = `object`

Defined in: [components/barChart.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L4)

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: [components/barChart.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L10)

Series colour. Defaults to the primary token.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: [components/barChart.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L8)

Y values, one per category.

##### name

> **name**: `string`

Defined in: [components/barChart.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L6)

Legend/label name for the series.

## Functions

### BarChart()

> **BarChart**(`__namedParameters`): `Element` \| `null`

Defined in: [components/barChart.tsx:37](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/barChart.tsx#L37)

Multi-series grouped bar chart. Self-contained SVG: groups of bars per
 category over a shared horizontal grid (CartesianGrid), with y-axis value
 ticks and x-axis category labels. Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`BarChartProps`](#barchartprops)

#### Returns

`Element` \| `null`
