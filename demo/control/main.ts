/* One machine's operator panel. The page is a lit template, as on the
   dashboard; the machine is simulated in this file. */

import './control.css';
import { html, nothing, render } from 'lit';
import '../../src/elements/alert/alert.js';
import '../../src/elements/badge/badge.js';
import '../../src/elements/banner/banner.js';
import '../../src/elements/button/button.js';
import '../../src/elements/card/card.js';
import '../../src/elements/confirm-dialog/confirm-dialog.js';
import '../../src/elements/gauge/gauge.js';
import '../../src/elements/heading/heading.js';
import '../../src/elements/kbd/kbd.js';
import '../../src/elements/meter/meter.js';
import '../../src/elements/number-input/number-input.js';
import '../../src/elements/progress/progress.js';
import '../../src/elements/segmented-control/segmented-control.js';
import '../../src/elements/slider/slider.js';
import '../../src/elements/switch/switch.js';
import '../../src/elements/text/text.js';
import '../../src/elements/timeline/timeline.js';
import '../../src/elements/tooltip/tooltip.js';
import '../../src/elements/value-scale-selector/value-scale-selector.js';
import type { NumberInputValueDetail } from '../../src/elements/number-input/number-input.js';
import type { SegmentedControlValueDetail } from '../../src/elements/segmented-control/segmented-control.js';
import type { CheckedDetail } from '../../src/elements/shared/checkable.js';
import type { SliderValueDetail } from '../../src/elements/slider/slider.js';
import type {
    TimelineColor,
    TimelineItem,
} from '../../src/elements/timeline/timeline.js';
import { toast } from '../../src/elements/toast/toast.js';
import type { ValueScaleSelectorValueDetail } from '../../src/elements/value-scale-selector/value-scale-selector.js';
import { mountShell } from '../shared/shell.js';

mountShell('control', '../');

const app = document.getElementById('app') as HTMLElement;

type Status = 'running' | 'stopped';
type Mode = 'auto' | 'manual' | 'setup';

const MODES = [
    { value: 'auto', label: 'Auto' },
    { value: 'manual', label: 'Manual' },
    { value: 'setup', label: 'Setup' },
];

const machine = {
    status: 'stopped' as Status,
    mode: 'auto' as Mode,
    // Setpoints, from the sliders.
    speed: 60,
    force: 420,
    oilLimit: 55,
    // Readings, from the simulation.
    pressure: 0,
    oilTemp: 41,
    rpm: 0,
    // Wear and levels, in %.
    tank: 82,
    filter: 64,
    tool: 37,
    // Auxiliaries.
    lubrication: true,
    cooling: true,
    autoRestart: false,
    // The batch.
    batch: 400,
    made: 0,
    quality: 0,
};

let confirmEmergency = false;
let confirmSetup = false;
let maintenanceShown = true;
let log: TimelineItem[] = [];

const clock = () =>
    new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

function record(title: string, color: TimelineColor, description?: string) {
    const item: TimelineItem = { title, color, time: clock() };
    if (description) item.description = description;
    log = [item, ...log].slice(0, 6);
}

function start(): void {
    if (machine.status === 'running' || machine.mode === 'setup') return;
    if (machine.made >= machine.batch) machine.made = 0;
    machine.status = 'running';
    record('Started', 'success', `${modeLabel()} mode, ${machine.speed} mm/s`);
    update();
}

function stop(reason = 'Stopped by the operator'): void {
    if (machine.status === 'stopped') return;
    machine.status = 'stopped';
    record('Stopped', 'default', reason);
    update();
}

function emergencyStop(): void {
    confirmEmergency = false;
    machine.status = 'stopped';
    machine.pressure = 0;
    machine.rpm = 0;
    record('Emergency stop', 'error', 'The part in the die is scrapped');
    toast.danger(
        'Emergency stop',
        'Press 2 stopped. Clear the area before a restart.',
    );
    update();
}

const modeLabel = () =>
    MODES.find((mode) => mode.value === machine.mode)?.label ?? machine.mode;

function changeMode(event: CustomEvent<SegmentedControlValueDetail>): void {
    const next = event.detail.value as Mode;
    const control = event.currentTarget as HTMLElement & { value: string };
    if (next === 'setup' && machine.status === 'running') {
        // The control owns its value: put it back until the press has stopped.
        control.value = machine.mode;
        confirmSetup = true;
        update();
        return;
    }
    machine.mode = next;
    record(`${modeLabel()} mode`, 'primary');
    update();
}

function enterSetup(): void {
    confirmSetup = false;
    stop('Stopped to enter setup mode');
    machine.mode = 'setup';
    record('Setup mode', 'primary');
    update();
}

function setpoint(
    key: 'speed' | 'force' | 'oilLimit',
    label: string,
    unit: string,
) {
    return (event: CustomEvent<SliderValueDetail>) => {
        machine[key] = event.detail.value;
        record(`${label} set to ${event.detail.value} ${unit}`, 'default');
        update();
    };
}

function auxiliary(
    key: 'lubrication' | 'cooling' | 'autoRestart',
    label: string,
) {
    return (event: CustomEvent<CheckedDetail>) => {
        machine[key] = event.detail.checked;
        record(`${label} ${event.detail.checked ? 'on' : 'off'}`, 'default');
        update();
    };
}

function setBatch(event: CustomEvent<NumberInputValueDetail>): void {
    machine.batch = event.detail.value ?? machine.batch;
    update();
}

function rate(event: CustomEvent<ValueScaleSelectorValueDetail>): void {
    machine.quality = event.detail.value;
    toast.success('Thanks', `Last batch rated ${event.detail.value} of 5.`);
    record(`Batch rated ${event.detail.value} of 5`, 'primary');
    update();
}

// Shortcuts, outside text fields: S starts, X stops.
const TEXT_ENTRY =
    'textarea, [contenteditable], input:not([type="checkbox"], [type="radio"], [type="range"], [type="button"])';

document.addEventListener('keydown', (event) => {
    const target = event.composedPath()[0] as Element;
    if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        target.matches(TEXT_ENTRY)
    ) {
        return;
    }
    if (event.key === 's' || event.key === 'S') start();
    else if (event.key === 'x' || event.key === 'X') stop();
});

const view = () => {
    const running = machine.status === 'running';
    const overheating = machine.oilTemp > machine.oilLimit;
    const progress = Math.min(
        100,
        Math.round((machine.made / machine.batch) * 100),
    );
    return html`
        <div class="demo-page-head">
            <div>
                <div class="ctl-title">
                    <hmi-heading level="1" size="xlarge">Press 2 · Hydraulic press</hmi-heading>
                    <hmi-badge variant=${running ? 'success' : 'default'} dot
                        >${running ? 'Running' : 'Stopped'}</hmi-badge
                    >
                </div>
                <hmi-text tone="muted">Line 3, station Press · operator A. Rossi</hmi-text>
            </div>
            <hmi-segmented-control
                label="Mode"
                .options=${MODES}
                value=${machine.mode}
                @hmi-change=${changeMode}
            ></hmi-segmented-control>
        </div>

        ${
            maintenanceShown
                ? html`<hmi-banner
                      variant="info"
                      dismissible
                      @hmi-dismiss=${() => {
                          maintenanceShown = false;
                          update();
                      }}
                  >
                      <span slot="title">Maintenance at 16:30</span>
                      Filter change, about 20 minutes. Plan the batch to finish before then.
                  </hmi-banner>`
                : nothing
        }

        <section class="ctl-grid">
            <hmi-card class="ctl-run">
                <hmi-heading slot="header" level="2" size="small">Run</hmi-heading>
                <div class="ctl-buttons">
                    <hmi-tooltip label="Start the press (S)">
                        <hmi-button
                            slot="trigger"
                            variant="primary"
                            ?disabled=${running || machine.mode === 'setup'}
                            @click=${start}
                            >Start</hmi-button
                        >
                    </hmi-tooltip>
                    <hmi-tooltip label="Stop at the end of the stroke (X)">
                        <hmi-button
                            slot="trigger"
                            variant="secondary"
                            ?disabled=${!running}
                            @click=${() => stop()}
                            >Stop</hmi-button
                        >
                    </hmi-tooltip>
                    <hmi-button
                        variant="danger"
                        @click=${() => {
                            confirmEmergency = true;
                            update();
                        }}
                        >Emergency stop</hmi-button
                    >
                </div>
                <hmi-text size="small" tone="muted">
                    Shortcuts: <hmi-kbd>S</hmi-kbd> start, <hmi-kbd>X</hmi-kbd> stop.
                    ${machine.mode === 'setup' ? 'Leave setup mode to run.' : ''}
                </hmi-text>
                <div class="ctl-batch">
                    <div class="ctl-row">
                        <hmi-text size="small">Batch: ${machine.made} of ${machine.batch} parts</hmi-text>
                        <hmi-text size="small" tone="muted">${progress}%</hmi-text>
                    </div>
                    <hmi-progress value=${progress} label="Batch progress"></hmi-progress>
                    <hmi-number-input
                        label="Batch size"
                        min="10"
                        max="5000"
                        step="10"
                        value=${machine.batch}
                        @hmi-change=${setBatch}
                    ></hmi-number-input>
                </div>
            </hmi-card>

            <hmi-card>
                <hmi-heading slot="header" level="2" size="small">Readings</hmi-heading>
                ${
                    overheating
                        ? html`<hmi-alert variant="warning">
                              <span slot="title">Oil above ${machine.oilLimit} °C</span>
                              ${machine.cooling ? 'The cooling fan is on.' : 'Turn the cooling fan on.'}
                              ${
                                  machine.cooling
                                      ? nothing
                                      : html`<hmi-button
                                            slot="action"
                                            size="small"
                                            variant="secondary"
                                            @click=${() => {
                                                machine.cooling = true;
                                                record(
                                                    'Cooling fan on',
                                                    'default',
                                                );
                                                update();
                                            }}
                                            >Turn on</hmi-button
                                        >`
}
                          </hmi-alert>`
                        : nothing
                }
                <div class="ctl-gauges">
                    <figure>
                        <hmi-gauge value=${machine.pressure} min="0" max="250" size="112" label="Hydraulic pressure"
                            ><span slot="caption">${machine.pressure} bar</span></hmi-gauge
                        >
                        <figcaption>Pressure</figcaption>
                    </figure>
                    <figure>
                        <hmi-gauge
                            value=${machine.oilTemp}
                            min="20"
                            max="80"
                            size="112"
                            color=${overheating ? 'var(--warning)' : 'var(--tertiary)'}
                            label="Oil temperature"
                            ><span slot="caption">${machine.oilTemp} °C</span></hmi-gauge
                        >
                        <figcaption>Oil</figcaption>
                    </figure>
                    <figure>
                        <hmi-gauge value=${machine.rpm} min="0" max="1800" size="112" color="var(--success)" label="Motor speed"
                            ><span slot="caption">${machine.rpm} rpm</span></hmi-gauge
                        >
                        <figcaption>Motor</figcaption>
                    </figure>
                </div>
            </hmi-card>

            <hmi-card>
                <hmi-heading slot="header" level="2" size="small">Setpoints</hmi-heading>
                <div class="ctl-stack">
                    <hmi-slider
                        label="Stroke speed"
                        min="20"
                        max="120"
                        step="5"
                        value=${machine.speed}
                        show-value
                        format-value="{value} mm/s"
                        ?disabled=${machine.mode === 'setup'}
                        @hmi-change=${setpoint('speed', 'Stroke speed', 'mm/s')}
                    ></hmi-slider>
                    <hmi-slider
                        label="Clamp force"
                        min="100"
                        max="800"
                        step="10"
                        value=${machine.force}
                        show-value
                        format-value="{value} kN"
                        @hmi-change=${setpoint('force', 'Clamp force', 'kN')}
                    ></hmi-slider>
                    <hmi-slider
                        label="Oil temperature limit"
                        min="40"
                        max="70"
                        value=${machine.oilLimit}
                        show-value
                        format-value="{value} °C"
                        @hmi-change=${setpoint('oilLimit', 'Oil limit', '°C')}
                    ></hmi-slider>
                </div>
            </hmi-card>

            <hmi-card>
                <hmi-heading slot="header" level="2" size="small">Auxiliaries</hmi-heading>
                <div class="ctl-stack">
                    <hmi-switch
                        .checked=${machine.lubrication}
                        @hmi-change=${auxiliary('lubrication', 'Lubrication')}
                        >Lubrication pump</hmi-switch
                    >
                    <hmi-switch
                        .checked=${machine.cooling}
                        @hmi-change=${auxiliary('cooling', 'Cooling fan')}
                        >Cooling fan</hmi-switch
                    >
                    <hmi-switch
                        .checked=${machine.autoRestart}
                        @hmi-change=${auxiliary('autoRestart', 'Auto restart')}
                        hint="Start the next batch when this one ends."
                        >Auto restart</hmi-switch
                    >
                    <hmi-switch
                        checked
                        disabled
                        hint="Safety interlock: it cannot be turned off here."
                        >Light curtain</hmi-switch
                    >
                </div>
            </hmi-card>

            <hmi-card>
                <hmi-heading slot="header" level="2" size="small">Levels and wear</hmi-heading>
                <div class="ctl-stack">
                    <hmi-meter value=${machine.tank} max="100" low="25" high="50" optimum="100" show-value
                        ><span slot="label">Oil tank</span></hmi-meter
                    >
                    <hmi-meter value=${machine.filter} max="100" low="50" high="80" optimum="0" show-value
                        ><span slot="label">Filter clogging</span></hmi-meter
                    >
                    <hmi-meter value=${Math.round(machine.tool)} max="100" low="60" high="85" optimum="0" show-value
                        ><span slot="label">Tool wear</span></hmi-meter
                    >
                </div>
            </hmi-card>

            <hmi-card>
                <hmi-heading slot="header" level="2" size="small">Quality</hmi-heading>
                <hmi-value-scale-selector
                    label="Rate the last batch"
                    max="5"
                    value=${machine.quality}
                    value-text="{value} of {max}"
                    hint="Your rating goes into the shift report."
                    @hmi-change=${rate}
                ></hmi-value-scale-selector>
            </hmi-card>

            <hmi-card class="ctl-log">
                <hmi-heading slot="header" level="2" size="small">Event log</hmi-heading>
                ${
                    log.length > 0
                        ? html`<hmi-timeline .items=${log}></hmi-timeline>`
                        : html`<hmi-text tone="muted">Nothing yet: start the press, or change a setpoint.</hmi-text>`
                }
            </hmi-card>
        </section>

        <hmi-confirm-dialog
            ?open=${confirmEmergency}
            variant="danger"
            heading="Emergency stop?"
            description="The press stops at once and the part in the die is scrapped."
            confirm-label="Stop now"
            @hmi-confirm=${emergencyStop}
            @hmi-cancel=${() => {
                confirmEmergency = false;
                update();
            }}
        ></hmi-confirm-dialog>
        <hmi-confirm-dialog
            ?open=${confirmSetup}
            heading="Stop the press for setup?"
            description="Setup mode needs the press stopped. The stroke in progress finishes first."
            confirm-label="Stop and enter setup"
            @hmi-confirm=${enterSetup}
            @hmi-cancel=${() => {
                confirmSetup = false;
                update();
            }}
        ></hmi-confirm-dialog>
    `;
};

function update(): void {
    render(view(), app);
}

// The machine, every 1.5 s: readings follow the setpoints while it runs.
const towards = (value: number, target: number, rate: number) =>
    value + (target - value) * rate;

window.setInterval(() => {
    const running = machine.status === 'running';
    machine.pressure = Math.round(
        towards(machine.pressure, running ? machine.force * 0.28 : 0, 0.5),
    );
    machine.rpm = Math.round(
        towards(machine.rpm, running ? machine.speed * 14 : 0, 0.5),
    );
    const heat = running ? machine.speed / 40 : 0;
    const cool = machine.cooling ? 1.6 : 0.2;
    machine.oilTemp = Math.round(
        Math.min(
            78,
            Math.max(38, machine.oilTemp + heat - cool + (Math.random() - 0.5)),
        ),
    );
    if (running) {
        machine.made = Math.min(
            machine.batch,
            machine.made + Math.max(1, Math.round(machine.speed / 12)),
        );
        machine.tool = Math.min(100, machine.tool + 0.05);
        if (machine.made >= machine.batch) {
            toast.success('Batch complete', `${machine.batch} parts.`);
            stop('Batch complete');
            if (machine.autoRestart) start();
            return;
        }
    }
    update();
}, 1500);

update();
