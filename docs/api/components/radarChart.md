[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/radarChart

# components/radarChart

## Type Aliases

### RadarChartProps

> **RadarChartProps** = `object`

Defined in: components/radarChart.tsx:12

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/radarChart.tsx:26

Accessible name for the chart.

###### Default

```ts
'Radar chart'
```

##### axes

> **axes**: `ReadonlyArray`\<`string`\>

Defined in: components/radarChart.tsx:14

Axis labels, one per spoke.

##### max?

> `optional` **max?**: `number`

Defined in: components/radarChart.tsx:22

Upper bound of the value range. Defaults to the max across all series.

##### min?

> `optional` **min?**: `number`

Defined in: components/radarChart.tsx:20

Override the value range; defaults to 0..max across all series.

##### rings?

> `optional` **rings?**: `number`

Defined in: components/radarChart.tsx:24

Number of concentric grid rings.

###### Default

```ts
4
```

##### series

> **series**: `ReadonlyArray`\<[`RadarChartSeries`](#radarchartseries)\>

Defined in: components/radarChart.tsx:16

One or more series drawn as closed polygons.

##### size?

> `optional` **size?**: `number`

Defined in: components/radarChart.tsx:18

SVG width/height in px.

###### Default

```ts
300
```

***

### RadarChartSeries

> **RadarChartSeries** = `object`

Defined in: components/radarChart.tsx:3

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: components/radarChart.tsx:9

Series colour. Defaults to a palette entry.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: components/radarChart.tsx:7

One value per axis; length should match the axes length.

##### name

> **name**: `string`

Defined in: components/radarChart.tsx:5

Legend/label name for the series.

## Functions

### RadarChart()

> **RadarChart**(`__namedParameters`): `Element` \| `null`

Defined in: components/radarChart.tsx:46

Radar (spider) chart. Plots each series as a closed polygon over a polar
 grid of concentric rings and radial spokes. Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`RadarChartProps`](#radarchartprops)

#### Returns

`Element` \| `null`
