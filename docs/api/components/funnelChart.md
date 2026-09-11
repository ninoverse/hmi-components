[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/funnelChart

# components/funnelChart

## Type Aliases

### FunnelChartProps

> **FunnelChartProps** = `object`

Defined in: [components/funnelChart.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L12)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/funnelChart.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L26)

Accessible name for the chart.

###### Default

```ts
'Funnel chart'
```

##### gap?

> `optional` **gap?**: `number`

Defined in: [components/funnelChart.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L20)

Vertical gap between stage bands in px.

###### Default

```ts
4
```

##### height?

> `optional` **height?**: `number`

Defined in: [components/funnelChart.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L18)

SVG height in px.

###### Default

```ts
280
```

##### labelWidth?

> `optional` **labelWidth?**: `number`

Defined in: [components/funnelChart.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L22)

Width reserved for the right-hand label column in px.

###### Default

```ts
180
```

##### showValues?

> `optional` **showValues?**: `boolean`

Defined in: [components/funnelChart.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L24)

Append each stage's value and share of the first stage to its label.

###### Default

```ts
false
```

##### stages

> **stages**: `ReadonlyArray`\<[`FunnelChartStage`](#funnelchartstage)\>

Defined in: [components/funnelChart.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L14)

Ordered stages, top (widest) to bottom.

##### width?

> `optional` **width?**: `number`

Defined in: [components/funnelChart.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L16)

SVG width in px.

###### Default

```ts
500
```

***

### FunnelChartStage

> **FunnelChartStage** = `object`

Defined in: [components/funnelChart.tsx:3](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L3)

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: [components/funnelChart.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L9)

Stage colour. Defaults to a palette entry.

##### label

> **label**: `string`

Defined in: [components/funnelChart.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L5)

Stage name shown in the label column.

##### value

> **value**: `number`

Defined in: [components/funnelChart.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L7)

Stage magnitude; sets the band width relative to the largest stage.

## Functions

### FunnelChart()

> **FunnelChart**(`__namedParameters`): `Element` \| `null`

Defined in: [components/funnelChart.tsx:42](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/funnelChart.tsx#L42)

Funnel chart. Stacks centred trapezoid bands that narrow from stage to
 stage, so each band's width maps to its value. Stage labels sit in a
 right-hand column so they stay legible whatever the band width.
 Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`FunnelChartProps`](#funnelchartprops)

#### Returns

`Element` \| `null`
