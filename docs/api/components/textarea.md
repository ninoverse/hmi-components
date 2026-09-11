[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/textarea

# components/textarea

## Type Aliases

### TextareaProps

> **TextareaProps** = `Omit`\<`ComponentPropsWithRef`\<`"textarea"`\>, `"value"` \| `"defaultValue"` \| `"onChange"`\> & `object`

Defined in: [components/textarea.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/textarea.tsx#L5)

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

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with the new string value on input.

###### Parameters

###### value

`string`

###### Returns

`void`

##### value?

> `optional` **value?**: `string`

Controlled value. Provide with `onChange`.

## Functions

### Textarea()

> **Textarea**(`__namedParameters`): `Element`

Defined in: [components/textarea.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/textarea.tsx#L26)

Multi-line text field with an error state. `onChange` is simplified to
receive the string value; caret position is preserved when controlled.

#### Parameters

##### \_\_namedParameters

[`TextareaProps`](#textareaprops)

#### Returns

`Element`

#### Example

```ts
<Textarea value={bio} onChange={setBio} rows={4} />
```
