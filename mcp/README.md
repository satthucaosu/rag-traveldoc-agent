# MCP (tools)

MCP is the "USB-C for AI tools": consume one server and any MCP-compatible agent uses it without custom integration code. It turns O(N×M) bespoke integrations into O(N+M).

**After editing config, run `CHECKLIST.md`** — step-by-step discovery, MCP Inspector, and smoke-test commands.

## Config files in this harness

| File | Format for | Notes |
|------|------------|-------|
| `mcp.json` | Cursor, Claude Code, Codex | HTTP entries use `url` |
| `mcp_config.antigravity.example.json` | Antigravity 2.0, IDE, CLI | HTTP entries use **`serverUrl`** (not `url`) |

Never hardcode credentials — use environment variables. Audit community servers before filesystem or credential access.

## Where to copy config (per tool)

| Tool | Global | Project / workspace |
|------|--------|---------------------|
| **Cursor** | user MCP settings | `.cursor/mcp.json` |
| **Claude Code** | see Claude Code MCP docs | project or user config per docs |
| **Codex** | see Codex MCP docs | per docs |
| **Antigravity 2.0 / IDE / CLI** | `~/.gemini/config/mcp_config.json` | `.agents/mcp_config.json` |

Antigravity: Settings → Customizations → Installed MCP Servers → **Refresh** after edits.

Docs: [Antigravity MCP](https://antigravity.google/docs/mcp). Deeper Antigravity paths: setup-harness `references/antigravity.md`.

## Onboard a server in three steps

1. **Discover** — find a pre-built server from a public registry, a vetted 3rd-party/official provider, or your internal registry. Prefer official/internal over unvetted public.
2. **Configure** — set scope and permissions; pass credentials via environment variables.
3. **Connect** — the client handshakes to list tools and validate schemas.

## Do

- Audit public/open-source servers before connecting them to filesystem or credentials.
- Load tools only when needed; drop them when done to keep context clean.
- Prefer internal API gateways / registries (governed schemas).
- Debug with the MCP Inspector or Chrome DevTools instead of blindly tweaking prompts.
- Keep a human in the loop: show tool inputs before calling; log usage for audit.
- **Antigravity:** keep total enabled tools modest (docs recommend staying under ~50 for best performance).

## Don't

- Build if you can consume — search for an existing server first.
- Use public, unverified MCPs in production.
- Hardcode credentials — environment variables only.
- Connect to production data — use dev/obfuscated data; read-only where possible.
- Grant wide access — scope to a single project's resources.
- Copy `url` from `mcp.json` into Antigravity without renaming to `serverUrl`.
