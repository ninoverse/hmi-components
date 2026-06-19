[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/bulletChart

# components/bulletChart

## Type Aliases

### BulletChartProps

> **BulletChartProps** = `object`

Defined in: components/bulletChart.tsx:3

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/bulletChart.tsx:23

Accessible name. Falls back to `label`, then `'Bullet chart'`.

##### color?

> `optional` **color?**: `string`

Defined in: components/bulletChart.tsx:15

Measure bar colour. Defaults to the primary token.

##### height?

> `optional` **height?**: `number`

Defined in: components/bulletChart.tsx:21

SVG height in px.

###### Default

```ts
48
```

##### label?

> `optional` **label?**: `string`

Defined in: components/bulletChart.tsx:17

Leading label rendered to the left of the track.

##### max?

> `optional` **max?**: `number`

Defined in: components/bulletChart.tsx:9

Upper bound of the scale. Defaults to max(value, target, last range).

##### min?

> `optional` **min?**: `number`

Defined in: components/bulletChart.tsx:11

Lower bound of the scale. Defaults to 0.

##### ranges?

> `optional` **ranges?**: `ReadonlyArray`\<`number`\>

Defined in: components/bulletChart.tsx:13

Ascending qualitative-range thresholds (e.g. [40, 75] → poor/ok/good).

##### target?

> `optional` **target?**: `number`

Defined in: components/bulletChart.tsx:7

Target/comparison marker.

##### value

> **value**: `number`

Defined in: components/bulletChart.tsx:5

The measured value (the primary bar).

##### width?

> `optional` **width?**: `number`

Defined in: components/bulletChart.tsx:19

SVG width in px.

###### Default

```ts
360
```

## Functions

### BulletChart()

> **BulletChart**(`__namedParameters`): `Element`

Defined in: components/bulletChart.tsx:36

Bullet chart (bullet graph): a compact horizontal KPI gauge. Qualitative
 range bands sit behind a measure bar, with a target tick for comparison.
 Pure SVG, zero deps, tokens-driven.

#### Parameters

##### \_\_namedParameters

[`BulletChartProps`](#bulletchartprops)

#### Returns

`Element`
