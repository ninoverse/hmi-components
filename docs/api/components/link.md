[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/link

# components/link

## Type Aliases

### LinkProps

> **LinkProps** = `AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: [components/link.tsx:7](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/link.tsx#L7)

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

Defined in: [components/link.tsx:5](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/link.tsx#L5)

***

### LinkUnderline

> **LinkUnderline** = `"always"` \| `"hover"` \| `"none"`

Defined in: [components/link.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/link.tsx#L4)

## Functions

### Link()

> **Link**(`__namedParameters`): `Element`

Defined in: [components/link.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/link.tsx#L23)

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
