[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/radioGroup

# components/radioGroup

## Type Aliases

### RadioGroupProps

> **RadioGroupProps**\<`T`\> = `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"onChange"`\> & `object`

Defined in: components/radioGroup.tsx:14

#### Type Declaration

##### defaultValue?

> `optional` **defaultValue?**: `T`

Initial selected value when uncontrolled.

##### name

> **name**: `string`

Shared input `name` that links the radios.

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with the newly selected value.

###### Parameters

###### value

`T`

###### Returns

`void`

##### options

> **options**: `ReadonlyArray`\<[`RadioOption`](#radiooption)\<`T`\>\>

Options to render.

##### value?

> `optional` **value?**: `T`

Controlled selected value. Provide with `onChange`.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

***

### RadioOption

> **RadioOption**\<`T`\> = `object`

Defined in: components/radioGroup.tsx:5

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: components/radioGroup.tsx:11

Disable this option.

###### Default

```ts
false
```

##### label

> **label**: `ReactNode`

Defined in: components/radioGroup.tsx:9

Visible option label.

##### value

> **value**: `T`

Defined in: components/radioGroup.tsx:7

Value selected when this option is chosen.

## Functions

### RadioGroup()

> **RadioGroup**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/radioGroup.tsx:37

Group of mutually exclusive [Radio](radio.md#radio)s built from an options array.
Works controlled or uncontrolled.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`RadioGroupProps`](#radiogroupprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<RadioGroup name="plan" options={plans} value={plan} onChange={setPlan} />
```
