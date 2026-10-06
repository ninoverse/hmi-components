// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './slider.js';

it('renders declarative shadow DOM with a range input and the value on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-slider
                label="Volume"
                hint="Keep it down"
                value="40"
                show-value
                format-value="{value}%"
            ></hmi-slider>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('type="range"');
    expect(out).toContain('--slider-pct:40%');
    expect(out).toContain('aria-valuetext="40%"');
    expect(out).toContain('40%');
    expect(out).toContain('Volume');
    expect(out).toContain('Keep it down');
});
