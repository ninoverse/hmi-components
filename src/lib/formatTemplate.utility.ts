/* Substitute `{token}` placeholders in a template string with values from a
   token map. Used to give web-component consumers a declarative alternative to
   function-valued formatter props (which cannot cross the attribute boundary).
   An unknown token is left untouched so a stray `{foo}` is visible rather than
   silently dropped. */
export function applyTemplate(
    template: string,
    tokens: Record<string, unknown>,
): string {
    return template.replace(/\{(\w+)\}/g, (_match, key: string) =>
        tokens[key] === undefined ? `{${key}}` : String(tokens[key]),
    );
}
