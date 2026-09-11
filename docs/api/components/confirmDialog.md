[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/confirmDialog

# components/confirmDialog

## Type Aliases

### ConfirmDialogProps

> **ConfirmDialogProps** = `object`

Defined in: [components/confirmDialog.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L7)

#### Properties

##### cancelLabel?

> `optional` **cancelLabel?**: `ReactNode`

Defined in: [components/confirmDialog.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L21)

Cancel button label.

###### Default

```ts
'Cancel'
```

##### confirmDisabled?

> `optional` **confirmDisabled?**: `boolean`

Defined in: [components/confirmDialog.tsx:27](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L27)

Disable only the confirm button (e.g. failed validation).

###### Default

```ts
false
```

##### confirmLabel?

> `optional` **confirmLabel?**: `ReactNode`

Defined in: [components/confirmDialog.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L19)

Confirm button label.

###### Default

```ts
'Confirm'
```

##### description?

> `optional` **description?**: `ReactNode`

Defined in: [components/confirmDialog.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L17)

Optional supporting text under the title.

##### loading?

> `optional` **loading?**: `boolean`

Defined in: [components/confirmDialog.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L25)

Disable both buttons while an action is in flight.

###### Default

```ts
false
```

##### onCancel

> **onCancel**: () => `void`

Defined in: [components/confirmDialog.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L11)

Called on cancel, backdrop/escape close.

###### Returns

`void`

##### onConfirm

> **onConfirm**: () => `void`

Defined in: [components/confirmDialog.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L13)

Called when the confirm button (or Enter) is activated.

###### Returns

`void`

##### open

> **open**: `boolean`

Defined in: [components/confirmDialog.tsx:9](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L9)

Whether the dialog is shown.

##### title

> **title**: `ReactNode`

Defined in: [components/confirmDialog.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L15)

Dialog heading.

##### variant?

> `optional` **variant?**: [`ConfirmDialogVariant`](#confirmdialogvariant)

Defined in: [components/confirmDialog.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L23)

`danger` styles the confirm button as destructive.

###### Default

```ts
'default'
```

***

### ConfirmDialogVariant

> **ConfirmDialogVariant** = `"default"` \| `"danger"`

Defined in: [components/confirmDialog.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L5)

## Functions

### ConfirmDialog()

> **ConfirmDialog**(`__namedParameters`): `Element` \| `null`

Defined in: [components/confirmDialog.tsx:38](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/confirmDialog.tsx#L38)

Confirmation dialog built on [Modal](modal.md#modal) with cancel/confirm buttons and
Enter-to-confirm. Use for destructive or irreversible actions.

#### Parameters

##### \_\_namedParameters

[`ConfirmDialogProps`](#confirmdialogprops)

#### Returns

`Element` \| `null`

#### Example

```ts
<ConfirmDialog open={open} title="Delete?" variant="danger"
    onCancel={close} onConfirm={remove} />
```
