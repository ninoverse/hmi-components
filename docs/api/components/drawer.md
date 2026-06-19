[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/drawer

# components/drawer

## Type Aliases

### DrawerProps

> **DrawerProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/drawer.tsx:16

#### Type Declaration

##### actions?

> `optional` **actions?**: `ReactNode` \| [`DialogAction`](modal.md#dialogaction)[]

Footer actions: arbitrary nodes, or a serializable `DialogAction[]`.

##### description?

> `optional` **description?**: `ReactNode`

Supporting text under the title.

##### onAction?

> `optional` **onAction?**: (`value`) => `void`

Fires with a `DialogAction.value` when a declarative action is chosen.

###### Parameters

###### value

`string`

###### Returns

`void`

##### onClose

> **onClose**: () => `void`

Called on Escape or backdrop click.

###### Returns

`void`

##### open

> **open**: `boolean`

Whether the drawer is open.

##### side?

> `optional` **side?**: [`DrawerSide`](#drawerside)

Edge the panel slides in from.

###### Default

```ts
'right'
```

##### size?

> `optional` **size?**: `string` \| `number`

Panel size (width for left/right, height for top/bottom); number = px.

##### title?

> `optional` **title?**: `ReactNode`

Heading shown at the top of the panel.

***

### DrawerSide

> **DrawerSide** = `"left"` \| `"right"` \| `"top"` \| `"bottom"`

Defined in: components/drawer.tsx:14

## Functions

### Drawer()

> **Drawer**(`__namedParameters`): `ReactPortal` \| `null`

Defined in: components/drawer.tsx:44

Slide-out panel anchored to a screen edge, with scrim, focus management,
Escape-to-close and optional title/description/footer actions.

#### Parameters

##### \_\_namedParameters

[`DrawerProps`](#drawerprops)

#### Returns

`ReactPortal` \| `null`

#### Example

```ts
<Drawer open={open} onClose={close} side="right" title="Filters">…</Drawer>
```
