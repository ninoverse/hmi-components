[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/spinner

# components/spinner

## Type Aliases

### SpinnerProps

> **SpinnerProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: [components/spinner.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/spinner.tsx#L6)

#### Type Declaration

##### label?

> `optional` **label?**: `string`

Accessible status label.

###### Default

```ts
'Loading'
```

##### size?

> `optional` **size?**: [`SpinnerSize`](#spinnersize)

Diameter preset.

###### Default

```ts
'medium'
```

***

### SpinnerSize

> **SpinnerSize** = `"small"` \| `"medium"` \| `"large"`

Defined in: [components/spinner.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/spinner.tsx#L4)

## Functions

### Spinner()

> **Spinner**(`__namedParameters`): `Element`

Defined in: [components/spinner.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/spinner.tsx#L19)

Indeterminate loading spinner with `role="status"`.

#### Parameters

##### \_\_namedParameters

[`SpinnerProps`](#spinnerprops)

#### Returns

`Element`

#### Example

```ts
<Spinner size="large" label="Fetching" />
```
