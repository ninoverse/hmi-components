[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / components/fileUpload

# components/fileUpload

## Type Aliases

### FileDescriptor

> **FileDescriptor** = `object`

Defined in: [components/fileUpload.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L12)

Serializable descriptor of a selected file — safe to emit across the Web
Component boundary, where a raw File object cannot travel.

#### Properties

##### name

> **name**: `string`

Defined in: [components/fileUpload.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L12)

##### size

> **size**: `number`

Defined in: [components/fileUpload.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L12)

##### type

> **type**: `string`

Defined in: [components/fileUpload.tsx:12](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L12)

***

### FileUploadProps

> **FileUploadProps** = `object`

Defined in: [components/fileUpload.tsx:14](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L14)

#### Properties

##### accept?

> `optional` **accept?**: `string`

Defined in: [components/fileUpload.tsx:18](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L18)

`accept` filter forwarded to the file input (e.g. `'image/*'`).

##### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [components/fileUpload.tsx:28](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L28)

Accessible label for the drop zone.

###### Default

```ts
'File upload'
```

##### disabled?

> `optional` **disabled?**: `boolean`

Defined in: [components/fileUpload.tsx:22](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L22)

Disable the drop zone and remove buttons.

###### Default

```ts
false
```

##### hint?

> `optional` **hint?**: `string`

Defined in: [components/fileUpload.tsx:26](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L26)

Secondary hint under the label (e.g. accepted types/size).

##### label?

> `optional` **label?**: `string`

Defined in: [components/fileUpload.tsx:24](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L24)

Drop-zone prompt text.

###### Default

```ts
'Drop files here or click to browse'
```

##### multiple?

> `optional` **multiple?**: `boolean`

Defined in: [components/fileUpload.tsx:20](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L20)

Allow selecting multiple files.

###### Default

```ts
false
```

##### onChange?

> `optional` **onChange?**: (`files`) => `void`

Defined in: [components/fileUpload.tsx:16](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L16)

Fires with the current selection as serializable [FileDescriptor](#filedescriptor)s.

###### Parameters

###### files

[`FileDescriptor`](#filedescriptor)[]

###### Returns

`void`

## Functions

### FileUpload()

> **FileUpload**(`__namedParameters`): `Element`

Defined in: [components/fileUpload.tsx:55](https://github.com/ninoverse/hmi-components/blob/c9083464b65c6e54e28cb104615de5c2407c5879/src/components/fileUpload.tsx#L55)

Drag-and-drop / click file picker. Uncontrolled — it owns the selection and
emits serializable [FileDescriptor](#filedescriptor)s (not raw `File`s) via `onChange`,
so it works across the Web Component boundary.

#### Parameters

##### \_\_namedParameters

[`FileUploadProps`](#fileuploadprops)

#### Returns

`Element`

#### Example

```ts
<FileUpload multiple accept="image/*" onChange={setFiles} />
```
