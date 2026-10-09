import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { baseStyles } from '../shared/base.styles.js';
import { toggleEmpty } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { styles } from './stepper.styles.js';

export type StepperOrientation = 'horizontal' | 'vertical';

/** One step. */
export interface StepperStep {
    /** Identity: matched against `current`, reported in `hmi-change` and naming the step's slots. */
    value: string;
    /** The step title: plain text, or the fallback of the `label-<value>` slot. */
    label: string;
    /** A secondary line under the title: plain text, or the fallback of the `description-<value>` slot. */
    description?: string;
}

/** Detail of `hmi-change`. */
export interface StepperChangeDetail {
    /** The `value` of the completed step that was chosen. */
    value: string;
}

type StepStatus = 'completed' | 'active' | 'upcoming';

const checkIcon = html`<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M5 12l4.5 4.5L19 7" />
</svg>`;

/**
 * Step progress indicator: an ordered list in which the steps before `current`
 * are completed, the current step is active and the rest are upcoming, joined by
 * connector lines. A completed step is a button that fires `hmi-change`, so a
 * wizard can go back to it.
 *
 * A step's `label` and `description` are text. For richer content, slot an
 * element named `label-<value>` or `description-<value>`.
 *
 * It is controlled: choosing a completed step fires `hmi-change` and the element
 * keeps showing the old step until you set `current`. `readonly` makes the steps
 * plain text, for a wizard that cannot go back. Below 40em a horizontal stepper
 * falls back to the vertical layout.
 *
 * @tag hmi-stepper
 * @cssprop --stepper-item-gap - The space between steps in the vertical layout. Set it on the host or an ancestor, or with `spacing`.
 * @slot label-<value> - Rich label for the step with that value.
 * @slot description-<value> - Rich description for the step with that value.
 * @csspart base - The ordered list.
 * @csspart step - One step. `data-status` is `completed`, `active` or `upcoming`.
 * @csspart button - A step's content: a `<button>` for a completed step, else a `<span>`.
 * @csspart indicator - The circle with the number or the check.
 * @csspart label - A step's title.
 * @csspart description - A step's secondary line.
 * @csspart connector - The line to the next step.
 * @fires hmi-change - A completed step was chosen. `detail` is `{ value }`.
 *
 * @example
 * const stepper = document.querySelector('hmi-stepper');
 * stepper.steps = [{ value: 'cart', label: 'Cart' }, { value: 'pay', label: 'Payment' }];
 * stepper.current = 'pay';
 * stepper.addEventListener('hmi-change', (e) => { stepper.current = e.detail.value; });
 */
@customElement('hmi-stepper')
export class HmiStepper extends LitElement {
    static override styles = [baseStyles, styles];

    /** The ordered steps. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false }) accessor steps: StepperStep[] =
        [];

    /** The `value` of the active step. The element never changes it. With none, every step is upcoming. */
    @property() accessor current: string | undefined;

    /** Layout direction. @default 'horizontal' */
    @property({ reflect: true }) accessor orientation: StepperOrientation =
        'horizontal';

    /** The space between steps in the vertical layout, as a CSS length such as `3rem`. Sets `--stepper-item-gap`. */
    @property() accessor spacing: string | undefined;

    /** Make completed steps plain text instead of buttons. @default false */
    @property({ type: Boolean, reflect: true }) accessor readonly = false;

    /** The name of the list. @default 'Progress steps' */
    @property() accessor label = 'Progress steps';

    #choose(value: string): void {
        emit<StepperChangeDetail>(this, 'hmi-change', { value });
    }

    #renderStep(step: StepperStep, index: number, currentIndex: number) {
        const status: StepStatus =
            index < currentIndex
                ? 'completed'
                : index === currentIndex
                  ? 'active'
                  : 'upcoming';
        const content = html`<span part="indicator" class="indicator" aria-hidden="true"
                >${
                    status === 'completed'
                        ? checkIcon
                        : html`<span class="number">${index + 1}</span>`
                }</span
            ><span class="text"
                ><span part="label" class="label"
                    ><slot name=${`label-${step.value}`}>${step.label}</slot></span
                ><span part="description" class="description" ?hidden=${!step.description}
                    ><slot
                        name=${`description-${step.value}`}
                        @slotchange=${(e: Event) => toggleEmpty(e, !!step.description)}
                        >${step.description}</slot
                    ></span
                ></span
            >`;
        return html`<li
            part="step"
            class="item"
            data-status=${status}
            aria-current=${status === 'active' ? 'step' : nothing}
        >
            ${
                status === 'completed' && !this.readonly
                    ? html`<button
                          type="button"
                          part="button"
                          class="button"
                          @click=${() => this.#choose(step.value)}
                      >
                          ${content}
                      </button>`
                    : html`<span part="button" class="button">${content}</span>`
            }
            ${
                index < this.steps.length - 1
                    ? html`<span part="connector" class="connector" aria-hidden="true"></span>`
                    : nothing
            }
        </li>`;
    }

    override render() {
        const currentIndex = this.steps.findIndex(
            (s) => s.value === this.current,
        );
        const orientation =
            this.orientation === 'vertical' ? 'vertical' : 'horizontal';
        return html`<ol
            part="base"
            class="stepper stepper--${orientation}"
            aria-label=${this.label}
            style=${styleMap(
                this.spacing === undefined
                    ? {}
                    : { '--stepper-item-gap': this.spacing },
            )}
        >
            ${this.steps.map((step, index) =>
                this.#renderStep(step, index, currentIndex),
            )}
        </ol>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-stepper': HmiStepper;
    }
}
