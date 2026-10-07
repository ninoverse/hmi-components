<!-- agentcfg:start -->
<!-- agentcfg:import · v1.2.0 -->
@AGENTS.md

<!-- language/typescript/automation.md · v1.2.0 -->
# Automation

`.claude/settings.json` allowlists the commands in *Build and test commands* so
they do not prompt, runs Biome's formatter on every TypeScript, JavaScript, JSON
or CSS file you edit, and warns at the end of a turn that changed a TypeScript
file if `pnpm typecheck` fails. Formatting is therefore already handled — do not
run `pnpm format` after each edit.
<!-- agentcfg:end -->
