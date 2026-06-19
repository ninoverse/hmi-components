[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/chip

# components/chip

## Type Aliases

### ChipProps

> **ChipProps** = `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"onSelect"`\> & `object`

Defined in: components/chip.tsx:4

#### Type Declaration

##### icon?

> `optional` **icon?**: `ReactNode`

Optional leading icon.

##### onClose?

> `optional` **onClose?**: () => `void`

When set, renders a trailing remove button calling this on click.

###### Returns

`void`

##### onSelect?

> `optional` **onSelect?**: () => `void`

When set, the chip becomes a toggle button calling this on click.

###### Returns

`void`

##### selected?

> `optional` **selected?**: `boolean`

Selected (pressed) state.

###### Default

```ts
false
```

## Functions

### Chip()

> **Chip**(`__namedParameters`): `Element`

Defined in: components/chip.tsx:36

Compact tag/filter element. Becomes an interactive toggle when `onSelect` is
set, and gains a remove button when `onClose` is set.

#### Parameters

##### \_\_namedParameters

[`ChipProps`](#chipprops)

#### Returns

`Element`

#### Example

```ts
<Chip selected onSelect={toggle} onClose={remove}>Filter</Chip>
```
