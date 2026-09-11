[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/contextMenu

# components/contextMenu

## Type Aliases

### ContextMenuProps

> **ContextMenuProps** = `object`

Defined in: [components/contextMenu.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/contextMenu.tsx#L14)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [components/contextMenu.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/contextMenu.tsx#L16)

Trigger element; right-clicking it opens the menu at the cursor.

##### menu

> **menu**: `ReactNode`

Defined in: [components/contextMenu.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/contextMenu.tsx#L18)

Menu content rendered in a viewport-clamped portal (e.g. a `<Menu>`).

## Functions

### ContextMenu()

> **ContextMenu**(`__namedParameters`): `Element`

Defined in: [components/contextMenu.tsx:30](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/contextMenu.tsx#L30)

Right-click (context) menu. Wraps a trigger and opens `menu` at the pointer,
clamped within the viewport; closes on outside click, Escape or scroll.

#### Parameters

##### \_\_namedParameters

[`ContextMenuProps`](#contextmenuprops)

#### Returns

`Element`

#### Example

```ts
<ContextMenu menu={<Menu items={items} />}><div>Right-click me</div></ContextMenu>
```
