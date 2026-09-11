[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/pagination

# components/pagination

## Type Aliases

### PaginationProps

> **PaginationProps** = `Omit`\<`HTMLAttributes`\<`HTMLElement`\>, `"onChange"`\> & `object`

Defined in: [components/pagination.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/pagination.tsx#L4)

#### Type Declaration

##### onChange

> **onChange**: (`page`) => `void`

Fires with the requested 1-based page number.

###### Parameters

###### page

`number`

###### Returns

`void`

##### page

> **page**: `number`

Current 1-based page.

##### total

> **total**: `number`

Total number of pages.

## Functions

### Pagination()

> **Pagination**(`__namedParameters`): `Element`

Defined in: [components/pagination.tsx:71](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/pagination.tsx#L71)

Page navigation with prev/next buttons and truncated page numbers (ellipses
for large ranges). Controlled via `page`/`onChange`.

#### Parameters

##### \_\_namedParameters

[`PaginationProps`](#paginationprops)

#### Returns

`Element`

#### Example

```ts
<Pagination page={page} total={20} onChange={setPage} />
```
