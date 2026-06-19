import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './styled/text.styled.css';

export type TextSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextTone = 'default' | 'muted' | 'primary' | 'error' | 'inherit';
export type TextAlign = 'start' | 'center' | 'end';

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
    /** Element/component to render as. @default 'p' */
    as?: ElementType;
    /** Font size preset. @default 'medium' */
    size?: TextSize;
    /** Font weight preset. @default 'regular' */
    weight?: TextWeight;
    /** Colour tone. @default 'default' */
    tone?: TextTone;
    /** Text alignment. */
    align?: TextAlign;
    /** Truncate to a single line with an ellipsis. @default false */
    truncate?: boolean;
    /** Text content. */
    children?: ReactNode;
};

/**
 * Body text primitive with size/weight/tone/alignment presets and optional
 * truncation. Render as any element via `as`.
 *
 * @example
 * <Text size="small" tone="muted">Last updated just now</Text>
 */
export function Text({
    as: Component = 'p',
    size = 'medium',
    weight = 'regular',
    tone = 'default',
    align,
    truncate = false,
    className,
    children,
    ...rest
}: TextProps) {
    const tokens: string[] = ['text'];
    if (size !== 'medium') tokens.push(`text--size-${size}`);
    if (weight !== 'regular') tokens.push(`text--weight-${weight}`);
    if (tone !== 'default') tokens.push(`text--tone-${tone}`);
    if (align) tokens.push(`text--align-${align}`);
    if (truncate) tokens.push('text--truncate');
    if (className) tokens.push(className);

    return (
        <Component className={tokens.join(' ')} {...rest}>
            {children}
        </Component>
    );
}
