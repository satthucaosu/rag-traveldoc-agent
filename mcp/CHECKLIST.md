# MCP connection checklist

Run this after editing your MCP config. Goal: confirm the server is reachable, tools are listed, and one read-only call works.

## 0. Config location (per tool)

| Tool | Project / workspace | Global |
|------|---------------------|--------|
| **Cursor** | `.cursor/mcp.json` (adapt from `mcp/mcp.json`) | Cursor user MCP settings |
| **Claude Code** | See Claude Code MCP docs | See docs |
| **Codex** | See Codex MCP docs | See docs |
| **Antigravity 2.0 / IDE / CLI** | `.agents/mcp_config.json` (adapt from `mcp/mcp_config.antigravity.example.json`) | `~/.gemini/config/mcp_config.json` |

**Antigravity HTTP servers:** use `serverUrl`, not `url`. Then: Settings → Customizations → Installed MCP Servers → **Refresh**.

## 1. Prerequisites

- [ ] Server package installed or remote URL is reachable
- [ ] Credentials in environment variables (never in the JSON file): `echo $ENV_API_TOKEN` or Windows equivalent
- [ ] Dev / non-production data only; read-only mode if available
- [ ] **Antigravity:** valid JSON (no `$comment` keys — strip comments from templates before copy)

## 2. Discover tools (MCP Inspector — recommended)

Install and run the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) against your server:

```bash
npx @modelcontextprotocol/inspector
```

In the UI:
- [ ] Connect using the same `command`/`args` or `serverUrl` as your config
- [ ] **List tools** — note names and input schemas
- [ ] **Call one read-only tool** with minimal valid input
- [ ] Confirm response shape matches what the agent will see

## 3. Smoke test from the terminal (stdio server)

Replace placeholders with your server entry from the config:

```bash
# Example: run the MCP server process directly (stdio)
# command and args from mcpServers["example-stdio"]
export API_TOKEN="${ENV_API_TOKEN}"
# python path/to/mcp_server.py   # must stay running; use Inspector for interactive test
```

For remote (HTTP) servers, verify the URL in a browser or `curl` (expect MCP handshake, not HTML error page).

## 4. Wire into the agent

- [ ] Copy config to the tool-specific path (see table in section 0)
- [ ] **Antigravity:** copy to `.agents/mcp_config.json` and/or merge into `~/.gemini/config/mcp_config.json`
- [ ] Restart the agent / IDE / refresh MCP in Antigravity Settings
- [ ] Ask the agent: "List the MCP tools you have available"
- [ ] Ask for one safe read-only operation (e.g. list, query SELECT-only)

## 5. Troubleshooting

| Symptom | Check |
|---------|--------|
| Tool not listed | Config path, JSON syntax, agent restart / Antigravity Refresh |
| Auth errors | Env var name matches config; token not expired; Antigravity OAuth file `~/.gemini/antigravity/mcp_oauth_tokens.json` |
| Wrong parameters | MCP Inspector → compare schema vs agent tool call in trace |
| Timeout | Network, firewall, remote server health |
| Antigravity HTTP 4xx | Used `serverUrl` not `url`; headers spelled correctly |

## 6. Before production use

- [ ] Audit server source if community/third-party
- [ ] Scope to one project / least privilege
- [ ] Log tool calls for audit
- [ ] Record decision in `harness/decisions/` if this server accesses sensitive data
