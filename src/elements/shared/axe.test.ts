import axe from 'axe-core';
import { html, render, type TemplateResult } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import '../index.js';

/* axe-core over each element, rendered the way a consumer minimally would,
   into a page landmark. It reaches into shadow roots, so it catches what an
   element's own tests may not: a control left without a name, a role without
   its required parts. Each element's review adds its row, once its findings
   are decided, so a row asserts the state the review agreed. Colour contrast
   depends on the theme, which these tests don't load: themes.test.ts checks
   it in every look. */
const cases: ReadonlyArray<{ name: string; template: TemplateResult }> = [
    {
        name: 'hmi-alert',
        template: html`<hmi-alert variant="danger"
            ><span slot="title">Upload failed</span>The file could not be sent.<button
                slot="action"
            >
                Retry
            </button></hmi-alert
        >`,
    },
    {
        name: 'hmi-aspect-ratio',
        template: html`<hmi-aspect-ratio ratio="16/9"
            ><img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Crect width='160' height='90' fill='%233d7a4f'/%3E%3C/svg%3E"
                alt="A green field"
        /></hmi-aspect-ratio>`,
    },
    {
        name: 'hmi-avatar',
        template: html`<hmi-avatar name="Ada Lovelace" status="away"></hmi-avatar>`,
    },
    {
        name: 'hmi-avatar with an image',
        template: html`<hmi-avatar
            name="Ada Lovelace"
            status="online"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
        ></hmi-avatar>`,
    },
    {
        name: 'hmi-avatar without a name',
        template: html`<hmi-avatar></hmi-avatar>`,
    },
    {
        name: 'hmi-avatar-stack',
        template: html`<hmi-avatar-stack
            .names=${[
                { name: 'Ada Lovelace', status: 'online' },
                'Alan Turing',
                'Grace Hopper',
                'Linus Torvalds',
                'Barbara Liskov',
            ]}
            max="3"
        ></hmi-avatar-stack>`,
    },
    {
        name: 'hmi-banner',
        template: html`<hmi-banner variant="warning" dismissible
            ><span slot="title">Update available</span>A new version is ready.<button
                slot="action"
            >
                Update
            </button></hmi-banner
        >`,
    },
    {
        name: 'hmi-badge',
        template: html`<hmi-badge variant="success" dot>Online</hmi-badge>`,
    },
    {
        name: 'hmi-blockquote',
        template: html`<hmi-blockquote source="https://example.com"
            ><p>That brain of mine is something more than mortal.</p>
            <p>Time will show.</p><span slot="cite">Ada Lovelace</span></hmi-blockquote
        >`,
    },
    {
        name: 'hmi-card',
        template: html`<hmi-card active
            ><hmi-heading slot="header" level="2" size="small">Line 3</hmi-heading
            ><hmi-text>Running at 92% of its rated output.</hmi-text
            ><hmi-link slot="footer" href="#line-3">Open the line</hmi-link></hmi-card
        >`,
    },
    {
        name: 'hmi-card, ink',
        template: html`<hmi-card variant="ink"
            ><hmi-heading slot="header" level="2" size="small">Shift notes</hmi-heading
            ><hmi-text>Press 2 is down for maintenance until 14:00.</hmi-text></hmi-card
        >`,
    },
    {
        name: 'hmi-chip',
        template: html`<hmi-chip>Static</hmi-chip
            ><hmi-chip selectable selected closable
                ><svg slot="icon" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6" /></svg
                >Pinned</hmi-chip
            >`,
    },
    {
        name: 'hmi-code',
        template: html`<p>Run <hmi-code>pnpm add @ninoverse/hmi-components</hmi-code></p
            ><hmi-code block style="width: 160px"
                >const message = 'far longer than the box it sits in';</hmi-code
            >`,
    },
    {
        name: 'hmi-empty-state',
        template: html`<hmi-empty-state
            ><svg slot="icon" viewBox="0 0 24 24"><title>Empty inbox</title></svg
            ><span slot="title">Inbox zero</span
            ><span slot="description">No new messages.</span
            ><button slot="action">Refresh</button></hmi-empty-state
        >`,
    },
    {
        name: 'hmi-empty-state without a title',
        template: html`<hmi-empty-state
            ><span slot="description">Nothing here yet.</span></hmi-empty-state
        >`,
    },
    {
        name: 'hmi-kbd',
        template: html`<p>
            Press
            <kbd><hmi-kbd>Ctrl</hmi-kbd> + <hmi-kbd>K</hmi-kbd></kbd>
        </p>`,
    },
    {
        name: 'hmi-kbd with a label',
        template: html`<p>
            Press <hmi-kbd label="Command">⌘</hmi-kbd>
            <hmi-kbd size="small" label="Escape"></hmi-kbd>
        </p>`,
    },
    {
        name: 'hmi-meter',
        template: html`<hmi-meter value="0.8" low="0.3" high="0.7" show-value
            ><span slot="label">Disk</span></hmi-meter
        >`,
    },
    {
        name: 'hmi-meter with a label and value text',
        template: html`<hmi-meter value="0.4" label="Memory" value-text="40%"></hmi-meter>`,
    },
    {
        name: 'hmi-meter with a value that is not a number',
        template: html`<hmi-meter value="abc" max="-1" label="Swap"></hmi-meter>`,
    },
    {
        name: 'hmi-progress',
        template: html`<hmi-progress value="3" max="7" show-value value-text="3 of 7 files"
            ><span slot="label">Backup</span></hmi-progress
        >`,
    },
    {
        name: 'hmi-progress named by aria-label, indeterminate',
        template: html`<hmi-progress indeterminate aria-label="Syncing"></hmi-progress>`,
    },
    {
        name: 'hmi-progress with a value that is not a number',
        template: html`<hmi-progress value="abc" max="0" label="Upload"></hmi-progress>`,
    },
    {
        name: 'hmi-skeleton',
        template: html`<hmi-skeleton variant="circle" width="40"></hmi-skeleton>`,
    },
    {
        name: 'hmi-skeleton in a region that is loading',
        template: html`<section aria-busy="true" aria-label="Profile"
            ><hmi-skeleton width="80%"></hmi-skeleton><hmi-skeleton variant="rect" height="24"></hmi-skeleton
        ></section>`,
    },
    {
        name: 'hmi-spinner',
        template: html`<hmi-spinner label="Fetching"></hmi-spinner>`,
    },
    {
        name: 'hmi-spinner decorative, in a button',
        template: html`<hmi-button
            ><hmi-spinner slot="left-icon" size="small" label=""></hmi-spinner>Saving</hmi-button
        >`,
    },
    {
        name: 'hmi-stat',
        template: html`<hmi-stat trend="up"
            ><span slot="label">Revenue</span><span slot="value">$12.4k</span
            ><span slot="delta">8%</span
            ><span slot="help-text">vs last month</span></hmi-stat
        >`,
    },
    {
        name: 'hmi-stat with an image icon and no label',
        template: html`<hmi-stat trend="down" tone="positive"
            ><img slot="icon" alt="" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" /><span
                slot="value"
                >12</span
            ></hmi-stat
        >`,
    },
];

afterEach(() => {
    document.body.replaceChildren();
});

describe('axe finds no violation', () => {
    for (const { name, template } of cases) {
        it(name, async () => {
            const host = document.createElement('main');
            document.body.append(host);
            render(template, host);
            const el = host.firstElementChild as HTMLElement & {
                updateComplete: Promise<unknown>;
            };
            await el.updateComplete;

            const { violations } = await axe.run(host, {
                rules: { 'color-contrast': { enabled: false } },
            });
            expect(
                violations.map(
                    (v) =>
                        `${v.id}: ${v.nodes.map((n) => n.target.join(' > ')).join(', ')}`,
                ),
            ).toEqual([]);
        });
    }
});
