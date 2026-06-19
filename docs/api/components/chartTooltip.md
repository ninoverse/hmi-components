[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/chartTooltip

# components/chartTooltip

## Type Aliases

### ChartTooltipItem

> **ChartTooltipItem** = `object`

Defined in: components/chartTooltip.tsx:4

#### Properties

##### color?

> `optional` **color?**: `string`

Defined in: components/chartTooltip.tsx:10

Series colour — consumer data (e.g. a chart palette entry).

##### label

> **label**: `ReactNode`

Defined in: components/chartTooltip.tsx:6

Row label (e.g. the series name).

##### value

> **value**: `ReactNode`

Defined in: components/chartTooltip.tsx:8

Row value at the hovered point.

***

### ChartTooltipProps

> **ChartTooltipProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/chartTooltip.tsx:13

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

Defined in: components/chartTooltip.tsx:23

Presentational tooltip card for charts: a title and one colour-swatched
 row per series. Charts position it (absolute/fixed) on hover; this
 component only renders the content.

#### Parameters

##### \_\_namedParameters

[`ChartTooltipProps`](#charttooltipprops)

#### Returns

`Element`
