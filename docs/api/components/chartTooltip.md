[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/chartTooltip

# components/chartTooltip

## Type Aliases

### ChartTooltipItem

> **ChartTooltipItem** = `object`

Defined in: [components/chartTooltip.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/chartTooltip.tsx#L4)

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: [components/chartTooltip.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/chartTooltip.tsx#L10)

Series colour — consumer data (e.g. a chart palette entry).

##### label

> **label**: `ReactNode`

Defined in: [components/chartTooltip.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/chartTooltip.tsx#L6)

Row label (e.g. the series name).

##### value

> **value**: `ReactNode`

Defined in: [components/chartTooltip.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/chartTooltip.tsx#L8)

Row value at the hovered point.

***

### ChartTooltipProps

> **ChartTooltipProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/chartTooltip.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/chartTooltip.tsx#L13)

#### Type Declaration

##### items

> **items**: `ReadonlyArray`\<[`ChartTooltipItem`](#charttooltipitem)\>

One row per series at the hovered point.

##### title?

> `optional` **title?**: `ReactNode`

Optional heading (e.g. the hovered category/x value).

## Functions

### ChartTooltip()

> **ChartTooltip**(`__namedParameters`): `Element`

Defined in: [components/chartTooltip.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/chartTooltip.tsx#L23)

Presentational tooltip card for charts: a title and one colour-swatched
 row per series. Charts position it (absolute/fixed) on hover; this
 component only renders the content.

#### Parameters

##### \_\_namedParameters

[`ChartTooltipProps`](#charttooltipprops)

#### Returns

`Element`
