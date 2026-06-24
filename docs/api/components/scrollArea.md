[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/scrollArea

# components/scrollArea

## Type Aliases

### ScrollAreaOrientation

> **ScrollAreaOrientation** = `"vertical"` \| `"horizontal"` \| `"both"`

Defined in: components/scrollArea.tsx:4

***

### ScrollAreaProps

> **ScrollAreaProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/scrollArea.tsx:6

#### Type Declaration

##### children?

> `optional` **children?**: `ReactNode`

Scrollable content.

##### maxHeight?

> `optional` **maxHeight?**: `number` \| `string`

Cap the height so content scrolls past it; number = px.

##### orientation?

> `optional` **orientation?**: [`ScrollAreaOrientation`](#scrollareaorientation)

Scroll axis to enable.

###### Default

```ts
'vertical'
```

## Functions

### ScrollArea()

> **ScrollArea**(`__namedParameters`): `Element`

Defined in: components/scrollArea.tsx:21

Scrollable container with themed custom scrollbars on the chosen axis.

#### Parameters

##### \_\_namedParameters

[`ScrollAreaProps`](#scrollareaprops)

#### Returns

`Element`

#### Example

```ts
<ScrollArea maxHeight={240}>…</ScrollArea>
```
