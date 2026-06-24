[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/modal

# components/modal

## Type Aliases

### DialogAction

> **DialogAction** = `object`

Defined in: components/modal.tsx:18

A serializable dialog action, rendered as a Button. Crosses the Web
Component boundary as plain JSON, unlike a JSX action node.

#### Properties

##### label

> **label**: `string`

Defined in: components/modal.tsx:20

Button text.

##### value

> **value**: `string`

Defined in: components/modal.tsx:22

Value passed to `onAction` when the button is clicked.

##### variant?

> `optional` **variant?**: `"primary"` \| `"secondary"` \| `"danger"`

Defined in: components/modal.tsx:24

Button variant.

###### Default

```ts
'secondary'
```

***

### ModalProps

> **ModalProps** = `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"title"`\> & `object`

Defined in: components/modal.tsx:59

#### Type Declaration

##### actions?

> `optional` **actions?**: `ReactNode` \| [`DialogAction`](#dialogaction)[]

Footer actions: arbitrary nodes, or a serializable `DialogAction[]`.

##### description?

> `optional` **description?**: `ReactNode`

Supporting text under the title, wired up as the accessible description.

##### onAction?

> `optional` **onAction?**: (`value`) => `void`

Fires with a `DialogAction.value` when a declarative action is chosen.

###### Parameters

###### value

`string`

###### Returns

`void`

##### onClose

> **onClose**: () => `void`

Called on Escape or backdrop click.

###### Returns

`void`

##### open

> **open**: `boolean`

Whether the modal is open.

##### size?

> `optional` **size?**: [`ModalSize`](#modalsize)

Width preset.

###### Default

```ts
'medium'
```

##### title?

> `optional` **title?**: `ReactNode`

Heading, wired up as the dialog's accessible name.

***

### ModalSize

> **ModalSize** = `"medium"` \| `"large"`

Defined in: components/modal.tsx:14

## Functions

### Modal()

> **Modal**(`__namedParameters`): `ReactPortal` \| `null`

Defined in: components/modal.tsx:83

Accessible modal dialog rendered in a portal, with scrim, focus management,
Escape/backdrop close and an optional title/description/footer actions.

#### Parameters

##### \_\_namedParameters

[`ModalProps`](#modalprops)

#### Returns

`ReactPortal` \| `null`

#### Example

```ts
<Modal open={open} onClose={close} title="Edit" actions={[{ label: 'Save', value: 'save', variant: 'primary' }]} onAction={onAction}>…</Modal>
```

***

### renderDialogActions()

> **renderDialogActions**(`actions`, `onAction?`): `ReactNode`

Defined in: components/modal.tsx:41

Render the `actions` prop: a serializable DialogAction[] becomes Buttons
that emit `onAction(value)`; any ReactNode is returned untouched so the
existing JSX API keeps working.

#### Parameters

##### actions

`ReactNode` \| [`DialogAction`](#dialogaction)[]

##### onAction?

(`value`) => `void`

#### Returns

`ReactNode`
