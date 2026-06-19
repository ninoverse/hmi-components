[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/numberInput

# components/numberInput

## Type Aliases

### NumberInputProps

> **NumberInputProps** = `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"type"` \| `"value"` \| `"defaultValue"` \| `"onChange"` \| `"min"` \| `"max"` \| `"step"`\> & `object`

Defined in: components/numberInput.tsx:5

#### Type Declaration

##### defaultValue?

> `optional` **defaultValue?**: `number`

Initial value when uncontrolled.

##### error?

> `optional` **error?**: `boolean`

Apply error styling.

###### Default

```ts
false
```

##### max?

> `optional` **max?**: `number`

Maximum value; clamped on blur and disables the increment at the bound.

##### min?

> `optional` **min?**: `number`

Minimum value; clamped on blur and disables the decrement at the bound.

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with the new number, or `null` when the field is cleared.

###### Parameters

###### value

`number` \| `null`

###### Returns

`void`

##### step?

> `optional` **step?**: `number`

Increment/decrement step.

###### Default

```ts
1
```

##### value?

> `optional` **value?**: `number` \| `null`

Controlled value, or `null` when empty. Provide with `onChange`.

## Functions

### NumberInput()

> **NumberInput**(`__namedParameters`): `Element`

Defined in: components/numberInput.tsx:32

Numeric field with stepper buttons and min/max clamping (applied on blur).
Empty input is represented as `null`. Works controlled or uncontrolled.

#### Parameters

##### \_\_namedParameters

[`NumberInputProps`](#numberinputprops)

#### Returns

`Element`

#### Example

```ts
<NumberInput min={0} max={10} value={qty} onChange={setQty} />
```
