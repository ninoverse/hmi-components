[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/table

# components/table

## Type Aliases

### TableColumn

> **TableColumn**\<`T`\> = `object`

Defined in: components/table.tsx:10

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Properties

##### key

> **key**: keyof `T` & `string`

Defined in: components/table.tsx:12

Row property this column reads (also the default cell value).

##### label

> **label**: `ReactNode`

Defined in: components/table.tsx:14

Header label.

##### render?

> `optional` **render?**: (`row`) => `ReactNode`

Defined in: components/table.tsx:18

Custom cell renderer; defaults to `row[key]`.

###### Parameters

###### row

`T`

###### Returns

`ReactNode`

##### sortable?

> `optional` **sortable?**: `boolean`

Defined in: components/table.tsx:16

Allow sorting by this column; overrides the table-level `sortable`.

##### style?

> `optional` **style?**: `CSSProperties`

Defined in: components/table.tsx:20

Inline styles applied to the header and cells (e.g. width).

***

### TableProps

> **TableProps**\<`T`\> = `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"children"`\> & `object`

Defined in: components/table.tsx:23

#### Type Declaration

##### columns

> **columns**: `ReadonlyArray`\<[`TableColumn`](#tablecolumn)\<`T`\>\>

Column definitions, left to right.

##### getRowKey?

> `optional` **getRowKey?**: (`row`, `index`) => `string` \| `number`

Stable key per row; defaults to the row index.

###### Parameters

###### row

`T`

###### index

`number`

###### Returns

`string` \| `number`

##### rows

> **rows**: `ReadonlyArray`\<`T`\>

Row data.

##### sortable?

> `optional` **sortable?**: `boolean`

Enable click-to-sort headers (per-column overridable).

###### Default

```ts
true
```

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

## Functions

### Table()

> **Table**\<`T`\>(`__namedParameters`): `Element`

Defined in: components/table.tsx:70

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### \_\_namedParameters

[`TableProps`](#tableprops)\<`T`\>

#### Returns

`Element`
