import type { HTMLAttributes } from 'react';
import { Avatar, type AvatarSize } from './avatar';
import './styled/avatar.styled.css';

export type AvatarStackProps = HTMLAttributes<HTMLSpanElement> & {
    /** Names to render as overlapping avatars, in display order. */
    names: ReadonlyArray<string>;
    /** Maximum avatars shown before collapsing the rest into a `+N` chip. @default 4 */
    max?: number;
    /** Diameter preset applied to every avatar. @default 'medium' */
    size?: AvatarSize;
};

/**
 * Overlapping row of {@link Avatar}s, collapsing any beyond `max` into a
 * trailing `+N` overflow badge.
 *
 * @example
 * <AvatarStack names={['Ada', 'Alan', 'Grace', 'Linus', 'Edsger']} max={3} />
 */
export function AvatarStack({
    names,
    max = 4,
    size = 'medium',
    className,
    ...rest
}: AvatarStackProps) {
    const tokens: string[] = ['avatar-stack'];
    if (className) tokens.push(className);

    const shown = names.slice(0, max);
    const extra = names.length - shown.length;
    const overflowCls = size !== 'medium' ? `avatar avatar--${size}` : 'avatar';

    return (
        <span className={tokens.join(' ')} {...rest}>
            {shown.map((name, index) => (
                <Avatar
                    // biome-ignore lint/suspicious/noArrayIndexKey: names may repeat; index keeps order stable
                    key={`${name}-${index}`}
                    name={name}
                    size={size}
                />
            ))}
            {extra > 0 && (
                <span
                    className={`${overflowCls} avatar--overflow`}
                    role="img"
                    aria-label={`${extra} more`}
                >
                    +{extra}
                </span>
            )}
        </span>
    );
}
