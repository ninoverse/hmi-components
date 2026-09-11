[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/popover

# components/popover

## Type Aliases

### PopoverAlign

> **PopoverAlign** = `"start"` \| `"end"`

Defined in: [components/popover.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L14)

***

### PopoverProps

> **PopoverProps** = `object`

Defined in: [components/popover.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L16)

#### Properties

##### align?

> `optional` **align?**: [`PopoverAlign`](#popoveralign)

Defined in: [components/popover.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L26)

Horizontal alignment to the trigger.

###### Default

```ts
'start'
```

##### children

> **children**: `ReactNode`

Defined in: [components/popover.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L24)

Popover content.

##### onOpenChange

> **onOpenChange**: (`open`) => `void`

Defined in: [components/popover.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L20)

Called to request an open/close change (trigger click, outside click, Escape).

###### Parameters

###### open

`boolean`

###### Returns

`void`

##### open

> **open**: `boolean`

Defined in: [components/popover.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L18)

Whether the popover is open.

##### trigger

> **trigger**: `ReactNode`

Defined in: [components/popover.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L22)

Element that toggles the popover; gets `aria-expanded`/`aria-haspopup`.

##### width?

> `optional` **width?**: `number` \| `string`

Defined in: [components/popover.tsx:28](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L28)

Minimum width; number = px. Defaults to the trigger width.

## Functions

### Popover()

> **Popover**(`__namedParameters`): `Element`

Defined in: [components/popover.tsx:45](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/popover.tsx#L45)

Controlled popover anchored to a trigger, rendered in a portal and
repositioned on scroll/resize. Closes on outside click or Escape.

#### Parameters

##### \_\_namedParameters

[`PopoverProps`](#popoverprops)

#### Returns

`Element`

#### Example

```ts
<Popover open={open} onOpenChange={setOpen} trigger={<Button>Menu</Button>}>…</Popover>
```
