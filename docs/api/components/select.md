[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/select

# components/select

## Type Aliases

### SelectOption

> **SelectOption**\<`T`\> = `object`

Defined in: [components/select.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L6)

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: [components/select.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L12)

Optional leading icon.

##### label

> **label**: `ReactNode`

Defined in: [components/select.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L10)

Visible option label.

##### value

> **value**: `T`

Defined in: [components/select.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L8)

Value selected when this option is chosen.

***

### SelectProps

> **SelectProps**\<`T`\> = `object`

Defined in: [components/select.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L15)

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### align?

> `optional` **align?**: [`PopoverAlign`](popover.md#popoveralign)

Defined in: [components/select.tsx:27](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L27)

Dropdown alignment to the trigger.

###### Default

```ts
'start'
```

##### defaultValue?

> `optional` **defaultValue?**: `T`

Defined in: [components/select.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L19)

Initial selected value when uncontrolled.

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [components/select.tsx:29](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L29)

Disable the trigger.

###### Default

```ts
false
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: [components/select.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L21)

Fires with the newly selected value.

###### Parameters

###### value

`T`

###### Returns

`void`

##### options

> **options**: `ReadonlyArray`\<[`SelectOption`](#selectoption)\<`T`\>\>

Defined in: [components/select.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L23)

Options to render in the dropdown.

##### placeholder?

> `optional` **placeholder?**: `ReactNode`

Defined in: [components/select.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L25)

Trigger text shown when nothing is selected.

###### Default

```ts
'Select…'
```

##### value?

> `optional` **value?**: `T`

Defined in: [components/select.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L17)

Controlled selected value. Provide with `onChange`.

## Functions

### Select()

> **Select**\<`T`\>(`__namedParameters`): `Element`

Defined in: [components/select.tsx:70](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/select.tsx#L70)

Single-select dropdown built on [Popover](popover.md#popover) + [Menu](menu.md#menu). For
type-ahead filtering over many options, use Combobox. Works
controlled or uncontrolled.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`SelectProps`](#selectprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<Select options={options} value={val} onChange={setVal} />
```
