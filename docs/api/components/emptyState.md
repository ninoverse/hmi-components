[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/emptyState

# components/emptyState

## Type Aliases

### EmptyStateProps

> **EmptyStateProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/emptyState.tsx:4

#### Type Declaration

##### action?

> `optional` **action?**: `ReactNode`

Call-to-action slot (e.g. a button).

##### description?

> `optional` **description?**: `ReactNode`

Supporting text under the title.

##### icon?

> `optional` **icon?**: `ReactNode`

Optional decorative illustration/icon.

##### title

> **title**: `ReactNode`

Primary heading.

## Functions

### EmptyState()

> **EmptyState**(`__namedParameters`): `Element`

Defined in: components/emptyState.tsx:23

Placeholder shown when there's no content yet — an optional icon, a title,
description and an action.

#### Parameters

##### \_\_namedParameters

[`EmptyStateProps`](#emptystateprops)

#### Returns

`Element`

#### Example

```ts
<EmptyState title="No results" description="Try another search."
    action={<Button>Reset</Button>} />
```
