[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/link

# components/link

## Type Aliases

### LinkProps

> **LinkProps** = `AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: components/link.tsx:7

#### Type Declaration

##### children?

> `optional` **children?**: `ReactNode`

Link content.

##### tone?

> `optional` **tone?**: [`LinkTone`](#linktone)

Colour tone.

###### Default

```ts
'primary'
```

##### underline?

> `optional` **underline?**: [`LinkUnderline`](#linkunderline)

When to show the underline.

###### Default

```ts
'always'
```

***

### LinkTone

> **LinkTone** = `"primary"` \| `"muted"`

Defined in: components/link.tsx:5

***

### LinkUnderline

> **LinkUnderline** = `"always"` \| `"hover"` \| `"none"`

Defined in: components/link.tsx:4

## Functions

### Link()

> **Link**(`__namedParameters`): `Element`

Defined in: components/link.tsx:23

Styled anchor. Automatically adds `rel="noopener noreferrer"` for
`target="_blank"` links to prevent reverse-tabnabbing.

#### Parameters

##### \_\_namedParameters

[`LinkProps`](#linkprops)

#### Returns

`Element`

#### Example

```ts
<Link href="/docs" underline="hover">Docs</Link>
```
