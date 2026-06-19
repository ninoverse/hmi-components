[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/stepper

# components/stepper

## Type Aliases

### StepperItem

> **StepperItem**\<`T`\> = `object`

Defined in: components/stepper.tsx:6

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### description?

> `optional` **description?**: `ReactNode`

Defined in: components/stepper.tsx:12

Optional secondary line under the label.

##### label

> **label**: `ReactNode`

Defined in: components/stepper.tsx:10

Step title.

##### value

> **value**: `T`

Defined in: components/stepper.tsx:8

Unique step value, emitted via `onChange` and matched against `current`.

***

### StepperOrientation

> **StepperOrientation** = `"horizontal"` \| `"vertical"`

Defined in: components/stepper.tsx:4

***

### StepperProps

> **StepperProps**\<`T`\> = `Omit`\<`HTMLAttributes`\<`HTMLOListElement`\>, `"onChange"`\> & `object`

Defined in: components/stepper.tsx:15

#### Type Declaration

##### current?

> `optional` **current?**: `T`

Controlled active step value. Provide with `onChange`.

##### defaultCurrent?

> `optional` **defaultCurrent?**: `T`

Initial active step when uncontrolled.

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with a completed step's `value` when it is clicked.

###### Parameters

###### value

`T`

###### Returns

`void`

##### orientation?

> `optional` **orientation?**: [`StepperOrientation`](#stepperorientation)

Layout direction.

###### Default

```ts
'horizontal'
```

##### spacing?

> `optional` **spacing?**: `string` \| `number`

Gap between steps; number = rem.

##### steps

> **steps**: `ReadonlyArray`\<[`StepperItem`](#stepperitem)\<`T`\>\>

Ordered steps.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

## Functions

### Stepper()

> **Stepper**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/stepper.tsx:57

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`StepperProps`](#stepperprops)\<`T`\>

#### Returns

`Element`
