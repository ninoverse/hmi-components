[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/avatar

# components/avatar

## Type Aliases

### AvatarProps

> **AvatarProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: components/avatar.tsx:8

#### Type Declaration

##### name

> **name**: `string`

Person's name — used for the alt text, initials and deterministic colour.

##### size?

> `optional` **size?**: [`AvatarSize`](#avatarsize)

Diameter preset.

###### Default

```ts
'medium'
```

##### src?

> `optional` **src?**: `string`

Image URL. When omitted, colour-hashed initials are shown instead.

##### status?

> `optional` **status?**: [`AvatarStatus`](#avatarstatus)

Optional presence indicator dot.

***

### AvatarSize

> **AvatarSize** = `"small"` \| `"medium"` \| `"large"` \| `"xlarge"`

Defined in: components/avatar.tsx:4

***

### AvatarStatus

> **AvatarStatus** = `"online"` \| `"away"` \| `"offline"`

Defined in: components/avatar.tsx:6

## Functions

### Avatar()

> **Avatar**(`__namedParameters`): `Element`

Defined in: components/avatar.tsx:51

User avatar showing an image, or colour-hashed initials derived from `name`
when no `src` is given, with an optional presence dot.

#### Parameters

##### \_\_namedParameters

[`AvatarProps`](#avatarprops)

#### Returns

`Element`

#### Example

```ts
<Avatar name="Ada Lovelace" status="online" />
```
