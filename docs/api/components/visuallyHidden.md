[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/visuallyHidden

# components/visuallyHidden

## Type Aliases

### VisuallyHiddenProps

> **VisuallyHiddenProps** = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: components/visuallyHidden.tsx:4

#### Type Declaration

##### as?

> `optional` **as?**: `ElementType`

Element/component to render as.

###### Default

```ts
'span'
```

##### children?

> `optional` **children?**: `ReactNode`

Content exposed to assistive tech but hidden visually.

## Functions

### VisuallyHidden()

> **VisuallyHidden**(`__namedParameters`): `Element`

Defined in: components/visuallyHidden.tsx:18

Hides content visually while keeping it available to screen readers (e.g. a
label for an icon-only control).

#### Parameters

##### \_\_namedParameters

[`VisuallyHiddenProps`](#visuallyhiddenprops)

#### Returns

`Element`

#### Example

```ts
<VisuallyHidden>Close menu</VisuallyHidden>
```
