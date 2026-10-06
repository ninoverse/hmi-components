import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './timeline.styles.js';

export type TimelineColor =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error';

/** One event of a timeline. */
export interface TimelineItem {
    /** The event title: plain text, or the fallback of the `title-<index>` slot. */
    title: string;
    /** Supporting text under the title: plain text, or the fallback of the `description-<index>` slot. */
    description?: string;
    /** A timestamp beside the title: plain text, or the fallback of the `time-<index>` slot. */
    time?: string;
    /** The marker colour. @default 'default' */
    color?: TimelineColor;
}

/** Hides the parent of a slot that has no content and no text fallback. */
const toggleEmpty = (event: Event, hasText: boolean) => {
    const slot = event.target as HTMLSlotElement;
    (slot.parentElement as HTMLElement).hidden =
        slot.assignedNodes().length === 0 && !hasText;
};

/**
 * Vertical timeline of events, each with a colour-coded marker, a title and an
 * optional time and description. An ordered list. `divider` adds a hairline
 * between events.
 *
 * An item's `title`, `description` and `time` are text. For richer content, slot
 * an element named `title-<index>`, `description-<index>` or `time-<index>` (the
 * item's position, from 0), which replaces that text. An icon in the marker is
 * an element slotted as `icon-<index>`; the marker is empty without one.
 *
 * @tag hmi-timeline
 * @slot title-<index> - Rich title for the event at that position.
 * @slot description-<index> - Rich description for the event at that position.
 * @slot time-<index> - Rich time for the event at that position.
 * @slot icon-<index> - Icon in the marker of the event at that position.
 * @csspart base - The list of events.
 * @csspart item - One event.
 * @csspart marker - An event's marker.
 * @csspart icon - An event's icon.
 * @csspart body - An event's title row and description.
 * @csspart title - An event's title.
 * @csspart time - An event's time.
 * @csspart description - An event's description.
 *
 * @example
 * <hmi-timeline divider></hmi-timeline>
 */
@customElement('hmi-timeline')
export class HmiTimeline extends LitElement {
    static override styles = [baseStyles, styles];

    /** The events, in chronological order. Set it as a property; a JSON attribute is accepted. @default [] */
    @property({ type: Array }) accessor items: TimelineItem[] = [];

    /** Draw a hairline between events. @default false */
    @property({ type: Boolean, reflect: true }) accessor divider = false;

    override render() {
        return html`<ol part="base" class="base">
            ${this.items.map(
                (item, index) => html`<li
                    part="item"
                    class="item"
                    data-color=${item.color ?? 'default'}
                >
                    <div part="marker" class="marker">
                        <span part="icon" class="icon" aria-hidden="true" hidden
                            ><slot
                                name=${`icon-${index}`}
                                @slotchange=${(e: Event) => toggleEmpty(e, false)}
                            ></slot
                        ></span>
                    </div>
                    <div part="body" class="body">
                        <div class="head">
                            <span part="title" class="title"
                                ><slot name=${`title-${index}`}>${item.title}</slot></span
                            >
                            <span part="time" class="time" ?hidden=${item.time == null}
                                ><slot
                                    name=${`time-${index}`}
                                    @slotchange=${(e: Event) => toggleEmpty(e, item.time != null)}
                                    >${item.time}</slot
                                ></span
                            >
                        </div>
                        <div part="description" class="description" ?hidden=${item.description == null}
                            ><slot
                                name=${`description-${index}`}
                                @slotchange=${(e: Event) => toggleEmpty(e, item.description != null)}
                                >${item.description}</slot
                            ></div
                        >
                    </div>
                </li>`,
            )}
        </ol>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-timeline': HmiTimeline;
    }
}
