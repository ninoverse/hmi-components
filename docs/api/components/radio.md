[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/radio

# components/radio

## Type Aliases

### RadioProps

> **RadioProps** = `Omit`\<`ComponentPropsWithRef`\<`"input"`\>, `"type"` \| `"checked"` \| `"defaultChecked"` \| `"onChange"`\> & `object`

Defined in: [components/radio.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radio.tsx#L4)

#### Type Declaration

##### checked?

> `optional` **checked?**: `boolean`

Controlled checked state. Provide with `onChange`.

##### defaultChecked?

> `optional` **defaultChecked?**: `boolean`

Initial checked state when uncontrolled.

##### label?

> `optional` **label?**: `ReactNode`

Text shown beside the radio.

##### onChange?

> `optional` **onChange?**: (`checked`) => `void`

Fires with the new checked state on selection.

###### Parameters

###### checked

`boolean`

###### Returns

`void`

## Functions

### Radio()

> **Radio**(`__namedParameters`): `Element`

Defined in: [components/radio.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/radio.tsx#L25)

Single labelled radio button. Usually composed via `RadioGroup`; share
a `name` to make radios mutually exclusive.

#### Parameters

##### \_\_namedParameters

[`RadioProps`](#radioprops)

#### Returns

`Element`

#### Example

```ts
<Radio name="plan" value="pro" label="Pro" onChange={onChange} />
```
