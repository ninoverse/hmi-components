[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/code

# components/code

## Type Aliases

### CodeProps

> **CodeProps** = `HTMLAttributes`\<`HTMLElement`\> & `object`

Defined in: [components/code.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/code.tsx#L4)

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

Defined in: [components/code.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/code.tsx#L18)

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
