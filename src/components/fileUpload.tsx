import {
    type DragEvent,
    type KeyboardEvent,
    type MouseEvent,
    useRef,
    useState,
} from 'react';
import './styled/fileUpload.styled.css';

/** Serializable descriptor of a selected file — safe to emit across the Web
   Component boundary, where a raw File object cannot travel. */
export type FileDescriptor = { name: string; size: number; type: string };

export type FileUploadProps = {
    onChange?: (files: FileDescriptor[]) => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    label?: string;
    hint?: string;
    'aria-label'?: string;
};

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

const toDescriptor = (f: File): FileDescriptor => ({
    name: f.name,
    size: f.size,
    type: f.type,
});

export function FileUpload({
    onChange,
    accept,
    multiple = false,
    disabled = false,
    label = 'Drop files here or click to browse',
    hint,
    'aria-label': ariaLabel = 'File upload',
}: FileUploadProps) {
    // Uncontrolled: a File cannot be reconstructed from an HTML attribute, so
    // the component owns its selection internally and only emits descriptors.
    const [current, setCurrent] = useState<ReadonlyArray<File>>([]);

    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const tokens: string[] = ['file-upload'];
    if (dragOver) tokens.push('file-upload--drag-over');
    if (disabled) tokens.push('file-upload--disabled');

    const set = (next: File[]) => {
        setCurrent(next);
        onChange?.(next.map(toDescriptor));
    };

    const addFiles = (incoming: FileList | null) => {
        if (!incoming || incoming.length === 0) return;
        const list = Array.from(incoming);
        if (!multiple) {
            set([list[0] as File]);
            return;
        }
        // Merge avoiding duplicates by key
        const existingKeys = new Set(current.map(fileKey));
        const merged = [
            ...current,
            ...list.filter((f) => !existingKeys.has(fileKey(f))),
        ];
        set(merged);
    };

    const remove = (key: string) => {
        const next = current.filter((f) => fileKey(f) !== key);
        set(next);
    };

    const openPicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const onDrop = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setDragOver(false);
        if (disabled) return;
        addFiles(event.dataTransfer.files);
    };

    const onDragEnter = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!disabled) setDragOver(true);
    };
    const onDragOver = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const onDragLeave = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setDragOver(false);
    };

    const onZoneKey = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
        }
    };

    return (
        <div className={tokens.join(' ')}>
            <input
                ref={inputRef}
                type="file"
                className="file-upload__input"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                aria-hidden="true"
                tabIndex={-1}
                onChange={(event) => {
                    addFiles(event.target.files);
                    // Reset so picking the same file twice still fires
                    event.target.value = '';
                }}
            />
            <button
                type="button"
                className="file-upload__zone"
                disabled={disabled}
                aria-label={ariaLabel}
                onClick={openPicker}
                onKeyDown={onZoneKey}
                onDrop={onDrop}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                <span className="file-upload__icon" aria-hidden="true">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <title>Upload</title>
                        <path d="M12 4v12M6 10l6-6 6 6" />
                        <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
                    </svg>
                </span>
                <span className="file-upload__label">{label}</span>
                {hint && <span className="file-upload__hint">{hint}</span>}
            </button>
            {current.length > 0 && (
                <ul className="file-upload__list">
                    {current.map((f) => {
                        const key = fileKey(f);
                        return (
                            <li key={key} className="file-upload__item">
                                <span
                                    className="file-upload__file-icon"
                                    aria-hidden="true"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <title>File</title>
                                        <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
                                        <path d="M14 3v5h5" />
                                    </svg>
                                </span>
                                <span className="file-upload__name">
                                    {f.name}
                                </span>
                                <span className="file-upload__size">
                                    {formatBytes(f.size)}
                                </span>
                                <button
                                    type="button"
                                    className="file-upload__remove"
                                    aria-label={`Remove ${f.name}`}
                                    disabled={disabled}
                                    onClick={(
                                        event: MouseEvent<HTMLButtonElement>,
                                    ) => {
                                        event.stopPropagation();
                                        remove(key);
                                    }}
                                >
                                    <svg
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <title>Remove</title>
                                        <path d="M4 4l8 8M12 4l-8 8" />
                                    </svg>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
