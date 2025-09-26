# token-counter-server MCP Server

Creating a token-aware system to manage the context window for LLMs is a sophisticated approach to optimizing multi-agent workflows. It correctly identifies a key bottleneck in current AI-powered development systems.

This is a TypeScript-based MCP server that provides a tool for counting tokens in files and directories.

## Features

### Tools
- `count_tokens` - Count the number of tokens in a file or directory.
  - Takes `path` (string) as a required parameter, which can be a file or directory path.
  - Takes `file_pattern` (string) as an optional parameter, which is a glob pattern to filter files (e.g., '*.ts').

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "token-counter-server": {
      "command": "/path/to/token-counter-server/build/index.js"
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
[![MCP Badge](https://lobehub.com/badge/mcp-full/intro0siddiqui-token-counter-server)](https://lobehub.com/mcp/intro0siddiqui-token-counter-server)