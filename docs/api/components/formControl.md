[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/formControl

# components/formControl

## Type Aliases

### FormControlProps

> **FormControlProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/formControl.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/formControl.tsx#L4)

#### Type Declaration

##### error?

> `optional` **error?**: `ReactNode`

Error message below the control; takes precedence over `hint`.

##### hint?

> `optional` **hint?**: `ReactNode`

Helper text below the control; hidden when `error` is set.

##### label?

> `optional` **label?**: `ReactNode`

Field label above the control.

## Functions

### FormControl()

> **FormControl**(`__namedParameters`): `Element`

Defined in: [components/formControl.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/formControl.tsx#L20)

Wrapper that adds a label and a hint/error message around any form control
passed as `children`.

#### Parameters

##### \_\_namedParameters

[`FormControlProps`](#formcontrolprops)

#### Returns

`Element`

#### Example

```ts
<FormControl label="Email" error={err}><Input /></FormControl>
```
