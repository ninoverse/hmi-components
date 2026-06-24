[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/hoverCard

# components/hoverCard

## Type Aliases

### HoverCardAlign

> **HoverCardAlign** = `"start"` \| `"center"` \| `"end"`

Defined in: components/hoverCard.tsx:14

***

### HoverCardProps

> **HoverCardProps** = `object`

Defined in: components/hoverCard.tsx:16

#### Properties

##### align?

> `optional` **align?**: [`HoverCardAlign`](#hovercardalign)

Defined in: components/hoverCard.tsx:24

Alignment along the chosen side.

###### Default

```ts
'center'
```

##### children

> **children**: `ReactNode`

Defined in: components/hoverCard.tsx:20

Rich card content.

##### closeDelay?

> `optional` **closeDelay?**: `number`

Defined in: components/hoverCard.tsx:28

Delay before closing after the pointer leaves, in ms.

###### Default

```ts
150
```

##### openDelay?

> `optional` **openDelay?**: `number`

Defined in: components/hoverCard.tsx:26

Delay before opening, in ms.

###### Default

```ts
300
```

##### side?

> `optional` **side?**: [`HoverCardSide`](#hovercardside)

Defined in: components/hoverCard.tsx:22

Preferred side relative to the trigger.

###### Default

```ts
'bottom'
```

##### trigger

> **trigger**: `ReactNode`

Defined in: components/hoverCard.tsx:18

Element that opens the card on hover/focus.

##### width?

> `optional` **width?**: `number` \| `string`

Defined in: components/hoverCard.tsx:30

Fixed card width; number = px.

***

### HoverCardSide

> **HoverCardSide** = `"top"` \| `"bottom"` \| `"left"` \| `"right"`

Defined in: components/hoverCard.tsx:13

## Functions

### HoverCard()

> **HoverCard**(`__namedParameters`): `Element`

Defined in: components/hoverCard.tsx:50

#### Parameters

##### \_\_namedParameters

[`HoverCardProps`](#hovercardprops)

#### Returns

`Element`
