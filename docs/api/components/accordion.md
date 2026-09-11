[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/accordion

# components/accordion

## Type Aliases

### AccordionItem

> **AccordionItem** = `object`

Defined in: [components/accordion.tsx:4](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/accordion.tsx#L4)

#### Properties

##### body

> **body**: `ReactNode`

Defined in: [components/accordion.tsx:8](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/accordion.tsx#L8)

Panel content revealed when the item is open.

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [components/accordion.tsx:10](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/accordion.tsx#L10)

Disable the trigger so the panel can't be toggled.

###### Default

```ts
false
```

##### title

> **title**: `ReactNode`

Defined in: [components/accordion.tsx:6](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/accordion.tsx#L6)

Header content shown on the always-visible trigger.

***

### AccordionProps

> **AccordionProps** = `HTMLAttributes`\<`HTMLDivElement`\> & `object`

Defined in: [components/accordion.tsx:13](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/accordion.tsx#L13)

#### Type Declaration

##### defaultOpen?

> `optional` **defaultOpen?**: `ReadonlyArray`\<`number`\>

Initially open item indices when uncontrolled.

##### items

> **items**: `ReadonlyArray`\<[`AccordionItem`](#accordionitem)\>

Ordered list of sections to render.

##### multiple?

> `optional` **multiple?**: `boolean`

Allow multiple panels open at once instead of one.

###### Default

```ts
false
```

##### onOpenChange?

> `optional` **onOpenChange?**: (`open`) => `void`

Fires after a toggle with the new sorted list of open indices.

###### Parameters

###### open

`number`[]

###### Returns

`void`

##### open?

> `optional` **open?**: `ReadonlyArray`\<`number`\>

Controlled set of open item indices. Provide with `onOpenChange`.

## Functions

### Accordion()

> **Accordion**(`__namedParameters`): `Element`

Defined in: [components/accordion.tsx:51](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/accordion.tsx#L51)

Vertically stacked, collapsible sections. Works controlled (`open` +
`onOpenChange`) or uncontrolled (`defaultOpen`).

#### Parameters

##### \_\_namedParameters

[`AccordionProps`](#accordionprops)

#### Returns

`Element`

#### Example

```ts
<Accordion
    multiple
    items={[{ title: 'Section', body: 'Details…' }]}
/>
```
