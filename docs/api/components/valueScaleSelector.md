[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/valueScaleSelector

# components/valueScaleSelector

## Type Aliases

### ValueScaleSelectorProps

> **ValueScaleSelectorProps** = `object`

Defined in: [components/valueScaleSelector.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L12)

#### Properties

##### allowHalf?

> `optional` **allowHalf?**: `boolean`

Defined in: [components/valueScaleSelector.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L22)

Allow half-step selection (e.g. 3.5).

###### Default

```ts
false
```

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/valueScaleSelector.tsx:38](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L38)

Accessible label for the slider.

###### Default

```ts
'Value selector'
```

##### defaultValue?

> `optional` **defaultValue?**: `number`

Defined in: [components/valueScaleSelector.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L16)

Initial value when uncontrolled.

###### Default

```ts
0
```

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [components/valueScaleSelector.tsx:34](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L34)

Disable the control.

###### Default

```ts
false
```

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: [components/valueScaleSelector.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L24)

Icon rendered for each position. Defaults to a star.

##### max?

> `optional` **max?**: `number`

Defined in: [components/valueScaleSelector.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L20)

Number of icons / maximum value.

###### Default

```ts
5
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: [components/valueScaleSelector.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L18)

Fires with the newly selected value.

###### Parameters

###### value

`number`

###### Returns

`void`

##### readOnly?

> `optional` **readOnly?**: `boolean`

Defined in: [components/valueScaleSelector.tsx:32](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L32)

Display only; no interaction.

###### Default

```ts
false
```

##### size?

> `optional` **size?**: [`ValueScaleSelectorSize`](#valuescaleselectorsize)

Defined in: [components/valueScaleSelector.tsx:36](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L36)

Icon size preset.

###### Default

```ts
'medium'
```

##### value?

> `optional` **value?**: `number`

Defined in: [components/valueScaleSelector.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L14)

Controlled value. Provide with `onChange`.

##### valueText?

> `optional` **valueText?**: `string` \| ((`value`, `max`) => `string`)

Defined in: [components/valueScaleSelector.tsx:30](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L30)

Build the `aria-valuetext`. A function `(value, max) => string`, or a
`{value}`/`{max}` template string usable over the web-component
boundary. Defaults to `'{value} out of {max}'`.

***

### ValueScaleSelectorSize

> **ValueScaleSelectorSize** = `"small"` \| `"medium"` \| `"large"`

Defined in: [components/valueScaleSelector.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L10)

## Functions

### ValueScaleSelector()

> **ValueScaleSelector**(`__namedParameters`): `Element`

Defined in: [components/valueScaleSelector.tsx:56](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/valueScaleSelector.tsx#L56)

Icon-based rating/scale selector (e.g. star rating) exposed as an accessible
slider, with optional half-steps, custom icon and keyboard support. Works
controlled or uncontrolled.

#### Parameters

##### \_\_namedParameters

[`ValueScaleSelectorProps`](#valuescaleselectorprops)

#### Returns

`Element`

#### Example

```ts
<ValueScaleSelector max={5} allowHalf value={rating} onChange={setRating} />
```
