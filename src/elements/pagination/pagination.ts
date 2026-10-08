import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { applyTemplate } from '../shared/format.js';
import { styles } from './pagination.styles.js';

/** Detail of `hmi-change`. */
export interface PaginationChangeDetail {
    /** The requested 1-based page. */
    value: number;
}

type PageEntry = number | 'ellipsis-start' | 'ellipsis-end';

/** Every page up to 7; beyond that, the first, the last and the current page with one on each side. */
function buildPages(page: number, total: number): PageEntry[] {
    if (total <= 0) return [];
    if (total <= 7) {
        const out: PageEntry[] = [];
        for (let i = 1; i <= total; i++) out.push(i);
        return out;
    }
    const out: PageEntry[] = [1];
    if (page > 3) out.push('ellipsis-start');
    const start = Math.max(2, page - 1);
    const end = Math.min(total - 1, page + 1);
    for (let i = start; i <= end; i++) out.push(i);
    if (page < total - 2) out.push('ellipsis-end');
    out.push(total);
    return out;
}

const chevron = (path: string) => html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d=${path} />
</svg>`;

/**
 * Page navigation with previous and next buttons and a window of page numbers,
 * with ellipses for long ranges. The current page is marked
 * `aria-current="page"`.
 *
 * It is controlled: choosing a page fires `hmi-change` and the consumer sets
 * `page` in response. Until it does, the element keeps showing the old page.
 *
 * @tag hmi-pagination
 * @csspart base - The `<nav>`.
 * @csspart button - A page button. The current one has `data-active`.
 * @csspart prev - The previous-page button.
 * @csspart next - The next-page button.
 * @csspart ellipsis - A gap in the window.
 * @fires hmi-change - A page was chosen. `detail` is `{ value }`, the 1-based page.
 *
 * @example
 * const pager = document.querySelector('hmi-pagination');
 * pager.total = 20;
 * pager.addEventListener('hmi-change', (e) => { pager.page = e.detail.value; });
 */
@customElement('hmi-pagination')
export class HmiPagination extends LitElement {
    static override styles = [baseStyles, styles];

    /** The current page, from 1. @default 1 */
    @property({ type: Number }) accessor page = 1;

    /** The number of pages. @default 0 */
    @property({ type: Number }) accessor total = 0;

    /** The name of the navigation landmark. @default 'Pagination' */
    @property() accessor label = 'Pagination';

    /** The name of the previous-page button. @default 'Previous page' */
    @property({ attribute: 'prev-label' }) accessor prevLabel = 'Previous page';

    /** The name of the next-page button. @default 'Next page' */
    @property({ attribute: 'next-label' }) accessor nextLabel = 'Next page';

    /** The name of a page button, with `{page}` for its number. @default 'Page {page}' */
    @property({ attribute: 'page-label' }) accessor pageLabel = 'Page {page}';

    #go(value: number) {
        emit<PaginationChangeDetail>(this, 'hmi-change', { value });
    }

    override render() {
        const canPrev = this.page > 1;
        const canNext = this.page < this.total;
        return html`<nav part="base" class="base" aria-label=${this.label}>
            <button
                type="button"
                part="prev"
                class="button"
                aria-label=${this.prevLabel}
                ?disabled=${!canPrev}
                @click=${() => this.#go(this.page - 1)}
            >
                ${chevron('M10 4l-4 4 4 4')}
            </button>
            ${buildPages(this.page, this.total).map((entry) => {
                if (typeof entry === 'string') {
                    return html`<span
                        part="ellipsis"
                        class="ellipsis"
                        aria-hidden="true"
                        >…</span
                    >`;
                }
                const active = entry === this.page;
                return html`<button
                    type="button"
                    part="button"
                    class="button"
                    data-active=${active}
                    aria-label=${applyTemplate(this.pageLabel, { page: entry })}
                    aria-current=${active ? 'page' : nothing}
                    @click=${() => this.#go(entry)}
                >
                    ${entry}
                </button>`;
            })}
            <button
                type="button"
                part="next"
                class="button"
                aria-label=${this.nextLabel}
                ?disabled=${!canNext}
                @click=${() => this.#go(this.page + 1)}
            >
                ${chevron('M6 4l4 4-4 4')}
            </button>
        </nav>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-pagination': HmiPagination;
    }
}
