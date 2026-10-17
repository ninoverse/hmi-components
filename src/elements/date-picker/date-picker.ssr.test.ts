// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './date-picker.js';

it('renders declarative shadow DOM with the trigger and the chosen day on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-date-picker
                label="Start"
                hint="When it begins"
                value="2026-05-15"
            ></hmi-date-picker>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<hmi-popover');
    expect(out).toContain('Start');
    expect(out).toContain('When it begins');
    expect(out).toContain('part="value"');
    expect(out).toContain('15 May 2026');
});

it('renders the placeholder on the server while nothing is chosen', async () => {
    const out = await collectResult(
        render(html`<hmi-date-picker placeholder="When?"></hmi-date-picker>`),
    );
    expect(out).toContain('part="placeholder"');
    expect(out).toContain('When?');
});

it('renders a range as its two ends', async () => {
    const out = await collectResult(
        render(
            html`<hmi-date-picker
                mode="range"
                .value=${{ start: '2026-05-15', end: '2026-05-20' }}
            ></hmi-date-picker>`,
        ),
    );
    expect(out).toContain('15 May 2026 – 20 May 2026');
});

it('does not build the calendar on the server, even for an open picker: it needs today', async () => {
    const out = await collectResult(
        render(
            html`<hmi-date-picker open value="2026-05-15"></hmi-date-picker>`,
        ),
    );
    expect(out).not.toContain('role="grid"');
    expect(out).not.toContain('role="dialog"');
});
