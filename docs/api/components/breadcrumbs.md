[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/breadcrumbs

# components/breadcrumbs

## Type Aliases

### BreadcrumbItem

> **BreadcrumbItem** = `object`

Defined in: components/breadcrumbs.tsx:4

#### Properties

##### href?

> `optional` **href?**: `string`

Defined in: components/breadcrumbs.tsx:8

Link target. Ignored on the last (current) item.

##### label

> **label**: `ReactNode`

Defined in: components/breadcrumbs.tsx:6

Visible crumb text.

##### onClick?

> `optional` **onClick?**: () => `void`

Defined in: components/breadcrumbs.tsx:10

Click handler; when set, default navigation is prevented.

###### Returns

`void`

***

### BreadcrumbsProps

> **BreadcrumbsProps** = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: components/breadcrumbs.tsx:13

#### Type Declaration

##### items

> **items**: `ReadonlyArray`\<[`BreadcrumbItem`](#breadcrumbitem)\>

Trail of crumbs; the last item is rendered as the current page.

##### separator?

> `optional` **separator?**: `ReactNode`

Separator between crumbs.

###### Default

```ts
'/'
```

## Functions

### Breadcrumbs()

> **Breadcrumbs**(`__namedParameters`): `Element`

Defined in: components/breadcrumbs.tsx:26

Navigation breadcrumb trail. The final item is marked `aria-current="page"`.

#### Parameters

##### \_\_namedParameters

[`BreadcrumbsProps`](#breadcrumbsprops)

#### Returns

`Element`

#### Example

```ts
<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />
```
