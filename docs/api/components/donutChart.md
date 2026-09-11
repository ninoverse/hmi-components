[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/donutChart

# components/donutChart

## Type Aliases

### DonutChartProps

> **DonutChartProps** = `object`

Defined in: [components/donutChart.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L13)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/donutChart.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L25)

Accessible name for the chart.

###### Default

```ts
'Donut chart'
```

##### centerLabel?

> `optional` **centerLabel?**: `ReactNode`

Defined in: [components/donutChart.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L23)

Content shown in the centre hole (e.g. a total).

##### gap?

> `optional` **gap?**: `number`

Defined in: [components/donutChart.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L21)

Gap between segments, in degrees.

###### Default

```ts
2
```

##### segments

> **segments**: `ReadonlyArray`\<[`DonutChartSegment`](#donutchartsegment)\>

Defined in: [components/donutChart.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L15)

Segments to render around the ring.

##### size?

> `optional` **size?**: `number`

Defined in: [components/donutChart.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L17)

SVG width/height in px.

###### Default

```ts
220
```

##### thickness?

> `optional` **thickness?**: `number`

Defined in: [components/donutChart.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L19)

Ring thickness as a fraction of the radius (0..1).

###### Default

```ts
0.32
```

***

### DonutChartSegment

> **DonutChartSegment** = `object`

Defined in: [components/donutChart.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L4)

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: [components/donutChart.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L10)

Segment colour. Falls back to a token from the default palette.

##### label

> **label**: `string`

Defined in: [components/donutChart.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L6)

Segment name (used as the React key).

##### value

> **value**: `number`

Defined in: [components/donutChart.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L8)

Segment magnitude; its share of the total sets the arc size.

## Functions

### DonutChart()

> **DonutChart**(`__namedParameters`): `Element` \| `null`

Defined in: [components/donutChart.tsx:46](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/donutChart.tsx#L46)

Donut (ring) chart. Each segment is an SVG arc sized by its share of the
 total, with a hole in the centre for an optional summary label. Pure SVG
 arc math, zero deps, tokens-driven palette.

#### Parameters

##### \_\_namedParameters

[`DonutChartProps`](#donutchartprops)

#### Returns

`Element` \| `null`
