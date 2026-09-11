[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/switch

# components/switch

## Type Aliases

### SwitchProps

> **SwitchProps** = `Omit`\<`ComponentPropsWithRef`\<`"input"`\>, `"type"` \| `"checked"` \| `"defaultChecked"` \| `"onChange"`\> & `object`

Defined in: [components/switch.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/switch.tsx#L4)

#### Type Declaration

##### checked?

> `optional` **checked?**: `boolean`

Controlled on/off state. Provide with `onChange`.

##### defaultChecked?

> `optional` **defaultChecked?**: `boolean`

Initial state when uncontrolled.

##### label?

> `optional` **label?**: `ReactNode`

Text shown beside the switch.

##### onChange?

> `optional` **onChange?**: (`checked`) => `void`

Fires with the new on/off state on toggle.

###### Parameters

###### checked

`boolean`

###### Returns

`void`

## Functions

### Switch()

> **Switch**(`__namedParameters`): `Element`

Defined in: [components/switch.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/switch.tsx#L25)

Labelled on/off toggle. Forwards native checkbox `<input>` props; `onChange`
is simplified to receive the boolean state.

#### Parameters

##### \_\_namedParameters

[`SwitchProps`](#switchprops)

#### Returns

`Element`

#### Example

```ts
<Switch label="Notifications" checked={on} onChange={setOn} />
```
