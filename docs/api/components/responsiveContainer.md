[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/responsiveContainer

# components/responsiveContainer

## Type Aliases

### ResponsiveContainerProps

> **ResponsiveContainerProps** = `object`

Defined in: components/responsiveContainer.tsx:9

#### Properties

##### aspect?

> `optional` **aspect?**: `number`

Defined in: components/responsiveContainer.tsx:13

Width / height ratio; height is derived from the measured width.

##### children

> **children**: (`size`) => `ReactNode`

Defined in: components/responsiveContainer.tsx:15

Render prop called with the measured pixel size once width is known.

###### Parameters

###### size

[`ResponsiveContainerSize`](#responsivecontainersize)

###### Returns

`ReactNode`

##### height?

> `optional` **height?**: `number`

Defined in: components/responsiveContainer.tsx:11

Fixed height in px. Ignored when `aspect` is set.

***

### ResponsiveContainerSize

> **ResponsiveContainerSize** = `object`

Defined in: components/responsiveContainer.tsx:4

#### Properties

##### height

> **height**: `number`

Defined in: components/responsiveContainer.tsx:6

##### width

> **width**: `number`

Defined in: components/responsiveContainer.tsx:5

## Functions

### ResponsiveContainer()

> **ResponsiveContainer**(`__namedParameters`): `Element`

Defined in: components/responsiveContainer.tsx:21

Measures its own width (via ResizeObserver) and hands a concrete pixel
 size to its render-prop child — the foundation chart primitives build on,
 since SVG coordinate math needs real numbers, not percentages.

#### Parameters

##### \_\_namedParameters

[`ResponsiveContainerProps`](#responsivecontainerprops)

#### Returns

`Element`
