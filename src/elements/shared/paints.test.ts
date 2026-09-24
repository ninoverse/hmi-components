import { html, render, type TemplateResult } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import '../index.js';

/* Every migrated element, rendered the way a consumer minimally would.
   A node that renders but paints nothing still satisfies a `[part="base"]`
   existence check — that is how hmi-skeleton shipped invisible through lint,
   build, tests and the manifest (#124). This asserts the base actually
   occupies a box. Add a row here with every new element. */
const cases: ReadonlyArray<{
    tag: string;
    template: TemplateResult;
    setup?: (el: HTMLElement) => void;
}> = [
    { tag: 'hmi-avatar', template: html`<hmi-avatar name="Ada"></hmi-avatar>` },
    {
        tag: 'hmi-avatar-stack',
        template: html`<hmi-avatar-stack></hmi-avatar-stack>`,
        // `names` is a JS property: arrays are never serialised to attributes.
        setup: (el) => {
            (el as HTMLElement & { names: readonly string[] }).names = [
                'Ada',
                'Alan',
            ];
        },
    },
    { tag: 'hmi-badge', template: html`<hmi-badge>Badge</hmi-badge>` },
    { tag: 'hmi-card', template: html`<hmi-card>Body</hmi-card>` },
    { tag: 'hmi-code', template: html`<hmi-code>npm i</hmi-code>` },
    { tag: 'hmi-kbd', template: html`<hmi-kbd>K</hmi-kbd>` },
    {
        tag: 'hmi-skeleton',
        template: html`<hmi-skeleton variant="circle"></hmi-skeleton>`,
    },
    { tag: 'hmi-spinner', template: html`<hmi-spinner></hmi-spinner>` },
];

afterEach(() => {
    document.body.replaceChildren();
});

describe('every element paints a visible base', () => {
    for (const { tag, template, setup } of cases) {
        it(tag, async () => {
            /* A real width to resolve percentage sizing against, the way the
               page would provide one. */
            const host = document.createElement('div');
            host.style.width = '400px';
            document.body.append(host);
            render(template, host);

            const el = host.firstElementChild as HTMLElement & {
                updateComplete: Promise<unknown>;
            };
            setup?.(el);
            await el.updateComplete;

            const base = el.shadowRoot?.querySelector('[part~="base"]');
            expect(base, `${tag} has no [part="base"]`).not.toBeNull();

            const box = (base as HTMLElement).getBoundingClientRect();
            expect(box.width, `${tag} base has zero width`).toBeGreaterThan(0);
            expect(box.height, `${tag} base has zero height`).toBeGreaterThan(
                0,
            );
        });
    }
});
