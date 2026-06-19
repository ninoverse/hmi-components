[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/searchInput

# components/searchInput

## Type Aliases

### SearchInputProps

> **SearchInputProps** = `Omit`\<[`InputProps`](input.md#inputprops), `"leftIcon"` \| `"type"`\>

Defined in: components/searchInput.tsx:4

Same as [InputProps](input.md#inputprops), minus `leftIcon` and `type` (set internally).

## Functions

### SearchInput()

> **SearchInput**(`__namedParameters`): `Element`

Defined in: components/searchInput.tsx:28

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
