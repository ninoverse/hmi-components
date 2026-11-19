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
