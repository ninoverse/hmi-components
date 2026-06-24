[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/tree

# components/tree

## Type Aliases

### TreeNode

> **TreeNode**\<`T`\> = `object`

Defined in: components/tree.tsx:10

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### children?

> `optional` **children?**: `ReadonlyArray`\<[`TreeNode`](#treenode)\<`T`\>\>

Defined in: components/tree.tsx:18

Child nodes; presence makes the node expandable.

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: components/tree.tsx:20

Disable selecting/focusing this node.

###### Default

```ts
false
```

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: components/tree.tsx:16

Optional leading icon.

##### label

> **label**: `ReactNode`

Defined in: components/tree.tsx:14

Visible node label.

##### value

> **value**: `T`

Defined in: components/tree.tsx:12

Unique node value, used for selection/expansion and as the key.

***

### TreeProps

> **TreeProps**\<`T`\> = `object`

Defined in: components/tree.tsx:23

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: components/tree.tsx:39

Accessible label for the tree.

###### Default

```ts
'Tree'
```

##### defaultExpanded?

> `optional` **defaultExpanded?**: `ReadonlyArray`\<`T`\>

Defined in: components/tree.tsx:29

Initially expanded node values when uncontrolled.

##### defaultSelected?

> `optional` **defaultSelected?**: `T`

Defined in: components/tree.tsx:35

Initially selected node value when uncontrolled.

##### expanded?

> `optional` **expanded?**: `ReadonlyArray`\<`T`\>

Defined in: components/tree.tsx:27

Controlled set of expanded node values. Provide with `onExpandedChange`.

##### nodes

> **nodes**: `ReadonlyArray`\<[`TreeNode`](#treenode)\<`T`\>\>

Defined in: components/tree.tsx:25

Root nodes of the tree.

##### onExpandedChange?

> `optional` **onExpandedChange?**: (`expanded`) => `void`

Defined in: components/tree.tsx:31

Fires with the new list of expanded node values.

###### Parameters

###### expanded

`T`[]

###### Returns

`void`

##### onSelect?

> `optional` **onSelect?**: (`value`) => `void`

Defined in: components/tree.tsx:37

Fires with the newly selected node value.

###### Parameters

###### value

`T`

###### Returns

`void`

##### selected?

> `optional` **selected?**: `T`

Defined in: components/tree.tsx:33

Controlled selected node value. Provide with `onSelect`.

## Functions

### Tree()

> **Tree**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/tree.tsx:97

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`TreeProps`](#treeprops)\<`T`\>

#### Returns

`Element`
