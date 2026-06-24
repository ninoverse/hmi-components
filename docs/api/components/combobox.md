[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/combobox

# components/combobox

## Type Aliases

### ComboboxOption

> **ComboboxOption**\<`T`\> = `object`

Defined in: components/combobox.tsx:16

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### description?

> `optional` **description?**: `ReactNode`

Defined in: components/combobox.tsx:22

Optional secondary line under the label.

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: components/combobox.tsx:24

Prevent selecting this option.

###### Default

```ts
false
```

##### label

> **label**: `string`

Defined in: components/combobox.tsx:20

Text shown in the input and option row, and matched while filtering.

##### value

> **value**: `T`

Defined in: components/combobox.tsx:18

Unique value committed on selection.

***

### ComboboxProps

> **ComboboxProps**\<`T`\> = `object`

Defined in: components/combobox.tsx:27

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/combobox.tsx:45

Accessible label for the input.

###### Default

```ts
'Combobox'
```

##### defaultValue?

> `optional` **defaultValue?**: `T`

Defined in: components/combobox.tsx:31

Initial selected value when uncontrolled.

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: components/combobox.tsx:39

Disable the input.

###### Default

```ts
false
```

##### emptyMessage?

> `optional` **emptyMessage?**: `ReactNode`

Defined in: components/combobox.tsx:43

Content shown when no option matches.

###### Default

```ts
'No matches'
```

##### filterOption?

> `optional` **filterOption?**: (`option`, `query`) => `boolean`

Defined in: components/combobox.tsx:41

Predicate for filtering options by query. Defaults to case-insensitive label match.

###### Parameters

###### option

[`ComboboxOption`](#comboboxoption)\<`T`\>

###### query

`string`

###### Returns

`boolean`

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: components/combobox.tsx:33

Fires with the new value (or `null` when cleared).

###### Parameters

###### value

`T` \| `null`

###### Returns

`void`

##### options

> **options**: `ReadonlyArray`\<[`ComboboxOption`](#comboboxoption)\<`T`\>\>

Defined in: components/combobox.tsx:35

Selectable options.

##### placeholder?

> `optional` **placeholder?**: `string`

Defined in: components/combobox.tsx:37

Input placeholder.

###### Default

```ts
'Search…'
```

##### value?

> `optional` **value?**: `T` \| `null`

Defined in: components/combobox.tsx:29

Controlled selected value, or `null` for none. Provide with `onChange`.

## Functions

### Combobox()

> **Combobox**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/combobox.tsx:60

Editable single-select with type-ahead filtering, keyboard navigation and a
portalled listbox. Works controlled or uncontrolled.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`ComboboxProps`](#comboboxprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<Combobox options={cities} onChange={setCity} placeholder="City" />
```
