[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/searchInput

# components/searchInput

## Type Aliases

### SearchInputProps

> **SearchInputProps** = `Omit`\<[`InputProps`](input.md#inputprops), `"leftIcon"` \| `"type"`\>

Defined in: [components/searchInput.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/searchInput.tsx#L4)

Same as [InputProps](input.md#inputprops), minus `leftIcon` and `type` (set internally).

## Functions

### SearchInput()

> **SearchInput**(`__namedParameters`): `Element`

Defined in: [components/searchInput.tsx:28](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/searchInput.tsx#L28)

[Input](input.md#input) preconfigured for search, with a leading search icon and
`type="search"`.

#### Parameters

##### \_\_namedParameters

[`SearchInputProps`](#searchinputprops)

#### Returns

`Element`

#### Example

```ts
<SearchInput value={q} onChange={setQ} />
```
