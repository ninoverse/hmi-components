[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/table

# components/table

## Type Aliases

### TableColumn

> **TableColumn**\<`T`\> = `object`

Defined in: [components/table.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L11)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Properties

##### format?

> `optional` **format?**: `string`

Defined in: [components/table.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L25)

Declarative cell formatter for web-component consumers (where `render`
cannot survive JSON serialization). A `{token}` template resolved against
the row, with `{value}` aliased to this column's cell value.

##### key

> **key**: keyof `T` & `string`

Defined in: [components/table.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L13)

Row property this column reads (also the default cell value).

##### label

> **label**: `ReactNode`

Defined in: [components/table.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L15)

Header label.

##### render?

> `optional` **render?**: (`row`) => `ReactNode`

Defined in: [components/table.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L19)

Custom cell renderer; defaults to `row[key]`.

###### Parameters

###### row

`T`

###### Returns

`ReactNode`

##### sortable?

> `optional` **sortable?**: `boolean`

Defined in: [components/table.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L17)

Allow sorting by this column; overrides the table-level `sortable`.

##### style?

> `optional` **style?**: `CSSProperties`

Defined in: [components/table.tsx:27](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L27)

Inline styles applied to the header and cells (e.g. width).

***

### TableProps

> **TableProps**\<`T`\> = `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"children"`\> & `object`

Defined in: [components/table.tsx:30](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L30)

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

Defined in: [components/table.tsx:76](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/table.tsx#L76)

Data table with optional client-side click-to-sort columns and custom cell
renderers. Column keys are type-checked against the row shape `T`.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### \_\_namedParameters

[`TableProps`](#tableprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<Table columns={columns} rows={rows} getRowKey={(r) => r.id} />
```
