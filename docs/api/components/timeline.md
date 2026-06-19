[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/timeline

# components/timeline

## Type Aliases

### TimelineColor

> **TimelineColor** = `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"error"`

Defined in: components/timeline.tsx:4

***

### TimelineItem

> **TimelineItem** = `object`

Defined in: components/timeline.tsx:11

#### Properties

##### color?

> `optional` **color?**: [`TimelineColor`](#timelinecolor)

Defined in: components/timeline.tsx:21

Marker colour.

###### Default

```ts
'default'
```

##### description?

> `optional` **description?**: `ReactNode`

Defined in: components/timeline.tsx:15

Optional supporting text under the title.

##### icon?

> `optional` **icon?**: `ReactNode`

Defined in: components/timeline.tsx:19

Optional icon shown in the marker.

##### time?

> `optional` **time?**: `ReactNode`

Defined in: components/timeline.tsx:17

Optional timestamp shown beside the title.

##### title

> **title**: `ReactNode`

Defined in: components/timeline.tsx:13

Event title.

***

### TimelineProps

> **TimelineProps** = `HTMLAttributes`\<`HTMLOListElement`\> & `object`

Defined in: components/timeline.tsx:24

#### Type Declaration

##### items

> **items**: `ReadonlyArray`\<[`TimelineItem`](#timelineitem)\>

Events in chronological order.

## Functions

### Timeline()

> **Timeline**(`__namedParameters`): `Element`

Defined in: components/timeline.tsx:36

Vertical timeline of events, each with a colour-coded marker, title and
optional time/description.

#### Parameters

##### \_\_namedParameters

[`TimelineProps`](#timelineprops)

#### Returns

`Element`

#### Example

```ts
<Timeline items={[{ title: 'Deployed', time: '2m ago', color: 'success' }]} />
```
