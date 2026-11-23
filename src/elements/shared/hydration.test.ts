// Lit's hydration support goes first: lit-element installs it as it loads.
import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
import { afterEach, describe, expect, it } from 'vitest';
import { commands } from 'vitest/browser';
import '../stat/stat.js';

declare module 'vitest/browser' {
    interface BrowserCommands {
        renderOnServer: (markup: string, modules: string[]) => Promise<string>;
    }
}

/* Each element rendered on the server, by @lit-labs/ssr in Node, then put in
   the page and hydrated by Lit, as Next.js, Angular SSR or Dioxus fullstack
   would. A hydrated root fires no slotchange for the slots it already fills,
   so an element that reads its slots only on slotchange never sees what the
   server sent. Each row checks that what the slots hold shows once hydrated;
   an element whose review covers server rendering adds its row. */
const cases: ReadonlyArray<{
    name: string;
    markup: string;
    shown: (root: ShadowRoot) => Array<Element | null | undefined>;
}> = [
    {
        name: 'hmi-stat',
        markup: `<hmi-stat trend="up"><span slot="label">Revenue</span><span slot="value">$12.4k</span><span slot="delta">8%</span><span slot="help-text">vs last month</span></hmi-stat>`,
        shown: (root) => [
            root.querySelector('[part~="footer"]'),
            root.querySelector('.delta'),
        ],
    },
];

const tagOf = (markup: string) => /^<([a-z-]+)/.exec(markup)?.[1] ?? '';

afterEach(() => {
    document.body.replaceChildren();
});

describe('shows slotted content once hydrated', () => {
    for (const { name, markup, shown } of cases) {
        it(name, async () => {
            const tag = tagOf(markup);
            const kebab = tag.replace(/^hmi-/, '');
            const sent = await commands.renderOnServer(markup, [
                `src/elements/${kebab}/${kebab}.ts`,
            ]);
            const host = document.createElement('div');
            host.setHTMLUnsafe(sent);
            document.body.append(host);
            const el = host.querySelector(tag) as HTMLElement & {
                updateComplete: Promise<boolean>;
            };
            const root = el.shadowRoot as ShadowRoot;
            /* the server's root, kept rather than rendered again */
            expect(root.querySelector('style')).not.toBeNull();
            await el.updateComplete;
            await new Promise((resolve) => requestAnimationFrame(resolve));
            await el.updateComplete;
            const hidden = shown(root)
                .map((node, i) =>
                    !node || node.closest('[hidden]') ? i : undefined,
                )
                .filter((i) => i !== undefined);
            expect(hidden).toEqual([]);
        });
    }
});
