<!-- agentcfg:start -->
<!-- core/code-review.md · v1.2.0 -->
# Code review

The checks every change gets, whatever the language. The language's own review
rules — error handling, unsafe code, public API docs — load for the same trigger
and are read alongside these.

## What to check

### Gates
- `pnpm run ci` passes — every gate, zero warnings.
- No `biome-ignore` or `@ts-expect-error` suppression added without a justifying comment.

### Dependencies
- New dependencies have a one-line justification in the PR description.
- The `engines.node` floor is not raised unless the change explicitly intends to.

### Tests
- New behavior is covered by at least one test.
<!-- agentcfg:end -->
