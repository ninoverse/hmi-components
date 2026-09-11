[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/multiInput

# components/multiInput

## Type Aliases

### MultiInputProps

> **MultiInputProps** = `object`

Defined in: [components/multiInput.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L12)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/multiInput.tsx:42](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L42)

Accessible label for the group.

###### Default

```ts
'Segmented input'
```

##### autoComplete?

> `optional` **autoComplete?**: `string`

Defined in: [components/multiInput.tsx:40](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L40)

`autocomplete` for the first cell (e.g. `'one-time-code'`).

###### Default

```ts
'off'
```

##### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: [components/multiInput.tsx:38](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L38)

Focus the first cell on mount.

###### Default

```ts
false
```

##### defaultValue?

> `optional` **defaultValue?**: `string`

Defined in: [components/multiInput.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L22)

Initial value when uncontrolled.

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [components/multiInput.tsx:34](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L34)

Disable all cells.

###### Default

```ts
false
```

##### groupSize?

> `optional` **groupSize?**: `number`

Defined in: [components/multiInput.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L16)

Insert a separator every N cells (e.g. `3` → `XXX–XXX`).

##### length?

> `optional` **length?**: `number`

Defined in: [components/multiInput.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L14)

Number of single-character cells.

###### Default

```ts
6
```

##### mask?

> `optional` **mask?**: `boolean`

Defined in: [components/multiInput.tsx:32](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L32)

Mask entered characters (password style).

###### Default

```ts
false
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: [components/multiInput.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L24)

Fires with the concatenated value on every edit.

###### Parameters

###### value

`string`

###### Returns

`void`

##### onComplete?

> `optional` **onComplete?**: (`value`) => `void`

Defined in: [components/multiInput.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L26)

Fires with the value once every cell is filled.

###### Parameters

###### value

`string`

###### Returns

`void`

##### pattern?

> `optional` **pattern?**: `RegExp`

Defined in: [components/multiInput.tsx:30](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L30)

Custom single-character validation pattern, overriding `type`.

##### readOnly?

> `optional` **readOnly?**: `boolean`

Defined in: [components/multiInput.tsx:36](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L36)

Make all cells read-only.

###### Default

```ts
false
```

##### separator?

> `optional` **separator?**: `string`

Defined in: [components/multiInput.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L18)

Separator string shown between groups.

###### Default

```ts
'–'
```

##### type?

> `optional` **type?**: [`MultiInputType`](#multiinputtype)

Defined in: [components/multiInput.tsx:28](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L28)

Allowed characters and input mode.

###### Default

```ts
'numeric'
```

##### value?

> `optional` **value?**: `string`

Defined in: [components/multiInput.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L20)

Controlled value (concatenated cells). Provide with `onChange`.

***

### MultiInputType

> **MultiInputType** = `"numeric"` \| `"text"`

Defined in: [components/multiInput.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L10)

## Functions

### MultiInput()

> **MultiInput**(`__namedParameters`): `Element`

Defined in: [components/multiInput.tsx:56](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/multiInput.tsx#L56)

Segmented single-character input for codes/OTP/PIN, with auto-advance,
paste-to-fill, keyboard navigation and optional grouping. Works controlled
or uncontrolled.

#### Parameters

##### \_\_namedParameters

[`MultiInputProps`](#multiinputprops)

#### Returns

`Element`

#### Example

```ts
<MultiInput length={6} groupSize={3} onComplete={verify} />
```
