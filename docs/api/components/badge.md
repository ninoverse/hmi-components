[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/badge

# components/badge

## Type Aliases

### BadgeProps

> **BadgeProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: components/badge.tsx:12

#### Type Declaration

##### children?

> `optional` **children?**: `ReactNode`

Badge label content.

##### dot?

> `optional` **dot?**: `boolean`

Show a small leading status dot.

###### Default

```ts
false
```

##### variant?

> `optional` **variant?**: [`BadgeVariant`](#badgevariant)

Color/tone of the badge.

###### Default

```ts
'default'
```

***

### BadgeVariant

> **BadgeVariant** = `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"danger"` \| `"info"`

Defined in: components/badge.tsx:4

## Functions

### Badge()

> **Badge**(`__namedParameters`): `Element`

Defined in: components/badge.tsx:27

Compact status label, optionally with a leading status dot.

#### Parameters

##### \_\_namedParameters

[`BadgeProps`](#badgeprops)

#### Returns

`Element`

#### Example

```ts
<Badge variant="success" dot>Online</Badge>
```
