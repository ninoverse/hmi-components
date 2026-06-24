[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/divider

# components/divider

## Type Aliases

### DividerAlign

> **DividerAlign** = `"start"` \| `"center"` \| `"end"`

Defined in: components/divider.tsx:5

***

### DividerOrientation

> **DividerOrientation** = `"horizontal"` \| `"vertical"`

Defined in: components/divider.tsx:4

***

### DividerProps

> **DividerProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: components/divider.tsx:7

#### Type Declaration

##### align?

> `optional` **align?**: [`DividerAlign`](#divideralign)

Label position; only applies to a labeled horizontal divider.

###### Default

```ts
'center'
```

##### children?

> `optional` **children?**: `ReactNode`

Optional label rendered inline (horizontal only).

##### orientation?

> `optional` **orientation?**: [`DividerOrientation`](#dividerorientation)

Line direction.

###### Default

```ts
'horizontal'
```

## Functions

### Divider()

> **Divider**(`__namedParameters`): `Element`

Defined in: components/divider.tsx:24

Separator line. Renders an `<hr>` when empty, or a labeled divider when
`children` are provided (horizontal orientation only).

#### Parameters

##### \_\_namedParameters

[`DividerProps`](#dividerprops)

#### Returns

`Element`

#### Example

```ts
<Divider />
<Divider align="start">Section</Divider>
```
