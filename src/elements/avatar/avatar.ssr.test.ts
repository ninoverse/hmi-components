// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './avatar.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-avatar
                name="Ada Lovelace"
                size="large"
                status="online"
            ></hmi-avatar>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="status"');
    expect(out).toContain('AL');
});

it('hashes the tint identically on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-avatar name="Ada Lovelace"></hmi-avatar>`),
    );
    expect(out).toContain('#DEEFEC');
    expect(out).toContain('#1F5B58');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Ada Lovelace"');
});
