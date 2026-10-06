import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { HmiCheckable } from '../shared/checkable.js';
import { checkableStyles } from '../shared/checkable.styles.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './switch.styles.js';

export type { CheckedDetail as SwitchChangeDetail } from '../shared/checkable.js';

/**
 * Labelled on/off toggle: a pill-shaped track with a thumb that slides. Under
 * the hood a checkbox, so it submits `name=value` while on, restores its initial
 * state on `form.reset()`, and toggles with Space.
 *
 * `hmi-change` fires on every toggle with `{ checked }`. The element owns its
 * state: to veto a toggle, set `checked` back from a listener. The inline text
 * is `label`, or the default slot for richer content; `hint` and `error` render
 * below. The thumb's shadow is the `--switch-thumb-shadow` token, which the
 * journal structure sets to `none`.
 *
 * @tag hmi-switch
 * @slot - Rich label content, instead of the `label` text.
 * @fires {CustomEvent<SwitchChangeDetail>} hmi-change - The state was toggled.
 * @csspart base - The label row: track and text.
 * @csspart track - The pill-shaped track.
 * @csspart thumb - The sliding thumb.
 * @csspart label - The label text.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-switch name="notifications" label="Notifications" checked></hmi-switch>
 */
@customElement('hmi-switch')
export class HmiSwitch extends HmiCheckable {
    static override styles = [baseStyles, formStyles, checkableStyles, styles];

    protected renderIndicator(): TemplateResult {
        return html`<span part="track" class="track" aria-hidden="true"
            ><span part="thumb" class="thumb"></span
        ></span>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-switch': HmiSwitch;
    }
}
