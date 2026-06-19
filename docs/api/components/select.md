[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/select

# components/select

## Type Aliases

### SelectOption

> **SelectOption**\<`T`\> = `object`

Defined in: components/select.tsx:6

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: components/select.tsx:12

Optional leading icon.

##### label

> **label**: `ReactNode`

Defined in: components/select.tsx:10

Visible option label.

##### value

> **value**: `T`

Defined in: components/select.tsx:8

Value selected when this option is chosen.

***

### SelectProps

> **SelectProps**\<`T`\> = `object`

Defined in: components/select.tsx:15

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### align?

> `optional` **align?**: [`PopoverAlign`](popover.md#popoveralign)

Defined in: components/select.tsx:27

Dropdown alignment to the trigger.

###### Default

```ts
'start'
```

##### defaultValue?

> `optional` **defaultValue?**: `T`

Defined in: components/select.tsx:19

Initial selected value when uncontrolled.

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: components/select.tsx:29

Disable the trigger.

###### Default

```ts
false
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: components/select.tsx:21

Fires with the newly selected value.

###### Parameters

###### value

`T`

###### Returns

`void`

##### options

> **options**: `ReadonlyArray`\<[`SelectOption`](#selectoption)\<`T`\>\>

Defined in: components/select.tsx:23

Options to render in the dropdown.

##### placeholder?

> `optional` **placeholder?**: `ReactNode`

Defined in: components/select.tsx:25

Trigger text shown when nothing is selected.

###### Default

```ts
'Select…'
```

##### value?

> `optional` **value?**: `T`

Defined in: components/select.tsx:17

Controlled selected value. Provide with `onChange`.

## Functions

### Select()

> **Select**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/select.tsx:71

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`SelectProps`](#selectprops)\<`T`\>

#### Returns

`Element`
