// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import { getToasts } from '../shared/toast.js';
import { toast } from './toast.js';

it('renders declarative shadow DOM with an empty live-region stack on the server', async () => {
    const out = await collectResult(render(html`<hmi-toast></hmi-toast>`));
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('popover="manual"');
    expect(out).toContain('aria-live="polite"');
    expect(out).toContain('part="base list"');
    expect(out).not.toContain('role="status"');
});

it('does not queue a toast on the server, where a queue would leak between requests', () => {
    expect(toast.show({ title: 'Saved' })).toBe(0);
    toast.dismiss(1);
    expect(getToasts()).toEqual([]);
});
