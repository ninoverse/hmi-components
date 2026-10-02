<!-- agentcfg:start -->
<!-- language/typescript/tasks/gates.md · v1.0.0 -->
# Merge gates

Run the merge gates defined in *Testing instructions*:

```
pnpm run ci
```

If `node_modules` is missing, run `pnpm install --frozen-lockfile` first and say
so. If pnpm itself is missing, say that rather than installing it:
`corepack enable` provides the version `packageManager` names.

Extra arguments, if any: $ARGUMENTS

Then report a one-line-per-gate summary:

- Which gates passed and which failed.
- For each failure, the specific file and line, and the actual error — not a
  paraphrase.
- Whether any gate could not run because its tool is not installed. Do not
  report a skipped gate as a passing gate.

`pnpm run ci` stops at the first failing script, so a gate listed after the
failure has not run. Report those as not run, not as passing.

Do not fix anything unless asked. This command reports; it does not edit.
<!-- agentcfg:end -->
