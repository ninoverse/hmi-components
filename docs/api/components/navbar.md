[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/navbar

# components/navbar

## Type Aliases

### NavbarLink

> **NavbarLink**\<`T`\> = `object`

Defined in: [components/navbar.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/navbar.tsx#L4)

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Properties

##### href?

> `optional` **href?**: `string`

Defined in: [components/navbar.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/navbar.tsx#L10)

Link target; when omitted, navigation is handled via `onNav` only.

##### label

> **label**: `ReactNode`

Defined in: [components/navbar.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/navbar.tsx#L8)

Visible link text.

##### value

> **value**: `T`

Defined in: [components/navbar.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/navbar.tsx#L6)

Unique link value, emitted via `onNav` and matched against `current`.

***

### NavbarProps

> **NavbarProps**\<`T`\> = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: [components/navbar.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/navbar.tsx#L13)

#### Type Declaration

##### brand?

> `optional` **brand?**: `ReactNode`

Brand slot; a string renders a generated monogram + label.

##### current?

> `optional` **current?**: `T`

Value of the active link, marked `aria-current="page"`.

##### links?

> `optional` **links?**: `ReadonlyArray`\<[`NavbarLink`](#navbarlink)\<`T`\>\>

Navigation links shown in the (collapsible) menu.

##### onNav?

> `optional` **onNav?**: (`value`) => `void`

Fires with a link's `value` when it is activated.

###### Parameters

###### value

`T`

###### Returns

`void`

##### right?

> `optional` **right?**: `ReactNode`

Trailing slot (e.g. a CTA button or account menu).

#### Type Parameters

##### T

`T` *extends* `string` = `string`

## Functions

### Navbar()

> **Navbar**\<`T`\>(`__namedParameters`): `Element`

Defined in: [components/navbar.tsx:62](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/navbar.tsx#L62)

Responsive top navigation bar with a brand, links, an active state and a
trailing slot. Collapses behind a menu toggle on narrow viewports.

#### Type Parameters

##### T

`T` *extends* `string` = `string`

#### Parameters

##### \_\_namedParameters

[`NavbarProps`](#navbarprops)\<`T`\>

#### Returns

`Element`

#### Example

```ts
<Navbar brand="Ninoverse" links={links} current={tab} onNav={setTab} />
```
