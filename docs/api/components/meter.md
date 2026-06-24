[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/meter

# components/meter

## Type Aliases

### MeterProps

> **MeterProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/meter.tsx:4

#### Type Declaration

##### high?

> `optional` **high?**: `number`

Upper threshold; above it the value is in the "high" band. Defaults to `max`.

##### label?

> `optional` **label?**: `ReactNode`

Optional label shown above the bar.

##### low?

> `optional` **low?**: `number`

Lower threshold; below it the value is in the "low" band. Defaults to `min`.

##### max?

> `optional` **max?**: `number`

Upper bound of the scale.

###### Default

```ts
1
```

##### min?

> `optional` **min?**: `number`

Lower bound of the scale.

###### Default

```ts
0
```

##### optimum?

> `optional` **optimum?**: `number`

Where the ideal value sits; drives the optimal/suboptimal/poor colour. Defaults to `max`.

##### showValue?

> `optional` **showValue?**: `boolean`

Show the numeric value beside the label.

###### Default

```ts
false
```

##### value

> **value**: `number`

Current measurement, clamped to `[min, max]`.

## Functions

### Meter()

> **Meter**(`__namedParameters`): `Element`

Defined in: components/meter.tsx:50

Scalar measurement bar within a known range (e.g. disk usage). Colour
reflects quality, mirroring the native `<meter>` algorithm via
`low`/`high`/`optimum`. For task progress, use `Progress` instead.

#### Parameters

##### \_\_namedParameters

[`MeterProps`](#meterprops)

#### Returns

`Element`

#### Example

```ts
<Meter value={0.8} low={0.3} high={0.7} optimum={0.2} label="Disk" showValue />
```
