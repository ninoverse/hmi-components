[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/commandPalette

# components/commandPalette

## Type Aliases

### CommandPaletteCommand

> **CommandPaletteCommand** = `object`

Defined in: components/commandPalette.tsx:17

#### Properties

##### description?

> `optional` **description?**: `string`

Defined in: components/commandPalette.tsx:23

Optional secondary line, also matched while searching.

##### group?

> `optional` **group?**: `string`

Defined in: components/commandPalette.tsx:29

Group heading this command is listed under.

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: components/commandPalette.tsx:25

Optional leading icon.

##### id

> **id**: `string`

Defined in: components/commandPalette.tsx:19

Stable id, emitted via `onAction` and used as the React key.

##### keywords?

> `optional` **keywords?**: `ReadonlyArray`\<`string`\>

Defined in: components/commandPalette.tsx:31

Extra terms matched while searching, beyond label/description.

##### label

> **label**: `string`

Defined in: components/commandPalette.tsx:21

Primary command text, shown and matched while searching.

##### onSelect?

> `optional` **onSelect?**: () => `void`

Defined in: components/commandPalette.tsx:33

Handler run when the command is chosen.

###### Returns

`void`

##### shortcut?

> `optional` **shortcut?**: `ReactNode`

Defined in: components/commandPalette.tsx:27

Trailing hint (e.g. a keyboard shortcut).

***

### CommandPaletteProps

> **CommandPaletteProps** = `object`

Defined in: components/commandPalette.tsx:36

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/commandPalette.tsx:52

Accessible label for the dialog.

###### Default

```ts
'Command palette'
```

##### commands

> **commands**: `ReadonlyArray`\<[`CommandPaletteCommand`](#commandpalettecommand)\>

Defined in: components/commandPalette.tsx:42

Commands to list and search.

##### emptyMessage?

> `optional` **emptyMessage?**: `ReactNode`

Defined in: components/commandPalette.tsx:46

Content shown when no command matches.

###### Default

```ts
'No matches'
```

##### onAction?

> `optional` **onAction?**: (`value`) => `void`

Defined in: components/commandPalette.tsx:50

Fired with the chosen command's `id` when a command is committed. The
serializable counterpart to a per-command `onSelect`, so the selection
survives the Web Component boundary.

###### Parameters

###### value

`string`

###### Returns

`void`

##### onOpenChange

> **onOpenChange**: (`open`) => `void`

Defined in: components/commandPalette.tsx:40

Called to request an open/close state change (Escape, backdrop, select).

###### Parameters

###### open

`boolean`

###### Returns

`void`

##### open

> **open**: `boolean`

Defined in: components/commandPalette.tsx:38

Whether the palette is open.

##### placeholder?

> `optional` **placeholder?**: `string`

Defined in: components/commandPalette.tsx:44

Search input placeholder.

###### Default

```ts
'Type a command or search…'
```

## Functions

### CommandPalette()

> **CommandPalette**(`__namedParameters`): `ReactPortal` \| `null`

Defined in: components/commandPalette.tsx:75

Modal command/search palette with grouped results, type-ahead filtering,
keyboard navigation and animated enter/exit. Render it always and drive
visibility via `open`/`onOpenChange`.

#### Parameters

##### \_\_namedParameters

[`CommandPaletteProps`](#commandpaletteprops)

#### Returns

`ReactPortal` \| `null`

#### Example

```ts
<CommandPalette open={open} onOpenChange={setOpen} commands={commands} />
```
