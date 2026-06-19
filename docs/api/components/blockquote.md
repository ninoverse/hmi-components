[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/blockquote

# components/blockquote

## Type Aliases

### BlockquoteProps

> **BlockquoteProps** = `Omit`\<`BlockquoteHTMLAttributes`\<`HTMLQuoteElement`\>, `"cite"`\> & `object`

Defined in: components/blockquote.tsx:4

#### Type Declaration

##### children?

> `optional` **children?**: `ReactNode`

Quotation body.

##### cite?

> `optional` **cite?**: `ReactNode`

Attribution shown in the quote footer.

## Functions

### Blockquote()

> **Blockquote**(`__namedParameters`): `Element`

Defined in: components/blockquote.tsx:20

Styled block quotation with an optional citation footer.

#### Parameters

##### \_\_namedParameters

[`BlockquoteProps`](#blockquoteprops)

#### Returns

`Element`

#### Example

```ts
<Blockquote cite="Ada Lovelace">That brain of mine is something more than mortal.</Blockquote>
```
