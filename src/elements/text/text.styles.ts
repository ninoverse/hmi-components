import { css } from 'lit';

/* Text — the body-copy primitive. The host is the text: medium size, regular
   weight and the standard on-surface tone in the Quicksand UI font; size,
   weight, tone, alignment and single-line truncation opt in through reflected
   attributes. The size scale is the old rem scale in base units (1rem = 1 base
   unit). Ported from src/components/styled/text.styled.css. */
export const styles = css`
    :host {
        display: block;
        margin: 0;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 400;
        line-height: 1.5;
        color: var(--on-surface);
    }

    :host([inline]) {
        display: inline;
    }

    :host([size='xsmall']) {
        font-size: calc(var(--_base) * 1.375);
    }
    :host([size='small']) {
        font-size: calc(var(--_base) * 1.5);
    }
    :host([size='large']) {
        font-size: calc(var(--_base) * 2);
    }
    :host([size='xlarge']) {
        font-size: calc(var(--_base) * 2.5);
    }

    :host([weight='medium']) {
        font-weight: 500;
    }
    :host([weight='semibold']) {
        font-weight: 600;
    }
    :host([weight='bold']) {
        font-weight: 700;
    }

    :host([tone='muted']) {
        color: var(--on-surface-variant);
    }
    :host([tone='primary']) {
        color: var(--primary);
    }
    :host([tone='error']) {
        color: var(--error);
    }
    :host([tone='inherit']) {
        color: inherit;
    }

    :host([align='start']) {
        text-align: start;
    }
    :host([align='center']) {
        text-align: center;
    }
    :host([align='end']) {
        text-align: end;
    }

    :host([truncate]) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
