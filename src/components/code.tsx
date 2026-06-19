import type { HTMLAttributes, ReactNode } from 'react';
import './styled/code.styled.css';

export type CodeProps = HTMLAttributes<HTMLElement> & {
    /** Render as a block (`<pre><code>`) instead of inline `<code>`. @default false */
    block?: boolean;
    /** Code content. */
    children?: ReactNode;
};

/**
 * Monospace code display, inline by default or as a block when `block` is set.
 *
 * @example
 * <Code>npm i</Code>
 * <Code block>{`const x = 1;`}</Code>
 */
export function Code({
    block = false,
    className,
    children,
    ...rest
}: CodeProps) {
    const tokens: string[] = ['code'];
    if (block) tokens.push('code--block');
    if (className) tokens.push(className);

    if (block) {
        return (
            <pre className={tokens.join(' ')} {...rest}>
                <code className="code__content">{children}</code>
            </pre>
        );
    }

    return (
        <code className={tokens.join(' ')} {...rest}>
            {children}
        </code>
    );
}
