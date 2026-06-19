[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/image

# components/image

## Type Aliases

### ImageFit

> **ImageFit** = `"cover"` \| `"contain"` \| `"fill"` \| `"none"` \| `"scale-down"`

Defined in: components/image.tsx:9

***

### ImageProps

> **ImageProps** = `ImageOwnProps` & `Omit`\<`ImgHTMLAttributes`\<`HTMLImageElement`\>, keyof `ImageOwnProps`\>

Defined in: components/image.tsx:31

***

### ImageRadius

> **ImageRadius** = `"none"` \| `"small"` \| `"medium"` \| `"large"` \| `"full"`

Defined in: components/image.tsx:10

## Functions

### Image()

> **Image**(`__namedParameters`): `Element`

Defined in: components/image.tsx:41

Image with loading/error states, aspect-ratio reservation, `object-fit` and
radius presets, and a fallback when the source fails. Lazy-loads by default.

#### Parameters

##### \_\_namedParameters

[`ImageProps`](#imageprops)

#### Returns

`Element`

#### Example

```ts
<Image src="/cover.jpg" alt="Cover" ratio={16 / 9} radius="large" />
```
