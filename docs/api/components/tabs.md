[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/tabs

# components/tabs

## Type Aliases

### TabOption

> **TabOption**\<`T`\> = `object`

Defined in: components/tabs.tsx:13

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### count?

> `optional` **count?**: `number`

Defined in: components/tabs.tsx:21

Optional count shown as a trailing [Badge](badge.md#badge).

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: components/tabs.tsx:19

Optional leading icon.

##### label

> **label**: `ReactNode`

Defined in: components/tabs.tsx:17

Visible tab label.

##### value

> **value**: `T`

Defined in: components/tabs.tsx:15

Value selected when this tab is chosen.

***

### TabsProps

> **TabsProps**\<`T`\> = `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"onChange"`\> & `object`

Defined in: components/tabs.tsx:24

#### Type Declaration

##### defaultValue?

> `optional` **defaultValue?**: `T`

Initial active tab when uncontrolled.

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with the newly selected tab value.

###### Parameters

###### value

`T`

###### Returns

`void`

##### options

> **options**: `ReadonlyArray`\<[`TabOption`](#taboption)\<`T`\>\>

Tabs to render.

##### value?

> `optional` **value?**: `T`

Controlled active tab value. Provide with `onChange`.

##### variant?

> `optional` **variant?**: [`TabsVariant`](#tabsvariant)

Visual style.

###### Default

```ts
'pill'
```

#### Type Parameters

##### T

`T` *extends* `string` = `string`

***

### TabsVariant

> **TabsVariant** = `"pill"` \| `"underline"`

Defined in: components/tabs.tsx:11

## Functions

### Tabs()

> **Tabs**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/tabs.tsx:51

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`TabsProps`](#tabsprops)\<`T`\>

#### Returns

`Element`
