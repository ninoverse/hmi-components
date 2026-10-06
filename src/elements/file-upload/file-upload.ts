import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { type FormKind, HmiFormField } from '../shared/form.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './file-upload.styles.js';

/** A selected file as `hmi-change` reports it: serialisable, unlike a `File`. */
export type FileDescriptor = { name: string; size: number; type: string };

/** Detail of `hmi-change`: the whole selection after the change. */
export interface FileUploadChangeDetail {
    value: FileDescriptor[];
}

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

/**
 * Drag-and-drop or click file picker with a list of the selected files and a
 * remove button for each. A native form control: `name` plus the real `File`s
 * reach `FormData`, `form.reset()` clears the selection, and `required` makes an
 * empty selection invalid.
 *
 * `hmi-change` fires when the user adds or removes files, with `{ value }`: the
 * selection as serialisable descriptors (name, size, type). The real `File`s
 * are the `files` property, which can also be set to replace the selection.
 *
 * Here `label` and `hint` are the text inside the drop zone, not a field label:
 * name the field with `aria-label` on the host, or wrap it in `hmi-form-control`.
 * `error` shows below the zone and makes the control invalid. Dropped files are
 * filtered by `accept`, as the picker is.
 *
 * @tag hmi-file-upload
 * @fires {CustomEvent<FileUploadChangeDetail>} hmi-change - The selection changed.
 * @csspart base - The zone and the list.
 * @csspart zone - The drop zone button.
 * @csspart icon - The upload icon.
 * @csspart label - The prompt inside the zone.
 * @csspart hint - The secondary text inside the zone.
 * @csspart list - The list of selected files.
 * @csspart item - One selected file.
 * @csspart file-name - A file's name.
 * @csspart size - A file's size.
 * @csspart remove - A file's remove button.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-file-upload name="attachments" multiple accept="image/*" hint="PNG or JPG"></hmi-file-upload>
 */
@customElement('hmi-file-upload')
export class HmiFileUpload extends HmiFormField {
    static override styles = [baseStyles, formStyles, styles];

    protected readonly formKind: FormKind = 'text';

    /** The selected files. Set it to replace the selection; it does not fire `hmi-change`. @default [] */
    @property({ attribute: false }) accessor files: File[] = [];

    /** File types the picker offers and a drop accepts, such as `image/*` or `.pdf`. */
    @property() accessor accept: string | undefined;

    /** Allow selecting more than one file. @default false */
    @property({ type: Boolean, reflect: true }) accessor multiple = false;

    /** Accessible name of each remove button; `{name}` is replaced. @default 'Remove {name}' */
    @property({ attribute: 'remove-label' }) accessor removeLabel =
        'Remove {name}';

    @state() private accessor dragOver = false;

    @query('input') private accessor picker!: HTMLInputElement | null;
    @query('.zone') private accessor zone!: HTMLButtonElement | null;

    constructor() {
        super();
        this.label = 'Drop files here or click to browse';
    }

    protected get formValue(): File[] {
        return this.files;
    }

    protected get control(): HTMLInputElement | null {
        return this.picker;
    }

    protected resetFormValue(): void {
        this.files = [];
    }

    /** Submits each file under `name`, and reports validity against the zone, which can take focus. */
    protected override syncForm(): void {
        if (this.name && this.files.length > 0) {
            const data = new FormData();
            for (const file of this.files) data.append(this.name, file);
            this.internals.setFormValue(data);
        } else {
            this.internals.setFormValue(null);
        }
        const anchor = this.zone ?? undefined;
        if (this.error) {
            this.internals.setValidity(
                { customError: true },
                this.error,
                anchor,
            );
        } else if (this.picker && !this.picker.validity.valid) {
            this.internals.setValidity(
                this.picker.validity,
                this.picker.validationMessage,
                anchor,
            );
        } else {
            this.internals.setValidity({});
        }
    }

    #accepts(file: File): boolean {
        const tokens = (this.accept ?? '')
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);
        if (tokens.length === 0) return true;
        const name = file.name.toLowerCase();
        const type = file.type.toLowerCase();
        return tokens.some((token) =>
            token.startsWith('.')
                ? name.endsWith(token)
                : token.endsWith('/*')
                  ? type.startsWith(token.slice(0, -1))
                  : type === token,
        );
    }

    #setFiles(next: File[]): void {
        this.files = next;
        emit<FileUploadChangeDetail>(this, 'hmi-change', {
            value: next.map(toDescriptor),
        });
    }

    #add(incoming: File[]): void {
        if (incoming.length === 0) return;
        if (!this.multiple) {
            this.#setFiles([incoming[0] as File]);
            return;
        }
        const known = new Set(this.files.map(fileKey));
        this.#setFiles([
            ...this.files,
            ...incoming.filter((f) => !known.has(fileKey(f))),
        ]);
    }

    #remove(key: string): void {
        this.#setFiles(this.files.filter((f) => fileKey(f) !== key));
    }

    #onPick(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.#add(Array.from(input.files ?? []));
        // So that picking the same file again still fires.
        input.value = '';
    }

    #onDragEnter(event: DragEvent): void {
        event.preventDefault();
        if (!this.isDisabled) this.dragOver = true;
    }

    #onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    #onDragLeave(event: DragEvent): void {
        event.preventDefault();
        // Moving over the label or icon leaves the button for a child.
        if (this.zone?.contains(event.relatedTarget as Node | null)) return;
        this.dragOver = false;
    }

    #onDrop(event: DragEvent): void {
        event.preventDefault();
        this.dragOver = false;
        if (this.isDisabled) return;
        this.#add(
            Array.from(event.dataTransfer?.files ?? []).filter((f) =>
                this.#accepts(f),
            ),
        );
    }

    protected override renderLabel(): typeof nothing {
        return nothing;
    }

    /** Only the error: `hint` sits inside the zone. */
    protected override renderMessage(): TemplateResult | typeof nothing {
        return this.error ? super.renderMessage() : nothing;
    }

    protected override get describedBy(): string | undefined {
        return this.error ? 'error' : undefined;
    }

    #renderItem(file: File): TemplateResult {
        const key = fileKey(file);
        return html`<li part="item" class="item">
            <span class="file-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
                    <path d="M14 3v5h5" />
                </svg>
            </span>
            <span part="file-name" class="file-name">${file.name}</span>
            <span part="size" class="size">${formatBytes(file.size)}</span>
            <button
                part="remove"
                class="remove"
                type="button"
                aria-label=${this.removeLabel.replace('{name}', file.name)}
                ?disabled=${this.isDisabled}
                @click=${(e: Event) => {
                    e.stopPropagation();
                    this.#remove(key);
                }}
            >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
            </button>
        </li>`;
    }

    override render() {
        return html`
            <div part="base" class=${this.dragOver ? 'base drag-over' : 'base'}>
                <input
                    class="picker"
                    type="file"
                    accept=${ifDefined(this.accept)}
                    ?multiple=${this.multiple}
                    ?required=${this.required && this.files.length === 0}
                    ?disabled=${this.isDisabled}
                    aria-hidden="true"
                    tabindex="-1"
                    @change=${this.#onPick}
                />
                <button
                    part="zone"
                    class=${this.error ? 'zone invalid' : 'zone'}
                    type="button"
                    ?disabled=${this.isDisabled}
                    aria-label=${ifDefined(this.getAttribute('aria-label') ?? undefined)}
                    aria-invalid=${ifDefined(this.invalid)}
                    aria-describedby=${ifDefined(this.describedBy)}
                    @click=${() => this.picker?.click()}
                    @dragenter=${this.#onDragEnter}
                    @dragover=${this.#onDragOver}
                    @dragleave=${this.#onDragLeave}
                    @drop=${this.#onDrop}
                >
                    <span part="icon" class="icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 4v12M6 10l6-6 6 6" />
                            <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
                        </svg>
                    </span>
                    ${this.label ? html`<span part="label" class="prompt">${this.label}</span>` : nothing}
                    ${this.hint ? html`<span part="hint" class="hint">${this.hint}</span>` : nothing}
                </button>
                ${
                    this.files.length > 0
                        ? html`<ul part="list" class="list">
                              ${this.files.map((f) => this.#renderItem(f))}
                          </ul>`
                        : nothing
                }
            </div>
            ${this.renderMessage()}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-file-upload': HmiFileUpload;
    }
}
