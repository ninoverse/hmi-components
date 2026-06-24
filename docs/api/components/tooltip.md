[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/tooltip

# components/tooltip

## Type Aliases

### TooltipProps

> **TooltipProps** = `object`

Defined in: components/tooltip.tsx:15

#### Properties

##### children

> **children**: `ReactNode`

Defined in: components/tooltip.tsx:23

Trigger element the tooltip describes.

##### delay?

> `optional` **delay?**: `number`

Defined in: components/tooltip.tsx:21

Delay before showing, in ms.

###### Default

```ts
200
```

##### label

> **label**: `ReactNode`

Defined in: components/tooltip.tsx:17

Tooltip content shown on hover/focus.

##### side?

> `optional` **side?**: [`TooltipSide`](#tooltipside)

Defined in: components/tooltip.tsx:19

Side of the trigger to position on.

###### Default

```ts
'top'
```

***

### TooltipSide

> **TooltipSide** = `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Defined in: components/tooltip.tsx:13

## Functions

### Tooltip()

> **Tooltip**(`__namedParameters`): `Element`

Defined in: components/tooltip.tsx:36

#### Parameters

##### \_\_namedParameters

[`TooltipProps`](#tooltipprops)

#### Returns

`Element`
