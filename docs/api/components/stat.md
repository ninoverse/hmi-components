[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/stat

# components/stat

## Type Aliases

### StatProps

> **StatProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/stat.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stat.tsx#L6)

#### Type Declaration

##### delta?

> `optional` **delta?**: `ReactNode`

Change amount shown next to the trend arrow (requires `trend`).

##### helpText?

> `optional` **helpText?**: `ReactNode`

Secondary helper text in the footer.

##### icon?

> `optional` **icon?**: `ReactNode`

Optional icon shown beside the label.

##### label

> **label**: `ReactNode`

Metric name.

##### trend?

> `optional` **trend?**: [`StatTrend`](#stattrend)

Direction of change; sets the delta colour and arrow.

##### value

> **value**: `ReactNode`

Primary metric value.

***

### StatTrend

> **StatTrend** = `"up"` \| `"down"` \| `"neutral"`

Defined in: [components/stat.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stat.tsx#L4)

## Functions

### Stat()

> **Stat**(`__namedParameters`): `Element`

Defined in: [components/stat.tsx:51](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stat.tsx#L51)

Compact metric/KPI display with a label, value and an optional trend delta
and help text.

#### Parameters

##### \_\_namedParameters

[`StatProps`](#statprops)

#### Returns

`Element`

#### Example

```ts
<Stat label="Revenue" value="$12.4k" trend="up" delta="8%" />
```
