[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/progress

# components/progress

## Type Aliases

### ProgressProps

> **ProgressProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/progress.tsx:4

#### Type Declaration

##### indeterminate?

> `optional` **indeterminate?**: `boolean`

Show a looping animation for unknown duration; ignores `value`.

###### Default

```ts
false
```

##### label?

> `optional` **label?**: `string`

Accessible label for the progress bar.

##### value?

> `optional` **value?**: `number`

Completion percentage 0–100 (clamped).

###### Default

```ts
0
```

## Functions

### Progress()

> **Progress**(`__namedParameters`): `Element`

Defined in: components/progress.tsx:20

Linear progress bar for a known or indeterminate task. For a scalar
measurement within a range, use `Meter` instead.

#### Parameters

##### \_\_namedParameters

[`ProgressProps`](#progressprops)

#### Returns

`Element`

#### Example

```ts
<Progress value={64} label="Uploading" />
```
