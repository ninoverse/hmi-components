[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/radarChart

# components/radarChart

## Type Aliases

### RadarChartProps

> **RadarChartProps** = `object`

Defined in: [components/radarChart.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L12)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/radarChart.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L26)

Accessible name for the chart.

###### Default

```ts
'Radar chart'
```

##### axes

> **axes**: `ReadonlyArray`\<`string`\>

Defined in: [components/radarChart.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L14)

Axis labels, one per spoke.

##### max?

> `optional` **max?**: `number`

Defined in: [components/radarChart.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L22)

Upper bound of the value range. Defaults to the max across all series.

##### min?

> `optional` **min?**: `number`

Defined in: [components/radarChart.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L20)

Override the value range; defaults to 0..max across all series.

##### rings?

> `optional` **rings?**: `number`

Defined in: [components/radarChart.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L24)

Number of concentric grid rings.

###### Default

```ts
4
```

##### series

> **series**: `ReadonlyArray`\<[`RadarChartSeries`](#radarchartseries)\>

Defined in: [components/radarChart.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L16)

One or more series drawn as closed polygons.

##### size?

> `optional` **size?**: `number`

Defined in: [components/radarChart.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L18)

SVG width/height in px.

###### Default

```ts
300
```

***

### RadarChartSeries

> **RadarChartSeries** = `object`

Defined in: [components/radarChart.tsx:3](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L3)

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: [components/radarChart.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L9)

Series colour. Defaults to a palette entry.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: [components/radarChart.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L7)

One value per axis; length should match the axes length.

##### name

> **name**: `string`

Defined in: [components/radarChart.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L5)

Legend/label name for the series.

## Functions

### RadarChart()

> **RadarChart**(`__namedParameters`): `Element` \| `null`

Defined in: [components/radarChart.tsx:46](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radarChart.tsx#L46)

Radar (spider) chart. Plots each series as a closed polygon over a polar
 grid of concentric rings and radial spokes. Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`RadarChartProps`](#radarchartprops)

#### Returns

`Element` \| `null`
