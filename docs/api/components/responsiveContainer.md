[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/responsiveContainer

# components/responsiveContainer

## Type Aliases

### ResponsiveContainerProps

> **ResponsiveContainerProps** = `object`

Defined in: [components/responsiveContainer.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L9)

#### Properties

##### aspect?

> `optional` **aspect?**: `number`

Defined in: [components/responsiveContainer.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L13)

Width / height ratio; height is derived from the measured width.

##### children

> **children**: (`size`) => `ReactNode`

Defined in: [components/responsiveContainer.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L15)

Render prop called with the measured pixel size once width is known.

###### Parameters

###### size

[`ResponsiveContainerSize`](#responsivecontainersize)

###### Returns

`ReactNode`

##### height?

> `optional` **height?**: `number`

Defined in: [components/responsiveContainer.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L11)

Fixed height in px. Ignored when `aspect` is set.

***

### ResponsiveContainerSize

> **ResponsiveContainerSize** = `object`

Defined in: [components/responsiveContainer.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L4)

#### Properties

##### height

> **height**: `number`

Defined in: [components/responsiveContainer.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L6)

##### width

> **width**: `number`

Defined in: [components/responsiveContainer.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L5)

## Functions

### ResponsiveContainer()

> **ResponsiveContainer**(`__namedParameters`): `Element`

Defined in: [components/responsiveContainer.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/responsiveContainer.tsx#L21)

Measures its own width (via ResizeObserver) and hands a concrete pixel
 size to its render-prop child — the foundation chart primitives build on,
 since SVG coordinate math needs real numbers, not percentages.

#### Parameters

##### \_\_namedParameters

[`ResponsiveContainerProps`](#responsivecontainerprops)

#### Returns

`Element`
