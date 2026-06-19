[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/stat

# components/stat

## Type Aliases

### StatProps

> **StatProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/stat.tsx:6

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

Defined in: components/stat.tsx:4

## Functions

### Stat()

> **Stat**(`__namedParameters`): `Element`

Defined in: components/stat.tsx:52

#### Parameters

##### \_\_namedParameters

[`StatProps`](#statprops)

#### Returns

`Element`
