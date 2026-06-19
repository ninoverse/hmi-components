[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/datePicker

# components/datePicker

## Type Aliases

### DateInput

> **DateInput** = `Date` \| `string`

Defined in: components/datePicker.tsx:10

A date accepted across the prop boundary: an ISO-8601 string (so it can
travel through an HTML attribute) or a live Date for the React API.

***

### DatePickerProps

> **DatePickerProps** = `SingleProps` \| `RangeProps`

Defined in: components/datePicker.tsx:51

***

### DateRange

> **DateRange** = `object`

Defined in: components/datePicker.tsx:6

Internal Date-pair shape used for range rendering and state.

#### Properties

##### end

> **end**: `Date` \| `null`

Defined in: components/datePicker.tsx:6

##### start

> **start**: `Date`

Defined in: components/datePicker.tsx:6

***

### DateRangeISO

> **DateRangeISO** = `object`

Defined in: components/datePicker.tsx:14

Serializable range emitted by onChange (ISO-8601 strings).

#### Properties

##### end

> **end**: `string` \| `null`

Defined in: components/datePicker.tsx:14

##### start

> **start**: `string`

Defined in: components/datePicker.tsx:14

***

### DateRangeValue

> **DateRangeValue** = `object`

Defined in: components/datePicker.tsx:12

Range value accepted as props — each endpoint an ISO string or Date.

#### Properties

##### end

> **end**: [`DateInput`](#dateinput) \| `null`

Defined in: components/datePicker.tsx:12

##### start

> **start**: [`DateInput`](#dateinput)

Defined in: components/datePicker.tsx:12

## Functions

### DatePicker()

> **DatePicker**(`props`): `Element`

Defined in: components/datePicker.tsx:132

Calendar date picker in a popover, supporting single-date or start/end range
selection, min/max bounds, and full keyboard navigation. Accepts ISO strings
or `Date`s and emits ISO-8601 strings (Web Component-safe). Works controlled
or uncontrolled.

#### Parameters

##### props

[`DatePickerProps`](#datepickerprops)

#### Returns

`Element`

#### Example

```ts
<DatePicker onChange={setDate} />
<DatePicker mode="range" onChange={setRange} />
```
