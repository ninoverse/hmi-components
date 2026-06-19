[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/button

# components/button

## Type Aliases

### ButtonProps

> **ButtonProps** = `ComponentPropsWithRef`\<`"button"`\> & `object`

Defined in: components/button.tsx:14

#### Type Declaration

##### asIcon?

> `optional` **asIcon?**: `boolean`

Render as a square, icon-only button (drops horizontal padding).

###### Default

```ts
false
```

##### leftIcon?

> `optional` **leftIcon?**: `ReactNode`

Element rendered before the label (e.g. an icon).

##### rightIcon?

> `optional` **rightIcon?**: `ReactNode`

Element rendered after the label (e.g. an icon).

##### size?

> `optional` **size?**: [`ButtonSize`](#buttonsize)

Control height — `1rem = 8px`.

###### Default

```ts
'medium'
```

##### variant?

> `optional` **variant?**: [`ButtonVariant`](#buttonvariant)

Visual style of the button.

###### Default

```ts
'primary'
```

***

### ButtonSize

> **ButtonSize** = `"small"` \| `"medium"` \| `"large"`

Defined in: components/button.tsx:12

***

### ButtonVariant

> **ButtonVariant** = `"primary"` \| `"secondary"` \| `"ghost"` \| `"soft"` \| `"danger"` \| `"link"`

Defined in: components/button.tsx:4

## Functions

### Button()

> **Button**(`__namedParameters`): `Element`

Defined in: components/button.tsx:34

Interactive button styled with MD3 tokens. Forwards all native `<button>`
props (including `ref`), and defaults `type` to `"button"`.

#### Parameters

##### \_\_namedParameters

[`ButtonProps`](#buttonprops)

#### Returns

`Element`

#### Example

```ts
<Button variant="primary" size="large">Launch</Button>
```
