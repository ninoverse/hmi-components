[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/carousel

# components/carousel

## Type Aliases

### CarouselProps

> **CarouselProps** = `object`

Defined in: [components/carousel.tsx:11](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L11)

#### Properties

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/carousel.tsx:29](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L29)

Accessible name for the carousel region.

###### Default

```ts
'Carousel'
```

##### autoPlay?

> `optional` **autoPlay?**: `number`

Defined in: [components/carousel.tsx:23](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L23)

Auto-advance interval in ms; pauses on hover/focus. Disabled when unset.

##### defaultIndex?

> `optional` **defaultIndex?**: `number`

Defined in: [components/carousel.tsx:17](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L17)

Initial slide index when uncontrolled.

###### Default

```ts
0
```

##### index?

> `optional` **index?**: `number`

Defined in: [components/carousel.tsx:15](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L15)

Controlled active slide index. Provide with `onIndexChange`.

##### loop?

> `optional` **loop?**: `boolean`

Defined in: [components/carousel.tsx:21](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L21)

Wrap around past the first/last slide.

###### Default

```ts
true
```

##### onIndexChange?

> `optional` **onIndexChange?**: (`index`) => `void`

Defined in: [components/carousel.tsx:19](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L19)

Fires with the new index whenever the active slide changes.

###### Parameters

###### index

`number`

###### Returns

`void`

##### showArrows?

> `optional` **showArrows?**: `boolean`

Defined in: [components/carousel.tsx:25](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L25)

Show prev/next arrow buttons.

###### Default

```ts
true
```

##### showDots?

> `optional` **showDots?**: `boolean`

Defined in: [components/carousel.tsx:27](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L27)

Show the dot pagination control.

###### Default

```ts
true
```

##### slides

> **slides**: `ReadonlyArray`\<`ReactNode`\>

Defined in: [components/carousel.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L13)

Slide content, in order.

## Functions

### Carousel()

> **Carousel**(`__namedParameters`): `Element` \| `null`

Defined in: [components/carousel.tsx:54](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/carousel.tsx#L54)

Sliding content carousel with optional arrows, dot pagination, looping,
autoplay and keyboard (←/→) support. Works controlled or uncontrolled.

#### Parameters

##### \_\_namedParameters

[`CarouselProps`](#carouselprops)

#### Returns

`Element` \| `null`

#### Example

```ts
<Carousel slides={[<Slide1 />, <Slide2 />]} autoPlay={4000} />
```
