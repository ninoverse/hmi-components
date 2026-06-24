[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/sparkline

# components/sparkline

## Type Aliases

### SparklineProps

> **SparklineProps** = `object`

Defined in: components/sparkline.tsx:3

#### Properties

##### area?

> `optional` **area?**: `boolean`

Defined in: components/sparkline.tsx:15

Fill the area under the line.

###### Default

```ts
false
```

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/sparkline.tsx:23

Accessible name for the chart.

##### color?

> `optional` **color?**: `string`

Defined in: components/sparkline.tsx:11

Line/area colour. Defaults to the primary token.

##### data

> **data**: `ReadonlyArray`\<`number`\>

Defined in: components/sparkline.tsx:5

Values to plot, in order.

##### height?

> `optional` **height?**: `number`

Defined in: components/sparkline.tsx:9

SVG height in px.

###### Default

```ts
32
```

##### max?

> `optional` **max?**: `number`

Defined in: components/sparkline.tsx:21

Upper bound of the value range. Defaults to the data max.

##### min?

> `optional` **min?**: `number`

Defined in: components/sparkline.tsx:19

Override the value range; defaults to the data's own min/max.

##### showDot?

> `optional` **showDot?**: `boolean`

Defined in: components/sparkline.tsx:17

Show a dot at the last data point.

###### Default

```ts
false
```

##### strokeWidth?

> `optional` **strokeWidth?**: `number`

Defined in: components/sparkline.tsx:13

Line stroke width in px.

###### Default

```ts
2
```

##### width?

> `optional` **width?**: `number`

Defined in: components/sparkline.tsx:7

SVG width in px.

###### Default

```ts
120
```

## Functions

### Sparkline()

> **Sparkline**(`__namedParameters`): `Element` \| `null`

Defined in: components/sparkline.tsx:28

Compact, axis-less trend line for inline contexts (table cells, cards).
 Pure SVG path math; the larger Cartesian charts reuse the same approach.

#### Parameters

##### \_\_namedParameters

[`SparklineProps`](#sparklineprops)

#### Returns

`Element` \| `null`
