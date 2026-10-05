// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './password-input.js';

it('renders declarative shadow DOM with a password field and the toggle on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-password-input
                name="password"
                label="Password"
                hint="Click the eye to reveal"
            ></hmi-password-input>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('type="password"');
    expect(out).toContain('part="toggle"');
    expect(out).toContain('aria-label="Show password"');
    expect(out).toContain('aria-pressed="false"');
    expect(out).toContain('Password');
    expect(out).toContain('Click the eye to reveal');
});
