// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './stepper.js';

it('renders declarative shadow DOM with the steps on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-stepper
                current="pay"
                spacing="3rem"
                orientation="vertical"
                .steps=${[
                    { value: 'cart', label: 'Cart' },
                    {
                        value: 'pay',
                        label: 'Payment',
                        description: 'Card or invoice',
                    },
                    { value: 'done', label: 'Done' },
                ]}
            ></hmi-stepper>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<ol');
    expect(out).toContain('aria-label="Progress steps"');
    expect(out).toContain('data-status="completed"');
    expect(out).toContain('data-status="active"');
    expect(out).toContain('aria-current="step"');
    expect(out).toContain('Card or invoice');
    expect(out).toContain('--stepper-item-gap');
});
