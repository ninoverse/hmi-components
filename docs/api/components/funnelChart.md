[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/funnelChart

# components/funnelChart

## Type Aliases

### FunnelChartProps

> **FunnelChartProps** = `object`

Defined in: components/funnelChart.tsx:12

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/funnelChart.tsx:26

Accessible name for the chart.

###### Default

```ts
'Funnel chart'
```

##### gap?

> `optional` **gap?**: `number`

Defined in: components/funnelChart.tsx:20

Vertical gap between stage bands in px.

###### Default

```ts
4
```

##### height?

> `optional` **height?**: `number`

Defined in: components/funnelChart.tsx:18

SVG height in px.

###### Default

```ts
280
```

##### labelWidth?

> `optional` **labelWidth?**: `number`

Defined in: components/funnelChart.tsx:22

Width reserved for the right-hand label column in px.

###### Default

```ts
180
```

##### showValues?

> `optional` **showValues?**: `boolean`

Defined in: components/funnelChart.tsx:24

Append each stage's value and share of the first stage to its label.

###### Default

```ts
false
```

##### stages

> **stages**: `ReadonlyArray`\<[`FunnelChartStage`](#funnelchartstage)\>

Defined in: components/funnelChart.tsx:14

Ordered stages, top (widest) to bottom.

##### width?

> `optional` **width?**: `number`

Defined in: components/funnelChart.tsx:16

SVG width in px.

###### Default

```ts
500
```

***

### FunnelChartStage

> **FunnelChartStage** = `object`

Defined in: components/funnelChart.tsx:3

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: components/funnelChart.tsx:9

Stage colour. Defaults to a palette entry.

##### label

> **label**: `string`

Defined in: components/funnelChart.tsx:5

Stage name shown in the label column.

##### value

> **value**: `number`

Defined in: components/funnelChart.tsx:7

Stage magnitude; sets the band width relative to the largest stage.

## Functions

### FunnelChart()

> **FunnelChart**(`__namedParameters`): `Element` \| `null`

Defined in: components/funnelChart.tsx:42

Funnel chart. Stacks centred trapezoid bands that narrow from stage to
 stage, so each band's width maps to its value. Stage labels sit in a
 right-hand column so they stay legible whatever the band width.
 Pure SVG, zero deps.

#### Parameters

##### \_\_namedParameters

[`FunnelChartProps`](#funnelchartprops)

#### Returns

`Element` \| `null`
