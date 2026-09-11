[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/scrollArea

# components/scrollArea

## Type Aliases

### ScrollAreaOrientation

> **ScrollAreaOrientation** = `"vertical"` \| `"horizontal"` \| `"both"`

Defined in: [components/scrollArea.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/scrollArea.tsx#L4)

***

### ScrollAreaProps

> **ScrollAreaProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/scrollArea.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/scrollArea.tsx#L6)

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

Defined in: [components/scrollArea.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/scrollArea.tsx#L21)

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
