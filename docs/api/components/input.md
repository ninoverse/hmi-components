[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/input

# components/input

## Type Aliases

### InputProps

> **InputProps** = `Omit`\<`ComponentPropsWithRef`\<`"input"`\>, `"value"` \| `"defaultValue"` \| `"onChange"`\> & `object`

Defined in: [components/input.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/input.tsx#L5)

#### Type Declaration

##### defaultValue?

> `optional` **defaultValue?**: `string`

Initial value when uncontrolled.

##### error?

> `optional` **error?**: `boolean`

Apply error styling.

###### Default

```ts
false
```

##### leftIcon?

> `optional` **leftIcon?**: `ReactNode`

Icon rendered inside the field, before the text.

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with the new string value on input.

###### Parameters

###### value

`string`

###### Returns

`void`

##### rightIcon?

> `optional` **rightIcon?**: `ReactNode`

Icon rendered inside the field, after the text.

##### value?

> `optional` **value?**: `string`

Controlled value. Provide with `onChange`.

## Functions

### Input()

> **Input**(`__namedParameters`): `Element`

Defined in: [components/input.tsx:31](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/input.tsx#L31)

Single-line text field with optional leading/trailing icons and an error
state. `onChange` is simplified to receive the string value; caret position
is preserved when controlled.

#### Parameters

##### \_\_namedParameters

[`InputProps`](#inputprops)

#### Returns

`Element`

#### Example

```ts
<Input value={q} onChange={setQ} leftIcon={<SearchIcon />} />
```
