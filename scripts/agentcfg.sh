#!/bin/sh
# sh scripts/agentcfg.sh <command> — or `pnpm agentcfg <command>`, such as
# `pnpm agentcfg check` after editing .agentprofile.yml, or `pnpm agentcfg sync`.
#
# Runs the agentcfg release .agentprofile.yml pins, fetching it once into a
# gitignored cache. It needs nothing installed: the published binary is static,
# and this repository has no Rust toolchain to build one with. The version comes
# from the profile, so the cache cannot drift from the pin — a bump fetches a
# new file rather than reusing a stale one — and .agentcfg/ is gitignored, so
# nothing downloaded is ever committed. CI runs this file directly, without
# installing dependencies.
set -eu

if [ ! -f .agentprofile.yml ]; then
    echo "no .agentprofile.yml here — run this from the repository root" >&2
    exit 1
fi
version=$(sed -n 's/^config_version:[[:space:]]*//p' .agentprofile.yml)

# The asset names are the rustc target triples the release publishes.
case "$(uname -s)/$(uname -m)" in
    Linux/x86_64) target=x86_64-unknown-linux-musl ;;
    Linux/aarch64 | Linux/arm64) target=aarch64-unknown-linux-musl ;;
    Darwin/arm64) target=aarch64-apple-darwin ;;
    *)
        echo "no agentcfg binary for $(uname -s)/$(uname -m) — published: linux-musl x86_64 and aarch64, darwin aarch64" >&2
        exit 1
        ;;
esac

binary=".agentcfg/agentcfg-${version}"
if [ ! -x "${binary}" ]; then
    mkdir -p .agentcfg
    curl -fsSL -o "${binary}" \
        "https://github.com/ninoverse/agent-config-sync/releases/download/${version}/agentcfg-${target}"
    chmod +x "${binary}"
fi

exec "${binary}" "$@"
