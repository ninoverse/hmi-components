[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/menu

# components/menu

## Type Aliases

### MenuItemProps

> **MenuItemProps** = `ComponentPropsWithRef`\<`"button"`\> & `object`

Defined in: components/menu.tsx:24

#### Type Declaration

##### danger?

> `optional` **danger?**: `boolean`

Style as a destructive action.

###### Default

```ts
false
```

##### icon?

> `optional` **icon?**: `ReactNode`

Leading icon.

##### shortcut?

> `optional` **shortcut?**: `ReactNode`

Trailing hint (e.g. a keyboard shortcut).

***

### MenuLabelProps

> **MenuLabelProps** = `HTMLAttributes`\<`HTMLDivElement`\>

Defined in: components/menu.tsx:67

***

### MenuProps

> **MenuProps** = `HTMLAttributes`\<`HTMLDivElement`\>

Defined in: components/menu.tsx:4

***

### MenuSeparatorProps

> **MenuSeparatorProps** = `HTMLAttributes`\<`HTMLHRElement`\>

Defined in: components/menu.tsx:58

## Functions

### Menu()

> **Menu**(`__namedParameters`): `Element`

Defined in: components/menu.tsx:14

Menu container holding [MenuItem](#menuitem), [MenuSeparator](#menuseparator) and
[MenuLabel](#menulabel) children. Pair with `Popover`/`ContextMenu` for
dropdown/right-click menus.

#### Parameters

##### \_\_namedParameters

[`MenuProps`](#menuprops)

#### Returns

`Element`

#### Example

```ts
<Menu><MenuItem>Edit</MenuItem><MenuSeparator /><MenuItem danger>Delete</MenuItem></Menu>
```

***

### MenuItem()

> **MenuItem**(`__namedParameters`): `Element`

Defined in: components/menu.tsx:34

Activatable menu row. Forwards native `<button>` props.

#### Parameters

##### \_\_namedParameters

[`MenuItemProps`](#menuitemprops)

#### Returns

`Element`

***

### MenuLabel()

> **MenuLabel**(`__namedParameters`): `Element`

Defined in: components/menu.tsx:70

Non-interactive group heading within a menu.

#### Parameters

##### \_\_namedParameters

[`MenuLabelProps`](#menulabelprops)

#### Returns

`Element`

***

### MenuSeparator()

> **MenuSeparator**(`__namedParameters`): `Element`

Defined in: components/menu.tsx:61

Horizontal divider between groups of menu items.

#### Parameters

##### \_\_namedParameters

[`MenuSeparatorProps`](#menuseparatorprops)

#### Returns

`Element`
