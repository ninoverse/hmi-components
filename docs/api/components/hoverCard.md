[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/hoverCard

# components/hoverCard

## Type Aliases

### HoverCardAlign

> **HoverCardAlign** = `"start"` \| `"center"` \| `"end"`

Defined in: [components/hoverCard.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L14)

***

### HoverCardProps

> **HoverCardProps** = `object`

Defined in: [components/hoverCard.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L16)

#### Properties

##### align?

> `optional` **align?**: [`HoverCardAlign`](#hovercardalign)

Defined in: [components/hoverCard.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L24)

Alignment along the chosen side.

###### Default

```ts
'center'
```

##### children

> **children**: `ReactNode`

Defined in: [components/hoverCard.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L20)

Rich card content.

##### closeDelay?

> `optional` **closeDelay?**: `number`

Defined in: [components/hoverCard.tsx:28](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L28)

Delay before closing after the pointer leaves, in ms.

###### Default

```ts
150
```

##### openDelay?

> `optional` **openDelay?**: `number`

Defined in: [components/hoverCard.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L26)

Delay before opening, in ms.

###### Default

```ts
300
```

##### side?

> `optional` **side?**: [`HoverCardSide`](#hovercardside)

Defined in: [components/hoverCard.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L22)

Preferred side relative to the trigger.

###### Default

```ts
'bottom'
```

##### trigger

> **trigger**: `ReactNode`

Defined in: [components/hoverCard.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L18)

Element that opens the card on hover/focus.

##### width?

> `optional` **width?**: `number` \| `string`

Defined in: [components/hoverCard.tsx:30](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L30)

Fixed card width; number = px.

***

### HoverCardSide

> **HoverCardSide** = `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Defined in: [components/hoverCard.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L13)

## Functions

### HoverCard()

> **HoverCard**(`__namedParameters`): `Element`

Defined in: [components/hoverCard.tsx:49](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/hoverCard.tsx#L49)

Rich hover/focus popover that stays open while the pointer is over its
content, with configurable side, alignment and open/close delays.

#### Parameters

##### \_\_namedParameters

[`HoverCardProps`](#hovercardprops)

#### Returns

`Element`

#### Example

```ts
<HoverCard trigger={<a>@ada</a>}><Profile /></HoverCard>
```
