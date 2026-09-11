[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/cartesianGrid

# components/cartesianGrid

## Type Aliases

### CartesianGridProps

> **CartesianGridProps** = `object`

Defined in: [components/cartesianGrid.tsx:3](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L3)

#### Properties

##### cols?

> `optional` **cols?**: `number`

Defined in: [components/cartesianGrid.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L11)

Number of vertical grid lines (inclusive of the edges).

##### height

> **height**: `number`

Defined in: [components/cartesianGrid.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L7)

Grid area height in px.

##### horizontal?

> `optional` **horizontal?**: `boolean`

Defined in: [components/cartesianGrid.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L15)

Draw horizontal lines.

##### padding?

> `optional` **padding?**: `number`

Defined in: [components/cartesianGrid.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L13)

Inset from each edge, in px.

##### rows?

> `optional` **rows?**: `number`

Defined in: [components/cartesianGrid.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L9)

Number of horizontal grid lines (inclusive of the edges).

##### vertical?

> `optional` **vertical?**: `boolean`

Defined in: [components/cartesianGrid.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L17)

Draw vertical lines.

##### width

> **width**: `number`

Defined in: [components/cartesianGrid.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L5)

Grid area width in px.

## Functions

### CartesianGrid()

> **CartesianGrid**(`__namedParameters`): `Element`

Defined in: [components/cartesianGrid.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/cartesianGrid.tsx#L22)

SVG grid for a Cartesian chart area. Renders a `<g>` of evenly spaced
 lines and is meant to be placed inside a chart's own `<svg>`.

#### Parameters

##### \_\_namedParameters

[`CartesianGridProps`](#cartesiangridprops)

#### Returns

`Element`
