import type { HTMLAttributes, ReactNode } from 'react';
import './styled/divider.styled.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerAlign = 'start' | 'center' | 'end';

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
    /** Line direction. @default 'horizontal' */
    orientation?: DividerOrientation;
    /** Label position; only applies to a labeled horizontal divider. @default 'center' */
    align?: DividerAlign;
    /** Optional label rendered inline (horizontal only). */
    children?: ReactNode;
};

/**
 * Separator line. Renders an `<hr>` when empty, or a labeled divider when
 * `children` are provided (horizontal orientation only).
 *
 * @example
 * <Divider />
 * <Divider align="start">Section</Divider>
 */
export function Divider({
    orientation = 'horizontal',
    align = 'center',
    children,
    className,
    ...rest
}: DividerProps) {
    const labeled = children !== undefined && orientation === 'horizontal';
    const tokens: string[] = ['divider', `divider--${orientation}`];
    if (labeled) tokens.push('divider--labeled', `divider--align-${align}`);
    if (className) tokens.push(className);

    if (labeled) {
        return (
            <div className={tokens.join(' ')} {...rest}>
                <span aria-hidden="true" className="divider__line" />
                <span className="divider__label">{children}</span>
                <span aria-hidden="true" className="divider__line" />
            </div>
        );
    }

    return (
        <hr
            aria-orientation={orientation}
            className={tokens.join(' ')}
            {...(rest as HTMLAttributes<HTMLHRElement>)}
        />
    );
}
