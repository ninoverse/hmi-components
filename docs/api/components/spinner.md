[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/spinner

# components/spinner

## Type Aliases

### SpinnerProps

> **SpinnerProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: components/spinner.tsx:6

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

Defined in: components/spinner.tsx:4

## Functions

### Spinner()

> **Spinner**(`__namedParameters`): `Element`

Defined in: components/spinner.tsx:19

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
