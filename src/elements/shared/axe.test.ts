import axe from 'axe-core';
import { html, render, type TemplateResult } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import '../index.js';

/* axe-core over each element, rendered the way a consumer minimally would,
   into a page landmark. It reaches into shadow roots, so it catches what an
   element's own tests may not: a control left without a name, a role without
   its required parts. Each element's review adds its row, once its findings
   are decided, so a row asserts the state the review agreed. Colour contrast
   depends on the theme, which these tests don't load: the review checks it in
   every look. */
const cases: ReadonlyArray<{ name: string; template: TemplateResult }> = [
    {
        name: 'hmi-badge',
        template: html`<hmi-badge variant="success" dot>Online</hmi-badge>`,
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
