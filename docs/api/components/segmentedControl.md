[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/segmentedControl

# components/segmentedControl

## Type Aliases

### SegmentedControlOption

> **SegmentedControlOption**\<`T`\> = `object`

Defined in: [components/segmentedControl.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L12)

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [components/segmentedControl.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L20)

Disable this segment.

###### Default

```ts
false
```

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: [components/segmentedControl.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L18)

Optional leading icon.

##### label

> **label**: `ReactNode`

Defined in: [components/segmentedControl.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L16)

Visible segment label.

##### value

> **value**: `T`

Defined in: [components/segmentedControl.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L14)

Value selected when this segment is chosen.

***

### SegmentedControlProps

> **SegmentedControlProps**\<`T`\> = `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"onChange"`\> & `object`

Defined in: [components/segmentedControl.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L23)

#### Type Declaration

##### aria-label?

> `optional` **aria-label?**: `string`

Accessible label for the group.

###### Default

```ts
'Segmented control'
```

##### defaultValue?

> `optional` **defaultValue?**: `T`

Initial selected value when uncontrolled.

##### disabled?

> `optional` **disabled?**: `boolean`

Disable the whole control.

###### Default

```ts
false
```

##### fullWidth?

> `optional` **fullWidth?**: `boolean`

Stretch segments to fill the container width.

###### Default

```ts
false
```

##### onChange?

> `optional` **onChange?**: (`value`) => `void`

Fires with the newly selected value.

###### Parameters

###### value

`T`

###### Returns

`void`

##### options

> **options**: `ReadonlyArray`\<[`SegmentedControlOption`](#segmentedcontroloption)\<`T`\>\>

Segments to render.

##### size?

> `optional` **size?**: [`SegmentedControlSize`](#segmentedcontrolsize)

Control size.

###### Default

```ts
'medium'
```

##### value?

> `optional` **value?**: `T`

Controlled selected value. Provide with `onChange`.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

***

### SegmentedControlSize

> **SegmentedControlSize** = `"small"` \| `"medium"` \| `"large"`

Defined in: [components/segmentedControl.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L10)

## Functions

### SegmentedControl()

> **SegmentedControl**\<`T`\>(`__namedParameters`): `Element`

Defined in: [components/segmentedControl.tsx:52](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/segmentedControl.tsx#L52)

Single-select control rendering options as adjacent segments, with full
keyboard (arrows/Home/End) support. Works controlled or uncontrolled.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`SegmentedControlProps`](#segmentedcontrolprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<SegmentedControl options={views} value={view} onChange={setView} />
```
