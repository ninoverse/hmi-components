[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/code

# components/code

## Type Aliases

### CodeProps

> **CodeProps** = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: components/code.tsx:4

#### Type Declaration

##### block?

> `optional` **block?**: `boolean`

Render as a block (`<pre><code>`) instead of inline `<code>`.

###### Default

```ts
false
```

##### children?

> `optional` **children?**: `ReactNode`

Code content.

## Functions

### Code()

> **Code**(`__namedParameters`): `Element`

Defined in: components/code.tsx:18

Monospace code display, inline by default or as a block when `block` is set.

#### Parameters

##### \_\_namedParameters

[`CodeProps`](#codeprops)

#### Returns

`Element`

#### Example

```ts
<Code>npm i</Code>
<Code block>{`const x = 1;`}</Code>
```
