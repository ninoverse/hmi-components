/* The Line 3 supervisor's inbox, a lit template like the dashboard. The state
   lives in one object, and every change renders the page again. */

import './inbox.css';
import { html, nothing, render, svg, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '../../src/elements/avatar/avatar.js';
import '../../src/elements/badge/badge.js';
import '../../src/elements/breadcrumbs/breadcrumbs.js';
import '../../src/elements/button/button.js';
import '../../src/elements/card/card.js';
import '../../src/elements/checkbox/checkbox.js';
import '../../src/elements/chip/chip.js';
import '../../src/elements/command-palette/command-palette.js';
import '../../src/elements/drawer/drawer.js';
import '../../src/elements/empty-state/empty-state.js';
import '../../src/elements/heading/heading.js';
import '../../src/elements/input/input.js';
import '../../src/elements/kbd/kbd.js';
import '../../src/elements/list/list.js';
import '../../src/elements/modal/modal.js';
import '../../src/elements/pagination/pagination.js';
import '../../src/elements/radio-group/radio-group.js';
import '../../src/elements/search-input/search-input.js';
import '../../src/elements/select/select.js';
import '../../src/elements/sidebar/sidebar.js';
import '../../src/elements/switch/switch.js';
import '../../src/elements/tabs/tabs.js';
import '../../src/elements/text/text.js';
import '../../src/elements/textarea/textarea.js';
import type {
    CommandPaletteActionDetail,
    CommandPaletteCommand,
} from '../../src/elements/command-palette/command-palette.js';
import type {
    ListItem,
    ListReorderDetail,
} from '../../src/elements/list/list.js';
import type { CheckedDetail } from '../../src/elements/shared/checkable.js';
import type { SidebarGroup } from '../../src/elements/sidebar/sidebar.js';
import type { HmiTextarea } from '../../src/elements/textarea/textarea.js';
import { toast } from '../../src/elements/toast/toast.js';
import { mountShell } from '../shared/shell.js';
import {
    CATEGORIES,
    type Category,
    type Mailbox,
    MESSAGES,
    type Message,
    PRIORITIES,
    TEAMS,
    type Team,
} from './data.js';

mountShell('inbox', '../');

const app = document.getElementById('app') as HTMLElement;

type Folder = Mailbox | 'flagged';
type View = 'all' | 'unread' | 'mentions';

const PAGE_SIZE = 8;

const FOLDERS: Record<Folder, { label: string; empty: string }> = {
    inbox: { label: 'Inbox', empty: 'Every message has been dealt with.' },
    flagged: { label: 'Flagged', empty: 'Flag a message to keep it here.' },
    archive: { label: 'Archive', empty: 'Archived messages land here.' },
    trash: { label: 'Trash', empty: 'Deleted messages stay here for 30 days.' },
};

/** The mailboxes, in the order the sidebar and the palette list them. */
const FOLDER_ORDER = Object.keys(FOLDERS) as Folder[];

const RECIPIENTS = [
    ...new Map(
        MESSAGES.filter((message) => message.team !== 'system').map(
            (message) => [
                message.from,
                {
                    value: message.from,
                    label: `${message.from}, ${message.role}`,
                },
            ],
        ),
    ).values(),
];

const COMPOSE_ACTIONS = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Send', value: 'send', variant: 'primary' as const },
];

const MAC = /Mac|iPhone|iPad/.test(navigator.userAgent);

const state = {
    messages: MESSAGES.map((message) => ({ ...message })),
    folder: 'inbox' as Folder,
    view: 'all' as View,
    query: '',
    categories: [] as Category[],
    team: 'anyone' as 'anyone' | Team,
    attachments: false,
    page: 1,
    open: undefined as number | undefined,
    priorities: PRIORITIES as ListItem[],
    filtersOpen: false,
    paletteOpen: false,
    composeOpen: false,
};

function update(changes: Partial<typeof state> = {}) {
    Object.assign(state, changes);
    render(page(), app);
}

/* ---- Icons, drawn like the elements' own: a 24px box, stroked. ---- */

const ICONS = {
    inbox: svg`<path d="M4 4h16l2 9v7H2v-7z" /><path d="M2 13h6l2 3h4l2-3h6" />`,
    flagged: svg`<path d="M5 21V4h12l-2 4 2 4H5" />`,
    archive: svg`<rect x="3" y="4" width="18" height="5" rx="1" /><path d="M5 9v11h14V9M10 13h4" />`,
    trash: svg`<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />`,
    clip: svg`<path d="M20 11l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 17a2 2 0 0 1-3-3l7.5-7.5" />`,
    search: svg`<circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />`,
};

/** An icon: decorative, or announced as `label`. */
const icon = (
    name: keyof typeof ICONS,
    { slot, label }: { slot?: string; label?: string } = {},
) =>
    html`<svg
        class="inbox-icon"
        slot=${slot ?? nothing}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        role=${label ? 'img' : nothing}
        aria-label=${label ?? nothing}
        aria-hidden=${label ? nothing : 'true'}
    >
        ${ICONS[name]}
    </svg>`;

/* ---- What is shown ---- */

const inFolder = (message: Message, folder: Folder) =>
    folder === 'flagged'
        ? !!message.flagged && message.mailbox !== 'trash'
        : message.mailbox === folder;

const count = (folder: Folder, test: (message: Message) => boolean) =>
    state.messages.filter(
        (message) => inFolder(message, folder) && test(message),
    ).length;

const filterCount = () =>
    state.categories.length +
    (state.team === 'anyone' ? 0 : 1) +
    (state.attachments ? 1 : 0);

const categoryLabel = (value: Category) =>
    CATEGORIES.find((category) => category.value === value)?.label ?? value;

function shown(): Message[] {
    const query = state.query.trim().toLowerCase();
    return state.messages.filter(
        (message) =>
            inFolder(message, state.folder) &&
            (state.view !== 'unread' || message.unread) &&
            (state.view !== 'mentions' || message.mention) &&
            (state.categories.length === 0 ||
                state.categories.includes(message.category)) &&
            (state.team === 'anyone' || message.team === state.team) &&
            (!state.attachments || message.attachment) &&
            (!query ||
                `${message.subject} ${message.from} ${message.body.join(' ')}`
                    .toLowerCase()
                    .includes(query)),
    );
}

const openMessage = () =>
    state.messages.find((message) => message.id === state.open);

/* ---- Actions ---- */

function showFolder(folder: Folder) {
    update({ folder, open: undefined, page: 1 });
}

function read(id: number) {
    const message = state.messages.find((each) => each.id === id);
    if (!message) return;
    message.unread = false;
    const folder = inFolder(message, state.folder)
        ? state.folder
        : message.mailbox;
    update({ open: id, folder });
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() =>
        app
            .querySelector<HTMLElement>('.inbox-message-bar hmi-button')
            ?.focus(),
    );
}

function move(message: Message, mailbox: Mailbox) {
    message.mailbox = mailbox;
    const done = {
        inbox: 'Moved to the Inbox',
        archive: 'Archived',
        trash: 'Moved to the Trash',
    }[mailbox];
    toast.info(done, message.subject);
    update({ open: undefined });
}

function markAllRead() {
    let marked = 0;
    for (const message of state.messages) {
        if (inFolder(message, state.folder) && message.unread) {
            message.unread = false;
            marked += 1;
        }
    }
    toast.success(
        'All read',
        `${marked} message${marked === 1 ? '' : 's'} in ${FOLDERS[state.folder].label}.`,
    );
    update();
}

function clearFilters() {
    update({ categories: [], team: 'anyone', attachments: false, page: 1 });
}

function showEverything() {
    update({
        view: 'all',
        query: '',
        categories: [],
        team: 'anyone',
        attachments: false,
        page: 1,
    });
}

function reply(message: Message) {
    const field = app.querySelector<HmiTextarea>('.inbox-reply hmi-textarea');
    if (!field?.reportValidity()) return;
    toast.success('Reply sent', `To ${message.from}.`);
    field.value = '';
}

function compose(event: CustomEvent<{ value: string }>) {
    const form = app.querySelector<HTMLFormElement>('.inbox-compose');
    if (!form) return;
    if (event.detail.value === 'send') {
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        toast.success(
            'Message sent',
            `To ${data.get('to')}: “${data.get('subject')}”.`,
        );
    }
    form.reset();
    update({ composeOpen: false });
}

function run(event: CustomEvent<CommandPaletteActionDetail>) {
    const [kind, argument] = event.detail.value.split(':');
    state.paletteOpen = false;
    if (kind === 'folder') showFolder(argument as Folder);
    else if (kind === 'open') read(Number(argument));
    else if (kind === 'compose') update({ composeOpen: true });
    else if (kind === 'read-all') markAllRead();
    else if (kind === 'filters') update({ filtersOpen: true });
    else if (kind === 'clear') clearFilters();
}

// Ctrl+K, or ⌘K on a Mac, from anywhere on the page: the palette's own
// field included, so the same keys close it.
document.addEventListener('keydown', (event) => {
    if (
        (MAC ? event.metaKey : event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
    ) {
        event.preventDefault();
        update({ paletteOpen: !state.paletteOpen });
    }
});

/* ---- Templates ---- */

function sidebarGroups(): SidebarGroup[] {
    const unread = count('inbox', (message) => !!message.unread);
    const flagged = count('flagged', () => true);
    const badges: Partial<Record<Folder, number>> = { inbox: unread, flagged };
    return [
        {
            label: 'Mailboxes',
            items: FOLDER_ORDER.map((value) => ({
                value,
                label: FOLDERS[value].label,
                ...(badges[value] ? { badge: String(badges[value]) } : {}),
                badgeVariant: value === 'inbox' ? 'primary' : 'default',
            })),
        },
    ];
}

function crumbs() {
    const message = openMessage();
    return [
        { label: 'Line 3', href: '../dashboard/' },
        { label: FOLDERS[state.folder].label, value: 'folder' },
        ...(message ? [{ label: message.subject }] : []),
    ];
}

function tabs() {
    const unread = count(state.folder, (message) => !!message.unread);
    const mentions = count(state.folder, (message) => !!message.mention);
    return [
        { value: 'all', label: 'All' },
        {
            value: 'unread',
            label: 'Unread',
            badge: unread ? String(unread) : undefined,
        },
        {
            value: 'mentions',
            label: 'Mentions',
            badge: mentions ? String(mentions) : undefined,
        },
    ];
}

function commands(): CommandPaletteCommand[] {
    return [
        ...FOLDER_ORDER.map((value) => ({
            value: `folder:${value}`,
            label: `Go to ${FOLDERS[value].label}`,
            group: 'Mailboxes',
        })),
        { value: 'compose', label: 'New message', group: 'Actions' },
        {
            value: 'read-all',
            label: 'Mark this mailbox as read',
            group: 'Actions',
        },
        { value: 'filters', label: 'Open the filters', group: 'Actions' },
        ...(filterCount()
            ? [{ value: 'clear', label: 'Clear the filters', group: 'Actions' }]
            : []),
        ...state.messages
            .filter((message) => message.mailbox !== 'trash')
            .map((message) => ({
                value: `open:${message.id}`,
                label: message.subject,
                description: `${message.from} · ${message.time}`,
                group: 'Messages',
                keywords: [message.from, categoryLabel(message.category)],
            })),
    ];
}

const preview = (message: Message) => {
    const [first = ''] = message.body;
    return first.length > 80 ? `${first.slice(0, 80).trimEnd()}…` : first;
};

const row = (message: Message): ListItem => ({
    id: message.id,
    avatar: message.from,
    title: message.subject,
    subtitle: message.from,
    right: message.time,
});

const rowSlots = (message: Message) => html`
    <button
        slot="title-${message.id}"
        class="inbox-subject"
        ?data-unread=${message.unread}
        @click=${() => read(message.id)}
    >
        ${message.subject}
    </button>
    <span slot="subtitle-${message.id}"
        >${message.from}<span class="inbox-preview">
            · ${preview(message)}</span
        ></span
    >
    <span slot="right-${message.id}" class="inbox-meta">
        ${message.flagged ? icon('flagged', { label: 'Flagged' }) : nothing}
        ${message.attachment ? icon('clip', { label: 'Attachment' }) : nothing}
        ${
            message.unread
                ? html`<hmi-badge variant="primary" dot>New</hmi-badge>`
                : nothing
        }
        <span>${message.time}</span>
    </span>
`;

const chip = (label: string, remove: () => void) =>
    html`<hmi-chip
        closable
        close-label="Remove the filter ${label}"
        @hmi-close=${(event: Event) => {
            // The page renders the chips from the state: it removes this one.
            event.preventDefault();
            remove();
        }}
        >${label}</hmi-chip
    >`;

function chips() {
    if (!filterCount()) return nothing;
    const team = TEAMS.find((each) => each.value === state.team)?.label;
    return html`<div class="inbox-chips">
        ${state.categories.map((value) =>
            chip(categoryLabel(value), () =>
                update({
                    categories: state.categories.filter(
                        (each) => each !== value,
                    ),
                    page: 1,
                }),
            ),
        )}
        ${
            state.team === 'anyone'
                ? nothing
                : chip(`From ${team}`, () =>
                      update({ team: 'anyone', page: 1 }),
                  )
        }
        ${
            state.attachments
                ? chip('With attachments', () =>
                      update({ attachments: false, page: 1 }),
                  )
                : nothing
        }
        <hmi-button size="small" variant="ghost" @click=${clearFilters}
            >Clear the filters</hmi-button
        >
    </div>`;
}

function empty() {
    const narrowed = state.view !== 'all' || !!state.query || !!filterCount();
    const folder = FOLDERS[state.folder];
    return html`<hmi-empty-state>
        ${icon(narrowed ? 'search' : 'inbox', { slot: 'icon' })}
        <span slot="title"
            >${narrowed ? 'Nothing matches' : `${folder.label} is empty`}</span
        >
        <span slot="description"
            >${
                narrowed
                    ? 'No message here fits the tab, the search and the filters together.'
                    : folder.empty
            }</span
        >
        ${
            narrowed
                ? html`<hmi-button slot="action" @click=${showEverything}
                  >Show every message</hmi-button
              >`
                : nothing
        }
    </hmi-empty-state>`;
}

function listView() {
    const messages = shown();
    const pages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
    const current = Math.min(state.page, pages);
    const first = (current - 1) * PAGE_SIZE;
    const slice = messages.slice(first, first + PAGE_SIZE);
    const filters = filterCount();
    return html`
        <div class="inbox-toolbar">
            <hmi-tabs
                label="Show"
                variant="underline"
                .options=${tabs()}
                .value=${state.view}
                @hmi-change=${(event: CustomEvent<{ value: View }>) =>
                    update({ view: event.detail.value, page: 1 })}
            ></hmi-tabs>
            <div class="inbox-tools">
                <hmi-button
                    size="small"
                    variant="secondary"
                    @click=${() => update({ filtersOpen: true })}
                    >Filters${filters ? ` (${filters})` : ''}</hmi-button
                >
                <hmi-button
                    size="small"
                    variant="ghost"
                    ?disabled=${!count(state.folder, (message) => !!message.unread)}
                    @click=${markAllRead}
                    >Mark all as read</hmi-button
                >
            </div>
        </div>
        <hmi-search-input
            label="Search ${FOLDERS[state.folder].label}"
            placeholder="A subject, a name or a word"
            .value=${state.query}
            @hmi-input=${(event: CustomEvent<{ value: string }>) =>
                update({ query: event.detail.value, page: 1 })}
        ></hmi-search-input>
        ${chips()}
        ${
            slice.length
                ? html`<hmi-list .items=${slice.map(row)}>
                      ${slice.map(rowSlots)}
                  </hmi-list>
                  <div class="inbox-pages">
                      <hmi-text size="small" tone="muted"
                          >${first + 1}–${first + slice.length} of
                          ${messages.length}</hmi-text
                      >
                      ${
                          pages > 1
                              ? html`<hmi-pagination
                                label="Pages of messages"
                                .page=${current}
                                .total=${pages}
                                @hmi-change=${(
                                    event: CustomEvent<{ value: number }>,
                                ) => update({ page: event.detail.value })}
                            ></hmi-pagination>`
                              : nothing
}
                  </div>`
                : empty()
        }
    `;
}

function messageView(message: Message) {
    const back = FOLDERS[state.folder].label;
    return html`<article class="inbox-message">
        <div class="inbox-message-bar">
            <hmi-button
                size="small"
                variant="ghost"
                @click=${() => update({ open: undefined })}
                >← Back to ${back}</hmi-button
            >
            <div class="inbox-tools">
                <hmi-button
                    size="small"
                    variant="secondary"
                    @click=${() => {
                        message.flagged = !message.flagged;
                        update();
                    }}
                    >${message.flagged ? 'Unflag' : 'Flag'}</hmi-button
                >
                <hmi-button
                    size="small"
                    variant="secondary"
                    @click=${() => {
                        message.unread = true;
                        update({ open: undefined });
                    }}
                    >Mark as unread</hmi-button
                >
                ${
                    message.mailbox === 'inbox'
                        ? html`<hmi-button
                          size="small"
                          variant="secondary"
                          @click=${() => move(message, 'archive')}
                          >Archive</hmi-button
                      >`
                        : html`<hmi-button
                          size="small"
                          variant="secondary"
                          @click=${() => move(message, 'inbox')}
                          >Move to the Inbox</hmi-button
                      >`
                }
                ${
                    message.mailbox === 'trash'
                        ? nothing
                        : html`<hmi-button
                          size="small"
                          variant="danger"
                          @click=${() => move(message, 'trash')}
                          >Delete</hmi-button
                      >`
                }
            </div>
        </div>
        <hmi-heading level="2" size="large">${message.subject}</hmi-heading>
        <div class="inbox-sender">
            <hmi-avatar name=${message.from}></hmi-avatar>
            <div>
                <hmi-text weight="semibold">${message.from}</hmi-text>
                <hmi-text size="small" tone="muted"
                    >${message.role} · ${message.time}</hmi-text
                >
            </div>
            <hmi-badge>${categoryLabel(message.category)}</hmi-badge>
        </div>
        <div class="inbox-body">
            ${message.body.map((paragraph) => html`<hmi-text>${paragraph}</hmi-text>`)}
        </div>
        ${
            message.attachment
                ? html`<div>
                  <hmi-chip>${icon('clip', { slot: 'icon' })}${message.attachment}</hmi-chip>
              </div>`
                : nothing
        }
        <div class="inbox-reply">
            <hmi-textarea
                label="Reply to ${message.from}"
                rows="3"
                placeholder="Write a reply…"
                required
            ></hmi-textarea>
            <div>
                <hmi-button variant="primary" @click=${() => reply(message)}
                    >Send the reply</hmi-button
                >
            </div>
        </div>
    </article>`;
}

function page(): TemplateResult {
    const message = openMessage();
    const folder = FOLDERS[state.folder];
    return html`
        <div class="demo-page-head">
            <div>
                <hmi-breadcrumbs
                    .items=${crumbs()}
                    @hmi-nav=${(event: CustomEvent<{ value: string }>) => {
                        if (event.detail.value === 'folder')
                            update({ open: undefined });
                    }}
                ></hmi-breadcrumbs>
                <hmi-heading level="1" size="xlarge">${folder.label}</hmi-heading>
                <hmi-text tone="muted"
                    >Messages for the Line 3 supervisor: from the other shifts,
                    the support teams and the line itself.</hmi-text
                >
            </div>
            <div class="inbox-actions">
                <hmi-button
                    variant="secondary"
                    @click=${() => update({ paletteOpen: true })}
                >
                    Search or jump to
                    <span class="inbox-keys" aria-hidden="true"
                        ><hmi-kbd size="small">${MAC ? '⌘' : 'Ctrl'}</hmi-kbd
                        ><hmi-kbd size="small">K</hmi-kbd></span
                    >
                </hmi-button>
                <hmi-button
                    variant="primary"
                    @click=${() => update({ composeOpen: true })}
                    >New message</hmi-button
                >
            </div>
        </div>

        <div class="inbox-layout">
            <hmi-sidebar
                label="Mailboxes"
                .groups=${sidebarGroups()}
                .current=${state.folder}
                @hmi-nav=${(event: CustomEvent<{ value: Folder }>) =>
                    showFolder(event.detail.value)}
            >
                ${FOLDER_ORDER.map((value) =>
                    icon(value, { slot: `icon-${value}` }),
                )}
            </hmi-sidebar>
            <hmi-card class="inbox-main">
                ${message ? keyed(message.id, messageView(message)) : listView()}
            </hmi-card>

            <hmi-card class="inbox-priorities">
                <hmi-heading slot="header" level="2" size="small"
                    >This shift</hmi-heading
                >
                <hmi-text size="small" tone="muted"
                    >Your plan, in order. Drag a row by its handle, or focus
                    the handle and press Alt with the arrow keys.</hmi-text
                >
                <hmi-list
                    reorderable
                    .items=${state.priorities}
                    @hmi-reorder=${(event: CustomEvent<ListReorderDetail>) => {
                        state.priorities = event.detail.items;
                    }}
                ></hmi-list>
            </hmi-card>
        </div>

        <hmi-drawer
            .open=${state.filtersOpen}
            heading="Filters"
            description="They narrow every mailbox until you clear them."
            @hmi-close=${() => update({ filtersOpen: false })}
        >
            <div class="inbox-filters">
                <fieldset class="inbox-group">
                    <legend>Category</legend>
                    ${CATEGORIES.map(
                        ({ value, label }) =>
                            html`<hmi-checkbox
                                .checked=${state.categories.includes(value)}
                                @hmi-change=${(
                                    event: CustomEvent<CheckedDetail>,
                                ) =>
                                    update({
                                        categories: event.detail.checked
                                            ? [...state.categories, value]
                                            : state.categories.filter(
                                                  (each) => each !== value,
                                              ),
                                        page: 1,
                                    })}
                                >${label}</hmi-checkbox
                            >`,
                    )}
                </fieldset>
                <hmi-radio-group
                    label="From"
                    .options=${TEAMS}
                    .value=${state.team}
                    @hmi-change=${(
                        event: CustomEvent<{ value: 'anyone' | Team }>,
                    ) => update({ team: event.detail.value, page: 1 })}
                ></hmi-radio-group>
                <hmi-switch
                    .checked=${state.attachments}
                    @hmi-change=${(event: CustomEvent<CheckedDetail>) =>
                        update({ attachments: event.detail.checked, page: 1 })}
                    >Only messages with attachments</hmi-switch
                >
            </div>
            <hmi-button
                slot="actions"
                variant="ghost"
                ?disabled=${!filterCount()}
                @click=${clearFilters}
                >Clear</hmi-button
            >
            <hmi-button
                slot="actions"
                variant="primary"
                @click=${() => update({ filtersOpen: false })}
                >Show ${shown().length} messages</hmi-button
            >
        </hmi-drawer>

        <hmi-command-palette
            .open=${state.paletteOpen}
            .commands=${commands()}
            placeholder="Search the messages, or jump to a mailbox…"
            @hmi-close=${() => update({ paletteOpen: false })}
            @hmi-action=${run}
        ></hmi-command-palette>

        <hmi-modal
            .open=${state.composeOpen}
            heading="New message"
            description="It reaches their inbox on every console of the plant."
            .actions=${COMPOSE_ACTIONS}
            @hmi-close=${() => update({ composeOpen: false })}
            @hmi-action=${compose}
        >
            <form class="inbox-compose" @submit=${(event: Event) => event.preventDefault()}>
                <hmi-select
                    name="to"
                    label="To"
                    placeholder="Choose someone"
                    .options=${RECIPIENTS}
                    required
                ></hmi-select>
                <hmi-input name="subject" label="Subject" required></hmi-input>
                <hmi-textarea name="message" label="Message" rows="5" required></hmi-textarea>
            </form>
        </hmi-modal>
    `;
}

update();
