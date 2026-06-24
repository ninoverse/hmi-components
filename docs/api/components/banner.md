[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/banner

# components/banner

## Type Aliases

### BannerProps

> **BannerProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/banner.tsx:6

#### Type Declaration

##### action?

> `optional` **action?**: `ReactNode`

Trailing slot for an action (e.g. a button).

##### dismissLabel?

> `optional` **dismissLabel?**: `string`

Accessible label for the dismiss button.

###### Default

```ts
'Dismiss'
```

##### icon?

> `optional` **icon?**: `ReactNode`

Custom leading icon, overriding the variant default.

##### onDismiss?

> `optional` **onDismiss?**: () => `void`

When provided, renders a dismiss button that calls this on click.

###### Returns

`void`

##### title?

> `optional` **title?**: `ReactNode`

Optional bold heading above the message.

##### variant?

> `optional` **variant?**: [`BannerVariant`](#bannervariant)

Tone, which sets the default icon and ARIA role.

###### Default

```ts
'info'
```

***

### BannerVariant

> **BannerVariant** = `"info"` \| `"success"` \| `"warning"` \| `"danger"`

Defined in: components/banner.tsx:4

## Functions

### Banner()

> **Banner**(`__namedParameters`): `Element`

Defined in: components/banner.tsx:99

Page-level status banner with a variant icon, optional title/action and an
optional dismiss button. `danger`/`warning` use `role="alert"`, others
`role="status"`. The body is passed as `children`.

#### Parameters

##### \_\_namedParameters

[`BannerProps`](#bannerprops)

#### Returns

`Element`

#### Example

```ts
<Banner variant="success" title="Saved" onDismiss={hide}>All set.</Banner>
```
