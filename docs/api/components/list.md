[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/list

# components/list

## Type Aliases

### ListItem

> **ListItem** = `object`

Defined in: [components/list.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L10)

#### Properties

##### avatar?

> `optional` **avatar?**: `string`

Defined in: [components/list.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L18)

Name used to render a leading [Avatar](avatar.md#avatar) in the default row.

##### id

> **id**: `string` \| `number`

Defined in: [components/list.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L12)

Stable identity, used as the React key.

##### right?

> `optional` **right?**: `ReactNode`

Defined in: [components/list.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L20)

Trailing slot (e.g. an action or value).

##### subtitle?

> `optional` **subtitle?**: `ReactNode`

Defined in: [components/list.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L16)

Secondary line under the title.

##### title?

> `optional` **title?**: `ReactNode`

Defined in: [components/list.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L14)

Primary line.

***

### ListProps

> **ListProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/list.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L23)

#### Type Declaration

##### draggable?

> `optional` **draggable?**: `boolean`

Enable drag-and-drop reordering.

###### Default

```ts
false
```

##### items

> **items**: `ReadonlyArray`\<[`ListItem`](#listitem)\>

Rows to render.

##### onReorder?

> `optional` **onReorder?**: (`items`) => `void`

Fires with the reordered items after a drag-drop.

###### Parameters

###### items

[`ListItem`](#listitem)[]

###### Returns

`void`

##### renderItem?

> `optional` **renderItem?**: (`item`, `index`) => `ReactNode`

Custom row renderer, replacing the default avatar/title/subtitle layout.

###### Parameters

###### item

[`ListItem`](#listitem)

###### index

`number`

###### Returns

`ReactNode`

## Functions

### List()

> **List**(`__namedParameters`): `Element`

Defined in: [components/list.tsx:53](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/list.tsx#L53)

Vertical list of rows with an optional avatar, title/subtitle and trailing
slot. Supports drag-and-drop reordering and a custom row renderer.

#### Parameters

##### \_\_namedParameters

[`ListProps`](#listprops)

#### Returns

`Element`

#### Example

```ts
<List items={items} draggable onReorder={setItems} />
```
