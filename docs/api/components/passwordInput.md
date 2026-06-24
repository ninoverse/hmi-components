[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/passwordInput

# components/passwordInput

## Type Aliases

### PasswordInputProps

> **PasswordInputProps** = `Omit`\<[`InputProps`](input.md#inputprops), `"type"` \| `"rightIcon"`\>

Defined in: components/passwordInput.tsx:6

Same as [InputProps](input.md#inputprops), minus `type` and `rightIcon` (used internally for the reveal toggle).

## Functions

### PasswordInput()

> **PasswordInput**(`props`): `Element`

Defined in: components/passwordInput.tsx:43

[Input](input.md#input) preconfigured for passwords, with a built-in show/hide toggle.

#### Parameters

##### props

[`PasswordInputProps`](#passwordinputprops)

#### Returns

`Element`

#### Example

```ts
<PasswordInput value={pw} onChange={setPw} />
```
