[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/valueScaleSelector

# components/valueScaleSelector

## Type Aliases

### ValueScaleSelectorProps

> **ValueScaleSelectorProps** = `object`

Defined in: components/valueScaleSelector.tsx:11

#### Properties

##### allowHalf?

> `optional` **allowHalf?**: `boolean`

Defined in: components/valueScaleSelector.tsx:21

Allow half-step selection (e.g. 3.5).

###### Default

```ts
false
```

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/valueScaleSelector.tsx:33

Accessible label for the slider.

###### Default

```ts
'Value selector'
```

##### defaultValue?

> `optional` **defaultValue?**: `number`

Defined in: components/valueScaleSelector.tsx:15

Initial value when uncontrolled.

###### Default

```ts
0
```

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: components/valueScaleSelector.tsx:29

Disable the control.

###### Default

```ts
false
```

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: components/valueScaleSelector.tsx:23

Icon rendered for each position. Defaults to a star.

##### max?

> `optional` **max?**: `number`

Defined in: components/valueScaleSelector.tsx:19

Number of icons / maximum value.

###### Default

```ts
5
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: components/valueScaleSelector.tsx:17

Fires with the newly selected value.

###### Parameters

###### value

`number`

###### Returns

`void`

##### readOnly?

> `optional` **readOnly?**: `boolean`

Defined in: components/valueScaleSelector.tsx:27

Display only; no interaction.

###### Default

```ts
false
```

##### size?

> `optional` **size?**: [`ValueScaleSelectorSize`](#valuescaleselectorsize)

Defined in: components/valueScaleSelector.tsx:31

Icon size preset.

###### Default

```ts
'medium'
```

##### value?

> `optional` **value?**: `number`

Defined in: components/valueScaleSelector.tsx:13

Controlled value. Provide with `onChange`.

##### valueText?

> `optional` **valueText?**: (`value`, `max`) => `string`

Defined in: components/valueScaleSelector.tsx:25

Build the `aria-valuetext`. Defaults to `'{value} out of {max}'`.

###### Parameters

###### value

`number`

###### max

`number`

###### Returns

`string`

***

### ValueScaleSelectorSize

> **ValueScaleSelectorSize** = `"small"` \| `"medium"` \| `"large"`

Defined in: components/valueScaleSelector.tsx:9

## Functions

### ValueScaleSelector()

> **ValueScaleSelector**(`__namedParameters`): `Element`

Defined in: components/valueScaleSelector.tsx:52

#### Parameters

##### \_\_namedParameters

[`ValueScaleSelectorProps`](#valuescaleselectorprops)

#### Returns

`Element`
