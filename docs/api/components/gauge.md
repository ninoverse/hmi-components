[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/gauge

# components/gauge

## Type Aliases

### GaugeProps

> **GaugeProps** = `object`

Defined in: [components/gauge.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L4)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/gauge.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L22)

Accessible name. Defaults to `'Gauge: {value} of {max}'`.

##### color?

> `optional` **color?**: `string`

Defined in: [components/gauge.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L12)

Arc colour. Defaults to the primary token.

##### label?

> `optional` **label?**: `ReactNode`

Defined in: [components/gauge.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L20)

Content shown below the dial (e.g. the value). Defaults to the value.

##### max?

> `optional` **max?**: `number`

Defined in: [components/gauge.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L10)

Upper bound of the scale.

###### Default

```ts
100
```

##### min?

> `optional` **min?**: `number`

Defined in: [components/gauge.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L8)

Lower bound of the scale.

###### Default

```ts
0
```

##### size?

> `optional` **size?**: `number`

Defined in: [components/gauge.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L18)

SVG width in px (height is derived).

###### Default

```ts
200
```

##### thickness?

> `optional` **thickness?**: `number`

Defined in: [components/gauge.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L16)

Thickness of the arc as a fraction of the radius (0..1).

###### Default

```ts
0.22
```

##### trackColor?

> `optional` **trackColor?**: `string`

Defined in: [components/gauge.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L14)

Track (unfilled arc) colour.

##### value

> **value**: `number`

Defined in: [components/gauge.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L6)

Current value, clamped to `[min, max]`.

## Functions

### Gauge()

> **Gauge**(`__namedParameters`): `Element`

Defined in: [components/gauge.tsx:49](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/gauge.tsx#L49)

Semicircular gauge dial. A value arc fills a 180° track from left to right;
 an optional label sits beneath. Pure SVG arc math, zero deps.

#### Parameters

##### \_\_namedParameters

[`GaugeProps`](#gaugeprops)

#### Returns

`Element`
