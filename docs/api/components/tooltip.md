[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/tooltip

# components/tooltip

## Type Aliases

### TooltipProps

> **TooltipProps** = `object`

Defined in: [components/tooltip.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/tooltip.tsx#L15)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/tooltip.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/tooltip.tsx#L23)

Trigger element the tooltip describes.

##### delay?

> `optional` **delay?**: `number`

Defined in: [components/tooltip.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/tooltip.tsx#L21)

Delay before showing, in ms.

###### Default

```ts
200
```

##### label

> **label**: `ReactNode`

Defined in: [components/tooltip.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/tooltip.tsx#L17)

Tooltip content shown on hover/focus.

##### side?

> `optional` **side?**: [`TooltipSide`](#tooltipside)

Defined in: [components/tooltip.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/tooltip.tsx#L19)

Side of the trigger to position on.

###### Default

```ts
'top'
```

***

### TooltipSide

> **TooltipSide** = `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Defined in: [components/tooltip.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/tooltip.tsx#L13)

## Functions

### Tooltip()

> **Tooltip**(`__namedParameters`): `Element`

Defined in: [components/tooltip.tsx:35](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/tooltip.tsx#L35)

Text tooltip shown on hover/focus, positioned in a portal and wired to the
trigger via `aria-describedby`.

#### Parameters

##### \_\_namedParameters

[`TooltipProps`](#tooltipprops)

#### Returns

`Element`

#### Example

```ts
<Tooltip label="Copy"><Button asIcon><CopyIcon /></Button></Tooltip>
```
