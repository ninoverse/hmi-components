[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/sidebar

# components/sidebar

## Type Aliases

### SidebarGroup

> **SidebarGroup**\<`T`\> = `object`

Defined in: components/sidebar.tsx:20

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### items

> **items**: `ReadonlyArray`\<[`SidebarItem`](#sidebaritem)\<`T`\>\>

Defined in: components/sidebar.tsx:24

Items in this group.

##### label?

> `optional` **label?**: `ReactNode`

Defined in: components/sidebar.tsx:22

Optional group heading.

***

### SidebarItem

> **SidebarItem**\<`T`\> = `object`

Defined in: components/sidebar.tsx:5

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### badge?

> `optional` **badge?**: `ReactNode`

Defined in: components/sidebar.tsx:15

Optional trailing [Badge](badge.md#badge) content.

##### badgeVariant?

> `optional` **badgeVariant?**: [`BadgeVariant`](badge.md#badgevariant)

Defined in: components/sidebar.tsx:17

Variant for the trailing badge.

###### Default

```ts
'default'
```

##### href?

> `optional` **href?**: `string`

Defined in: components/sidebar.tsx:13

Link target; when omitted, navigation is handled via `onNav` only.

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: components/sidebar.tsx:11

Optional leading icon.

##### label

> **label**: `ReactNode`

Defined in: components/sidebar.tsx:9

Visible item label.

##### value

> **value**: `T`

Defined in: components/sidebar.tsx:7

Unique value, emitted via `onNav` and matched against `current`.

***

### SidebarProps

> **SidebarProps**\<`T`\> = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: components/sidebar.tsx:27

#### Type Declaration

##### current?

> `optional` **current?**: `T`

Value of the active item, marked `aria-current="page"`.

##### groups

> **groups**: `ReadonlyArray`\<[`SidebarGroup`](#sidebargroup)\<`T`\>\>

Grouped navigation items.

##### onNav?

> `optional` **onNav?**: (`value`) => `void`

Fires with an item's `value` when it is activated.

###### Parameters

###### value

`T`

###### Returns

`void`

#### Type Parameters

##### T

`T` *extends* `string` = `string`

## Functions

### Sidebar()

> **Sidebar**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/sidebar.tsx:44

Vertical side navigation with grouped, optionally-badged links and an active
state.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`SidebarProps`](#sidebarprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<Sidebar groups={groups} current={page} onNav={setPage} />
```
