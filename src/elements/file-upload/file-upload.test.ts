import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './file-upload.js';
import type { FileUploadChangeDetail, HmiFileUpload } from './file-upload.js';
import { FileUpload } from './file-upload.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiFileUpload> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-file-upload') as HmiFileUpload;
    await el.updateComplete;
    return el;
}

const part = (el: HmiFileUpload, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const parts = (el: HmiFileUpload, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );
const picker = (el: HmiFileUpload) =>
    el.shadowRoot?.querySelector('input') as HTMLInputElement;
const zone = (el: HmiFileUpload) => part(el, 'zone') as HTMLButtonElement;

const file = (name: string, type = 'text/plain', size = 1) =>
    new File(['x'.repeat(size)], name, { type, lastModified: 1 });

async function pick(el: HmiFileUpload, ...files: File[]) {
    const data = new DataTransfer();
    for (const f of files) data.items.add(f);
    picker(el).files = data.files;
    picker(el).dispatchEvent(new Event('change'));
    await el.updateComplete;
}

async function drop(el: HmiFileUpload, ...files: File[]) {
    const data = new DataTransfer();
    for (const f of files) data.items.add(f);
    const event = new DragEvent('drop', {
        dataTransfer: data,
        bubbles: true,
        cancelable: true,
    });
    zone(el).dispatchEvent(event);
    await el.updateComplete;
    return event;
}

const names = (el: HmiFileUpload) => el.files.map((f) => f.name);

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-file-upload', () => {
    it('registers', () => {
        expect(customElements.get('hmi-file-upload')).toBeDefined();
    });

    it('has defaults and an empty list', async () => {
        const el = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        expect(el.files).toEqual([]);
        expect(el.multiple).toBe(false);
        expect(el.removeLabel).toBe('Remove {name}');
        expect(part(el, 'label').textContent).toBe(
            'Drop files here or click to browse',
        );
        expect(part(el, 'list')).toBeNull();
        expect(part(el, 'hint')).toBeNull();
    });

    it('shows the label and hint inside the zone', async () => {
        const el = await fixture(
            html`<hmi-file-upload label="Upload a resume" hint="PDF only"></hmi-file-upload>`,
        );
        expect(zone(el).contains(part(el, 'label'))).toBe(true);
        expect(part(el, 'label').textContent).toBe('Upload a resume');
        expect(zone(el).contains(part(el, 'hint'))).toBe(true);
    });

    it('opens the picker when the zone is clicked', async () => {
        const el = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        let clicked = 0;
        picker(el).addEventListener('click', (e) => {
            e.preventDefault();
            clicked++;
        });
        zone(el).click();
        expect(clicked).toBe(1);
    });

    it('names the zone by the host aria-label, else by its text', async () => {
        const named = await fixture(
            html`<hmi-file-upload aria-label="Attachments"></hmi-file-upload>`,
        );
        expect(zone(named).getAttribute('aria-label')).toBe('Attachments');
        const plain = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        expect(zone(plain).hasAttribute('aria-label')).toBe(false);
    });

    it('forwards accept and multiple to the picker', async () => {
        const el = await fixture(
            html`<hmi-file-upload accept="image/*" multiple></hmi-file-upload>`,
        );
        expect(picker(el).accept).toBe('image/*');
        expect(picker(el).multiple).toBe(true);
    });

    it('lists a picked file, fires hmi-change with descriptors, and resets the picker', async () => {
        const el = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        const seen: FileUploadChangeDetail[] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push((e as CustomEvent<FileUploadChangeDetail>).detail),
        );
        await pick(el, file('a.png', 'image/png', 2048));
        expect(seen).toEqual([
            { value: [{ name: 'a.png', size: 2048, type: 'image/png' }] },
        ]);
        expect(names(el)).toEqual(['a.png']);
        expect(el.files[0]).toBeInstanceOf(File);
        expect(parts(el, 'item')).toHaveLength(1);
        expect(part(el, 'file-name').textContent).toBe('a.png');
        expect(part(el, 'size').textContent).toBe('2.0 KB');
        expect(picker(el).value).toBe('');
    });

    it('formats sizes', async () => {
        const el = await fixture(
            html`<hmi-file-upload multiple></hmi-file-upload>`,
        );
        await pick(
            el,
            file('b', 'text/plain', 500),
            file('mb', 'text/plain', 1.5 * 1024 * 1024),
        );
        expect(parts(el, 'size').map((s) => s.textContent)).toEqual([
            '500 B',
            '1.5 MB',
        ]);
    });

    it('replaces the selection without multiple', async () => {
        const el = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        await pick(el, file('a'), file('b'));
        expect(names(el)).toEqual(['a']);
        await pick(el, file('c'));
        expect(names(el)).toEqual(['c']);
    });

    it('merges with multiple, skipping duplicates', async () => {
        const el = await fixture(
            html`<hmi-file-upload multiple></hmi-file-upload>`,
        );
        await pick(el, file('a'), file('b'));
        await pick(el, file('b'), file('c'));
        expect(names(el)).toEqual(['a', 'b', 'c']);
    });

    it('removes a file with its button, which is named after it', async () => {
        const el = await fixture(
            html`<hmi-file-upload multiple></hmi-file-upload>`,
        );
        await pick(el, file('a'), file('b'));
        const seen: string[][] = [];
        el.addEventListener('hmi-change', (e) =>
            seen.push(
                (e as CustomEvent<FileUploadChangeDetail>).detail.value.map(
                    (f) => f.name,
                ),
            ),
        );
        const remove = parts(el, 'remove');
        expect(remove[0]?.getAttribute('aria-label')).toBe('Remove a');
        remove[0]?.click();
        await el.updateComplete;
        expect(names(el)).toEqual(['b']);
        expect(seen).toEqual([['b']]);
    });

    it('takes remove-label for the remove buttons', async () => {
        const el = await fixture(
            html`<hmi-file-upload remove-label="Quitar {name}"></hmi-file-upload>`,
        );
        await pick(el, file('a'));
        expect(part(el, 'remove').getAttribute('aria-label')).toBe('Quitar a');
    });

    it('adds dropped files, and marks the zone while a drag is over it', async () => {
        const el = await fixture(
            html`<hmi-file-upload multiple></hmi-file-upload>`,
        );
        const base = part(el, 'base');
        zone(el).dispatchEvent(
            new DragEvent('dragenter', { bubbles: true, cancelable: true }),
        );
        await el.updateComplete;
        expect(base.classList.contains('drag-over')).toBe(true);
        const event = await drop(el, file('a'), file('b'));
        expect(event.defaultPrevented).toBe(true);
        expect(base.classList.contains('drag-over')).toBe(false);
        expect(names(el)).toEqual(['a', 'b']);
    });

    it('keeps the drag mark while the drag moves onto a child of the zone', async () => {
        const el = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        zone(el).dispatchEvent(
            new DragEvent('dragenter', { bubbles: true, cancelable: true }),
        );
        await el.updateComplete;
        zone(el).dispatchEvent(
            new DragEvent('dragleave', {
                bubbles: true,
                cancelable: true,
                relatedTarget: part(el, 'label'),
            }),
        );
        await el.updateComplete;
        expect(part(el, 'base').classList.contains('drag-over')).toBe(true);
        zone(el).dispatchEvent(
            new DragEvent('dragleave', { bubbles: true, cancelable: true }),
        );
        await el.updateComplete;
        expect(part(el, 'base').classList.contains('drag-over')).toBe(false);
    });

    it('filters dropped files by accept: extension, MIME type and wildcard', async () => {
        const el = await fixture(
            html`<hmi-file-upload multiple accept="image/*, .pdf, text/csv"></hmi-file-upload>`,
        );
        await drop(
            el,
            file('a.png', 'image/png'),
            file('b.PDF', 'application/pdf'),
            file('c.csv', 'text/csv'),
            file('d.txt', 'text/plain'),
        );
        expect(names(el)).toEqual(['a.png', 'b.PDF', 'c.csv']);
    });

    it('does not fire when every dropped file is refused', async () => {
        const el = await fixture(
            html`<hmi-file-upload accept=".pdf"></hmi-file-upload>`,
        );
        let fired = 0;
        el.addEventListener('hmi-change', () => fired++);
        await drop(el, file('a.txt'));
        expect(fired).toBe(0);
        expect(el.files).toEqual([]);
    });

    it('takes the first accepted file of a drop without multiple', async () => {
        const el = await fixture(
            html`<hmi-file-upload accept="image/*"></hmi-file-upload>`,
        );
        await drop(
            el,
            file('a.txt'),
            file('b.png', 'image/png'),
            file('c.png', 'image/png'),
        );
        expect(names(el)).toEqual(['b.png']);
    });

    it('lets files be set from outside, without firing hmi-change', async () => {
        const el = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        let fired = 0;
        el.addEventListener('hmi-change', () => fired++);
        el.files = [file('a')];
        await el.updateComplete;
        expect(parts(el, 'item')).toHaveLength(1);
        expect(fired).toBe(0);
    });

    it('disables the zone, the picker and the remove buttons', async () => {
        const el = await fixture(html`<hmi-file-upload></hmi-file-upload>`);
        el.files = [file('a')];
        el.disabled = true;
        await el.updateComplete;
        expect(zone(el).disabled).toBe(true);
        expect(picker(el).disabled).toBe(true);
        expect((part(el, 'remove') as HTMLButtonElement).disabled).toBe(true);
        await drop(el, file('b'));
        expect(names(el)).toEqual(['a']);
    });

    it('is disabled by an ancestor fieldset', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<fieldset><hmi-file-upload name="n"></hmi-file-upload></fieldset>`,
            host,
        );
        const el = host.querySelector('hmi-file-upload') as HmiFileUpload;
        await el.updateComplete;
        (host.querySelector('fieldset') as HTMLFieldSetElement).disabled = true;
        await el.updateComplete;
        expect(zone(el).disabled).toBe(true);
    });

    describe('form', () => {
        async function formFixture(inner: ReturnType<typeof html>) {
            const host = document.createElement('div');
            document.body.append(host);
            render(html`<form>${inner}</form>`, host);
            const el = host.querySelector('hmi-file-upload') as HmiFileUpload;
            await el.updateComplete;
            return { form: host.querySelector('form') as HTMLFormElement, el };
        }

        it('submits the real files under its name', async () => {
            const { form, el } = await formFixture(
                html`<hmi-file-upload name="docs" multiple></hmi-file-upload>`,
            );
            const a = file('a.txt');
            const b = file('b.txt');
            await pick(el, a, b);
            const sent = new FormData(form).getAll('docs');
            expect(sent).toHaveLength(2);
            expect(sent.every((f) => f instanceof File)).toBe(true);
            expect((sent[0] as File).name).toBe('a.txt');
        });

        it('submits nothing without a selection or a name', async () => {
            const named = await formFixture(
                html`<hmi-file-upload name="docs"></hmi-file-upload>`,
            );
            expect(new FormData(named.form).has('docs')).toBe(false);
            const anonymous = await formFixture(
                html`<hmi-file-upload></hmi-file-upload>`,
            );
            await pick(anonymous.el, file('a'));
            expect(Array.from(new FormData(anonymous.form).keys())).toEqual([]);
        });

        it('clears the selection on reset', async () => {
            const { form, el } = await formFixture(
                html`<hmi-file-upload name="docs"></hmi-file-upload>`,
            );
            await pick(el, file('a'));
            form.reset();
            await el.updateComplete;
            expect(el.files).toEqual([]);
            expect(part(el, 'list')).toBeNull();
        });

        it('is invalid while required and empty, and focuses the zone', async () => {
            const { el } = await formFixture(
                html`<hmi-file-upload name="docs" required></hmi-file-upload>`,
            );
            expect(el.checkValidity()).toBe(false);
            expect(el.validity.valueMissing).toBe(true);
            el.reportValidity();
            expect(el.shadowRoot?.activeElement).toBe(zone(el));
            await pick(el, file('a'));
            expect(el.checkValidity()).toBe(true);
        });

        it('is invalid with the error text, shown below the zone', async () => {
            const { el } = await formFixture(
                html`<hmi-file-upload name="docs" error="Too big"></hmi-file-upload>`,
            );
            expect(el.validity.customError).toBe(true);
            expect(el.validationMessage).toBe('Too big');
            expect(part(el, 'error').textContent?.trim()).toBe('Too big');
            expect(zone(el).getAttribute('aria-invalid')).toBe('true');
            expect(zone(el).getAttribute('aria-describedby')).toBe('error');
        });
    });
});

describe('FileUpload (React wrapper)', () => {
    it('maps onChange to hmi-change', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const seen: string[][] = [];
        await act(async () => {
            root.render(
                createElement(FileUpload, {
                    multiple: true,
                    onChange: (e) =>
                        seen.push(e.detail.value.map((f) => f.name)),
                }),
            );
        });
        const el = host.querySelector('hmi-file-upload') as HmiFileUpload;
        await el.updateComplete;
        await pick(el, file('a'), file('b'));
        expect(seen).toEqual([['a', 'b']]);
        await act(async () => root.unmount());
    });
});
