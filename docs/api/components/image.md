[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/image

# components/image

## Type Aliases

### ImageFit

> **ImageFit** = `"cover"` \| `"contain"` \| `"fill"` \| `"none"` \| `"scale-down"`

Defined in: [components/image.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L11)

***

### ImageProps

> **ImageProps** = `ImageOwnProps` & `Omit`\<`ImgHTMLAttributes`\<`HTMLImageElement`\>, keyof `ImageOwnProps`\>

Defined in: [components/image.tsx:60](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L60)

***

### ImageRadius

> **ImageRadius** = `"none"` \| `"small"` \| `"medium"` \| `"large"` \| `"full"`

Defined in: [components/image.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L12)

***

### ImageSlotProps

> **ImageSlotProps** = `object`

Defined in: [components/image.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L15)

Props handed to a custom image renderer. See ImageProps.renderImage.

#### Properties

##### alt

> **alt**: `string`

Defined in: [components/image.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L17)

##### className

> **className**: `string`

Defined in: [components/image.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L18)

##### onError

> **onError**: () => `void`

Defined in: [components/image.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L20)

###### Returns

`void`

##### onLoad

> **onLoad**: () => `void`

Defined in: [components/image.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L19)

###### Returns

`void`

##### src

> **src**: `string`

Defined in: [components/image.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L16)

## Functions

### Image()

> **Image**(`__namedParameters`): `Element`

Defined in: [components/image.tsx:72](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/image.tsx#L72)

Image with loading/error states, aspect-ratio reservation, `object-fit`/
`object-position` and radius presets, a placeholder while loading, and a
fallback when the source fails. Lazy-loads by default. Pass `renderImage` to
supply an optimized image (e.g. `next/image`) inside the same styled shell.

#### Parameters

##### \_\_namedParameters

[`ImageProps`](#imageprops)

#### Returns

`Element`

#### Example

```ts
<Image src="/cover.jpg" alt="Cover" ratio={16 / 9} radius="large" />
```
