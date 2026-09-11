[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/stepper

# components/stepper

## Type Aliases

### StepperItem

> **StepperItem**\<`T`\> = `object`

Defined in: [components/stepper.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stepper.tsx#L6)

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### description?

> `optional` **description?**: `ReactNode`

Defined in: [components/stepper.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stepper.tsx#L12)

Optional secondary line under the label.

##### label

> **label**: `ReactNode`

Defined in: [components/stepper.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stepper.tsx#L10)

Step title.

##### value

> **value**: `T`

Defined in: [components/stepper.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stepper.tsx#L8)

Unique step value, emitted via `onChange` and matched against `current`.

***

### StepperOrientation

> **StepperOrientation** = `"horizontal"` \| `"vertical"`

Defined in: [components/stepper.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stepper.tsx#L4)

***

### StepperProps

> **StepperProps**\<`T`\> = `Omit`\<`HTMLAttributes`\<`HTMLOListElement`\>, `"onChange"`\> & `object`

Defined in: [components/stepper.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stepper.tsx#L15)

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

Defined in: [components/stepper.tsx:56](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/stepper.tsx#L56)

Step progress indicator. Marks steps before `current` as completed (and
clickable), the current step active, and the rest upcoming. Works controlled
or uncontrolled.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`StepperProps`](#stepperprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<Stepper steps={steps} current={step} onChange={setStep} />
```
