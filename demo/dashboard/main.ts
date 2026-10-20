/* The page is a lit template, since lit is already the elements' only
   dependency; any framework renders the same tags. */

import './dashboard.css';
import { html, render } from 'lit';
import '../../src/elements/badge/badge.js';
import '../../src/elements/bar-chart/bar-chart.js';
import '../../src/elements/button/button.js';
import '../../src/elements/card/card.js';
import '../../src/elements/gauge/gauge.js';
import '../../src/elements/heading/heading.js';
import '../../src/elements/legend/legend.js';
import '../../src/elements/line-chart/line-chart.js';
import '../../src/elements/list/list.js';
import '../../src/elements/meter/meter.js';
import '../../src/elements/progress/progress.js';
import '../../src/elements/responsive-container/responsive-container.js';
import '../../src/elements/sparkline/sparkline.js';
import '../../src/elements/stat/stat.js';
import '../../src/elements/switch/switch.js';
import '../../src/elements/table/table.js';
import '../../src/elements/text/text.js';
import type { ResponsiveContainerResizeDetail } from '../../src/elements/responsive-container/responsive-container.js';
import type { CheckedDetail } from '../../src/elements/shared/checkable.js';
import type { TableColumn } from '../../src/elements/table/table.js';
import { toast } from '../../src/elements/toast/toast.js';
import { mountShell } from '../shared/shell.js';
import {
    ALARMS,
    type Alarm,
    HOURS,
    KPIS,
    OUTPUT,
    STATIONS,
    THROUGHPUT,
} from './data.js';

mountShell('dashboard', '../');

const app = document.getElementById('app') as HTMLElement;

let alarms = ALARMS;
let live = true;
let throughput = [...THROUGHPUT.actual];
const gauges = { temperature: 186, pressure: 4.2, load: 71 };

const SEVERITY_VARIANT = { 1: 'danger', 2: 'warning', 3: 'info' } as const;

const columns: TableColumn[] = [
    {
        key: 'time',
        label: 'Time',
        style: { width: 'calc(var(--hmi-base) * 10)' },
    },
    { key: 'station', label: 'Station' },
    { key: 'message', label: 'Message', sortable: false },
    {
        key: 'level',
        label: 'Severity',
        kind: 'badge',
        format: '{severity}',
        badgeDot: true,
        badgeVariant: (value) =>
            SEVERITY_VARIANT[value as keyof typeof SEVERITY_VARIANT],
    },
    {
        key: 'status',
        label: 'Status',
        kind: 'badge',
        badgeVariant: { Active: 'primary', Acknowledged: 'default' },
    },
    {
        key: 'action',
        label: 'Action',
        sortable: false,
        // A button only where there is something to acknowledge.
        render: (row) =>
            row.status === 'Active'
                ? html`<hmi-button
                      size="small"
                      variant="secondary"
                      @click=${() => acknowledge(row as Alarm)}
                      >Acknowledge</hmi-button
                  >`
                : '',
    },
];

const lineSeries = () => [
    { name: 'Actual', data: throughput, color: 'var(--primary)' },
    { name: 'Target', data: THROUGHPUT.target, color: 'var(--outline)' },
];

const scrapSeries = [
    { name: 'Scrap', data: OUTPUT.scrap, color: 'var(--error)' },
];

const formatUnits = (value: number) => value.toLocaleString('en-GB');

const sum = (values: readonly number[]) =>
    values.reduce((total, value) => total + value, 0);
const good = sum(OUTPUT.good);
const scrap = sum(OUTPUT.scrap);
const scrapRate = ((scrap / (good + scrap)) * 100).toFixed(1);

const SHIFT_FACTS = [
    { id: 'changeovers', title: 'Changeovers', right: '2 of 3' },
    { id: 'maintenance', title: 'Next maintenance', right: 'Press, 16:30' },
    { id: 'crew', title: 'Operators on shift', right: '14' },
];

// A chart needs its size in px; the container measures it.
function fit(event: CustomEvent<ResponsiveContainerResizeDetail>): void {
    const chart = (event.currentTarget as HTMLElement)
        .firstElementChild as HTMLElement & { width: number; height: number };
    chart.width = event.detail.width;
    chart.height = event.detail.height;
}

function acknowledge(row: Alarm): void {
    alarms = alarms.map((alarm) =>
        alarm.id === row.id ? { ...alarm, status: 'Acknowledged' } : alarm,
    );
    update();
    toast.success('Alarm acknowledged', `${row.station}: ${row.message}`);
}

function setLive(event: CustomEvent<CheckedDetail>): void {
    live = event.detail.checked;
    update();
}

const view = () => {
    const active = alarms.filter((alarm) => alarm.status === 'Active').length;
    const latest = throughput[throughput.length - 1] ?? 0;
    return html`
        <div class="demo-page-head">
            <div>
                <hmi-heading level="1" size="xlarge">Line 3 · Operations</hmi-heading>
                <hmi-text tone="muted">
                    Day shift, 06:00 to 18:00 · ${active} active
                    ${active === 1 ? 'alarm' : 'alarms'}
                </hmi-text>
            </div>
            <hmi-switch ?checked=${live} @hmi-change=${setLive}>Live data</hmi-switch>
        </div>

        <section class="dash-kpis" aria-label="Key figures">
            ${KPIS.map(
                (kpi) => html`<hmi-stat trend=${kpi.trend}>
                    <span slot="label">${kpi.label}</span>
                    <span slot="value"
                        >${kpi.id === 'throughput' ? `${formatUnits(latest)} u/h` : kpi.value}</span
                    >
                    <span slot="delta">${kpi.delta}</span>
                    <span slot="help-text" class="dash-help">
                        <hmi-sparkline
                            .data=${kpi.id === 'throughput' ? throughput : kpi.spark}
                            color=${kpi.color}
                            area
                            width="88"
                            height="24"
                            label=${`${kpi.label} today`}
                        ></hmi-sparkline>
                        ${kpi.help}
                    </span>
                </hmi-stat>`,
            )}
        </section>

        <section class="dash-charts">
            <hmi-card class="dash-wide">
                <hmi-heading slot="header" level="2" size="small"
                    >Throughput, units per hour from 06:00</hmi-heading
                >
                <hmi-responsive-container height="240" @hmi-resize=${fit}>
                    <hmi-line-chart
                        label="Throughput per hour, actual against target"
                        show-dots
                        min="900"
                        max="1350"
                        .labels=${HOURS}
                        .series=${lineSeries()}
                    ></hmi-line-chart>
                </hmi-responsive-container>
                <hmi-legend
                    slot="footer"
                    .items=${lineSeries().map(({ name, color }) => ({ label: name, color }))}
                ></hmi-legend>
            </hmi-card>

            <hmi-card>
                <hmi-heading slot="header" level="2" size="small">Process</hmi-heading>
                <div class="dash-gauges">
                    <figure>
                        <hmi-gauge
                            value=${gauges.temperature}
                            min="0"
                            max="250"
                            size="120"
                            color=${gauges.temperature > 200 ? 'var(--warning)' : 'var(--primary)'}
                            label="Oven temperature"
                            ><span slot="caption">${gauges.temperature} °C</span></hmi-gauge
                        >
                        <figcaption>Oven</figcaption>
                    </figure>
                    <figure>
                        <hmi-gauge
                            value=${gauges.pressure}
                            min="0"
                            max="6"
                            size="120"
                            color="var(--tertiary)"
                            label="Line pressure"
                            ><span slot="caption">${gauges.pressure.toFixed(1)} bar</span></hmi-gauge
                        >
                        <figcaption>Hydraulics</figcaption>
                    </figure>
                    <figure>
                        <hmi-gauge
                            value=${gauges.load}
                            min="0"
                            max="100"
                            size="120"
                            color=${gauges.load > 85 ? 'var(--error)' : 'var(--success)'}
                            label="Spindle load"
                            ><span slot="caption">${gauges.load}%</span></hmi-gauge
                        >
                        <figcaption>Spindle</figcaption>
                    </figure>
                </div>
            </hmi-card>

            <hmi-card class="dash-wide">
                <hmi-heading slot="header" level="2" size="small">Scrap by station, since 06:00</hmi-heading>
                <hmi-responsive-container height="220" @hmi-resize=${fit}>
                    <hmi-bar-chart
                        label="Scrapped units by station"
                        .labels=${STATIONS}
                        .series=${scrapSeries}
                    ></hmi-bar-chart>
                </hmi-responsive-container>
                <hmi-text slot="footer" size="small" tone="muted">
                    ${formatUnits(good)} good units · scrap rate ${scrapRate}%
                </hmi-text>
            </hmi-card>

            <hmi-card>
                <hmi-heading slot="header" level="2" size="small">Shift</hmi-heading>
                <div class="dash-shift">
                    <div>
                        <hmi-text size="small">Elapsed, 8 h 10 min of 12 h</hmi-text>
                        <hmi-progress value="68" label="Shift elapsed"></hmi-progress>
                    </div>
                    <hmi-meter
                        value="74"
                        max="100"
                        low="60"
                        high="90"
                        optimum="100"
                        show-value
                        ><span slot="label">Output against plan</span></hmi-meter
                    >
                    <hmi-list .items=${SHIFT_FACTS}></hmi-list>
                </div>
            </hmi-card>
        </section>

        <hmi-card>
            <div slot="header" class="dash-card-head">
                <hmi-heading level="2" size="small">Alarms</hmi-heading>
                <hmi-badge variant=${active > 0 ? 'danger' : 'default'}>${active} active</hmi-badge>
            </div>
            <hmi-table
                row-key="id"
                sort-key="level"
                .columns=${columns}
                .rows=${alarms}
            ></hmi-table>
        </hmi-card>
    `;
};

function update(): void {
    render(view(), app);
}

// A small random walk every few seconds, so the page looks connected.
const drift = (value: number, step: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value + (Math.random() - 0.5) * 2 * step));

window.setInterval(() => {
    if (!live) return;
    gauges.temperature = Math.round(drift(gauges.temperature, 4, 160, 215));
    gauges.pressure =
        Math.round(drift(gauges.pressure, 0.2, 3.4, 5.2) * 10) / 10;
    gauges.load = Math.round(drift(gauges.load, 5, 40, 95));
    const last = throughput[throughput.length - 1] ?? 1250;
    throughput = [
        ...throughput.slice(0, -1),
        Math.round(drift(last, 25, 1180, 1340)),
    ];
    update();
}, 3000);

update();
