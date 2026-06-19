[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/alert

# components/alert

## Type Aliases

### AlertProps

> **AlertProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/alert.tsx:6

#### Type Declaration

##### action?

> `optional` **action?**: `ReactNode`

Trailing slot for an action (e.g. a button or dismiss control).

##### title?

> `optional` **title?**: `ReactNode`

Optional bold heading above the message.

##### variant?

> `optional` **variant?**: [`AlertVariant`](#alertvariant)

Tone, which also selects the leading status icon.

###### Default

```ts
'info'
```

***

### AlertVariant

> **AlertVariant** = `"info"` \| `"success"` \| `"warning"` \| `"danger"`

Defined in: components/alert.tsx:4

## Functions

### Alert()

> **Alert**(`__namedParameters`): `Element`

Defined in: components/alert.tsx:92

Inline message with a variant-matched icon, optional title and trailing
action. The body is passed as `children`.

#### Parameters

##### \_\_namedParameters

[`AlertProps`](#alertprops)

#### Returns

`Element`

#### Example

```ts
<Alert variant="warning" title="Heads up">Disk almost full.</Alert>
```
