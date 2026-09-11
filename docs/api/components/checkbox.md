[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/checkbox

# components/checkbox

## Type Aliases

### CheckboxProps

> **CheckboxProps** = `Omit`\<`ComponentPropsWithRef`\<`"input"`\>, `"type"` \| `"checked"` \| `"defaultChecked"` \| `"onChange"`\> & `object`

Defined in: [components/checkbox.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/checkbox.tsx#L4)

#### Type Declaration

##### checked?

> `optional` **checked?**: `boolean`

Controlled checked state. Provide with `onChange`.

##### defaultChecked?

> `optional` **defaultChecked?**: `boolean`

Initial checked state when uncontrolled.

##### label?

> `optional` **label?**: `ReactNode`

Text shown beside the checkbox.

##### onChange?

> `optional` **onChange?**: (`checked`) => `void`

Fires with the new checked state on toggle.

###### Parameters

###### checked

`boolean`

###### Returns

`void`

## Functions

### Checkbox()

> **Checkbox**(`__namedParameters`): `Element`

Defined in: [components/checkbox.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/checkbox.tsx#L25)

Labelled checkbox. Forwards native `<input>` props; `onChange` is simplified
to receive the boolean checked state.

#### Parameters

##### \_\_namedParameters

[`CheckboxProps`](#checkboxprops)

#### Returns

`Element`

#### Example

```ts
<Checkbox label="Subscribe" defaultChecked onChange={setOn} />
```
