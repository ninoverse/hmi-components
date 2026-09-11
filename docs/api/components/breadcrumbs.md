[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/breadcrumbs

# components/breadcrumbs

## Type Aliases

### BreadcrumbItem

> **BreadcrumbItem** = `object`

Defined in: [components/breadcrumbs.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/breadcrumbs.tsx#L4)

#### Properties

##### href?

> `optional` **href?**: `string`

Defined in: [components/breadcrumbs.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/breadcrumbs.tsx#L8)

Link target. Ignored on the last (current) item.

##### label

> **label**: `ReactNode`

Defined in: [components/breadcrumbs.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/breadcrumbs.tsx#L6)

Visible crumb text.

##### onClick?

> `optional` **onClick?**: () => `void`

Defined in: [components/breadcrumbs.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/breadcrumbs.tsx#L10)

Click handler; when set, default navigation is prevented.

###### Returns

`void`

***

### BreadcrumbsProps

> **BreadcrumbsProps** = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: [components/breadcrumbs.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/breadcrumbs.tsx#L13)

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

Defined in: [components/breadcrumbs.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/breadcrumbs.tsx#L26)

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
