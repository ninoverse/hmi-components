[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/toast

# components/toast

## Type Aliases

### ToastOptions

> **ToastOptions** = `object`

Defined in: components/toast.tsx:7

#### Properties

##### body?

> `optional` **body?**: `ReactNode`

Defined in: components/toast.tsx:13

Secondary message line.

##### duration?

> `optional` **duration?**: `number`

Defined in: components/toast.tsx:15

Auto-dismiss after this many milliseconds. 0 disables auto-dismiss.

###### Default

```ts
4000
```

##### title?

> `optional` **title?**: `ReactNode`

Defined in: components/toast.tsx:11

Bold heading line.

##### variant?

> `optional` **variant?**: [`ToastVariant`](#toastvariant)

Defined in: components/toast.tsx:9

Tone, which selects the icon and colour.

###### Default

```ts
'info'
```

***

### ToastVariant

> **ToastVariant** = `"info"` \| `"success"` \| `"warning"` \| `"danger"`

Defined in: components/toast.tsx:5

## Variables

### toast

> `const` **toast**: `object`

Defined in: components/toast.tsx:83

Imperative toast API. Call `toast.show(...)` (or the `info`/`success`/
`warning`/`danger` shortcuts) from anywhere to enqueue a toast; render a
single [ToastHost](#toasthost) once near your app root to display them.

#### Type Declaration

##### danger

> **danger**: (`title`, `body?`, `opts?`) => `number`

###### Parameters

###### title

`ReactNode`

###### body?

`ReactNode`

###### opts?

`ShortcutOptions`

###### Returns

`number`

##### dismiss

> **dismiss**: (`id`) => `void`

###### Parameters

###### id

`number`

###### Returns

`void`

##### info

> **info**: (`title`, `body?`, `opts?`) => `number`

###### Parameters

###### title

`ReactNode`

###### body?

`ReactNode`

###### opts?

`ShortcutOptions`

###### Returns

`number`

##### show

> **show**: (`opts`) => `number`

###### Parameters

###### opts

[`ToastOptions`](#toastoptions)

###### Returns

`number`

##### success

> **success**: (`title`, `body?`, `opts?`) => `number`

###### Parameters

###### title

`ReactNode`

###### body?

`ReactNode`

###### opts?

`ShortcutOptions`

###### Returns

`number`

##### warning

> **warning**: (`title`, `body?`, `opts?`) => `number`

###### Parameters

###### title

`ReactNode`

###### body?

`ReactNode`

###### opts?

`ShortcutOptions`

###### Returns

`number`

#### Example

```ts
toast.success('Saved', 'Your changes are live.');
const id = toast.show({ variant: 'info', title: 'Working…', duration: 0 });
toast.dismiss(id);
```

## Functions

### ToastHost()

> **ToastHost**(): `ReactPortal` \| `null`

Defined in: components/toast.tsx:187

Renders queued toasts in a portal. Mount exactly once near your app root;
trigger toasts via the [toast](#toast) API.

#### Returns

`ReactPortal` \| `null`

#### Example

```ts
<ToastHost />
```
