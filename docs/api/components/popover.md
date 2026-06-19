[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/popover

# components/popover

## Type Aliases

### PopoverAlign

> **PopoverAlign** = `"start"` \| `"end"`

Defined in: components/popover.tsx:14

***

### PopoverProps

> **PopoverProps** = `object`

Defined in: components/popover.tsx:16

#### Properties

##### align?

> `optional` **align?**: [`PopoverAlign`](#popoveralign)

Defined in: components/popover.tsx:26

Horizontal alignment to the trigger.

###### Default

```ts
'start'
```

##### children

> **children**: `ReactNode`

Defined in: components/popover.tsx:24

Popover content.

##### onOpenChange

> **onOpenChange**: (`open`) => `void`

Defined in: components/popover.tsx:20

Called to request an open/close change (trigger click, outside click, Escape).

###### Parameters

###### open

`boolean`

###### Returns

`void`

##### open

> **open**: `boolean`

Defined in: components/popover.tsx:18

Whether the popover is open.

##### trigger

> **trigger**: `ReactNode`

Defined in: components/popover.tsx:22

Element that toggles the popover; gets `aria-expanded`/`aria-haspopup`.

##### width?

> `optional` **width?**: `number` \| `string`

Defined in: components/popover.tsx:28

Minimum width; number = px. Defaults to the trigger width.

## Functions

### Popover()

> **Popover**(`__namedParameters`): `Element`

Defined in: components/popover.tsx:46

#### Parameters

##### \_\_namedParameters

[`PopoverProps`](#popoverprops)

#### Returns

`Element`
