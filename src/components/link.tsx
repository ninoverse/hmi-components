import type { AnchorHTMLAttributes, ReactNode } from 'react';
import './styled/link.styled.css';

export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkTone = 'primary' | 'muted';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** When to show the underline. @default 'always' */
    underline?: LinkUnderline;
    /** Colour tone. @default 'primary' */
    tone?: LinkTone;
    /** Link content. */
    children?: ReactNode;
};

/**
 * Styled anchor. Automatically adds `rel="noopener noreferrer"` for
 * `target="_blank"` links to prevent reverse-tabnabbing.
 *
 * @example
 * <Link href="/docs" underline="hover">Docs</Link>
 */
export function Link({
    underline = 'always',
    tone = 'primary',
    target,
    rel,
    className,
    children,
    ...rest
}: LinkProps) {
    const tokens: string[] = ['link', `link--underline-${underline}`];
    if (tone !== 'primary') tokens.push(`link--tone-${tone}`);
    if (className) tokens.push(className);

    // Guard external links against reverse-tabnabbing.
    const safeRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

    return (
        <a className={tokens.join(' ')} rel={safeRel} target={target} {...rest}>
            {children}
        </a>
    );
}
