[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/slider

# components/slider

## Type Aliases

### SliderProps

> **SliderProps** = `Omit`\<`InputHTMLAttributes`\<`HTMLInputElement`\>, `"type"` \| `"value"` \| `"defaultValue"` \| `"onChange"` \| `"min"` \| `"max"` \| `"step"`\> & `object`

Defined in: components/slider.tsx:5

#### Type Declaration

##### defaultValue?

> `optional` **defaultValue?**: `number`

Initial value when uncontrolled. Defaults to `min`.

##### formatValue?

> `optional` **formatValue?**: (`value`) => `string`

Format the displayed value (e.g. add a unit).

###### Parameters

###### value

`number`

###### Returns

`string`

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

Defined in: components/slider.tsx:34

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
