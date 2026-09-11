[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/bulletChart

# components/bulletChart

## Type Aliases

### BulletChartProps

> **BulletChartProps** = `object`

Defined in: [components/bulletChart.tsx:3](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L3)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/bulletChart.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L23)

Accessible name. Falls back to `label`, then `'Bullet chart'`.

##### color?

> `optional` **color?**: `string`

Defined in: [components/bulletChart.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L15)

Measure bar colour. Defaults to the primary token.

##### height?

> `optional` **height?**: `number`

Defined in: [components/bulletChart.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L21)

SVG height in px.

###### Default

```ts
48
```

##### label?

> `optional` **label?**: `string`

Defined in: [components/bulletChart.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L17)

Leading label rendered to the left of the track.

##### max?

> `optional` **max?**: `number`

Defined in: [components/bulletChart.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L9)

Upper bound of the scale. Defaults to max(value, target, last range).

##### min?

> `optional` **min?**: `number`

Defined in: [components/bulletChart.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L11)

Lower bound of the scale. Defaults to 0.

##### ranges?

> `optional` **ranges?**: `ReadonlyArray`\<`number`\>

Defined in: [components/bulletChart.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L13)

Ascending qualitative-range thresholds (e.g. [40, 75] → poor/ok/good).

##### target?

> `optional` **target?**: `number`

Defined in: [components/bulletChart.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L7)

Target/comparison marker.

##### value

> **value**: `number`

Defined in: [components/bulletChart.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L5)

The measured value (the primary bar).

##### width?

> `optional` **width?**: `number`

Defined in: [components/bulletChart.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L19)

SVG width in px.

###### Default

```ts
360
```

## Functions

### BulletChart()

> **BulletChart**(`__namedParameters`): `Element`

Defined in: [components/bulletChart.tsx:36](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/bulletChart.tsx#L36)

Bullet chart (bullet graph): a compact horizontal KPI gauge. Qualitative
 range bands sit behind a measure bar, with a target tick for comparison.
 Pure SVG, zero deps, tokens-driven.

#### Parameters

##### \_\_namedParameters

[`BulletChartProps`](#bulletchartprops)

#### Returns

`Element`
