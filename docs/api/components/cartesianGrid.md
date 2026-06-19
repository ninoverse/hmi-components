[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/cartesianGrid

# components/cartesianGrid

## Type Aliases

### CartesianGridProps

> **CartesianGridProps** = `object`

Defined in: components/cartesianGrid.tsx:3

#### Properties

##### cols?

> `optional` **cols?**: `number`

Defined in: components/cartesianGrid.tsx:11

Number of vertical grid lines (inclusive of the edges).

##### height

> **height**: `number`

Defined in: components/cartesianGrid.tsx:7

Grid area height in px.

##### horizontal?

> `optional` **horizontal?**: `boolean`

Defined in: components/cartesianGrid.tsx:15

Draw horizontal lines.

##### padding?

> `optional` **padding?**: `number`

Defined in: components/cartesianGrid.tsx:13

Inset from each edge, in px.

##### rows?

> `optional` **rows?**: `number`

Defined in: components/cartesianGrid.tsx:9

Number of horizontal grid lines (inclusive of the edges).

##### vertical?

> `optional` **vertical?**: `boolean`

Defined in: components/cartesianGrid.tsx:17

Draw vertical lines.

##### width

> **width**: `number`

Defined in: components/cartesianGrid.tsx:5

Grid area width in px.

## Functions

### CartesianGrid()

> **CartesianGrid**(`__namedParameters`): `Element`

Defined in: components/cartesianGrid.tsx:22

SVG grid for a Cartesian chart area. Renders a `<g>` of evenly spaced
 lines and is meant to be placed inside a chart's own `<svg>`.

#### Parameters

##### \_\_namedParameters

[`CartesianGridProps`](#cartesiangridprops)

#### Returns

`Element`
