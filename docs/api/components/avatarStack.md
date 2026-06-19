[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/avatarStack

# components/avatarStack

## Type Aliases

### AvatarStackProps

> **AvatarStackProps** = `HTMLAttributes`\<`HTMLSpanElement`\> & `object`

Defined in: components/avatarStack.tsx:5

#### Type Declaration

##### max?

> `optional` **max?**: `number`

Maximum avatars shown before collapsing the rest into a `+N` chip.

###### Default

```ts
4
```

##### names

> **names**: `ReadonlyArray`\<`string`\>

Names to render as overlapping avatars, in display order.

##### size?

> `optional` **size?**: [`AvatarSize`](avatar.md#avatarsize)

Diameter preset applied to every avatar.

###### Default

```ts
'medium'
```

## Functions

### AvatarStack()

> **AvatarStack**(`__namedParameters`): `Element`

Defined in: components/avatarStack.tsx:21

Overlapping row of [Avatar](avatar.md#avatar)s, collapsing any beyond `max` into a
trailing `+N` overflow badge.

#### Parameters

##### \_\_namedParameters

[`AvatarStackProps`](#avatarstackprops)

#### Returns

`Element`

#### Example

```ts
<AvatarStack names={['Ada', 'Alan', 'Grace', 'Linus', 'Edsger']} max={3} />
```
