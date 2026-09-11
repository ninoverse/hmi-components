[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/slider

# components/slider

## Type Aliases

### SliderProps

> **SliderProps** = `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"type"` \| `"value"` \| `"defaultValue"` \| `"onChange"` \| `"min"` \| `"max"` \| `"step"`\> & `object`

Defined in: [components/slider.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/slider.tsx#L6)

#### Type Declaration

##### defaultValue?

> `optional` **defaultValue?**: `number`

Initial value when uncontrolled. Defaults to `min`.

##### formatValue?

> `optional` **formatValue?**: `string` \| ((`value`) => `string`)

Format the displayed value. A function `(value) => string`, or a
`{value}` template string (e.g. `"{value}%"`) usable over the
web-component boundary.

##### max?

> `optional` **max?**: `number`

Maximum value.

###### Default

```ts
100
```

##### min?

> `optional` **min?**: `number`

Minimum value.

###### Default

```ts
0
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with the new value as the thumb moves.

###### Parameters

###### value

`number`

###### Returns

`void`

##### showValue?

> `optional` **showValue?**: `boolean`

Show the current value beside the track.

###### Default

```ts
false
```

##### step?

> `optional` **step?**: `number`

Step increment.

###### Default

```ts
1
```

##### value?

> `optional` **value?**: `number`

Controlled value. Provide with `onChange`.

## Functions

### Slider()

> **Slider**(`__namedParameters`): `Element`

Defined in: [components/slider.tsx:39](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/slider.tsx#L39)

Range slider over a native `range` input, with optional value display and
formatting. Works controlled or uncontrolled.

#### Parameters

##### \_\_namedParameters

[`SliderProps`](#sliderprops)

#### Returns

`Element`

#### Example

```ts
<Slider min={0} max={100} value={vol} onChange={setVol} showValue />
```
