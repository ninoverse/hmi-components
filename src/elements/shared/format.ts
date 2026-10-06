/**
 * Substitute `{token}` placeholders in a template string with values from a
 * token map. It gives attribute-only hosts a declarative alternative to a
 * function-valued formatter. An unknown token is left untouched, so a stray
 * `{foo}` is visible rather than silently dropped. Ported unchanged from
 * `src/lib/formatTemplate.utility.ts`.
 */
export function applyTemplate(
    template: string,
    tokens: Record<string, unknown>,
): string {
    return template.replace(/\{(\w+)\}/g, (_match, key: string) =>
        tokens[key] === undefined ? `{${key}}` : String(tokens[key]),
    );
}
