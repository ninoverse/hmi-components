import { css } from 'lit';

/* FormControl — a vertical stack of a label, the control and a hint or error
   message. The layout and the text styles are the shared form styles; this adds
   only what the slots need: every part is always rendered, because its slot has
   to exist for slotchange to tell whether it holds anything, so an empty one is
   hidden instead. Ported from src/components/styled/formControl.styled.css. */
export const styles = css`
    .label[hidden],
    .message[hidden] {
        display: none;
    }
`;
