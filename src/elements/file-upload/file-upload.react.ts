import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { type FileUploadChangeDetail, HmiFileUpload } from './file-upload.js';

export type { FileDescriptor, FileUploadChangeDetail } from './file-upload.js';

/**
 * React wrapper for `<hmi-file-upload>`.
 *
 * `onChange` receives the event: read `event.detail.value`, the selection as
 * serialisable descriptors. The real `File`s are `ref.current.files`.
 *
 * @example
 * <FileUpload multiple accept="image/*" onChange={(e) => setFiles(e.detail.value)} />
 */
export const FileUpload = createComponent({
    tagName: 'hmi-file-upload',
    elementClass: HmiFileUpload,
    react: React,
    displayName: 'FileUpload',
    events: {
        onChange: 'hmi-change' as EventName<
            CustomEvent<FileUploadChangeDetail>
        >,
    },
});
