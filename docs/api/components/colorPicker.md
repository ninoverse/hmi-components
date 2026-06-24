[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/colorPicker

# components/colorPicker

## Type Aliases

### ColorPickerProps

> **ColorPickerProps** = `object`

Defined in: components/colorPicker.tsx:5

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/colorPicker.tsx:19

Accessible label for the trigger.

###### Default

```ts
'Choose color'
```

##### defaultValue?

> `optional` **defaultValue?**: `string`

Defined in: components/colorPicker.tsx:9

Initial hex value when uncontrolled.

###### Default

```ts
'#e87a5d'
```

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: components/colorPicker.tsx:15

Disable the trigger.

###### Default

```ts
false
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: components/colorPicker.tsx:11

Fires with the new hex value on swatch/input/native change.

###### Parameters

###### value

`string`

###### Returns

`void`

##### showInput?

> `optional` **showInput?**: `boolean`

Defined in: components/colorPicker.tsx:17

Show the hex + native colour inputs below the swatches.

###### Default

```ts
true
```

##### swatches?

> `optional` **swatches?**: `string`[]

Defined in: components/colorPicker.tsx:13

Preset swatch colours shown in the panel.

##### value?

> `optional` **value?**: `string`

Defined in: components/colorPicker.tsx:7

Controlled hex value (e.g. `'#e87a5d'`). Provide with `onChange`.

## Functions

### ColorPicker()

> **ColorPicker**(`__namedParameters`): `Element`

Defined in: components/colorPicker.tsx:42

Popover colour picker with preset swatches plus optional hex and native
colour inputs. Works controlled or uncontrolled.

#### Parameters

##### \_\_namedParameters

[`ColorPickerProps`](#colorpickerprops)

#### Returns

`Element`

#### Example

```ts
<ColorPicker defaultValue="#5c9a6a" onChange={setColor} />
```
