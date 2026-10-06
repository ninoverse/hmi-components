// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './radio-group.js';

it('renders declarative shadow DOM with a radio group and its label on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-radio-group
                name="plan"
                label="Plan"
                hint="Pick one"
                value="pro"
                .options=${[
                    { value: 'free', label: 'Free' },
                    { value: 'pro', label: 'Pro' },
                ]}
            ></hmi-radio-group>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="radiogroup"');
    expect(out).toContain('Plan');
    expect(out).toContain('Pick one');
    expect(out).toContain('<hmi-radio');
});
