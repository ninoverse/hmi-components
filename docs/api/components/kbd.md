[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/kbd

# components/kbd

## Type Aliases

### KbdProps

> **KbdProps** = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: components/kbd.tsx:6

#### Type Declaration

##### children

> **children**: `ReactNode`

Key label (e.g. `⌘`, `Ctrl`).

##### size?

> `optional` **size?**: [`KbdSize`](#kbdsize)

Key cap size.

###### Default

```ts
'medium'
```

***

### KbdSize

> **KbdSize** = `"small"` \| `"medium"`

Defined in: components/kbd.tsx:4

## Functions

### Kbd()

> **Kbd**(`__namedParameters`): `Element`

Defined in: components/kbd.tsx:19

Renders a keyboard key cap (`<kbd>`).

#### Parameters

##### \_\_namedParameters

[`KbdProps`](#kbdprops)

#### Returns

`Element`

#### Example

```ts
<Kbd>⌘</Kbd> <Kbd>K</Kbd>
```
