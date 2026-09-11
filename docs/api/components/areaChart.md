[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/areaChart

# components/areaChart

## Type Aliases

### AreaChartProps

> **AreaChartProps** = `object`

Defined in: [components/areaChart.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L13)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/areaChart.tsx:29](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L29)

Accessible name for the chart.

###### Default

```ts
'Area chart'
```

##### height?

> `optional` **height?**: `number`

Defined in: [components/areaChart.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L21)

SVG viewport height in px.

###### Default

```ts
260
```

##### labels?

> `optional` **labels?**: `ReadonlyArray`\<`string`\>

Defined in: [components/areaChart.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L17)

X-axis category labels; length should match the series data length.

##### max?

> `optional` **max?**: `number`

Defined in: [components/areaChart.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L25)

Upper bound of the value range. Defaults to the max across all series.

##### min?

> `optional` **min?**: `number`

Defined in: [components/areaChart.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L23)

Override the value range; defaults to 0..max across all series.

##### series

> **series**: `ReadonlyArray`\<[`AreaChartSeries`](#areachartseries)\>

Defined in: [components/areaChart.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L15)

One or more data series to overlay.

##### width?

> `optional` **width?**: `number`

Defined in: [components/areaChart.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L19)

SVG viewport width in px.

###### Default

```ts
520
```

##### yTicks?

> `optional` **yTicks?**: `number`

Defined in: [components/areaChart.tsx:27](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L27)

Number of horizontal grid lines / y-axis ticks.

###### Default

```ts
4
```

***

### AreaChartSeries

> **AreaChartSeries** = `object`

Defined in: [components/areaChart.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L4)

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: [components/areaChart.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L10)

Series colour. Defaults to the primary token.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: [components/areaChart.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L8)

Y values, one per category.

##### name

> **name**: `string`

Defined in: [components/areaChart.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L6)

Legend/label name for the series.

## Functions

### AreaChart()

> **AreaChart**(`__namedParameters`): `Element` \| `null`

Defined in: [components/areaChart.tsx:37](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/areaChart.tsx#L37)

Multi-series area chart. Self-contained SVG: each series is a line with a
 tinted fill down to the baseline, over a shared horizontal grid
 (CartesianGrid), with y-axis value ticks and x-axis labels. Zero deps.

#### Parameters

##### \_\_namedParameters

[`AreaChartProps`](#areachartprops)

#### Returns

`Element` \| `null`
